"""Dependencies for API endpoints."""
from typing import Generator, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.db.session import SessionLocal
from app.services.whatsapp_service import WhatsAppService

security = HTTPBearer()

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

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user."""
    try:
        # For now, we'll use a simple user object since we don't have full auth
        # In a real app, you would verify the token and get the actual user
        return {
            "id": "default-user-id",
            "email": "user@example.com",
            "is_active": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
