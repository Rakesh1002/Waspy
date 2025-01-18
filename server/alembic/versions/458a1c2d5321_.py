"""empty message

Revision ID: 458a1c2d5321
Revises: d2d1d364e089
Create Date: 2025-01-18 22:24:44.229554

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '458a1c2d5321'
down_revision: Union[str, None] = 'd2d1d364e089'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('campaigns', sa.Column('message_id', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('campaigns', 'message_id')
    # ### end Alembic commands ###
