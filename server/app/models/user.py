from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class User(Base):
    """User model."""
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Relationships
    campaigns = relationship("Campaign", back_populates="user") 