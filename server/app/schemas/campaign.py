"""Campaign schemas."""
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from pydantic import BaseModel, Field


class TemplateComponent(BaseModel):
    """Template component schema."""

    type: str
    parameters: List[Dict[str, str]]


class CampaignBase(BaseModel):
    """Base campaign schema."""

    name: str
    from_number: str
    template_name: str
    template_language: str
    template_components: Optional[List[TemplateComponent]] = None
    recipient_type: str = Field(pattern="^(individual|list)$")
    recipients: Optional[List[str]] = None
    file_url: Optional[str] = None


class CampaignCreate(CampaignBase):
    """Create campaign schema."""

    pass


class CampaignUpdate(BaseModel):
    """Update campaign schema."""

    status: Optional[str] = Field(pattern="^(pending|in_progress|completed|failed)$")
    sent_count: Optional[int] = 0
    open_count: Optional[int] = 0
    response_count: Optional[int] = 0
    error_count: Optional[int] = 0
    completed_at: Optional[datetime] = None


class Campaign(CampaignBase):
    """Campaign schema."""

    id: str
    user_id: str
    status: str = Field(default="pending", pattern="^(pending|in_progress|completed|failed)$")
    sent_count: int = 0
    open_count: int = 0
    response_count: int = 0
    error_count: int = 0
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        """Pydantic config."""

        from_attributes = True 


class CampaignMetrics(BaseModel):
    sent: int
    delivered: int
    read: int
    clicked: List[Dict[str, Any]]


class TemplateContent(BaseModel):
    raw: Dict[str, Any]
    final_message: str


class MessageMetrics(BaseModel):
    sent: int
    delivered: int
    read: int
    clicked: List[Dict[str, Any]]
    status: str
    last_status_update: Optional[str]


class CampaignDetails(BaseModel):
    id: str
    name: str
    status: str
    template_name: str
    template_content: TemplateContent
    recipients: List[str]
    metrics: MessageMetrics
    created_at: str
    completed_at: Optional[str] = None
    error_count: int 