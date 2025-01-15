"""Import all models here for Alembic to detect them."""
from app.db.base_class import Base  # noqa
from app.models.order import Order, KnowledgeBase  # noqa
