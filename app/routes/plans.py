from fastapi import APIRouter, HTTPException

from app.services.optimization_service import get_plan

router = APIRouter()


@router.get("/plans/{plan_id}")
async def read_plan(plan_id: str):
    plan = await get_plan(plan_id)

    if plan is None:
        raise HTTPException(status_code=404, detail="Plan not found")

    return plan
