# app/routes/resources.py
from fastapi import APIRouter, Query
from app.services import data_service

router = APIRouter()


@router.get("/resources")
async def read_resources(
    section_id: str = Query(None),
    resource_type: str = Query(None),
    status: str = Query(None),
    department: str = Query(None),
):
    return await data_service.get_resources(
        section_id=section_id,
        resource_type=resource_type,
        status=status,
        department=department,
    )