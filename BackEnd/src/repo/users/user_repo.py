from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.schema.index import User


class UserRepo:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, *, email: str, full_name: str) -> User:
        user = User(email=email, full_name=full_name)
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def get_by_email(self, email: str) -> User | None:
        result = await self._session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def list(self) -> list[User]:
        result = await self._session.execute(select(User).order_by(User.created_at.desc()))
        return list(result.scalars().all())
