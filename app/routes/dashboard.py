from fastapi import APIRouter, Query
from app.database import db
from app.services.data_service import get_dashboard_summary
from app.schemas.dashboard import DashboardSummary

router = APIRouter()

@router.get("/dashboard", response_model=DashboardSummary)
async def dashboard(section_id: str | None = Query(default=None)):
    summary = await get_dashboard_summary(db, section_id)
    return summary