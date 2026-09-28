from fastapi import APIRouter, Query

from app.schemas.block import Block
from app.services import data_service


router = APIRouter()


@router.get(
    "/blocks",
    response_model=list[Block],
)
async def read_blocks(
    section_id: str | None = Query(default=None),
    section: str | None = Query(default=None),
    block_type: str | None = Query(default=None),
    overrun_flag: bool | None = Query(default=None),
    block_outcome: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
):
    return await data_service.get_blocks(
        section_id=section_id or section,
        block_type=block_type,
        overrun_flag=overrun_flag,
        block_outcome=block_outcome,
        skip=skip,
        limit=limit,
    )
