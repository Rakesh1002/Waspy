"""Database models for campaigns."""
from datetime import datetime
from typing import List, Optional

from sqlalchemy import JSON, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.user import User


class Campaign(Base):
    """Campaign model."""
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    from_number = Column(String, nullable=False)
    template_name = Column(String, nullable=False)
    template_language = Column(String, nullable=False)
    template_components = Column(JSON, nullable=True)
    template_data = Column(JSON, nullable=True)
    recipient_type = Column(String, nullable=False)
    recipients = Column(JSON, nullable=True)
    file_url = Column(String, nullable=True)
    status = Column(String, default="pending", nullable=False)
    sent_count = Column(Integer, default=0, nullable=False)
    open_count = Column(Integer, default=0, nullable=False)
    response_count = Column(Integer, default=0, nullable=False)
    error_count = Column(Integer, default=0, nullable=False)
    message_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="campaigns") 