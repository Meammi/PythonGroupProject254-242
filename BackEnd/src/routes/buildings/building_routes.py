from fastapi import APIRouter

from src.controllers.buildings import building_controller

router = APIRouter(tags=["buildings"])

router.add_api_route(
    "/buildings",
    building_controller.get_buildings,
    methods=["GET"],
    response_model=building_controller.BuildingsResponse,
)
router.add_api_route(
    "/buildings/{building_id}",
    building_controller.get_building,
    methods=["GET"],
    response_model=building_controller.BuildingDetailResponse,
)
router.add_api_route(
    "/buildings/{building_id}/floors",
    building_controller.get_building_floors,
    methods=["GET"],
    response_model=building_controller.FloorsResponse,
)
router.add_api_route(
    "/buildings/{building_id}/facilities",
    building_controller.get_building_facilities,
    methods=["GET"],
    response_model=building_controller.FacilitiesResponse,
)
