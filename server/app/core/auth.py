from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

class User:
    def __init__(self, business_id: str):
        self.business_id = business_id

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Get the current authenticated user
    For now, we'll use a simple implementation that returns a user with the business ID from settings
    """
    logger.info("=== Authentication Process Started ===")
    
    # Log token presence
    if token:
        masked_token = f"{token[:6]}...{token[-4:]}" if len(token) > 10 else "***"
        logger.info(f"Received token (masked): {masked_token}")
    else:
        logger.info("No token provided, using default business ID")
    
    try:
        # In a real implementation, you would validate the token and get the user info
        # For now, we'll just return a user with the business ID from settings
        business_id = settings.BUSINESS_ID
        logger.info(f"Using business ID from settings: {business_id}")
        
        if not business_id:
            logger.error("No business ID configured in settings")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Business ID not configured",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = User(business_id=business_id)
        logger.info("=== Authentication Successful ===")
        logger.info(f"Authenticated user with business ID: {user.business_id}")
        return user
        
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        ) 