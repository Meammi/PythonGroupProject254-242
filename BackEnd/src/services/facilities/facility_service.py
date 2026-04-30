import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Facility
from src.repo.facilities import facility_repo
from src.schemas.facility import CreateFacilityRequest, UpdateFacilityRequest

logger = logging.getLogger(__name__)


class FacilityValidationError(ValueError):
    """Raised when facility business validation fails."""


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
    building = await facility_repo.get_building_by_id(db, data.building_id)
    if building is None:
        raise FacilityValidationError("Building not found")

    floor = await facility_repo.get_floor_by_id(db, data.floor_id)
    if floor is None:
        raise FacilityValidationError("Floor not found")

    if floor.building_id != data.building_id:
        raise FacilityValidationError("Floor does not belong to building")

    facility_type = await facility_repo.get_facility_type_by_id(db, data.type_id)
    if facility_type is None:
        raise FacilityValidationError("Facility type not found")

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
