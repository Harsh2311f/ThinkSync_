import asyncio
from datetime import datetime, timedelta, timezone

from pymongo import ReturnDocument

from app.database import db


async def get_all_sections(division: str | None = None):
    query = {"dataset": "jharkhand"}

    if division:
        query["division"] = division

    cursor = (
        db.sections
        .find(query, {"_id": 0})
        .sort("section_id", 1)
    )

    return await cursor.to_list(length=100)


async def get_tasks(
    section_id: str | None = None,
    department: str | None = None,
    severity: str | None = None,
    is_overdue: bool | None = None,
    skip: int = 0,
    limit: int = 100,
):
    query = {"dataset": "jharkhand"}

    if section_id:
        query["section_id"] = section_id

    if department:
        query["department"] = department

    if severity:
        query["labels.severity"] = severity

    if is_overdue is not None:
        query["schedule.is_overdue"] = is_overdue

    cursor = (
        db.maintenance_tasks
        .find(query, {"_id": 0})
        .sort("labels.risk_score", -1)
        .skip(skip)
        .limit(limit)
    )

    return await cursor.to_list(length=limit)


async def get_task_by_id(task_id: str):
    return await db.maintenance_tasks.find_one(
        {
            "task_id": task_id,
            "dataset": "jharkhand",
        },
        {"_id": 0},
    )


async def update_task_status(task_id: str, status: str):
    return await db.maintenance_tasks.find_one_and_update(
        {
            "task_id": task_id,
            "dataset": "jharkhand",
        },
        {
            "$set": {
                "workflow_status": status.strip(),
                "updated_at": datetime.now(timezone.utc),
            }
        },
        projection={"_id": 0},
        return_document=ReturnDocument.AFTER,
    )


async def get_resources(
    section_id: str | None = None,
    resource_type: str | None = None,
    status: str | None = None,
    department: str | None = None,
    skip: int = 0,
    limit: int = 100,
):
    query = {"dataset": "jharkhand"}

    if section_id:
        query["section_id"] = section_id

    if resource_type:
        query["resource_type"] = resource_type

    if status:
        query["status"] = status

    if department:
        query["department"] = department

    cursor = (
        db.resources
        .find(query, {"_id": 0})
        .sort("resource_id", 1)
        .skip(skip)
        .limit(limit)
    )

    return await cursor.to_list(length=limit)


async def get_blocks(
    section_id: str | None = None,
    block_type: str | None = None,
    overrun_flag: bool | None = None,
    block_outcome: str | None = None,
    skip: int = 0,
    limit: int = 100,
):
    query = {"dataset": "jharkhand"}

    if section_id:
        query["section_id"] = section_id

    if block_type:
        query["block_type"] = block_type

    if overrun_flag is not None:
        query["overrun_flag"] = overrun_flag

    if block_outcome:
        query["block_outcome"] = block_outcome

    cursor = (
        db.block_history
        .find(query, {"_id": 0})
        .sort("block_start", -1)
        .skip(skip)
        .limit(limit)
    )

    return await cursor.to_list(length=limit)


async def get_traffic(
    section_id: str | None = None,
    direction: str | None = None,
    priority: str | None = None,
    train_category: str | None = None,
    skip: int = 0,
    limit: int = 100,
):
    query = {"dataset": "jharkhand"}

    if section_id:
        query["section_id"] = section_id

    if direction:
        query["direction"] = direction

    if priority:
        query["priority"] = priority

    if train_category:
        query["train_category"] = train_category

    cursor = (
        db.train_movements
        .find(query, {"_id": 0})
        .sort("scheduled_entry", 1)
        .skip(skip)
        .limit(limit)
    )

    return await cursor.to_list(length=limit)


async def get_task_kpis(database, section_id: str | None = None):
    match_stage = {
        "dataset": "jharkhand",
        "labels.maintenance_required": True,
        "workflow_status": {"$ne": "Completed"},
    }
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
            },
        }},
    ]
    result = await (await database.maintenance_tasks.aggregate(pipeline)).to_list(length=1)

    severity_pipeline = [
        {"$match": match_stage},
        {"$group": {"_id": "$labels.severity", "count": {"$sum": 1}}},
    ]
    severity_result = await (await database.maintenance_tasks.aggregate(severity_pipeline)).to_list(length=None)
    by_severity = {doc["_id"]: doc["count"] for doc in severity_result if doc["_id"]}

    if not result:
        return {
            "total_open": 0,
            "by_severity": {},
            "overdue_count": 0,
            "avg_risk_score": None,
        }

    result_item = result[0]
    return {
        "total_open": result_item["total_open"],
        "by_severity": by_severity,
        "overdue_count": result_item["overdue_count"],
        "avg_risk_score": (
            round(result_item["avg_risk_score"], 2)
            if result_item.get("avg_risk_score") is not None
            else None
        ),
    }


async def get_resource_kpis(database, section_id: str | None = None):
    match_stage = {"dataset": "jharkhand"}
    if section_id:
        match_stage["section_id"] = section_id

    pipeline = [
        {"$match": match_stage},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
    ]
    result = await (await database.resources.aggregate(pipeline)).to_list(length=None)
    by_status = {doc["_id"]: doc["count"] for doc in result if doc["_id"]}
    total = sum(by_status.values())
    available = by_status.get("Available", 0)
    readiness_pct = round((available / total) * 100, 1) if total else None

    return {
        "total": total,
        "by_status": by_status,
        "readiness_pct": readiness_pct,
    }


async def get_traffic_kpis(database, section_id: str | None = None):
    match_stage = {"dataset": "jharkhand"}
    if section_id:
        match_stage["section_id"] = section_id

    total = await database.train_movements.count_documents(match_stage)
    return {"total_movements": total}


async def get_block_kpis(database, section_id: str | None = None):
    match_stage = {"dataset": "jharkhand"}
    if section_id:
        match_stage["section_id"] = section_id

    total = await database.block_history.count_documents(match_stage)
    overrun_match = {**match_stage, "overrun_flag": True}
    overrun_count = await database.block_history.count_documents(overrun_match)

    return {
        "total_blocks": total,
        "overrun_count": overrun_count,
    }


async def get_top_risk(database, section_id: str | None = None, limit: int = 5):
    match_stage = {
        "dataset": "jharkhand",
        "labels.maintenance_required": True,
        "workflow_status": {"$ne": "Completed"},
    }
    if section_id:
        match_stage["section_id"] = section_id

    pipeline = [
        {"$match": match_stage},
        {"$sort": {"labels.risk_score": -1}},
        {"$limit": limit},
        {"$project": {
            "_id": 0,
            "section_id": 1,
            "risk_score": "$labels.risk_score",
            "label": "$task_id",
        }},
    ]
    return await (await database.maintenance_tasks.aggregate(pipeline)).to_list(length=limit)


async def get_dashboard_summary(database, section_id: str | None = None):
    tasks, resources, traffic, blocks, top_risk = await asyncio.gather(
        get_task_kpis(database, section_id),
        get_resource_kpis(database, section_id),
        get_traffic_kpis(database, section_id),
        get_block_kpis(database, section_id),
        get_top_risk(database, section_id),
    )

    return {
        "scope": "section" if section_id else "network",
        "section_id": section_id,
        "tasks": tasks,
        "resources": resources,
        "traffic": traffic,
        "blocks": blocks,
        "top_risk": top_risk,
    }


async def get_health_map(database):
    sections = await (
        database.sections
        .find({"dataset": "jharkhand"}, {"_id": 0})
        .sort("section_id", 1)
        .to_list(length=100)
    )

    task_pipeline = [
        {"$match": {
            "dataset": "jharkhand",
            "labels.maintenance_required": True,
            "workflow_status": {"$ne": "Completed"},
        }},
        {"$group": {
            "_id": "$section_id",
            "avg_risk_score": {"$avg": "$labels.risk_score"},
            "overdue_count": {
                "$sum": {"$cond": [{"$eq": ["$schedule.is_overdue", True]}, 1, 0]}
            },
            "critical_count": {
                "$sum": {"$cond": [{"$eq": ["$labels.severity", "Critical"]}, 1, 0]}
            },
        }},
    ]

    resource_pipeline = [
        {"$match": {"dataset": "jharkhand"}},
        {"$group": {
            "_id": "$section_id",
            "total": {"$sum": 1},
            "available": {
                "$sum": {"$cond": [{"$eq": ["$status", "Available"]}, 1, 0]}
            },
        }},
    ]

    block_pipeline = [
        {"$match": {"dataset": "jharkhand", "overrun_flag": True}},
        {"$group": {"_id": "$section_id", "count": {"$sum": 1}}},
    ]

    task_rows, resource_rows, block_rows = await asyncio.gather(
        (await database.maintenance_tasks.aggregate(task_pipeline)).to_list(length=None),
        (await database.resources.aggregate(resource_pipeline)).to_list(length=None),
        (await database.block_history.aggregate(block_pipeline)).to_list(length=None),
    )

    task_by_section = {row["_id"]: row for row in task_rows}
    resource_by_section = {row["_id"]: row for row in resource_rows}
    block_by_section = {row["_id"]: row for row in block_rows}

    result = []
    for section in sections:
        section_id = section["section_id"]
        task_data = task_by_section.get(section_id, {})
        resource_data = resource_by_section.get(section_id, {})
        block_data = block_by_section.get(section_id, {})

        avg_risk = task_data.get("avg_risk_score")
        if avg_risk is not None:
            avg_risk = round(avg_risk, 2)

        resource_total = resource_data.get("total", 0)
        resource_available = resource_data.get("available", 0)
        resource_readiness = (
            round((resource_available / resource_total) * 100, 1)
            if resource_total
            else None
        )

        if avg_risk is not None and avg_risk >= 80:
            health_status = "critical"
        elif avg_risk is not None and avg_risk >= 65:
            health_status = "warning"
        else:
            health_status = "healthy"

        result.append({
            "section_id": section_id,
            "division": section.get("division"),
            "origin_station": section.get("origin_station"),
            "destination_station": section.get("destination_station"),
            "origin_geo": section.get("origin_geo"),
            "destination_geo": section.get("destination_geo"),
            "avg_risk_score": avg_risk,
            "overdue_count": task_data.get("overdue_count", 0),
            "critical_count": task_data.get("critical_count", 0),
            "resource_readiness_pct": resource_readiness,
            "block_overrun_count": block_data.get("count", 0),
            "health_status": health_status,
        })

    return result


async def _latest_dataset_datetime(database):
    rows = await (
        database.maintenance_tasks
        .find(
            {"dataset": "jharkhand", "event_datetime": {"$ne": None}},
            {"_id": 0, "event_datetime": 1},
        )
        .sort("event_datetime", -1)
        .limit(1)
        .to_list(length=1)
    )

    if rows and rows[0].get("event_datetime"):
        value = rows[0]["event_datetime"]
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            try:
                return datetime.fromisoformat(value.replace("Z", "+00:00"))
            except ValueError:
                pass

    return datetime.now(timezone.utc)


async def get_report(
    database,
    period: str,
    days: int,
    section_id: str | None = None,
    end_date: datetime | None = None,
):
    report_end = end_date or await _latest_dataset_datetime(database)
    if report_end.tzinfo is None:
        report_end = report_end.replace(tzinfo=timezone.utc)

    report_start = report_end - timedelta(days=days)

    # mongoimport can preserve Extended JSON dates as BSON datetimes, while
    # older/plain imports may leave ISO-8601 strings. Match the stored type.
    sample_task = await database.maintenance_tasks.find_one(
        {"dataset": "jharkhand", "event_datetime": {"$ne": None}},
        {"_id": 0, "event_datetime": 1},
    )
    dates_are_strings = bool(
        sample_task and isinstance(sample_task.get("event_datetime"), str)
    )

    if dates_are_strings:
        query_start = report_start.replace(tzinfo=None).isoformat(timespec="seconds")
        query_end = report_end.replace(tzinfo=None).isoformat(timespec="seconds")
    else:
        query_start = report_start
        query_end = report_end

    section_filter = {"section_id": section_id} if section_id else {}

    task_match = {
        "dataset": "jharkhand",
        "event_datetime": {"$gte": query_start, "$lte": query_end},
        **section_filter,
    }
    block_match = {
        "dataset": "jharkhand",
        "block_start": {"$gte": query_start, "$lte": query_end},
        **section_filter,
    }
    traffic_match = {
        "dataset": "jharkhand",
        "scheduled_entry": {"$gte": query_start, "$lte": query_end},
        **section_filter,
    }
    resource_match = {
        "dataset": "jharkhand",
        "available_from": {"$gte": query_start, "$lte": query_end},
        **section_filter,
    }

    severity_pipeline = [
        {"$match": task_match},
        {"$group": {"_id": "$labels.severity", "count": {"$sum": 1}}},
    ]
    department_pipeline = [
        {"$match": task_match},
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
    ]
    block_average_pipeline = [
        {"$match": block_match},
        {"$group": {"_id": None, "avg": {"$avg": "$overrun_min"}}},
    ]
    traffic_average_pipeline = [
        {"$match": traffic_match},
        {"$group": {"_id": None, "avg": {"$avg": "$delay_minutes"}}},
    ]

    (
        task_total,
        task_overdue,
        severity_rows,
        department_rows,
        block_total,
        block_overruns,
        block_avg_rows,
        traffic_total,
        traffic_avg_rows,
        resource_total,
        resource_available,
    ) = await asyncio.gather(
        database.maintenance_tasks.count_documents(task_match),
        database.maintenance_tasks.count_documents({**task_match, "schedule.is_overdue": True}),
        (await database.maintenance_tasks.aggregate(severity_pipeline)).to_list(length=None),
        (await database.maintenance_tasks.aggregate(department_pipeline)).to_list(length=None),
        database.block_history.count_documents(block_match),
        database.block_history.count_documents({**block_match, "overrun_flag": True}),
        (await database.block_history.aggregate(block_average_pipeline)).to_list(length=1),
        database.train_movements.count_documents(traffic_match),
        (await database.train_movements.aggregate(traffic_average_pipeline)).to_list(length=1),
        database.resources.count_documents(resource_match),
        database.resources.count_documents({**resource_match, "status": "Available"}),
    )

    by_severity = {row["_id"]: row["count"] for row in severity_rows if row["_id"]}
    by_department = {row["_id"]: row["count"] for row in department_rows if row["_id"]}

    block_avg = block_avg_rows[0].get("avg") if block_avg_rows else None
    traffic_avg = traffic_avg_rows[0].get("avg") if traffic_avg_rows else None

    return {
        "period": period,
        "start_date": report_start,
        "end_date": report_end,
        "section_id": section_id,
        "tasks": {
            "total": task_total,
            "overdue": task_overdue,
            "by_severity": by_severity,
            "by_department": by_department,
        },
        "blocks": {
            "total": block_total,
            "overruns": block_overruns,
            "avg_overrun_min": round(block_avg, 2) if block_avg is not None else None,
        },
        "traffic": {
            "total": traffic_total,
            "avg_delay_min": round(traffic_avg, 2) if traffic_avg is not None else None,
        },
        "resources": {
            "total": resource_total,
            "available": resource_available,
            "readiness_pct": (
                round((resource_available / resource_total) * 100, 1)
                if resource_total
                else None
            ),
        },
    }
