"""
run_seed.py — Execute seed.sql against the database after Alembic migrations.

Uses asyncpg directly (already a project dependency). asyncpg.execute() supports
multi-statement SQL when called without parameters, making it safe to run the
full seed script in a single call.
"""

import asyncio
import os
import sys

import asyncpg


async def main() -> None:
    seed_path = os.path.join(os.path.dirname(__file__), "seed.sql")

    if not os.path.isfile(seed_path):
        print("⚠  seed.sql not found — skipping database seeding.")
        return

    # Convert the SQLAlchemy-style URL to a plain PostgreSQL URL
    db_url = os.environ.get("DATABASE_URL", "")
    db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")

    if not db_url:
        print("✗  DATABASE_URL is not set — cannot seed.", file=sys.stderr)
        sys.exit(1)

    with open(seed_path, encoding="utf-8") as f:
        sql = f.read()

    conn = await asyncpg.connect(db_url)
    try:
        await conn.execute(sql)
        print("✓  Seed data applied successfully.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
