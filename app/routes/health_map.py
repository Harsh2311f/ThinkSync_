from fastapi import APIRouter

from app.database import db
from app.schemas.health_map import HealthMapItem
from app.services.data_service import get_health_map

router = APIRouter()


@router.get("/health-map", response_model=list[HealthMapItem])
async def health_map():
    return await get_health_map(db)
