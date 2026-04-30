from typing import Optional

from pydantic import BaseModel, Field


class FacilityTypeDetail(BaseModel):
    name: str
    icon: Optional[str]


class FacilityDetailResponse(BaseModel):
    id: int
    name: str
    lat: Optional[float]
    lng: Optional[float]
    description: Optional[str]
    is_active: bool
    floor: str
    type: FacilityTypeDetail
    building_name: str
    building_code: str


class CreateFacilityRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    building_id: int = Field(..., ge=1)
    floor_id: int = Field(..., ge=1)
    type_id: int = Field(..., ge=1)
    lat: Optional[float] = None
    lng: Optional[float] = None


class UpdateFacilityRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
