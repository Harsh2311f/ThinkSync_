# app/routes/blocks.py
from fastapi import APIRouter, Query
from app.services import data_service

router = APIRouter()


@router.get("/blocks")
async def read_blocks(
    section_id: str = Query(None),
    block_type: str = Query(None),
    overrun_flag: bool = Query(None),
    block_outcome: str = Query(None),
):
    return await data_service.get_blocks(
        section_id=section_id,
        block_type=block_type,
        overrun_flag=overrun_flag,
        block_outcome=block_outcome,
    )