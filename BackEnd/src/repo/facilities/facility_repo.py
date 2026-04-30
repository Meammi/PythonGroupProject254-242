import logging
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Building, Facility, FacilityType, Floor

logger = logging.getLogger(__name__)


async def get_facility_detail_by_id(
    db: AsyncSession,
    facility_id: int,
) -> Optional[tuple]:
    """Return (Facility, floor_code, type_name, type_icon, building_name, building_code)."""
    result = await db.execute(
        select(
            Facility,
            Floor.floor_code,
            FacilityType.name,
            FacilityType.icon,
            Building.name,
            Building.code,
        )
        .join(Floor, Facility.floor_id == Floor.id)
        .join(FacilityType, Facility.facility_type_id == FacilityType.id)
        .join(Building, Facility.building_id == Building.id)
        .where(Facility.id == facility_id)
    )
    return result.first()


async def get_active_facility_by_id(
    db: AsyncSession,
    facility_id: int,
) -> Optional[Facility]:
    result = await db.execute(
        select(Facility)
        .where(Facility.id == facility_id)
        .where(Facility.is_active)
    )
    return result.scalars().first()


async def create_facility(db: AsyncSession, facility: Facility) -> Facility:
    db.add(facility)
    await db.commit()
    await db.refresh(facility)
    logger.info("Created facility id=%s name=%s", facility.id, facility.name)
    return facility


async def update_facility(
    db: AsyncSession,
    facility: Facility,
    update_data: dict,
) -> Facility:
    for key, value in update_data.items():
        setattr(facility, key, value)
    await db.commit()
    await db.refresh(facility)
    logger.info("Updated facility id=%s", facility.id)
    return facility


async def delete_facility(db: AsyncSession, facility: Facility) -> None:
    facility.is_active = False
    await db.commit()
    logger.info("Soft deleted facility id=%s", facility.id)
