from typing import Any, Dict, List

from pydantic import BaseModel


class WebhookRequest(BaseModel):
    object: str
    entry: List[Dict[str, Any]]


class Message(BaseModel):
    role: str
    content: str


class WebhookResponse(BaseModel):
    status: str
    message: str
