import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Facility
from src.repo.facilities import facility_repo
from src.schemas.facility import CreateFacilityRequest, UpdateFacilityRequest

logger = logging.getLogger(__name__)


async def get_facility_detail_by_id(
    db: AsyncSession,
    facility_id: int,
) -> Optional[tuple]:
    return await facility_repo.get_facility_detail_by_id(db, facility_id)


async def get_active_facility_by_id(
    db: AsyncSession,
    facility_id: int,
) -> Optional[Facility]:
    return await facility_repo.get_active_facility_by_id(db, facility_id)


async def create_facility(
    db: AsyncSession,
    data: CreateFacilityRequest,
) -> Facility:
    new_facility = Facility(
        name=data.name,
        building_id=data.building_id,
        floor_id=data.floor_id,
        facility_type_id=data.type_id,
        latitude=data.lat,
        longitude=data.lng,
    )
    return await facility_repo.create_facility(db, new_facility)


async def update_facility(
    db: AsyncSession,
    facility: Facility,
    data: UpdateFacilityRequest,
) -> Facility:
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        logger.warning("update_facility called with no fields to update, id=%s", facility.id)
        return facility
    return await facility_repo.update_facility(db, facility, update_data)


async def delete_facility(db: AsyncSession, facility: Facility) -> None:
    await facility_repo.delete_facility(db, facility)
