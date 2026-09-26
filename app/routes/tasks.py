# app/routes/tasks.py
from fastapi import APIRouter, Query
from app.services import data_service

router = APIRouter()


@router.get("/tasks")
async def read_tasks(
    section_id: str = Query(None),
    department: str = Query(None),
    severity: str = Query(None),
    is_overdue: bool = Query(None),
):
    return await data_service.get_tasks(
        section_id=section_id,
        department=department,
        severity=severity,
        is_overdue=is_overdue,
    )