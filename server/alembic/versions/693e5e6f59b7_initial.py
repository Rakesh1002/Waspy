"""initial

Revision ID: 693e5e6f59b7
Revises: 
Create Date: 2025-01-15 04:03:15.947777

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "693e5e6f59b7"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "knowledgebase",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("content", sa.String(), nullable=False),
        sa.Column("embedding", postgresql.ARRAY(sa.Float()), nullable=True),
        sa.Column("source", sa.String(), nullable=False),
        sa.Column("meta_info", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_knowledgebase_id"), "knowledgebase", ["id"], unique=False)
    op.create_table(
        "order",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("order_id", sa.String(), nullable=True),
        sa.Column("customer_phone", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("delivery_date", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_order_customer_phone"), "order", ["customer_phone"], unique=False
    )
    op.create_index(op.f("ix_order_id"), "order", ["id"], unique=False)
    op.create_index(op.f("ix_order_order_id"), "order", ["order_id"], unique=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_order_order_id"), table_name="order")
    op.drop_index(op.f("ix_order_id"), table_name="order")
    op.drop_index(op.f("ix_order_customer_phone"), table_name="order")
    op.drop_table("order")
    op.drop_index(op.f("ix_knowledgebase_id"), table_name="knowledgebase")
    op.drop_table("knowledgebase")
    # ### end Alembic commands ###
