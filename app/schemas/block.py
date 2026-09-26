# app/schemas/block.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Geo(BaseModel):
    state: Optional[str] = None
    division: Optional[str] = None
    zone: Optional[str] = None
    district_corridor: Optional[str] = None
    origin_station: Optional[str] = None
    destination_station: Optional[str] = None


class Block(BaseModel):
    block_id: str
    dataset: Optional[str] = None
    section_id: Optional[str] = None
    geo: Optional[Geo] = None
    block_start: Optional[datetime] = None
    planned_duration_min: Optional[int] = None
    actual_duration_min: Optional[int] = None
    overrun_min: Optional[int] = None
    block_type: Optional[str] = None
    departments: Optional[List[str]] = None
    tasks_count: Optional[int] = None
    resource_readiness_pct: Optional[int] = None
    train_conflicts: Optional[int] = None
    planned_delay_min: Optional[int] = None
    actual_delay_min: Optional[int] = None
    overrun_flag: Optional[bool] = None
    block_outcome: Optional[str] = None