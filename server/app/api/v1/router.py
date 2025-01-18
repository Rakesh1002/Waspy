from fastapi import APIRouter
from app.api.v1.whatsapp import router as whatsapp_router
from app.api.v1.endpoints.knowledge_base import router as knowledge_base_router

api_router = APIRouter()

# Include WhatsApp endpoints
api_router.include_router(whatsapp_router)

# Include Knowledge Base endpoints
api_router.include_router(knowledge_base_router, prefix="/knowledge-base", tags=["knowledge-base"])
