from fastapi import FastAPI

from src.config import settings
from src.routes.index import api_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, debug=settings.debug)
    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
