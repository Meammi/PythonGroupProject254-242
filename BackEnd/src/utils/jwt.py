from datetime import datetime, timedelta, timezone

from src.config import settings


def create_access_token(subject: str, expires_minutes: int = 60) -> str:
    # Placeholder until auth is implemented.
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    return f"{subject}.{expires_at.timestamp()}.{settings.jwt_algorithm}"
