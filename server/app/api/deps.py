"""Dependencies for API endpoints."""
from typing import Generator

from app.db.session import SessionLocal
from app.services.whatsapp_service import WhatsAppService


def get_db() -> Generator:
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_whatsapp_service() -> WhatsAppService:
    """Get WhatsApp service instance."""
    service = WhatsAppService()
    try:
        yield service
    finally:
        await service.close()
