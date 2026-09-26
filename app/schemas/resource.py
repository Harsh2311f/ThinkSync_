# app/schemas/resource.py
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


class Resource(BaseModel):
    resource_id: str
    dataset: Optional[str] = None
    section_id: Optional[str] = None
    geo: Optional[Geo] = None
    resource_type: Optional[str] = None
    department: Optional[str] = None
    depot_id: Optional[str] = None
    available_from: Optional[datetime] = None
    available_to: Optional[datetime] = None
    quantity: Optional[int] = None
    status: Optional[str] = None
    skill_or_item: Optional[str] = None
    is_usable: Optional[bool] = None