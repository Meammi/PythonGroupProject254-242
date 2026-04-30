import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy import select, func
from src.db.schema.index import Temperature, Building, Facility

async def fetch_batch_weather(coordinates: list[dict]) -> list[float]:
    """
    Fetch temperatures for multiple coordinates in a single request.
    """
    if not coordinates:
        return []
    
    lats = [str(c["lat"]) for c in coordinates]
    lons = [str(c["lon"]) for c in coordinates]
    
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": ",".join(lats),
        "longitude": ",".join(lons),
        "current_weather": True
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Open-Meteo returns a list if multiple locations are requested
        if isinstance(data, list):
            return [item["current_weather"]["temperature"] for item in data]
        return [data["current_weather"]["temperature"]]


async def save_temperature(
    db: AsyncSession,
    building_id: int,
    floor_id: int,
    facility_id: int,
    temperature: float
) -> None:
    """
    Save single temperature data (kept for backward compatibility/individual updates).
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
    """
    result = await db.execute(select(Facility).where(Facility.id == facility_id))
    facility = result.scalar_one_or_none()
    
    lat, lon = None, None
    if facility and facility.latitude is not None and facility.longitude is not None:
        lat, lon = facility.latitude, facility.longitude
    else:
        result = await db.execute(select(Building).where(Building.id == building_id))
        building = result.scalar_one_or_none()
        if building and building.latitude is not None and building.longitude is not None:
            lat, lon = building.latitude, building.longitude
            
    if lat is None or lon is None:
        return None
        
    temperature = (await fetch_batch_weather([{"lat": lat, "lon": lon}]))[0]
    await save_temperature(db, building_id, floor_id, facility_id, temperature)
    return temperature


import asyncio
import logging

logger = logging.getLogger(__name__)

async def sync_all_weather_data(db: AsyncSession) -> None:
    """
    Fetch all facilities and update their weather data using Batch Requests and Bulk Upsert.
    """
    logger.info("Starting automated batch weather synchronization...")
    
    # 1. Pre-fetch all facilities and buildings to avoid N+1 queries
    result = await db.execute(select(Facility))
    facilities = result.scalars().all()
    
    build_res = await db.execute(select(Building))
    buildings_map = {b.id: b for b in build_res.scalars().all()}
    
    # 2. Collect coordinates for all facilities
    to_sync = []
    for f in facilities:
        lat, lon = f.latitude, f.longitude
        if lat is None or lon is None:
            # Fallback to building coordinates
            b = buildings_map.get(f.building_id)
            if b:
                lat, lon = b.latitude, b.longitude
        
        if lat is not None and lon is not None:
            to_sync.append({
                "building_id": f.building_id,
                "floor_id": f.floor_id,
                "facility_id": f.id,
                "lat": lat,
                "lon": lon
            })

    if not to_sync:
        logger.info("No facilities with valid coordinates to sync.")
        return

    try:
        # 3. Fetch all temperatures in ONE request
        logger.info(f"Fetching weather for {len(to_sync)} locations...")
        temperatures = await fetch_batch_weather(to_sync)
        
        # 4. Prepare data for Bulk UPSERT
        values_list = []
        for i, info in enumerate(to_sync):
            values_list.append({
                "building_id": info["building_id"],
                "floor_id": info["floor_id"],
                "facility_id": info["facility_id"],
                "temperature": temperatures[i]
            })
            
        # 5. Execute Bulk UPSERT
        stmt = pg_insert(Temperature).values(values_list)
        stmt = stmt.on_conflict_do_update(
            constraint="uq_temperature_location",
            set_={
                "temperature": stmt.excluded.temperature,
                "created_at": func.now()
            }
        )
        
        await db.execute(stmt)
        await db.commit()
        logger.info(f"Weather sync completed successfully for {len(to_sync)} facilities.")
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to perform batch weather sync: {e}")

