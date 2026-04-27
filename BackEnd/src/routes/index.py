from fastapi import APIRouter

from src.routes.health.health_routes import router as health_router
from src.routes.temperature_routes import router as temperature_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(temperature_router)

