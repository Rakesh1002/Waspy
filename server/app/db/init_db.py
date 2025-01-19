"""Script to initialize database with mock data."""
import logging
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.order import KnowledgeBase, Order

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample order data
ORDERS = [
    {
        "order_id": "ORD123456",
        "customer_phone": "+918102998806",
        "status": "processing",
        "delivery_date": datetime.utcnow() + timedelta(days=3),
    },
    {
        "order_id": "ORD789012",
        "customer_phone": "+918102998806",
        "status": "shipped",
        "delivery_date": datetime.utcnow() + timedelta(days=1),
    },
    {
        "order_id": "ORD345678",
        "customer_phone": "+918102998806",
        "status": "delivered",
        "delivery_date": datetime.utcnow() - timedelta(days=1),
    },
    {
        "order_id": "ORD901234",
        "customer_phone": "+918102998806",
        "status": "pending",
        "delivery_date": datetime.utcnow() + timedelta(days=5),
    },
    {
        "order_id": "ORD567890",
        "customer_phone": "+918102998806",
        "status": "cancelled",
        "delivery_date": None,
    },
    {
        "order_id": "ORD111222",
        "customer_phone": "+919019545645",
        "status": "delivered",
        "delivery_date": datetime.utcnow() - timedelta(days=5),
    },
    {
        "order_id": "ORD333444",
        "customer_phone": "+919019545645",
        "status": "processing",
        "delivery_date": datetime.utcnow() + timedelta(days=2),
    },
    {
        "order_id": "ORD555666",
        "customer_phone": "+919019545645",
        "status": "shipped",
        "delivery_date": datetime.utcnow() + timedelta(days=1),
    },
    {
        "order_id": "ORD777888",
        "customer_phone": "+919019545645",
        "status": "cancelled",
        "delivery_date": None,
    },
    {
        "order_id": "ORD999000",
        "customer_phone": "+919019545645",
        "status": "pending",
        "delivery_date": datetime.utcnow() + timedelta(days=4),
    },
    # Orders for 7044151056
    {
        "order_id": "ORD101112",
        "customer_phone": "+917044151056",
        "status": "processing",
        "delivery_date": datetime.utcnow() + timedelta(days=2),
    },
    {
        "order_id": "ORD131415",
        "customer_phone": "+917044151056",
        "status": "delivered",
        "delivery_date": datetime.utcnow() - timedelta(days=3),
    },
    {
        "order_id": "ORD161718",
        "customer_phone": "+917044151056",
        "status": "pending",
        "delivery_date": datetime.utcnow() + timedelta(days=5),
    },
    # Orders for 7042105230
    {
        "order_id": "ORD192021",
        "customer_phone": "+917042105230",
        "status": "shipped",
        "delivery_date": datetime.utcnow() + timedelta(days=1),
    },
    {
        "order_id": "ORD222324",
        "customer_phone": "+917042105230",
        "status": "processing",
        "delivery_date": datetime.utcnow() + timedelta(days=4),
    },
    {
        "order_id": "ORD252627",
        "customer_phone": "+917042105230",
        "status": "cancelled",
        "delivery_date": None,
    },
    # Additional orders for 7044151056
    {
        "order_id": "ORD282930",
        "customer_phone": "+917044151056",
        "status": "shipped",
        "delivery_date": datetime.utcnow() + timedelta(hours=12),
    },
    {
        "order_id": "ORD313233",
        "customer_phone": "+917044151056",
        "status": "delivered",
        "delivery_date": datetime.utcnow() - timedelta(days=10),
    },
    {
        "order_id": "ORD343536",
        "customer_phone": "+917044151056",
        "status": "cancelled",
        "delivery_date": None,
    },
    # Additional orders for 7042105230
    {
        "order_id": "ORD373839",
        "customer_phone": "+917042105230",
        "status": "delivered",
        "delivery_date": datetime.utcnow() - timedelta(days=7),
    },
    {
        "order_id": "ORD404142",
        "customer_phone": "+917042105230",
        "status": "pending",
        "delivery_date": datetime.utcnow() + timedelta(days=6),
    },
    {
        "order_id": "ORD434445",
        "customer_phone": "+917042105230",
        "status": "shipped",
        "delivery_date": datetime.utcnow() + timedelta(hours=36),
    },
    # Additional orders for 8102998806
    {
        "order_id": "ORD464748",
        "customer_phone": "+918102998806",
        "status": "processing",
        "delivery_date": datetime.utcnow() + timedelta(days=4),
    },
    {
        "order_id": "ORD495051",
        "customer_phone": "+918102998806",
        "status": "shipped",
        "delivery_date": datetime.utcnow() + timedelta(hours=18),
    },
    # Additional orders for 9019545645
    {
        "order_id": "ORD525354",
        "customer_phone": "+919019545645",
        "status": "processing",
        "delivery_date": datetime.utcnow() + timedelta(days=3),
    },
    {
        "order_id": "ORD555657",
        "customer_phone": "+919019545645",
        "status": "delivered",
        "delivery_date": datetime.utcnow() - timedelta(days=15),
    },
]

# Sample knowledge base data
KNOWLEDGE_BASE = [
    {
        "content": "Orders typically take 3-5 business days for delivery within the city limits. For international orders, delivery time may extend up to 14 business days.",
        "source": "delivery_faq",
        "meta_info": {"category": "shipping", "priority": "high"},
    },
    {
        "content": "For order cancellations, please contact us within 24 hours of placing the order. After 24 hours, cancellation might not be possible if the order is already processed.",
        "source": "cancellation_policy",
        "meta_info": {"category": "policy", "priority": "high"},
    },
    {
        "content": "We offer free shipping on all orders above $50. Standard shipping charges of $5 apply for orders below $50. Express shipping is available at additional cost.",
        "source": "shipping_policy",
        "meta_info": {"category": "shipping", "priority": "medium"},
    },
    {
        "content": "Returns must be initiated within 30 days of delivery. Items must be unused and in original packaging. Return shipping costs will be covered for defective items.",
        "source": "return_policy",
        "meta_info": {"category": "returns", "priority": "high"},
    },
    {
        "content": "Track your order status by sending your order ID starting with 'ORD'. You can also check delivery updates and estimated arrival time using your order ID.",
        "source": "tracking_info",
        "meta_info": {"category": "tracking", "priority": "high"},
    },
    {
        "content": "Our customer service team is available 24/7 to assist you with any queries. For urgent assistance, please provide your order ID for faster resolution.",
        "source": "support_info",
        "meta_info": {"category": "support", "priority": "high"},
    },
    {
        "content": "We process orders Monday through Friday, excluding holidays. Orders placed after 2 PM will be processed the next business day.",
        "source": "processing_info",
        "meta_info": {"category": "processing", "priority": "medium"},
    },
]


def init_db(db: Session) -> None:
    """Initialize database with sample data."""
    # Clear existing data
    db.query(Order).delete()
    db.query(KnowledgeBase).delete()

    # Create orders
    for order_data in ORDERS:
        order = Order(**order_data)
        db.add(order)

    # Create knowledge base entries
    for kb_data in KNOWLEDGE_BASE:
        kb = KnowledgeBase(**kb_data)
        db.add(kb)

    db.commit()
    logger.info("Sample data has been initialized")


def main() -> None:
    """Main function to initialize database."""
    logger.info("Creating initial data")
    db = SessionLocal()
    init_db(db)
    db.close()


if __name__ == "__main__":
    main()
