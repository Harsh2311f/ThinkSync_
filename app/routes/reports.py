from datetime import datetime

from fastapi import APIRouter, Query

from app.database import db
from app.schemas.report import ReportSummary
from app.services.data_service import get_report

router = APIRouter()


@router.get("/reports/weekly", response_model=ReportSummary)
async def weekly_report(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
    end_date: datetime | None = Query(default=None),
):
    return await get_report(
        db,
        period="weekly",
        days=7,
        section_id=section_id or section,
        end_date=end_date,
    )


@router.get("/reports/monthly", response_model=ReportSummary)
async def monthly_report(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
    end_date: datetime | None = Query(default=None),
):
    return await get_report(
        db,
        period="monthly",
        days=30,
        section_id=section_id or section,
        end_date=end_date,
    )
