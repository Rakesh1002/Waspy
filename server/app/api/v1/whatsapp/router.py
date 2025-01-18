from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from loguru import logger
import json
import uuid
from datetime import datetime, timedelta

from app.core.whatsapp import WhatsAppClient
from app.api.deps import get_db, get_whatsapp_service, get_current_user
from app.core.config import settings
from app.schemas.whatsapp import (
    PhoneNumber, 
    VerificationRequest, 
    VerificationCode,
    WhatsAppMessageRequest
)
from app.services.whatsapp_bot import WhatsAppBot
from app.services.whatsapp_service import WhatsAppService
from app.services.campaign_service import CampaignService
from app.utils.error_handler import WhatsAppError, handle_whatsapp_error
from app.utils.whatsapp_utils import (
    is_valid_whatsapp_message,
    extract_whatsapp_message_data
)
from app.schemas.campaign import CampaignCreate, TemplateComponent
from app.models.user import User
from app.models.campaign import Campaign

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])
whatsapp_bot = WhatsAppBot()

class RegisterPhoneRequest(BaseModel):
    phone_number_id: str
    pin: str

class WebhookQueryParams(BaseModel):
    hub_mode: str
    hub_verify_token: str
    hub_challenge: str

@router.post("/register-phone")
async def register_phone(request: RegisterPhoneRequest):
    """Register a phone number with WhatsApp Cloud API."""
    logger.debug(f"=== Starting phone registration process ===")
    logger.debug(f"Request data: phone_number_id={request.phone_number_id}, pin=******")
    
    try:
        logger.debug("Initializing WhatsApp client...")
        client = WhatsAppClient()
        logger.debug("WhatsApp client initialized successfully")
        
        logger.debug("Attempting to register phone number...")
        result = await client.register_phone_number(
            phone_number_id=request.phone_number_id,
            pin=request.pin
        )
        logger.debug(f"Registration result: {result}")
        
        response_data = {
            "success": True,
            "message": "Phone number registered successfully",
            "data": result
        }
        logger.debug(f"Sending success response: {response_data}")
        return response_data
        
    except Exception as e:
        error_msg = f"Phone number registration failed: {str(e)}"
        error_type = type(e).__name__
        logger.error(f"Error Type: {error_type}")
        logger.error(error_msg)
        logger.error(f"Error details: {str(e)}")
        logger.error(f"Full exception info:", exc_info=True)
        raise HTTPException(status_code=400, detail=error_msg)

@router.get("/verify-registration/{phone_number_id}")
async def verify_phone_registration(phone_number_id: str):
    """Check if a phone number is registered with WhatsApp Cloud API."""
    try:
        client = WhatsAppClient()
        is_registered = await client.verify_registration(phone_number_id)
        return {
            "success": True,
            "is_registered": is_registered
        }
    except Exception as e:
        logger.error(f"Registration verification failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Phone Numbers Management
@router.get("/phone-numbers", response_model=List[PhoneNumber])
async def get_phone_numbers(
    sort_ascending: bool = Query(False, description="Sort by last_onboarded_time in ascending order"),
    account_mode: Optional[str] = Query(None, description="Filter by account mode (SANDBOX or LIVE)")
):
    """Get all WhatsApp phone numbers associated with the business account"""
    try:
        client = WhatsAppClient()
        business_id = client.business_id
        logger.info(f"Fetching phone numbers for business ID: {business_id}")
        
        numbers = await client.get_phone_numbers(
            business_id=business_id,
            sort_ascending=sort_ascending,
            account_mode=account_mode
        )
        
        logger.info(f"Retrieved {len(numbers)} phone numbers")
        return numbers
        
    except Exception as e:
        logger.error(f"Error fetching phone numbers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/phone-numbers/{phone_number_id}")
async def get_phone_number(
    phone_number_id: str,
    include_name_status: bool = Query(False, description="Include name status information")
):
    """Get information about a specific phone number"""
    try:
        client = WhatsAppClient()
        logger.info(f"Fetching phone number details for ID: {phone_number_id}")
        return await client.get_single_phone_number(
            phone_number_id=phone_number_id,
            include_name_status=include_name_status
        )
    except Exception as e:
        logger.error(f"Error fetching phone number details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Account Management
@router.post("/account")
async def register_account(request: VerificationRequest):
    """Register a WhatsApp account with the provided details."""
    try:
        client = WhatsAppClient()
        logger.info(f"Attempting to register account for +{request.cc}{request.phone_number}")
        
        result = await client.register_account(
            cc=request.cc,
            phone_number=request.phone_number,
            method=request.method,
            cert=request.cert,
            pin=None  # Optional PIN for two-step verification
        )
        
        return {
            "success": True,
            "message": "Account registration initiated successfully",
            "data": result
        }
        
    except Exception as e:
        logger.error(f"Account registration failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/request-code")
async def request_verification_code(request: VerificationRequest):
    """Request a verification code for a phone number"""
    try:
        client = WhatsAppClient()
        result = await client.request_code(
            business_id=client.business_id,
            phone_number=request.phone_number,
            cc=request.cc,
            method=request.method
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-code")
async def verify_code(verification: VerificationCode):
    """Verify a phone number using the received code"""
    try:
        client = WhatsAppClient()
        result = await client.verify_code(
            business_id=client.business_id,
            phone_number=verification.phone_number,
            cc=verification.cc,
            code=verification.code
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Messaging and Webhooks
@router.get("/webhook")
async def verify_webhook(
    mode: Optional[str] = Query(None, alias="hub.mode"),
    token: Optional[str] = Query(None, alias="hub.verify_token"),
    challenge: Optional[str] = Query(None, alias="hub.challenge")
) -> Response:
    """Verify webhook endpoint for WhatsApp API"""
    try:
        logger.info(f"=== Webhook Verification Request ===")
        logger.info(f"Mode: {mode}")
        logger.info(f"Token: {token}")
        logger.info(f"Challenge: {challenge}")
        logger.info(f"Expected Token: {settings.VERIFY_TOKEN}")

        # Check if this is a verification request
        if mode == "subscribe" and token == settings.VERIFY_TOKEN:
            if challenge:
                logger.info("✅ WEBHOOK_VERIFIED")
                return Response(content=challenge, media_type="text/plain")
            
        logger.error("❌ VERIFICATION_FAILED")
        logger.error(f"Token mismatch or invalid mode")
        return Response(
            content="Error validating verification",
            status_code=403
        )

    except Exception as e:
        logger.error(f"❌ Webhook verification error: {str(e)}", exc_info=True)
        return Response(
            content=str(e),
            status_code=500
        )

@router.post("/webhook")
async def webhook(request: Request, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Handle incoming WhatsApp messages"""
    try:
        body = await request.json()
        logger.info("=== Incoming Webhook Event ===")
        logger.info(f"Headers: {dict(request.headers)}")
        logger.info(f"Raw Body: {json.dumps(body, indent=2)}")

        # Check if this is a status update
        if "statuses" in str(body):
            logger.info("Received status update - skipping")
            return {"success": True, "message": "Status update received"}

        # Handle incoming messages
        if "entry" in body and len(body["entry"]) > 0:
            entry = body["entry"][0]
            
            if "changes" in entry and len(entry["changes"]) > 0:
                change = entry["changes"][0]
                
                if "value" in change:
                    value = change["value"]
                    
                    if "messages" in value and len(value["messages"]) > 0:
                        logger.info("Valid message payload detected")
                        
                        try:
                            # Extract message data
                            message_data = extract_whatsapp_message_data(body)
                            logger.info(f"Extracted message data: {json.dumps(message_data, indent=2)}")

                            # Process message with WhatsApp bot
                            result = await whatsapp_bot.handle_message(body, db)
                            logger.info(f"Message processed successfully: {json.dumps(result)}")
                            
                            return {
                                "success": True,
                                "message": "Message processed successfully",
                                "data": result
                            }
                        except Exception as e:
                            logger.error(f"Error processing message: {str(e)}", exc_info=True)
                            return {
                                "success": False,
                                "message": f"Error processing message: {str(e)}"
                            }

        logger.warning("Received webhook with unknown format")
        logger.warning(f"Body structure: {json.dumps(body, indent=2)}")
        return {"success": True, "message": "Webhook received but no action taken"}

    except Exception as e:
        logger.error(f"Error in webhook: {str(e)}", exc_info=True)
        logger.error("Full webhook payload:", exc_info=True)
        logger.error(json.dumps(body, indent=2))
        raise HTTPException(status_code=500, detail=str(e))

async def update_message_metrics(message_id: str, status: str, db: Session):
    """Update message metrics based on status updates"""
    try:
        # Find campaign message
        campaign_message = db.query(Campaign).filter(
            Campaign.message_id == message_id
        ).first()
        
        if campaign_message:
            if status == "sent":
                campaign_message.sent_count += 1
            elif status == "delivered":
                campaign_message.delivered_count += 1
            elif status == "read":
                campaign_message.open_count += 1
            
            db.commit()
            logger.info(f"Updated metrics for message {message_id}: {status}")
    except Exception as e:
        logger.error(f"Error updating message metrics: {str(e)}")

async def track_message_receipt(message_data: dict, db: Session):
    """Track received message metrics"""
    try:
        # Find associated campaign if this is a response
        campaign = db.query(Campaign).filter(
            Campaign.phone_number == message_data["from"]
        ).order_by(Campaign.created_at.desc()).first()
        
        if campaign:
            campaign.response_count += 1
            db.commit()
            logger.info(f"Updated response count for campaign {campaign.id}")
    except Exception as e:
        logger.error(f"Error tracking message receipt: {str(e)}")

@router.post("/send")
async def send_message(
    request: WhatsAppMessageRequest,
    whatsapp_service: WhatsAppService = Depends(get_whatsapp_service),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Send a WhatsApp message and create a campaign."""
    try:
        logger.debug(f"Send message request:\n{json.dumps(request.dict(), indent=2)}")

        # Ensure user exists in database
        user = db.query(User).filter(User.id == current_user["id"]).first()
        if not user:
            # Create user if doesn't exist
            user = User(
                id=current_user["id"],
                email=current_user["email"],
                is_active=current_user["is_active"]
            )
            db.add(user)
            db.commit()
            logger.debug(f"Created new user: {user.id}")

        if not request.use_template and not request.message:
            raise WhatsAppError(message="Message is required when not using template", status_code=400)

        # Create campaign if using template
        if request.use_template and request.template:
            campaign_service = CampaignService(db, whatsapp_service)
            
            # Convert template components to campaign format with correct types
            template_components = []
            if request.template.get("components"):
                for comp in request.template["components"]:
                    comp_type = comp.get("type", "").upper()
                    # Only include valid component types
                    if comp_type in ["HEADER", "BODY", "BUTTON", "CAROUSEL", "LIMITED_TIME_OFFER", "ORDER_STATUS"]:
                        template_components.append(
                            TemplateComponent(
                                type=comp_type,
                                parameters=comp.get("parameters", [])
                            )
                        )

            # Create campaign with proper user ID
            campaign_in = CampaignCreate(
                name=request.campaign_name or f"Campaign {request.template_name}",
                from_number=request.from_number,
                template_name=request.template_name,
                template_language=request.template.get("language", {}).get("code", "en"),
                template_components=template_components,
                recipient_type="individual",
                recipients=request.recipients or [request.phone_number]
            )
            
            campaign = campaign_service.create_campaign(current_user["id"], campaign_in)
            logger.debug(f"Created campaign: {campaign.id}")

            try:
                # Get all recipients from the request
                recipients = request.recipients or [request.phone_number]
                
                # Send to each recipient
                success_count = 0
                error_count = 0
                errors = []

                for recipient in recipients:
                    try:
                        await whatsapp_service.send_template_message(
                            phone_number=recipient,
                            template_name=request.template_name,
                            template_data=request.template
                        )
                        success_count += 1
                    except Exception as e:
                        error_count += 1
                        errors.append(f"Error sending to {recipient}: {str(e)}")
                        logger.error(f"Error sending to {recipient}: {str(e)}")

                # Update campaign stats
                campaign.sent_count = success_count
                campaign.error_count = error_count
                campaign.status = "completed" if error_count == 0 else "partial"
                db.commit()

                return {
                    "success": True,
                    "data": {
                        "campaign_id": campaign.id,
                        "status": campaign.status,
                        "sent_count": success_count,
                        "error_count": error_count,
                        "errors": errors if errors else None
                    }
                }

            except Exception as send_error:
                logger.error(f"Error processing campaign: {str(send_error)}")
                campaign.status = "failed"
                db.commit()
                return {
                    "success": False,
                    "error": str(send_error),
                    "data": {
                        "campaign_id": campaign.id,
                        "status": "failed",
                        "sent_count": 0,
                        "error_count": len(recipients)
                    }
                }

        # Send regular message without campaign
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
        return {"success": True, "data": response}

    except Exception as e:
        logger.error(f"Error in send_message: {str(e)}")
        return handle_whatsapp_error(e)

@router.get("/templates")
async def get_templates() -> Dict[str, Any]:
    """Get available WhatsApp templates"""
    try:
        templates = await whatsapp_bot.get_templates()
        return {"templates": templates}
    except Exception as e:
        logger.error(f"Error getting templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/template-content")
async def get_template_content(
    phone_number_id: str,
    template_name: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get the content of a specific WhatsApp message template
    """
    try:
        client = WhatsAppClient()
        content = await client.get_template_content(phone_number_id, template_name)
        return {
            "success": True,
            "template": content
        }
    except HTTPException as e:
        logger.error(f"HTTP error in template content: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Error getting template content: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch template content: {str(e)}"
        ) 

@router.get("/campaigns")
async def get_campaigns(
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get all campaigns for the current user."""
    try:
        # Get campaigns from database
        campaigns = db.query(Campaign)\
            .filter(Campaign.user_id == current_user["id"])\
            .order_by(Campaign.created_at.desc())\
            .all()

        return {
            "success": True,
            "campaigns": [
                {
                    "id": campaign.id,
                    "name": campaign.name,
                    "status": campaign.status,
                    "sent_count": campaign.sent_count,
                    "open_count": campaign.open_count,
                    "response_count": campaign.response_count,
                    "error_count": campaign.error_count,
                    "created_at": campaign.created_at.isoformat()
                }
                for campaign in campaigns
            ]
        }
    except Exception as e:
        logger.error(f"Error getting campaigns: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch campaigns: {str(e)}"
        ) 

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get dashboard statistics."""
    try:
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_start = (month_start - timedelta(days=1)).replace(day=1)

        # Use COALESCE to handle NULL values
        current_stats = db.query(
            func.count(case((Campaign.status.in_(['pending', 'processing']), 1))).label('active_campaigns'),
            func.coalesce(func.sum(Campaign.sent_count), 0).label('total_messages'),
            func.coalesce(func.sum(Campaign.open_count), 0).label('open_count'),
            func.coalesce(
                (func.sum(Campaign.response_count) * 100.0 / 
                func.greatest(func.sum(Campaign.sent_count), 1)), 
                0
            ).label('response_rate')
        ).filter(
            Campaign.user_id == current_user["id"],
            Campaign.created_at >= month_start
        ).first()

        # Last month stats with same NULL handling
        last_month_stats = db.query(
            func.count(case((Campaign.status.in_(['pending', 'processing']), 1))).label('active_campaigns'),
            func.coalesce(func.sum(Campaign.sent_count), 0).label('total_messages'),
            func.coalesce(func.sum(Campaign.open_count), 0).label('open_count'),
            func.coalesce(
                (func.sum(Campaign.response_count) * 100.0 / 
                func.greatest(func.sum(Campaign.sent_count), 1)), 
                0
            ).label('response_rate')
        ).filter(
            Campaign.user_id == current_user["id"],
            Campaign.created_at >= last_month_start,
            Campaign.created_at < month_start
        ).first()

        # Calculate stats (values are already coalesced to 0)
        active_campaigns = current_stats[0]
        total_messages = current_stats[1]
        open_rate = current_stats[2] * 100.0 / max(total_messages, 1)
        response_rate = current_stats[3]

        return {
            "success": True,
            "stats": {
                "active_campaigns": active_campaigns,
                "total_messages": total_messages,
                "open_rate": round(open_rate, 1),
                "response_rate": round(response_rate, 1),
                "active_campaigns_change": calculate_change(active_campaigns, last_month_stats[0]),
                "total_messages_change": calculate_change(total_messages, last_month_stats[1]),
                "open_rate_change": calculate_change(open_rate, 
                    (last_month_stats[2] * 100.0 / max(last_month_stats[1], 1))),
                "response_rate_change": calculate_change(response_rate, last_month_stats[3])
            }
        }
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch dashboard stats: {str(e)}"
        )

def calculate_change(current: float, previous: float) -> float:
    """Calculate percentage change between two values."""
    if previous == 0:
        return 0
    return round(((current - previous) / previous) * 100, 1) 

@router.post("/webhook/test")
async def test_webhook(db: Session = Depends(get_db)):
    """Test endpoint for webhook processing"""
    test_payload = {
        "object": "whatsapp_business_account",
        "entry": [{
            "id": "123456789",
            "changes": [{
                "value": {
                    "messaging_product": "whatsapp",
                    "metadata": {
                        "display_phone_number": "16505551111",
                        "phone_number_id": "123456123"
                    },
                    "contacts": [{
                        "profile": {
                            "name": "test user name"
                        },
                        "wa_id": "16315551181"
                    }],
                    "messages": [{
                        "from": "16315551181",
                        "id": "ABGGFlA5Fpa",
                        "timestamp": "1504902988",
                        "type": "text",
                        "text": {
                            "body": "test message"
                        }
                    }]
                },
                "field": "messages"
            }]
        }]
    }

    result = await webhook(Request(scope={"type": "http"}), db)
    return result 