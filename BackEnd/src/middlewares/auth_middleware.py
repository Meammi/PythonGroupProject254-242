from __future__ import annotations

from fastapi import Header, HTTPException, status


async def require_auth(authorization: str | None = Header(default=None)) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header.",
        )

    return authorization
