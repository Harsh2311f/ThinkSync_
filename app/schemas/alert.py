from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Alert(BaseModel):
    alert_id: str
    alert_type: str
    severity: str
    title: str
    message: str
    section_id: Optional[str] = None
    source_id: Optional[str] = None
    timestamp: Optional[datetime] = None
