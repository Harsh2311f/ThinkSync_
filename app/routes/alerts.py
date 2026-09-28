from fastapi import APIRouter, Query

from app.schemas.alert import Alert
from app.services.alert_service import get_alerts

router = APIRouter()


@router.get("/alerts", response_model=list[Alert])
async def alerts(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
):
    return await get_alerts(section_id=section_id or section, limit=limit)
