from typing import Optional

from pydantic import BaseModel


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
    name: str
    building_id: int
    floor_id: int
    type_id: int
    lat: Optional[float] = None
    lng: Optional[float] = None


class UpdateFacilityRequest(BaseModel):
    name: str
