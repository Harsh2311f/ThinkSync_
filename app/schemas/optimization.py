from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OptimizationRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

    section_id: Optional[str] = None
    task_ids: list[str] = Field(default_factory=list)
    planning_date: Optional[date] = None


class ReplanRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

    plan_id: Optional[str] = None
    section_id: Optional[str] = None
    reason: Optional[str] = None
