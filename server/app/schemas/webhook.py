from typing import Optional
from pydantic import BaseModel

class WebhookVerification(BaseModel):
    """Schema for webhook verification parameters"""
    hub_mode: str
    hub_verify_token: str
    hub_challenge: str

class WebhookMessage(BaseModel):
    """Schema for incoming webhook message"""
    object: str
    entry: list

class WebhookResponse(BaseModel):
    """Schema for webhook response"""
    success: bool
    message: str
    data: Optional[dict] = None
