from fastapi import APIRouter, status

from src.controllers.users import user_controller

router = APIRouter(prefix="/users", tags=["users"])

router.add_api_route(
    "",
    user_controller.create_user,
    methods=["POST"],
    response_model=user_controller.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
router.add_api_route(
    "",
    user_controller.list_users,
    methods=["GET"],
    response_model=list[user_controller.UserResponse],
)
