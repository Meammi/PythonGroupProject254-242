from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.schema.index import Temperature

async def get_all_temperatures(db: AsyncSession):
    result = await db.execute(select(Temperature))
    temperatures = result.scalars().all()
    return temperatures

async def get_temperature_by_facility(db: AsyncSession, facility_id: int):
    result = await db.execute(select(Temperature).where(Temperature.facility_id == facility_id))
    temperature = result.scalar_one_or_none()
    return temperature
