"""Campaign schemas."""
from datetime import datetime
from typing import Dict, List, Optional, Union
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