from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Temperature
from src.services.temperatures import temperature_service


async def get_all_temperatures(db: AsyncSession) -> list[Temperature]:
    return await temperature_service.get_all_temperatures(db)


async def get_temperature_by_building(
    db: AsyncSession,
    building_id: int,
) -> Temperature | None:
    return await temperature_service.get_temperature_by_building(db, building_id)
