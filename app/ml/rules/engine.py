from __future__ import annotations

from typing import Any


def task_category(task: dict[str, Any]) -> str:
    asset = task.get("asset") or {}
    defect = str(asset.get("defect_type") or "").strip()
    asset_type = str(asset.get("type") or "").strip()
    return defect or asset_type or "Unknown"


def _category_candidates(task: dict[str, Any]) -> set[str]:
    asset = task.get("asset") or {}
    return {
        str(asset.get("defect_type") or "").strip(),
        str(asset.get("type") or "").strip(),
    } - {""}


def match_rule(task_a: dict[str, Any], task_b: dict[str, Any], rules: list[dict[str, Any]]) -> dict[str, Any] | None:
    dept_a = task_a.get("department")
    dept_b = task_b.get("department")
    categories_a = _category_candidates(task_a)
    categories_b = _category_candidates(task_b)

    for rule in rules:
        if rule.get("dataset") not in (None, "jharkhand"):
            continue

        direct = (
            rule.get("department_a") == dept_a
            and rule.get("department_b") == dept_b
            and rule.get("task_category_a") in categories_a
            and rule.get("task_category_b") in categories_b
        )
        reverse = (
            rule.get("department_a") == dept_b
            and rule.get("department_b") == dept_a
            and rule.get("task_category_a") in categories_b
            and rule.get("task_category_b") in categories_a
        )
        if direct or reverse:
            return rule
    return None


def compatibility(task_a: dict[str, Any], task_b: dict[str, Any], rules: list[dict[str, Any]]) -> dict[str, Any]:
    rule = match_rule(task_a, task_b, rules)
    if rule:
        return {
            "compatible": bool(rule.get("compatible")),
            "reason": rule.get("dependency_rule") or rule.get("notes") or rule.get("rule_id"),
            "rule_id": rule.get("rule_id"),
        }

    # Prototype default: tasks are allowed to share a planning horizon unless a known
    # hard compatibility rule rejects the combination. Resource constraints still apply.
    return {
        "compatible": True,
        "reason": "No explicit incompatibility rule matched",
        "rule_id": None,
    }


def required_block_type(task: dict[str, Any]) -> str:
    readiness = task.get("readiness") or {}
    department = task.get("department")

    if readiness.get("power_block_required") is True or department == "TRD":
        return "Power Block"
    if readiness.get("disconnection_required") is True:
        return "Integrated Block"
    return "Traffic Block"


def hard_resource_check(task: dict[str, Any], resources: list[dict[str, Any]]) -> dict[str, Any]:
    readiness = task.get("readiness") or {}
    usable = [r for r in resources if r.get("is_usable", r.get("status") == "Available")]

    if readiness.get("tower_wagon_required") is True:
        has_tower_wagon = any(
            r.get("resource_type") == "Machine"
            and "tower wagon" in str(r.get("skill_or_item") or "").lower()
            for r in usable
        ) or readiness.get("tower_wagon_available") is True
        if not has_tower_wagon:
            return {"allowed": False, "reason": "Tower wagon required but unavailable"}

    if readiness.get("material_available") is False:
        has_material = any(r.get("resource_type") == "Material" for r in usable)
        if not has_material:
            return {"allowed": False, "reason": "Required material unavailable"}

    return {"allowed": True, "reason": "Hard resource checks passed"}
