from app.database import db

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