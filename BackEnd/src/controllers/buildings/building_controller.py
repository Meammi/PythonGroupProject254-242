from typing import Optional

from fastapi import Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.index import get_db_session
from src.services.buildings import building_service


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


class FloorResponse(BaseModel):
    id: int
    code: str


class FloorsResponse(BaseModel):
    data: list[FloorResponse]


class FacilityResponse(BaseModel):
    id: int
    name: str
    lat: Optional[float]
    lng: Optional[float]


class FacilitiesResponse(BaseModel):
    data: list[FacilityResponse]


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

    facilities = await building_service.get_facilities_by_building_id(
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
            )
            for facility in facilities
        ]
    )
