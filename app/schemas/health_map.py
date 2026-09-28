from typing import Optional

from pydantic import BaseModel

from app.schemas.section import GeoPoint


class HealthMapItem(BaseModel):
    section_id: str
    division: Optional[str] = None
    origin_station: Optional[str] = None
    destination_station: Optional[str] = None
    origin_geo: Optional[GeoPoint] = None
    destination_geo: Optional[GeoPoint] = None
    avg_risk_score: Optional[float] = None
    overdue_count: int = 0
    critical_count: int = 0
    resource_readiness_pct: Optional[float] = None
    block_overrun_count: int = 0
    health_status: str
