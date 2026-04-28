from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ── Request Schemas ──────────────────────────────────────────────────────────

class CreateBuildingRequest(BaseModel):
    """Schema for creating a new building."""

    code: str = Field(..., min_length=1, max_length=100, description="Unique building code")
    name: str = Field(..., min_length=1, max_length=255, description="Building name")
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="Longitude coordinate")
    description: Optional[str] = Field(None, description="Building description")


class UpdateBuildingRequest(BaseModel):
    """Schema for updating an existing building (partial update)."""

    code: Optional[str] = Field(None, min_length=1, max_length=100, description="Unique building code")
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Building name")
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="Longitude coordinate")
    description: Optional[str] = Field(None, description="Building description")


# ── Response Schemas ─────────────────────────────────────────────────────────

class BuildingOut(BaseModel):
    """Single building response payload."""

    id: int
    code: str
    name: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BuildingCreateOut(BaseModel):
    """Response after creating a building."""

    id: int
    message: str = "created"


class MessageOut(BaseModel):
    """Generic message response."""

    message: str
