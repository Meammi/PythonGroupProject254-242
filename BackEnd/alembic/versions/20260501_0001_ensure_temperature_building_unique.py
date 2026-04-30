"""ensure temperature building uniqueness

Revision ID: 20260501_0001
Revises: 39373da1e99f
Create Date: 2026-05-01
"""

from __future__ import annotations

from collections.abc import Sequence

from alembic import op


revision: str = "20260501_0001"
down_revision: str | None = "39373da1e99f"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        DELETE FROM temperatures t
        USING (
            SELECT id
            FROM (
                SELECT
                    id,
                    row_number() OVER (
                        PARTITION BY building_id
                        ORDER BY created_at DESC, id DESC
                    ) AS row_num
                FROM temperatures
            ) ranked
            WHERE ranked.row_num > 1
        ) duplicate_temperatures
        WHERE t.id = duplicate_temperatures.id
        """
    )
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'uq_temperature_building'
                  AND conrelid = 'temperatures'::regclass
            ) THEN
                ALTER TABLE temperatures
                ADD CONSTRAINT uq_temperature_building UNIQUE (building_id);
            END IF;
        END $$;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE temperatures
        DROP CONSTRAINT IF EXISTS uq_temperature_building
        """
    )
