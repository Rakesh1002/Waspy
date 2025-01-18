from typing import Any, Dict
from fastapi import HTTPException
from loguru import logger

class WhatsAppError(HTTPException):
    def __init__(self, message: str, status_code: int = 500, details: Dict[str, Any] = None):
        self.details = details or {}
        super().__init__(status_code=status_code, detail=message)

def handle_whatsapp_error(error: Exception) -> None:
    """Centralized error handler for WhatsApp operations"""
    if isinstance(error, HTTPException):
        logger.error(f"HTTP Exception: status_code={error.status_code}, detail={error.detail}")
        raise error

    if isinstance(error, WhatsAppError):
        logger.error(f"WhatsApp Error: {error.detail}")
        raise error

    # Handle unexpected errors
    error_msg = str(error)
    logger.error(f"Unexpected error: {error_msg}")
    raise HTTPException(
        status_code=500,
        detail=f"Internal server error: {error_msg}"
    )
