from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Building, Facility, FacilityType, Floor


# ── Pydantic Schemas ─────────────────────────────────────────────────────────

class FacilityTypeDetail(BaseModel):
    name: str
    icon: str


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


# ── GET /facilities/{id} ────────────────────────────────────────────────────

async def get_facility_by_id(
    facility_id: int, db: AsyncSession
) -> FacilityDetailResponse:
    """Return a single facility with its floor, type, and parent building info."""
    result = await db.execute(
        select(Facility, Floor.floor_code, FacilityType.name, FacilityType.icon,
               Building.name, Building.code)
        .join(Floor, Facility.floor_id == Floor.id)
        .join(FacilityType, Facility.facility_type_id == FacilityType.id)
        .join(Building, Facility.building_id == Building.id)
        .where(Facility.id == facility_id)
    )
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Facility not found")

    facility, floor_code, type_name, type_icon, bldg_name, bldg_code = row

    return FacilityDetailResponse(
        id=facility.id,
        name=facility.name,
        lat=facility.latitude,
        lng=facility.longitude,
        description=facility.description,
        is_active=facility.is_active,
        floor=floor_code,
        type=FacilityTypeDetail(name=type_name, icon=type_icon),
        building_name=bldg_name,
        building_code=bldg_code,
    )


async def create_facility(body: CreateFacilityRequest, db: AsyncSession) -> dict:
    new_facility = Facility(
        name=body.name,
        building_id=body.building_id,
        floor_id=body.floor_id,
        facility_type_id=body.type_id,
        latitude=body.lat,
        longitude=body.lng,
    )
    db.add(new_facility)
    await db.commit()
    await db.refresh(new_facility)

    return {
        "id": new_facility.id,
        "message": "created",
    }


async def update_facility(facility_id: int, body: UpdateFacilityRequest, db: AsyncSession) -> dict:
    result = await db.execute(
        select(Facility)
        .where(Facility.id == facility_id)
        .where(Facility.is_active)
    )
    facility = result.scalars().first()

    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    facility.name = body.name
    await db.commit()

    return {"message": "updated"}


async def delete_facility(facility_id: int, db: AsyncSession) -> dict:
    result = await db.execute(
        select(Facility)
        .where(Facility.id == facility_id)
        .where(Facility.is_active)
    )
    facility = result.scalars().first()

    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    facility.is_active = False
    await db.commit()

    return {"message": "deleted"}
