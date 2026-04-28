import logging
from typing import Optional

from fastapi import Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.index import get_db_session
from src.schemas.building import (
    BuildingCreateOut,
    BuildingOut,
    CreateBuildingRequest,
    MessageOut,
    UpdateBuildingRequest,
)
from src.services.buildings import building_service

logger = logging.getLogger(__name__)


# ── Response wrappers (match existing project pattern) ───────────────────────

class BuildingResponse(BaseModel):
    id: int
    code: str
    name: str
    lat: Optional[float]
    lng: Optional[float]


class BuildingsResponse(BaseModel):
    data: list[BuildingResponse]


class BuildingDetailResponse(BaseModel):
    id: int
    name: str
    lat: Optional[float]
    lng: Optional[float]
    description: Optional[str]


class FloorResponse(BaseModel):
    id: int
    code: str


class FloorsResponse(BaseModel):
    data: list[FloorResponse]


class FacilityTypeResponse(BaseModel):
    name: str
    icon: str


class FacilityResponse(BaseModel):
    id: int
    name: str
    lat: Optional[float]
    lng: Optional[float]
    floor: str
    type: FacilityTypeResponse


class FacilitiesResponse(BaseModel):
    data: list[FacilityResponse]


# ── GET controllers (existing) ───────────────────────────────────────────────

async def get_buildings(db: AsyncSession = Depends(get_db_session)) -> BuildingsResponse:
    buildings = await building_service.get_all_buildings(db)
    return BuildingsResponse(
        data=[
            BuildingResponse(
                id=building.id,
                code=building.code,
                name=building.name,
                lat=building.latitude,
                lng=building.longitude,
            )
            for building in buildings
        ]
    )


async def get_building(
    building_id: int,
    db: AsyncSession = Depends(get_db_session),
) -> BuildingDetailResponse:
    building = await building_service.get_building_by_id(db, building_id)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    return BuildingDetailResponse(
        id=building.id,
        name=building.code,
        lat=building.latitude,
        lng=building.longitude,
        description=building.description,
    )


async def get_building_floors(
    building_id: int,
    db: AsyncSession = Depends(get_db_session),
) -> FloorsResponse:
    building = await building_service.get_building_by_id(db, building_id)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    floors = await building_service.get_floors_by_building_id(db, building_id)
    return FloorsResponse(
        data=[
            FloorResponse(
                id=floor.id,
                code=floor.floor_code,
            )
            for floor in floors
        ]
    )


async def get_building_facilities(
    building_id: int,
    floor: Optional[str] = None,
    facility_types: Optional[list[str]] = Query(default=None, alias="type"),
    db: AsyncSession = Depends(get_db_session),
) -> FacilitiesResponse:
    building = await building_service.get_building_by_id(db, building_id)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    rows = await building_service.get_facilities_by_building_id(
        db,
        building_id,
        floor_code=floor,
        facility_types=facility_types,
    )
    return FacilitiesResponse(
        data=[
            FacilityResponse(
                id=facility.id,
                name=facility.name,
                lat=facility.latitude,
                lng=facility.longitude,
                floor=fcode,
                type=FacilityTypeResponse(name=type_name, icon=type_icon),
            )
            for facility, fcode, type_name, type_icon in rows
        ]
    )


# ── POST / PUT / DELETE controllers (new) ────────────────────────────────────

async def create_building(
    body: CreateBuildingRequest,
    db: AsyncSession = Depends(get_db_session),
) -> BuildingCreateOut:
    """Create a new building entry."""
    try:
        new_building = await building_service.create_building(db, body)
    except Exception as exc:
        logger.error("Failed to create building: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return BuildingCreateOut(id=new_building.id, message="created")


async def update_building(
    building_id: int,
    body: UpdateBuildingRequest,
    db: AsyncSession = Depends(get_db_session),
) -> MessageOut:
    """Update an existing building (partial update)."""
    building = await building_service.get_building_by_id(db, building_id)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    try:
        await building_service.update_building(db, building, body)
    except Exception as exc:
        logger.error("Failed to update building id=%s: %s", building_id, exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return MessageOut(message="updated")


async def delete_building(
    building_id: int,
    db: AsyncSession = Depends(get_db_session),
) -> MessageOut:
    """Delete a building by its ID (hard delete)."""
    building = await building_service.get_building_by_id(db, building_id)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    try:
        await building_service.delete_building(db, building)
    except Exception as exc:
        logger.error("Failed to delete building id=%s: %s", building_id, exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return MessageOut(message="deleted")
