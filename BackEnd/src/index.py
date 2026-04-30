from contextlib import asynccontextmanager
from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import datetime
from src.config import settings
from src.middlewares.cors import setup_cors
from src.routes.index import api_router
from src.db.index import AsyncSessionLocal
from src.utils.weather import sync_all_weather_data

async def run_weather_sync():
    async with AsyncSessionLocal() as session:
        await sync_all_weather_data(session)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    bangkok_tz = datetime.timezone(datetime.timedelta(hours=7))
    scheduler = AsyncIOScheduler(timezone=bangkok_tz)
    # Run immediately, then every 1 hour
    scheduler.add_job(
        run_weather_sync, 
        'interval', 
        hours=1, 
        next_run_time=datetime.datetime.now(bangkok_tz),
        misfire_grace_time=60
    )
    scheduler.start()
    yield
    # Shutdown
    scheduler.shutdown()



def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)
    setup_cors(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()

