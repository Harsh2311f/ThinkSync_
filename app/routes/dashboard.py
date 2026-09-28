from fastapi import APIRouter, Query

from app.database import db
from app.schemas.dashboard import DashboardSummary
from app.services.data_service import get_dashboard_summary

router = APIRouter()


@router.get("/dashboard", response_model=DashboardSummary)
async def dashboard(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
):
    selected_section = section_id or section
    return await get_dashboard_summary(db, selected_section)
