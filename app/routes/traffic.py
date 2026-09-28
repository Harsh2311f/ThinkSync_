from fastapi import APIRouter, Query

from app.schemas.traffic import TrainMovement
from app.services import data_service


router = APIRouter()


@router.get(
    "/traffic",
    response_model=list[TrainMovement],
)
async def read_traffic(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
    direction: str | None = Query(default=None),
    priority: str | None = Query(default=None),
    train_category: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
):
    return await data_service.get_traffic(
        section_id=section_id or section,
        direction=direction,
        priority=priority,
        train_category=train_category,
        skip=skip,
        limit=limit,
    )
