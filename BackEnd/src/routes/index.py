from fastapi import APIRouter

from src.routes.health.health_routes import router as health_router
from src.routes.users.user_routes import router as users_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(users_router)
