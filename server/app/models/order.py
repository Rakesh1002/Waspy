"""Database models for orders and knowledge base."""
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Float, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY

from app.db.base_class import Base


class Order(Base):
    """Order model."""

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True)
    customer_phone = Column(String, index=True)
    status = Column(String)
    delivery_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class KnowledgeBase(Base):
    """Knowledge base model with vector search support."""

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    embedding = Column(ARRAY(Float), nullable=True)
    source = Column(String, nullable=False)
    meta_info = Column(JSON, nullable=True)  # Changed from metadata to meta_info
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
