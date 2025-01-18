from typing import Dict, Optional, Literal, List, Any

from pydantic import BaseModel


class WhatsAppTemplate(BaseModel):
    name: str
    language: Dict[str, str]
    components: Optional[list] = None

class WhatsAppMessageRequest(BaseModel):
    phone_number: str
    message: Optional[str] = None
    use_template: bool = False
    template_name: Optional[str] = None
    template: Optional[dict] = None
    campaign_name: Optional[str] = None
    from_number: str
    recipients: Optional[List[str]] = None

class PhoneNumber(BaseModel):
    id: str
    verified_name: str
    display_phone_number: str
    quality_rating: str
    code_verification_status: Optional[str]
    whatsapp_registered: bool = False

class VerificationRequest(BaseModel):
    phone_number: str
    cc: str  # country code
    method: Literal["sms", "voice"]

class VerificationCode(BaseModel):
    phone_number: str
    cc: str
    code: str

class WhatsAppWebhookChange(BaseModel):
    field: str
    value: Dict[str, Any]

class WhatsAppWebhookEntry(BaseModel):
    id: str
    time: int
    changes: List[WhatsAppWebhookChange]

class WhatsAppWebhookPayload(BaseModel):
    object: str
    entry: List[WhatsAppWebhookEntry]

class WhatsAppVerification(BaseModel):
    mode: str
    token: str
    challenge: str
