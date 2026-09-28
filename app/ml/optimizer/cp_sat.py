from __future__ import annotations

import math
from datetime import date, datetime, time, timedelta
from typing import Any

from ortools.sat.python import cp_model

from app.ml.explain.reasons import plan_reason, task_reason
from app.ml.inference.predictors import (
    forecast_goods_batch,
    predict_duration,
    predict_overrun_batch,
    predict_risk,
)
from app.ml.rules.engine import compatibility, hard_resource_check, required_block_type

SLOT_MINUTES = 30
HORIZON_SLOTS = 48


def _season(month: int) -> str:
    if month in (6, 7, 8, 9):
        return "Monsoon"
    if month in (11, 12, 1, 2):
        return "Winter"
    return "Summer"


def _historical_overrun_rate(block_history: list[dict[str, Any]]) -> float:
    if not block_history:
        return 0.2
    return sum(1 for b in block_history if b.get("overrun_flag") is True) / len(block_history)


def _traffic_by_hour(traffic: list[dict[str, Any]]) -> dict[int, dict[str, float]]:
    result = {hour: {"passenger": 0.0, "goods": 0.0, "load": 0.0} for hour in range(24)}
    for item in traffic:
        hour = int(item.get("hour") or 0) % 24
        category = str(item.get("train_category") or "").lower()
        if category == "passenger":
            result[hour]["passenger"] += 1
        elif category == "goods":
            result[hour]["goods"] += 1
        load = item.get("network_load_index")
        if isinstance(load, (int, float)):
            result[hour]["load"] = max(result[hour]["load"], float(load))
    return result


def _crew_capacity(resources: list[dict[str, Any]], tasks: list[dict[str, Any]]) -> dict[str, int]:
    capacity: dict[str, int] = {}
    for item in resources:
        if item.get("resource_type") != "Crew":
            continue
        if not item.get("is_usable", item.get("status") == "Available"):
            continue
        department = str(item.get("department") or "Unknown")
        capacity[department] = capacity.get(department, 0) + int(item.get("quantity") or 0)

    # Keep prototype solvable when the seed resource calendar does not align with the
    # selected planning day: fall back to the task's observed crew availability.
    for task in tasks:
        department = str(task.get("department") or "Unknown")
        observed = int((task.get("readiness") or {}).get("crew_available") or 0)
        capacity[department] = max(capacity.get(department, 0), observed)
    return capacity


def _task_inputs(
    section: dict[str, Any],
    tasks: list[dict[str, Any]],
    resources: list[dict[str, Any]],
    traffic: list[dict[str, Any]],
    block_history: list[dict[str, Any]],
    planning_date: date,
) -> list[dict[str, Any]]:
    traffic_hours = _traffic_by_hour(traffic)
    history_rate = _historical_overrun_rate(block_history)
    day_name = planning_date.strftime("%A")
    season = _season(planning_date.month)

    # Freight depends on section/time window rather than on the maintenance task.
    # Predict the 24 hourly windows once instead of repeating the same ML call
    # hundreds of times for every task/start slot.
    hourly_windows = [
        {
            "section_id": section.get("section_id"),
            "hour": hour,
            "day_of_week": day_name,
            "season": season,
            "recent_freight_count": traffic_hours[hour]["goods"],
            "network_load_index": traffic_hours[hour]["load"],
            "traffic_density": section.get("traffic_density", 0),
        }
        for hour in range(24)
    ]
    hourly_freight = forecast_goods_batch(section, hourly_windows)

    prepared = []
    for task in tasks:
        risk = predict_risk(task)
        duration = predict_duration(task, resources)
        duration_slots = max(1, math.ceil(float(duration["upper"]) / SLOT_MINUTES))
        max_start = max(0, HORIZON_SLOTS - duration_slots)
        hard_check = hard_resource_check(task, resources)
        block_type = required_block_type(task)
        readiness_pct = int(
            round(float((task.get("readiness") or {}).get("readiness_score") or 0) * 100)
        )

        traffic_costs: list[int] = []
        freight_counts: list[float] = []
        overrun_contexts: list[dict[str, Any]] = []

        for slot in range(max_start + 1):
            hour = (slot * SLOT_MINUTES) // 60
            observed = traffic_hours[hour]
            freight = hourly_freight[hour]
            train_conflicts = int(
                round(
                    observed["passenger"]
                    + max(freight["predicted_count"], observed["goods"])
                )
            )
            overrun_contexts.append(
                {
                    "section_id": section.get("section_id"),
                    "block_type": block_type,
                    "planned_duration_min": int(math.ceil(duration["upper"])),
                    "resource_readiness_pct": readiness_pct,
                    "train_conflicts": train_conflicts,
                    "tasks_count": 1,
                    "departments_count": 1,
                    "season": season,
                    "hour": hour,
                    "day_of_week": day_name,
                    "historical_section_overrun_rate": history_rate,
                }
            )
            traffic_cost = int(
                round(
                    observed["passenger"] * 12
                    + freight["predicted_count"] * 8
                    + observed["load"] * 5
                )
            )
            traffic_costs.append(max(0, traffic_cost))
            freight_counts.append(float(freight["predicted_count"]))

        # One vectorized classifier call per task instead of one call per slot.
        overrun_predictions = predict_overrun_batch(overrun_contexts)
        overrun_costs = [
            int(round(float(item["probability"]) * 100))
            for item in overrun_predictions
        ]

        prepared.append(
            {
                "task": task,
                "risk": risk,
                "duration": duration,
                "duration_slots": duration_slots,
                "max_start": max_start,
                "block_type": block_type,
                "hard_check": hard_check,
                "traffic_costs": traffic_costs,
                "overrun_costs": overrun_costs,
                "freight_counts": freight_counts,
                "reasons": task_reason(task, risk, duration),
            }
        )
    return prepared

def _merge_blocks(scheduled: list[dict[str, Any]], planning_date: date) -> list[dict[str, Any]]:
    if not scheduled:
        return []
    ordered = sorted(scheduled, key=lambda x: (x["start_slot"], x["end_slot"]))
    groups: list[list[dict[str, Any]]] = []
    current = [ordered[0]]
    current_end = ordered[0]["end_slot"]
    for item in ordered[1:]:
        if item["start_slot"] < current_end:
            current.append(item)
            current_end = max(current_end, item["end_slot"])
        else:
            groups.append(current)
            current = [item]
            current_end = item["end_slot"]
    groups.append(current)

    midnight = datetime.combine(planning_date, time.min)
    blocks = []
    for index, group in enumerate(groups, start=1):
        start_slot = min(item["start_slot"] for item in group)
        end_slot = max(item["end_slot"] for item in group)
        start_dt = midnight + timedelta(minutes=start_slot * SLOT_MINUTES)
        end_dt = midnight + timedelta(minutes=end_slot * SLOT_MINUTES)
        block_types = {item["block_type"] for item in group}
        block_type = "Integrated Block" if len(block_types) > 1 or len({i["department"] for i in group}) > 1 else next(iter(block_types))
        blocks.append(
            {
                "block_no": index,
                "block_type": block_type,
                "start": start_dt.isoformat(),
                "end": end_dt.isoformat(),
                "duration_min": (end_slot - start_slot) * SLOT_MINUTES,
                "task_ids": [item["task_id"] for item in group],
                "departments": sorted({item["department"] for item in group}),
                "max_risk_score": max(item["risk_score"] for item in group),
                "max_overrun_probability": max(item["overrun_probability"] for item in group),
                "predicted_freight_load": round(sum(item["freight_count"] for item in group), 2),
            }
        )
    return blocks


def solve_plan(
    *,
    name: str,
    section: dict[str, Any],
    tasks: list[dict[str, Any]],
    resources: list[dict[str, Any]],
    traffic: list[dict[str, Any]],
    rules: list[dict[str, Any]],
    block_history: list[dict[str, Any]],
    planning_date: date,
    traffic_weight: int,
    maintenance_weight: int,
    overrun_weight: int,
    time_limit_seconds: float = 4.0,
) -> dict[str, Any]:
    prepared = _task_inputs(section, tasks, resources, traffic, block_history, planning_date)
    model = cp_model.CpModel()
    crew_capacity = _crew_capacity(resources, tasks)

    selected = {}
    start = {}
    end = {}
    intervals = {}
    effective_traffic = {}
    effective_overrun = {}
    objective_terms = []

    for index, item in enumerate(prepared):
        task = item["task"]
        task_id = str(task.get("task_id") or f"task-{index}")
        duration_slots = item["duration_slots"]
        max_start = item["max_start"]

        selected[index] = model.NewBoolVar(f"selected_{index}")
        start[index] = model.NewIntVar(0, max_start, f"start_{index}")
        end[index] = model.NewIntVar(duration_slots, HORIZON_SLOTS, f"end_{index}")
        model.Add(end[index] == start[index] + duration_slots)
        intervals[index] = model.NewOptionalIntervalVar(
            start[index], duration_slots, end[index], selected[index], f"interval_{index}"
        )

        if not item["hard_check"]["allowed"]:
            model.Add(selected[index] == 0)

        traffic_var = model.NewIntVar(0, max(item["traffic_costs"] or [0]), f"traffic_{index}")
        overrun_var = model.NewIntVar(0, 100, f"overrun_{index}")
        model.AddElement(start[index], item["traffic_costs"], traffic_var)
        model.AddElement(start[index], item["overrun_costs"], overrun_var)

        effective_traffic[index] = model.NewIntVar(0, max(item["traffic_costs"] or [0]), f"effective_traffic_{index}")
        effective_overrun[index] = model.NewIntVar(0, 100, f"effective_overrun_{index}")
        model.Add(effective_traffic[index] == traffic_var).OnlyEnforceIf(selected[index])
        model.Add(effective_traffic[index] == 0).OnlyEnforceIf(selected[index].Not())
        model.Add(effective_overrun[index] == overrun_var).OnlyEnforceIf(selected[index])
        model.Add(effective_overrun[index] == 0).OnlyEnforceIf(selected[index].Not())

        risk_value = int(round(float(item["risk"]["risk_score"])))
        overdue_hours = int((task.get("schedule") or {}).get("overdue_hours") or 0)
        maintenance_value = max(1, risk_value + min(overdue_hours // 24, 30))
        unscheduled = 1 - selected[index]
        objective_terms.append(maintenance_weight * maintenance_value * unscheduled)
        objective_terms.append(traffic_weight * effective_traffic[index])
        objective_terms.append(overrun_weight * effective_overrun[index])

    # Known incompatibilities cannot overlap.
    for i in range(len(prepared)):
        for j in range(i + 1, len(prepared)):
            result = compatibility(prepared[i]["task"], prepared[j]["task"], rules)
            if not result["compatible"]:
                model.AddNoOverlap([intervals[i], intervals[j]])

    # Crew capacity is enforced department-wise using the available prototype resources.
    departments = sorted({str(item["task"].get("department") or "Unknown") for item in prepared})
    for department in departments:
        indexes = [i for i, item in enumerate(prepared) if str(item["task"].get("department") or "Unknown") == department]
        if not indexes:
            continue
        capacity = max(1, int(crew_capacity.get(department, 1)))
        demands = [max(1, int((prepared[i]["task"].get("readiness") or {}).get("required_crew") or 1)) for i in indexes]
        model.AddCumulative([intervals[i] for i in indexes], demands, capacity)

    if prepared:
        model.Add(sum(selected.values()) >= min(3, len(prepared)))

    model.Minimize(sum(objective_terms))
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = time_limit_seconds
    solver.parameters.num_search_workers = 8
    status = solver.Solve(model)

    feasible = status in (cp_model.OPTIMAL, cp_model.FEASIBLE)
    scheduled = []
    unscheduled = []
    if feasible:
        for index, item in enumerate(prepared):
            task = item["task"]
            task_id = str(task.get("task_id") or f"task-{index}")
            if solver.Value(selected[index]):
                start_slot = solver.Value(start[index])
                overrun_probability = item["overrun_costs"][start_slot] / 100.0
                scheduled.append(
                    {
                        "task_id": task_id,
                        "department": task.get("department"),
                        "start_slot": start_slot,
                        "end_slot": solver.Value(end[index]),
                        "block_type": item["block_type"],
                        "risk_score": item["risk"]["risk_score"],
                        "severity": item["risk"]["severity"],
                        "risk_confidence": item["risk"]["confidence"],
                        "predicted_duration_min": item["duration"]["minutes"],
                        "duration_lower_min": item["duration"]["lower"],
                        "duration_upper_min": item["duration"]["upper"],
                        "duration_confidence": item["duration"]["confidence"],
                        "overrun_probability": round(overrun_probability, 4),
                        "freight_count": round(item["freight_counts"][start_slot], 2),
                        "reasons": item["reasons"],
                    }
                )
            else:
                unscheduled.append(
                    {
                        "task_id": task_id,
                        "reason": item["hard_check"]["reason"] if not item["hard_check"]["allowed"] else "Not selected under this plan objective/capacity",
                    }
                )

    blocks = _merge_blocks(scheduled, planning_date) if feasible else []
    return {
        "name": name,
        "solver_status": solver.StatusName(status),
        "feasible": feasible,
        "objective_value": round(float(solver.ObjectiveValue()), 2) if feasible else None,
        "scheduled_task_count": len(scheduled),
        "unscheduled_task_count": len(unscheduled),
        "blocks": blocks,
        "scheduled_tasks": scheduled,
        "unscheduled_tasks": unscheduled,
        "explanation": plan_reason(name, traffic_weight, maintenance_weight),
        "weights": {
            "traffic": traffic_weight,
            "maintenance": maintenance_weight,
            "overrun": overrun_weight,
        },
    }
