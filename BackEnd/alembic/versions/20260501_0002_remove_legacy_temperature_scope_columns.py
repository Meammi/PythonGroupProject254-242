"""remove legacy temperature scope columns

Revision ID: 20260501_0002
Revises: 20260501_0001
Create Date: 2026-05-01
"""

from __future__ import annotations

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260501_0002"
down_revision: str | None = "20260501_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("ALTER TABLE temperatures DROP COLUMN IF EXISTS floor_id")
    op.execute("ALTER TABLE temperatures DROP COLUMN IF EXISTS facility_id")


def downgrade() -> None:
    op.add_column("temperatures", sa.Column("floor_id", sa.Integer(), nullable=True))
    op.add_column("temperatures", sa.Column("facility_id", sa.Integer(), nullable=True))
