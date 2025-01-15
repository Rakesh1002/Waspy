from typing import Optional, Dict
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
    template: Optional[WhatsAppTemplate] = None 
