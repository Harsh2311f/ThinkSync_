from fastapi import APIRouter, HTTPException

from app.schemas.optimization import OptimizationRequest, ReplanRequest
from app.services.optimization_service import optimize_request, replan_request

router = APIRouter()


@router.post("/optimize")
async def optimize(payload: OptimizationRequest):
    section_id = payload.section_id
    if not section_id:
        raise HTTPException(status_code=400, detail="section_id is required")

    try:
        return await optimize_request(
            section_id=section_id,
            task_ids=payload.task_ids,
            planning_date=payload.planning_date,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.post("/replan")
async def replan(payload: ReplanRequest):
    if not payload.plan_id:
        raise HTTPException(status_code=400, detail="plan_id is required")

    try:
        result = await replan_request(payload.plan_id, payload.reason)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    if result is None:
        raise HTTPException(status_code=404, detail="Plan not found")
    return result
