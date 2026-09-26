from pydantic import BaseModel
from typing import Optional

class GeoPoint(BaseModel):
    type: str
    coordinates: list[float]

class Section(BaseModel):
    section_id: str
    dataset: Optional[str] = None
    state: Optional[str] = None
    division: Optional[str] = None
    zone: Optional[str] = None
    district_corridor: Optional[str] = None
    origin_station: Optional[str] = None
    destination_station: Optional[str] = None
    line_type: Optional[str] = None
    length_km: Optional[float] = None
    traffic_density: Optional[float] = None
    asset_age_index: Optional[float] = None
    depot_id: Optional[str] = None