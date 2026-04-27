from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Building, Facility, FacilityType, Floor


async def get_all_buildings(db: AsyncSession) -> list[Building]:
    result = await db.execute(select(Building).order_by(Building.id))
    return list(result.scalars().all())


async def get_building_by_id(db: AsyncSession, building_id: int) -> Optional[Building]:
    return await db.get(Building, building_id)


async def get_floors_by_building_id(db: AsyncSession, building_id: int) -> list[Floor]:
    result = await db.execute(
        select(Floor)
        .where(Floor.building_id == building_id)
        .order_by(Floor.sort_order, Floor.id)
    )
    return list(result.scalars().all())


async def get_facilities_by_building_id(
    db: AsyncSession,
    building_id: int,
    floor_code: Optional[str] = None,
    facility_types: Optional[list[str]] = None,
) -> list[Facility]:
    query = (
        select(Facility)
        .join(Floor, Facility.floor_id == Floor.id)
        .join(FacilityType, Facility.facility_type_id == FacilityType.id)
        .where(Facility.building_id == building_id)
        .where(Facility.is_active)
        .order_by(Facility.id)
    )

    if floor_code is not None:
        query = query.where(Floor.floor_code == floor_code)

    if facility_types:
        query = query.where(FacilityType.name.in_(facility_types))

    result = await db.execute(query)
    return list(result.scalars().all())
