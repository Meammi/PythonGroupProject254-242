from datetime import datetime
from pydantic import BaseModel

class TemperatureResponse(BaseModel):
    id: int
    building_id: int
    floor_id: int
    facility_id: int
    temperature: float
    created_at: datetime

    class Config:
        from_attributes = True
