import logging

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas.facility import (
    CreateFacilityRequest,
    FacilityDetailResponse,
    FacilityTypeDetail,
    UpdateFacilityRequest,
)
from src.services.facilities import facility_service

logger = logging.getLogger(__name__)


async def get_facility_by_id(
    facility_id: int,
    db: AsyncSession,
) -> FacilityDetailResponse:
    """Return a single facility with its floor, type, and parent building info."""
    row = await facility_service.get_facility_detail_by_id(db, facility_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Facility not found")

    facility, floor_code, type_name, type_icon, bldg_name, bldg_code = row

    return FacilityDetailResponse(
        id=facility.id,
        name=facility.name,
        lat=facility.latitude,
        lng=facility.longitude,
        description=facility.description,
        is_active=facility.is_active,
        floor=floor_code,
        type=FacilityTypeDetail(name=type_name, icon=type_icon),
        building_name=bldg_name,
        building_code=bldg_code,
    )


async def create_facility(body: CreateFacilityRequest, db: AsyncSession) -> dict:
    try:
        new_facility = await facility_service.create_facility(db, body)
    except facility_service.FacilityValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.error("Failed to create facility: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "id": new_facility.id,
        "message": "created",
    }


async def update_facility(
    facility_id: int,
    body: UpdateFacilityRequest,
    db: AsyncSession,
) -> dict:
    facility = await facility_service.get_active_facility_by_id(db, facility_id)
    if facility is None:
        raise HTTPException(status_code=404, detail="Facility not found")

    try:
        await facility_service.update_facility(db, facility, body)
    except Exception as exc:
        logger.error("Failed to update facility id=%s: %s", facility_id, exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"message": "updated"}


async def delete_facility(facility_id: int, db: AsyncSession) -> dict:
    facility = await facility_service.get_active_facility_by_id(db, facility_id)
    if facility is None:
        raise HTTPException(status_code=404, detail="Facility not found")

    try:
        await facility_service.delete_facility(db, facility)
    except Exception as exc:
        logger.error("Failed to delete facility id=%s: %s", facility_id, exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"message": "deleted"}
