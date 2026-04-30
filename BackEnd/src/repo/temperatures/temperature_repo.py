from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import Temperature


async def get_all_temperatures(db: AsyncSession) -> list[Temperature]:
    result = await db.execute(select(Temperature))
    return list(result.scalars().all())


async def get_temperature_by_building(
    db: AsyncSession,
    building_id: int,
) -> Optional[Temperature]:
    result = await db.execute(
        select(Temperature).where(Temperature.building_id == building_id)
    )
    return result.scalar_one_or_none()
