from fastapi import APIRouter

from api.v1.templates.requests import TEMPLATE_REQUESTS_ROUTER


API_V1_TEMPLATES_ROUTER = APIRouter(prefix="/api/v1")

API_V1_TEMPLATES_ROUTER.include_router(TEMPLATE_REQUESTS_ROUTER)
