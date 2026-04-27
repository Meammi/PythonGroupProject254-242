from datetime import datetime
from uuid import UUID

from fastapi import Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.index import get_db_session
from src.db.schema.index import User
from src.repo.users.user_repo import UserRepo
from src.services.users.user_service import UserAlreadyExistsError, UserService


class CreateUserRequest(BaseModel):
    email: EmailStr
    full_name: str


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    created_at: datetime


def get_user_service(session: AsyncSession = Depends(get_db_session)) -> UserService:
    return UserService(UserRepo(session))


async def create_user(
    request: CreateUserRequest,
    user_service: UserService = Depends(get_user_service),
) -> User:
    try:
        return await user_service.create_user(email=request.email, full_name=request.full_name)
    except UserAlreadyExistsError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


async def list_users(
    user_service: UserService = Depends(get_user_service),
) -> list[User]:
    return await user_service.list_users()
