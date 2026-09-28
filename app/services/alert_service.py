from app.database import db


async def get_alerts(section_id: str | None = None, limit: int = 20):
    base_match = {"dataset": "jharkhand"}
    if section_id:
        base_match["section_id"] = section_id

    per_type_limit = max(1, limit)

    critical_tasks = await (
        db.maintenance_tasks
        .find(
            {
                **base_match,
                "labels.maintenance_required": True,
                "labels.severity": "Critical",
                "workflow_status": {"$ne": "Completed"},
            },
            {"_id": 0},
        )
        .sort("labels.risk_score", -1)
        .limit(per_type_limit)
        .to_list(length=per_type_limit)
    )

    unavailable_resources = await (
        db.resources
        .find(
            {
                **base_match,
                "status": {"$in": ["Unavailable", "Maintenance"]},
            },
            {"_id": 0},
        )
        .sort("available_from", -1)
        .limit(per_type_limit)
        .to_list(length=per_type_limit)
    )

    block_overruns = await (
        db.block_history
        .find(
            {
                **base_match,
                "overrun_flag": True,
            },
            {"_id": 0},
        )
        .sort("block_start", -1)
        .limit(per_type_limit)
        .to_list(length=per_type_limit)
    )

    alerts = []

    for task in critical_tasks:
        task_id = task.get("task_id")
        risk_score = task.get("labels", {}).get("risk_score")
        alerts.append({
            "alert_id": f"task-{task_id}",
            "alert_type": "critical_task",
            "severity": "critical",
            "title": "Critical maintenance task",
            "message": f"{task_id} has risk score {risk_score}.",
            "section_id": task.get("section_id"),
            "source_id": task_id,
            "timestamp": task.get("event_datetime"),
        })

    for resource in unavailable_resources:
        resource_id = resource.get("resource_id")
        status = resource.get("status")
        alerts.append({
            "alert_id": f"resource-{resource_id}",
            "alert_type": "resource",
            "severity": "warning",
            "title": "Resource availability issue",
            "message": f"{resource_id} is currently marked {status}.",
            "section_id": resource.get("section_id"),
            "source_id": resource_id,
            "timestamp": resource.get("available_from"),
        })

    for block in block_overruns:
        block_id = block.get("block_id")
        overrun_min = block.get("overrun_min")
        alerts.append({
            "alert_id": f"block-{block_id}",
            "alert_type": "block_overrun",
            "severity": "high",
            "title": "Maintenance block overrun",
            "message": f"{block_id} overran by {overrun_min} minutes.",
            "section_id": block.get("section_id"),
            "source_id": block_id,
            "timestamp": block.get("block_start"),
        })

    severity_order = {"critical": 0, "high": 1, "warning": 2, "info": 3}
    alerts.sort(
        key=lambda item: (
            severity_order.get(item["severity"], 9),
            -(item["timestamp"].timestamp() if item.get("timestamp") else 0),
        )
    )

    return alerts[:limit]
