from app.database import db

async def get_all_sections(division: str | None = None):
    query = {}
    if division:
        query["division"] = division
    cursor = db.sections.find(query, {"_id": 0})
    return await cursor.to_list(length=None)