"""add preparando to estadopedido enum

Revision ID: d4e5f6a7b8c9
Revises: b1c2d3e4f5a6
Create Date: 2026-05-25

"""
from alembic import op

revision = 'd4e5f6a7b8c9'
down_revision = 'b1c2d3e4f5a6'
branch_labels = None
depends_on = None


def upgrade():
    # PostgreSQL 12+ supports ADD VALUE inside a transaction.
    # BEFORE 'enviado' places the new value in the correct logical order.
    op.execute("ALTER TYPE estadopedido ADD VALUE IF NOT EXISTS 'preparando' BEFORE 'enviado'")


def downgrade():
    # PostgreSQL does not support removing enum values; downgrade is a no-op.
    pass
