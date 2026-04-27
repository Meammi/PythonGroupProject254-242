from src.db.schema.index import User
from src.repo.users.user_repo import UserRepo


class UserAlreadyExistsError(Exception):
    pass


class UserService:
    def __init__(self, user_repo: UserRepo) -> None:
        self._user_repo = user_repo

    async def create_user(self, *, email: str, full_name: str) -> User:
        existing_user = await self._user_repo.get_by_email(email)
        if existing_user is not None:
            raise UserAlreadyExistsError("A user with this email already exists.")

        return await self._user_repo.create(email=email, full_name=full_name)

    async def list_users(self) -> list[User]:
        return await self._user_repo.list()
