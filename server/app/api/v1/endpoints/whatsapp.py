import json
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from loguru import logger
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_whatsapp_service
from app.core.config import settings
from app.schemas.whatsapp import WhatsAppMessageRequest
from app.services.whatsapp_bot import WhatsAppBot
from app.services.whatsapp_service import WhatsAppService
from app.utils.error_handler import handle_whatsapp_error
from app.utils.whatsapp_utils import is_valid_whatsapp_message

router = APIRouter()
whatsapp_bot = WhatsAppBot()


@router.get("/webhook")
async def verify_webhook(
    mode: str = Query(..., alias="hub.mode"),
    token: str = Query(..., alias="hub.verify_token"),
    challenge: str = Query(..., alias="hub.challenge"),
) -> Response:
    """Verify webhook endpoint for WhatsApp API"""
    logger.debug(
        "Webhook verification request - Mode: %s, Token: %s, Challenge: %s",
        mode, token, challenge
    )

    try:
        if mode == "subscribe" and token == settings.VERIFY_TOKEN:
            logger.info("Webhook verified successfully with challenge: %s", challenge)
            return Response(content=challenge, media_type="text/plain")

        logger.error("Webhook verification failed - Invalid mode or token")
        logger.debug("Expected token: %s, Received token: %s", settings.VERIFY_TOKEN, token)
        raise HTTPException(
            status_code=403, detail="Verification failed: Invalid mode or token"
        )
    except Exception as e:
        logger.error("Webhook verification error: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def webhook(request: Request, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Handle incoming WhatsApp messages"""
    try:
        body = await request.json()
        logger.debug(f"Received webhook:\n{json.dumps(body, indent=2)}")

        # Handle status updates
        if "statuses" in str(body):
            logger.info("Status update received")
            return {
                "success": True,
                "message": "Status update received"
            }

        # Handle messages
        if is_valid_whatsapp_message(body):
            # Let the WhatsApp bot handle the message with database session
            result = await whatsapp_bot.handle_message(body, db)
            return {
                "success": True,
                "data": result
            }

        return {
            "success": True,
            "message": "Webhook received"
        }

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error processing webhook: {error_msg}")
        raise WhatsAppError(
            message=error_msg,
            status_code=500
        )


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"}


@router.post("/send")
async def send_message(
    request: WhatsAppMessageRequest,
    whatsapp_service: WhatsAppService = Depends(get_whatsapp_service),
) -> Dict[str, Any]:
    """Send a WhatsApp message."""
    try:
        request_dict = request.dict()
        logger.debug(f"Send message request:\n{json.dumps(request_dict, indent=2)}")

        if not request.use_template and not request.message:
            raise WhatsAppError(
                message="Message is required when not using template",
                status_code=400
            )

        if request.use_template:
            response = await whatsapp_service.send_template_message(
                phone_number=request.phone_number,
                template_name=request.template_name,
                template_data=request.template.dict() if request.template else None
            )
        else:
            response = await whatsapp_service.send_text_message(
                phone_number=request.phone_number,
                message=request.message
            )

        logger.debug(f"WhatsApp API response:\n{json.dumps(response, indent=2)}")
        return {
            "success": True,
            "data": response
        }

    except Exception as e:
        handle_whatsapp_error(e)


@router.get("/templates")
async def get_templates() -> Dict[str, Any]:
    """Get available WhatsApp templates"""
    try:
        templates = await whatsapp_bot.get_templates()
        return {"templates": templates}
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error getting templates: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)
