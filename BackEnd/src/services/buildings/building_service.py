from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Building, Facility, Floor
from src.repo.buildings import building_repo


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
