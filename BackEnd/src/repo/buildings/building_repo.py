import logging
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Building, Facility, FacilityType, Floor

logger = logging.getLogger(__name__)


# ── Read ─────────────────────────────────────────────────────────────────────

async def get_all_buildings(db: AsyncSession) -> list[Building]:
    result = await db.execute(select(Building).order_by(Building.id))
    return list(result.scalars().all())


async def get_building_by_id(db: AsyncSession, building_id: int) -> Optional[Building]:
    return await db.get(Building, building_id)


async def get_building_by_code(db: AsyncSession, code: str) -> Optional[Building]:
    result = await db.execute(select(Building).where(Building.code == code))
    return result.scalar_one_or_none()


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
) -> list[tuple]:
    """Return (Facility, floor_code, type_name, type_icon) tuples."""
    query = (
        select(Facility, Floor.floor_code, FacilityType.name, FacilityType.icon)
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
    return list(result.tuples().all())


# ── Create ───────────────────────────────────────────────────────────────────

async def create_building(db: AsyncSession, building: Building) -> Building:
    db.add(building)
    await db.commit()
    await db.refresh(building)
    logger.info("Created building id=%s code=%s", building.id, building.code)
    return building


# ── Update ───────────────────────────────────────────────────────────────────

async def update_building(
    db: AsyncSession,
    building: Building,
    update_data: dict,
) -> Building:
    for key, value in update_data.items():
        setattr(building, key, value)
    await db.commit()
    await db.refresh(building)
    logger.info("Updated building id=%s", building.id)
    return building


# ── Delete ───────────────────────────────────────────────────────────────────

async def delete_building(db: AsyncSession, building: Building) -> None:
    await db.delete(building)
    await db.commit()
    logger.info("Deleted building id=%s", building.id)
