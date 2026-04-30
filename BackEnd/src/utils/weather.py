import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy import select, func
from src.db.schema.index import Temperature, Building, Facility

async def fetch_temperature(lat: float, lon: float) -> float:
    """
    Fetch current temperature from Open-Meteo API.
    """
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": True
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data["current_weather"]["temperature"]

async def save_temperature(
    db: AsyncSession,
    building_id: int,
    floor_id: int,
    facility_id: int,
    temperature: float
) -> None:
    """
    Save temperature data to the database using UPSERT.
    If a record for the same location exists, update the temperature.
    """
    stmt = pg_insert(Temperature).values(
        building_id=building_id,
        floor_id=floor_id,
        facility_id=facility_id,
        temperature=temperature
    )
    
    stmt = stmt.on_conflict_do_update(
        constraint="uq_temperature_location",
        set_={
            "temperature": temperature,
            "created_at": func.now()
        }
    )
    
    await db.execute(stmt)
    await db.commit()


async def update_location_weather(
    db: AsyncSession,
    building_id: int,
    floor_id: int,
    facility_id: int
) -> float | None:
    """
    Query coordinates from DB, fetch weather, and save it.
    Returns the fetched temperature, or None if coordinates not found.
    """
    # 1. Try to get coordinates from Facility
    result = await db.execute(select(Facility).where(Facility.id == facility_id))
    facility = result.scalar_one_or_none()
    
    lat, lon = None, None
    if facility and facility.latitude is not None and facility.longitude is not None:
        lat, lon = facility.latitude, facility.longitude
    else:
        # 2. Fallback to Building coordinates
        result = await db.execute(select(Building).where(Building.id == building_id))
        building = result.scalar_one_or_none()
        if building and building.latitude is not None and building.longitude is not None:
            lat, lon = building.latitude, building.longitude
            
    if lat is None or lon is None:
        return None  # Or raise an exception, depending on your error handling policy
        
    temperature = await fetch_temperature(lat, lon)
    await save_temperature(db, building_id, floor_id, facility_id, temperature)
    return temperature

import asyncio
import logging

logger = logging.getLogger(__name__)

async def sync_all_weather_data(db: AsyncSession) -> None:
    """
    Fetch all facilities and update their weather data periodically.
    """
    logger.info("Starting automated weather synchronization...")
    
    result = await db.execute(select(Facility))
    facilities = result.scalars().all()
    
    success_count = 0
    failure_count = 0
    
    for facility in facilities:
        try:
            temp = await update_location_weather(db, facility.building_id, facility.floor_id, facility.id)
            if temp is not None:
                success_count += 1
            else:
                failure_count += 1
                logger.warning(f"Could not find coordinates for Facility ID: {facility.id}")
            
            # Delay to avoid rate limits
            await asyncio.sleep(0.5)
        except Exception as e:
            failure_count += 1
            logger.error(f"Failed to update weather for Facility ID: {facility.id}. Error: {e}")
            
    logger.info(f"Weather sync completed. Success: {success_count}, Failures: {failure_count}")

