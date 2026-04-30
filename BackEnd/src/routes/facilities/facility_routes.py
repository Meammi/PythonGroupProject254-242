from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.controllers.facilities import facility_controller
from src.db.index import get_db_session
from src.schemas.facility import (
    CreateFacilityRequest,
    FacilityDetailResponse,
    UpdateFacilityRequest,
)

router = APIRouter(prefix="/facilities", tags=["facilities"])


@router.get("/{id}", response_model=FacilityDetailResponse)
async def get_facility(id: int, db: AsyncSession = Depends(get_db_session)):
    return await facility_controller.get_facility_by_id(id, db)


@router.post("")
async def create_facility(body: CreateFacilityRequest, db: AsyncSession = Depends(get_db_session)):
    return await facility_controller.create_facility(body, db)


@router.put("/{id}")
async def update_facility(
    id: int,
    body: UpdateFacilityRequest,
    db: AsyncSession = Depends(get_db_session),
):
    return await facility_controller.update_facility(id, body, db)


@router.delete("/{id}")
async def delete_facility(id: int, db: AsyncSession = Depends(get_db_session)):
    return await facility_controller.delete_facility(id, db)
