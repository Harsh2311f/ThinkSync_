from __future__ import annotations

from datetime import date
from typing import Any

from app.ml.optimizer.cp_sat import solve_plan


def optimize_blocks(payload: dict[str, Any]) -> dict[str, Any]:
    section = payload["section"]
    tasks = payload.get("tasks") or []
    resources = payload.get("resources") or []
    traffic = payload.get("traffic") or []
    rules = payload.get("rules") or []
    block_history = payload.get("block_history") or []
    planning_date = payload.get("planning_date") or date.today()
    if isinstance(planning_date, str):
        planning_date = date.fromisoformat(planning_date)

    if not tasks:
        raise ValueError("No maintenance tasks are available for optimization")

    profiles = [
        ("Plan A", 10, 55, 8),
        ("Plan B", 18, 45, 8),
        ("Plan C", 6, 80, 10),
    ]
    plans = [
        solve_plan(
            name=name,
            section=section,
            tasks=tasks,
            resources=resources,
            traffic=traffic,
            rules=rules,
            block_history=block_history,
            planning_date=planning_date,
            traffic_weight=traffic_weight,
            maintenance_weight=maintenance_weight,
            overrun_weight=overrun_weight,
        )
        for name, traffic_weight, maintenance_weight, overrun_weight in profiles
    ]

    feasible = [plan for plan in plans if plan["feasible"]]
    recommended = min(feasible, key=lambda p: p["objective_value"]) if feasible else None
    return {
        "engine": "ThinkSync Module 2 - ML + Rules + OR-Tools CP-SAT",
        "section_id": section.get("section_id"),
        "planning_date": planning_date.isoformat(),
        "recommended_plan": recommended["name"] if recommended else None,
        "plans": plans,
    }
