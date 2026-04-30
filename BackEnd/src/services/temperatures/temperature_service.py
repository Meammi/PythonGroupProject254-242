from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Temperature
from src.repo.temperatures import temperature_repo


async def get_all_temperatures(db: AsyncSession) -> list[Temperature]:
    return await temperature_repo.get_all_temperatures(db)


async def get_temperature_by_facility(
    db: AsyncSession,
    facility_id: int,
) -> Optional[Temperature]:
    return await temperature_repo.get_temperature_by_facility(db, facility_id)
