from __future__ import annotations

import asyncio
from datetime import date, datetime, timezone
from uuid import uuid4

from app.database import db
from app.ml.optimizer.plans import optimize_blocks


async def get_plan(plan_id: str):
    return await db.optimized_plans.find_one({"plan_id": plan_id}, {"_id": 0})


async def _build_payload(section_id: str, task_ids: list[str] | None, planning_date: date | None):
    section = await db.sections.find_one(
        {"section_id": section_id, "dataset": "jharkhand"}, {"_id": 0}
    )
    if section is None:
        raise ValueError("Section not found")

    task_query = {
        "dataset": "jharkhand",
        "section_id": section_id,
        "labels.maintenance_required": True,
        "workflow_status": {"$ne": "Completed"},
    }
    if task_ids:
        task_query["task_id"] = {"$in": task_ids}

    tasks = await (
        db.maintenance_tasks.find(task_query, {"_id": 0})
        .sort("labels.risk_score", -1)
        .limit(12)
        .to_list(length=12)
    )
    resources = await db.resources.find(
        {"dataset": "jharkhand", "section_id": section_id}, {"_id": 0}
    ).to_list(length=500)
    traffic = await db.train_movements.find(
        {"dataset": "jharkhand", "section_id": section_id}, {"_id": 0}
    ).to_list(length=2000)
    rules = await db.compatibility_rules.find(
        {"dataset": "jharkhand"}, {"_id": 0}
    ).to_list(length=100)
    block_history = await (
        db.block_history.find(
            {"dataset": "jharkhand", "section_id": section_id}, {"_id": 0}
        )
        .sort("block_start", -1)
        .limit(500)
        .to_list(length=500)
    )

    return {
        "section": section,
        "tasks": tasks,
        "resources": resources,
        "traffic": traffic,
        "rules": rules,
        "block_history": block_history,
        "planning_date": planning_date or date.today(),
    }


async def optimize_request(section_id: str, task_ids: list[str] | None = None, planning_date: date | None = None):
    payload = await _build_payload(section_id, task_ids, planning_date)
    result = await asyncio.to_thread(optimize_blocks, payload)
    plan_id = f"PLAN-{uuid4().hex[:12].upper()}"
    document = {
        "plan_id": plan_id,
        "section_id": section_id,
        "created_at": datetime.now(timezone.utc),
        "status": "generated",
        **result,
    }
    await db.optimized_plans.insert_one(document.copy())
    document.pop("_id", None)
    return document


async def replan_request(plan_id: str, reason: str | None = None):
    existing = await get_plan(plan_id)
    if existing is None:
        return None
    result = await optimize_request(existing["section_id"], planning_date=date.today())
    result["replan_of"] = plan_id
    result["replan_reason"] = reason or "Changed operating condition"
    await db.optimized_plans.update_one(
        {"plan_id": result["plan_id"]},
        {"$set": {"replan_of": plan_id, "replan_reason": result["replan_reason"]}},
    )
    return result
