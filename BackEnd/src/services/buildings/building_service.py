import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Building, Facility, Floor
from src.repo.buildings import building_repo
from src.schemas.building import CreateBuildingRequest, UpdateBuildingRequest

logger = logging.getLogger(__name__)


# ── Read ─────────────────────────────────────────────────────────────────────

async def get_all_buildings(db: AsyncSession) -> list[Building]:
    return await building_repo.get_all_buildings(db)


async def get_building_by_id(db: AsyncSession, building_id: int) -> Optional[Building]:
    return await building_repo.get_building_by_id(db, building_id)


async def get_floors_by_building_id(db: AsyncSession, building_id: int) -> list[Floor]:
    return await building_repo.get_floors_by_building_id(db, building_id)


async def get_facilities_by_building_id(
    db: AsyncSession,
    building_id: int,
    floor_code: Optional[str] = None,
    facility_types: Optional[list[str]] = None,
) -> list[Facility]:
    return await building_repo.get_facilities_by_building_id(
        db,
        building_id,
        floor_code,
        facility_types,
    )


# ── Create ───────────────────────────────────────────────────────────────────

async def create_building(
    db: AsyncSession,
    data: CreateBuildingRequest,
) -> Building:
    new_building = Building(
        code=data.code,
        name=data.name,
        latitude=data.latitude,
        longitude=data.longitude,
        description=data.description,
    )
    return await building_repo.create_building(db, new_building)


# ── Update ───────────────────────────────────────────────────────────────────

async def update_building(
    db: AsyncSession,
    building: Building,
    data: UpdateBuildingRequest,
) -> Building:
    # Only apply fields that were explicitly set in the request body
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        logger.warning("update_building called with no fields to update, id=%s", building.id)
        return building
    return await building_repo.update_building(db, building, update_data)


# ── Delete ───────────────────────────────────────────────────────────────────

async def delete_building(db: AsyncSession, building: Building) -> None:
    await building_repo.delete_building(db, building)
