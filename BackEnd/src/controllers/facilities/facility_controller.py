from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Facility, FacilityType, Floor


class CreateFacilityRequest(BaseModel):
    name: str
    building_id: int
    floor_id: int
    type_id: int
    lat: Optional[float] = None
    lng: Optional[float] = None


class UpdateFacilityRequest(BaseModel):
    name: str


async def get_facility_by_id(facility_id: int, db: AsyncSession) -> dict:
    result = await db.execute(
        select(Facility, Floor, FacilityType)
        .join(Floor, Facility.floor_id == Floor.id)
        .join(FacilityType, Facility.facility_type_id == FacilityType.id)
        .where(Facility.id == facility_id)
        .where(Facility.is_active == True)
    )
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Facility not found")

    facility, floor, facility_type = row

    return {
        "id": facility.id,
        "name": facility.name,
        "floor": floor.floor_code,
        "type": facility_type.name,
        "lat": facility.latitude,
        "lng": facility.longitude,
    }


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
        .where(Facility.is_active == True)
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
        .where(Facility.is_active == True)
    )
    facility = result.scalars().first()

    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    facility.is_active = False
    await db.commit()

    return {"message": "deleted"}
