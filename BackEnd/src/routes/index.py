from fastapi import APIRouter

from src.routes.buildings.building_routes import router as building_router
from src.routes.health.health_routes import router as health_router
from src.routes.temperature_routes import router as temperature_router
from src.routes.facilities.facility_routes import router as facilities_router

api_router = APIRouter()
api_router.include_router(building_router)
api_router.include_router(health_router)
api_router.include_router(temperature_router)

api_router.include_router(facilities_router)
