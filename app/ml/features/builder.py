from __future__ import annotations

from datetime import datetime
from typing import Any, Iterable

import numpy as np
import pandas as pd


def _nested(record: dict[str, Any], *path: str, default: Any = None) -> Any:
    value: Any = record
    for key in path:
        if not isinstance(value, dict):
            return default
        value = value.get(key, default)
        if value is default:
            return default
    return value


def _bool_to_int(value: Any) -> int:
    return 1 if value is True else 0


def _extended_date(value: Any) -> datetime | None:
    if isinstance(value, dict) and "$date" in value:
        value = value["$date"]
    if isinstance(value, datetime):
        return value
    if not value:
        return None
    try:
        return pd.to_datetime(value, utc=True).to_pydatetime()
    except (TypeError, ValueError):
        return None


def season_from_month(month: int) -> str:
    if month in (6, 7, 8, 9):
        return "Monsoon"
    if month in (11, 12, 1, 2):
        return "Winter"
    return "Summer"


def task_feature_row(task: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_system": task.get("source_system") or "Unknown",
        "department": task.get("department") or "Unknown",
        "section_id": task.get("section_id") or "Unknown",
        "season": task.get("season") or "Unknown",
        "asset_type": _nested(task, "asset", "type", default="Unknown") or "Unknown",
        "defect_type": _nested(task, "asset", "defect_type", default="Unknown") or "Unknown",
        "ballast_condition": _nested(task, "context", "ballast_condition", default="Unknown") or "Unknown",
        "asset_age_years": _nested(task, "asset", "age_years", default=0) or 0,
        "traffic_density": _nested(task, "context", "traffic_density", default=0) or 0,
        "previous_failures_12m": _nested(task, "context", "previous_failures_12m", default=0) or 0,
        "days_since_service": _nested(task, "context", "days_since_service", default=0) or 0,
        "rail_wear_mm": _nested(task, "context", "rail_wear_mm", default=np.nan),
        "track_vibration": _nested(task, "context", "track_vibration", default=np.nan),
        "overdue_hours": _nested(task, "schedule", "overdue_hours", default=0) or 0,
        "is_overdue": _bool_to_int(_nested(task, "schedule", "is_overdue", default=False)),
        "crew_available": _nested(task, "readiness", "crew_available", default=0) or 0,
        "required_crew": _nested(task, "readiness", "required_crew", default=0) or 0,
        "crew_gap": _nested(task, "readiness", "crew_gap", default=0) or 0,
        "material_available": _bool_to_int(_nested(task, "readiness", "material_available", default=False)),
        "machine_available": _bool_to_int(_nested(task, "readiness", "machine_available", default=False)),
        "readiness_score": _nested(task, "readiness", "readiness_score", default=0.0) or 0.0,
        "power_block_required": _bool_to_int(_nested(task, "readiness", "power_block_required", default=False)),
        "disconnection_required": _bool_to_int(_nested(task, "readiness", "disconnection_required", default=False)),
        "tower_wagon_required": _bool_to_int(_nested(task, "readiness", "tower_wagon_required", default=False)),
        "tower_wagon_available": _bool_to_int(_nested(task, "readiness", "tower_wagon_available", default=False)),
    }


def task_training_frame(tasks: Iterable[dict[str, Any]]) -> pd.DataFrame:
    rows = []
    for task in tasks:
        row = task_feature_row(task)
        row["severity"] = _nested(task, "labels", "severity")
        row["risk_score"] = _nested(task, "labels", "risk_score")
        row["actual_repair_min"] = _nested(task, "labels", "actual_repair_min")
        rows.append(row)
    return pd.DataFrame(rows)


def block_training_frame(blocks: Iterable[dict[str, Any]]) -> pd.DataFrame:
    rows = []
    for block in blocks:
        dt = _extended_date(block.get("block_start"))
        departments = block.get("departments") or []
        rows.append({
            "section_id": block.get("section_id") or "Unknown",
            "block_type": block.get("block_type") or "Unknown",
            "planned_duration_min": block.get("planned_duration_min") or 0,
            "resource_readiness_pct": block.get("resource_readiness_pct") or 0,
            "train_conflicts": block.get("train_conflicts") or 0,
            "tasks_count": block.get("tasks_count") or 0,
            "departments_count": len(departments),
            "season": season_from_month(dt.month) if dt else "Unknown",
            "hour": dt.hour if dt else 0,
            "day_of_week": dt.strftime("%A") if dt else "Unknown",
            "overrun_flag": bool(block.get("overrun_flag", False)),
            "actual_duration_min": block.get("actual_duration_min") or 0,
        })

    frame = pd.DataFrame(rows)
    if frame.empty:
        return frame

    target = frame["overrun_flag"].astype(float)
    grouped_sum = target.groupby(frame["section_id"]).transform("sum")
    grouped_count = target.groupby(frame["section_id"]).transform("count")
    global_rate = float(target.mean())
    denominator = (grouped_count - 1).replace(0, np.nan)
    frame["historical_section_overrun_rate"] = ((grouped_sum - target) / denominator).fillna(global_rate)
    return frame


def freight_training_frame(movements: Iterable[dict[str, Any]], sections: Iterable[dict[str, Any]]) -> pd.DataFrame:
    density_map = {
        item.get("section_id"): item.get("traffic_density", 0)
        for item in sections
        if item.get("section_id")
    }
    rows = []
    for movement in movements:
        if movement.get("train_category") != "goods":
            continue
        dt = _extended_date(movement.get("scheduled_entry"))
        if dt is None:
            continue
        section_id = movement.get("section_id") or "Unknown"
        rows.append({
            "section_id": section_id,
            "window_start": dt.replace(minute=0, second=0, microsecond=0),
            "hour": int(movement.get("hour", dt.hour)),
            "day_of_week": movement.get("day_of_week") or dt.strftime("%A"),
            "season": season_from_month(dt.month),
            "network_load_index": movement.get("network_load_index"),
            "traffic_density": density_map.get(section_id, 0),
        })

    raw = pd.DataFrame(rows)
    if raw.empty:
        return raw

    windows = (
        raw.groupby(["section_id", "window_start", "hour", "day_of_week", "season"], as_index=False)
        .agg(
            goods_count=("section_id", "size"),
            network_load_index=("network_load_index", "mean"),
            traffic_density=("traffic_density", "mean"),
        )
        .sort_values(["section_id", "window_start"])
        .reset_index(drop=True)
    )
    windows["recent_freight_count"] = windows.groupby("section_id")["goods_count"].shift(1).fillna(0).astype(float)
    return windows


RISK_FEATURES = [
    "source_system", "department", "section_id", "season", "asset_type", "defect_type",
    "ballast_condition", "asset_age_years", "traffic_density", "previous_failures_12m",
    "days_since_service", "rail_wear_mm", "track_vibration", "overdue_hours", "is_overdue",
    "crew_gap", "material_available", "machine_available", "readiness_score",
]

DURATION_FEATURES = RISK_FEATURES + ["severity", "crew_available", "required_crew"]

OVERRUN_FEATURES = [
    "section_id", "block_type", "planned_duration_min", "resource_readiness_pct",
    "train_conflicts", "tasks_count", "departments_count", "season", "hour",
    "day_of_week", "historical_section_overrun_rate",
]

FREIGHT_FEATURES = [
    "section_id", "hour", "day_of_week", "season", "recent_freight_count",
    "network_load_index", "traffic_density",
]
