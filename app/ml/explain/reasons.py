from __future__ import annotations

from typing import Any


def task_reason(task: dict[str, Any], risk: dict[str, Any], duration: dict[str, Any]) -> list[str]:
    reasons: list[str] = []
    schedule = task.get("schedule") or {}
    context = task.get("context") or {}
    readiness = task.get("readiness") or {}

    reasons.append(f"Predicted severity {risk['severity']} with risk score {risk['risk_score']}")
    if schedule.get("is_overdue"):
        reasons.append(f"Task is overdue by {schedule.get('overdue_hours', 0)} hours")
    if context.get("previous_failures_12m", 0):
        reasons.append(f"Previous failures in last 12 months: {context.get('previous_failures_12m')}")
    if readiness.get("crew_gap", 0):
        reasons.append(f"Crew gap: {readiness.get('crew_gap')}")
    reasons.append(
        f"Predicted repair duration {duration['minutes']} min; uncertainty range {duration['lower']}-{duration['upper']} min"
    )
    return reasons


def plan_reason(name: str, traffic_weight: int, maintenance_weight: int) -> str:
    if name == "Plan B":
        return "Traffic-protection alternative: gives stronger weight to lower train disruption."
    if name == "Plan C":
        return "Maintenance-priority alternative: gives stronger weight to high-risk and overdue work."
    return "Balanced alternative: balances maintenance value, disruption, resources and overrun risk."
