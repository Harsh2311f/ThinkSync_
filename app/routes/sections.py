from fastapi import APIRouter, Query
from app.services.data_service import get_all_sections

router = APIRouter()

@router.get("/api/sections")
async def sections(division: str | None = Query(None)):
    return await get_all_sections(division)