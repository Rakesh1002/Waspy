"""API v1 package."""

from fastapi import APIRouter
from app.api.v1.whatsapp.router import router as whatsapp_router

api_router = APIRouter()
api_router.include_router(whatsapp_router)
