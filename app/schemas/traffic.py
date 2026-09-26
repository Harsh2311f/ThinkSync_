# app/schemas/traffic.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Geo(BaseModel):
    state: Optional[str] = None
    division: Optional[str] = None
    zone: Optional[str] = None
    district_corridor: Optional[str] = None
    origin_station: Optional[str] = None
    destination_station: Optional[str] = None


class TrainMovement(BaseModel):
    movement_id: str
    train_category: Optional[str] = None
    dataset: Optional[str] = None
    section_id: Optional[str] = None
    geo: Optional[Geo] = None
    train_id: Optional[str] = None
    train_type: Optional[str] = None
    scheduled_entry: Optional[datetime] = None
    scheduled_exit: Optional[datetime] = None
    actual_entry: Optional[datetime] = None
    actual_exit: Optional[datetime] = None
    delay_minutes: Optional[int] = None
    direction: Optional[str] = None
    priority: Optional[str] = None
    corridor_status: Optional[str] = None
    hour: Optional[int] = None
    day_of_week: Optional[str] = None
    commodity_class: Optional[str] = None
    network_load_index: Optional[float] = None