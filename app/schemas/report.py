from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TaskReport(BaseModel):
    total: int
    overdue: int
    by_severity: dict[str, int]
    by_department: dict[str, int]


class BlockReport(BaseModel):
    total: int
    overruns: int
    avg_overrun_min: Optional[float] = None


class TrafficReport(BaseModel):
    total: int
    avg_delay_min: Optional[float] = None


class ResourceReport(BaseModel):
    total: int
    available: int
    readiness_pct: Optional[float] = None


class ReportSummary(BaseModel):
    period: str
    start_date: datetime
    end_date: datetime
    section_id: Optional[str] = None
    tasks: TaskReport
    blocks: BlockReport
    traffic: TrafficReport
    resources: ResourceReport
