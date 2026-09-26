from app.database import db
import asyncio

async def get_all_sections(division: str | None = None):
    query = {}
    if division:
        query["division"] = division
    cursor = db.sections.find(query, {"_id": 0})
    return await cursor.to_list(length=None)
# Append these functions to app/services/data_service.py
# (keeps the same filter-dict -> find(query, {"_id": 0}) -> to_list(length=None) pattern as get_sections)



async def get_tasks(
    section_id: str = None,
    department: str = None,
    severity: str = None,
    is_overdue: bool = None,
):
    query = {}
    if section_id:
        query["section_id"] = section_id
    if department:
        query["department"] = department
    if severity:
        query["labels.severity"] = severity
    if is_overdue is not None:
        query["schedule.is_overdue"] = is_overdue

    return await db.maintenance_tasks.find(query, {"_id": 0}).to_list(length=None)


async def get_resources(
    section_id: str = None,
    resource_type: str = None,
    status: str = None,
    department: str = None,
):
    query = {}
    if section_id:
        query["section_id"] = section_id
    if resource_type:
        query["resource_type"] = resource_type
    if status:
        query["status"] = status
    if department:
        query["department"] = department

    return await db.resources.find(query, {"_id": 0}).to_list(length=None)


async def get_blocks(
    section_id: str = None,
    block_type: str = None,
    overrun_flag: bool = None,
    block_outcome: str = None,
):
    query = {}
    if section_id:
        query["section_id"] = section_id
    if block_type:
        query["block_type"] = block_type
    if overrun_flag is not None:
        query["overrun_flag"] = overrun_flag
    if block_outcome:
        query["block_outcome"] = block_outcome

    return await db.block_history.find(query, {"_id": 0}).to_list(length=None)


async def get_traffic(
    section_id: str = None,
    direction: str = None,
    priority: str = None,
    train_category: str = None,
):
    query = {}
    if section_id:
        query["section_id"] = section_id
    if direction:
        query["direction"] = direction
    if priority:
        query["priority"] = priority
    if train_category:
        query["train_category"] = train_category

    return await db.train_movements.find(query, {"_id": 0}).to_list(length=None)
async def get_task_kpis(db, section_id: str | None = None):
    match_stage = {"labels.maintenance_required": True}
    if section_id:
        match_stage["section_id"] = section_id

    pipeline = [
        {"$match": match_stage},
        {"$group": {
            "_id": None,
            "total_open": {"$sum": 1},
            "avg_risk_score": {"$avg": "$labels.risk_score"},
            "overdue_count": {
                "$sum": {"$cond": [{"$eq": ["$schedule.is_overdue", True]}, 1, 0]}
            }
        }}
    ]
    result = await db.maintenance_tasks.aggregate(pipeline).to_list(length=1)

    severity_pipeline = [
        {"$match": match_stage},
        {"$group": {"_id": "$labels.severity", "count": {"$sum": 1}}}
    ]
    severity_result = await db.maintenance_tasks.aggregate(severity_pipeline).to_list(length=None)
    by_severity = {doc["_id"]: doc["count"] for doc in severity_result if doc["_id"]}

    if not result:
        return {"total_open": 0, "by_severity": {}, "overdue_count": 0, "avg_risk_score": None}

    r = result[0]
    return {
        "total_open": r["total_open"],
        "by_severity": by_severity,
        "overdue_count": r["overdue_count"],
        "avg_risk_score": round(r["avg_risk_score"], 2) if r.get("avg_risk_score") is not None else None
    }

async def get_resource_kpis(db, section_id: str | None = None):
    match_stage = {}
    if section_id:
        match_stage["section_id"] = section_id

    pipeline = [
        {"$match": match_stage},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    result = await db.resources.aggregate(pipeline).to_list(length=None)
    by_status = {doc["_id"]: doc["count"] for doc in result if doc["_id"]}
    total = sum(by_status.values())
    available = by_status.get("Available", 0)
    readiness_pct = round((available / total) * 100, 1) if total else None

    return {"total": total, "by_status": by_status, "readiness_pct": readiness_pct}


async def get_traffic_kpis(db, section_id: str | None = None):
    match_stage = {}
    if section_id:
        match_stage["section_id"] = section_id
    total = await db.train_movements.count_documents(match_stage)
    return {"total_movements": total}


async def get_block_kpis(db, section_id: str | None = None):
    match_stage = {}
    if section_id:
        match_stage["section_id"] = section_id
    total = await db.block_history.count_documents(match_stage)
    overrun_match = {**match_stage, "overrun_flag": True}
    overrun_count = await db.block_history.count_documents(overrun_match)
    return {"total_blocks": total, "overrun_count": overrun_count}


async def get_top_risk(db, section_id: str | None = None, limit: int = 5):
    match_stage = {"labels.maintenance_required": True}
    if section_id:
        match_stage["section_id"] = section_id

    pipeline = [
        {"$match": match_stage},
        {"$sort": {"labels.risk_score": -1}},
        {"$limit": limit},
        {"$project": {"_id": 0, "section_id": 1, "risk_score": "$labels.risk_score", "label": "$task_id"}}
    ]
    result = await db.maintenance_tasks.aggregate(pipeline).to_list(length=limit)
    return result

async def get_dashboard_summary(db, section_id: str | None = None):
    tasks, resources, traffic, blocks, top_risk = await asyncio.gather(
        get_task_kpis(db, section_id),
        get_resource_kpis(db, section_id),
        get_traffic_kpis(db, section_id),
        get_block_kpis(db, section_id),
        get_top_risk(db, section_id)
    )

    return {
        "scope": "section" if section_id else "network",
        "section_id": section_id,
        "tasks": tasks,
        "resources": resources,
        "traffic": traffic,
        "blocks": blocks,
        "top_risk": top_risk
    }