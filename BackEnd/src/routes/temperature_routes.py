from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.index import get_db_session
from src.controllers import temperature_controller
from src.schemas.temperature import TemperatureResponse

router = APIRouter(prefix="/temperatures", tags=["Temperatures"])

@router.get("/", response_model=list[TemperatureResponse])
async def read_temperatures(db: AsyncSession = Depends(get_db_session)):
    return await temperature_controller.get_all_temperatures(db)

@router.get("/building/{building_id}", response_model=TemperatureResponse)
async def read_temperature_by_building(
    building_id: int,
    db: AsyncSession = Depends(get_db_session),
):
    temp = await temperature_controller.get_temperature_by_building(db, building_id)
    if not temp:
        raise HTTPException(status_code=404, detail="Temperature not found for this building")
    return temp
