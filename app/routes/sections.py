from fastapi import APIRouter, Query

from app.schemas.section import Section
from app.services.data_service import get_all_sections


router = APIRouter()


@router.get(
    "/sections",
    response_model=list[Section],
)
async def sections(
    division: str | None = Query(default=None),
):
    return await get_all_sections(division)