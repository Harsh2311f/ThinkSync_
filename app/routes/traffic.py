# app/routes/traffic.py
from fastapi import APIRouter, Query
from app.services import data_service

router = APIRouter()


@router.get("/traffic")
async def read_traffic(
    section_id: str = Query(None),
    direction: str = Query(None),
    priority: str = Query(None),
    train_category: str = Query(None),
):
    return await data_service.get_traffic(
        section_id=section_id,
        direction=direction,
        priority=priority,
        train_category=train_category,
    )