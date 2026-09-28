from fastapi import APIRouter, Query

from app.schemas.resource import Resource
from app.services import data_service


router = APIRouter()


@router.get(
    "/resources",
    response_model=list[Resource],
)
async def read_resources(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
    resource_type: str | None = Query(default=None),
    status: str | None = Query(default=None),
    department: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
):
    return await data_service.get_resources(
        section_id=section_id or section,
        resource_type=resource_type,
        status=status,
        department=department,
        skip=skip,
        limit=limit,
    )
