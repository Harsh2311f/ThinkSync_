from fastapi import APIRouter, HTTPException, Query

from app.schemas.task import Task, TaskStatusUpdate
from app.services import data_service


router = APIRouter()


@router.get(
    "/tasks",
    response_model=list[Task],
)
async def read_tasks(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
    department: str | None = Query(default=None),
    severity: str | None = Query(default=None),
    is_overdue: bool | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
):
    return await data_service.get_tasks(
        section_id=section_id or section,
        department=department,
        severity=severity,
        is_overdue=is_overdue,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/tasks/{task_id}",
    response_model=Task,
)
async def read_task(task_id: str):
    task = await data_service.get_task_by_id(task_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.patch(
    "/tasks/{task_id}/status",
    response_model=Task,
)
async def update_task_status(task_id: str, payload: TaskStatusUpdate):
    task = await data_service.update_task_status(task_id, payload.status)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task
