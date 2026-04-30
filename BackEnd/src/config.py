from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _parse_origins(raw: str) -> list[str]:
    """Parse a comma-separated string of origins into a clean list.

    Returns ["*"] (wildcard) when the input is empty or only whitespace,
    which is safe for this public-facing campus-map API.
    """
    origins = [o.strip() for o in raw.split(",") if o.strip()]
    return origins if origins else ["*"]


class Settings(BaseSettings):
    app_name: str = "Clean FastAPI Backend"
    app_env: str = "local"
    debug: bool = Field(default=False, validation_alias="APP_DEBUG")
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/clean_fastapi"
    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"

    # CORS — comma-separated origins, e.g. "http://localhost:5173,https://tulong.app"
    allowed_origins: str = ""

    @property
    def cors_origins(self) -> list[str]:
        """Parsed list of allowed CORS origins (falls back to wildcard)."""
        return _parse_origins(self.allowed_origins)

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
