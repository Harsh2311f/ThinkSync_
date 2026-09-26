from pydantic import BaseModel
from typing import Optional


class TaskKPIs(BaseModel):
    total_open: int
    by_severity: dict[str, int]       # e.g. {"High": 12, "Medium": 30, "Low": 8}
    overdue_count: int
    avg_risk_score: Optional[float] = None


class ResourceKPIs(BaseModel):
    total: int
    by_status: dict[str, int]         # e.g. {"Available": 40, "Busy": 15}
    readiness_pct: Optional[float] = None


class TrafficKPIs(BaseModel):
    total_movements: int


class BlockKPIs(BaseModel):
    total_blocks: int
    overrun_count: int


class TopRiskItem(BaseModel):
    section_id: str
    risk_score: float
    label: Optional[str] = None


class DashboardSummary(BaseModel):
    scope: str
    section_id: Optional[str] = None
    tasks: TaskKPIs
    resources: ResourceKPIs
    traffic: TrafficKPIs
    blocks: BlockKPIs
    top_risk: list[TopRiskItem]