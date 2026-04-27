# FastAPI Backend

Backend scaffold using FastAPI, SQLAlchemy, and PostgreSQL with a controller/service/repository structure.

## Setup

```bash
cd BackEnd
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
```

Start PostgreSQL locally:

```bash
docker compose up -d postgres
```

Update `DATABASE_URL` in `.env` if needed.

## Database

```bash
alembic upgrade head
```

## Run

```bash
uvicorn src.index:app --reload
```

Open `http://127.0.0.1:8000/docs`.

## Docker Compose

Run the database and backend together:

```bash
docker compose up --build
```

This starts:

- `postgres` on `127.0.0.1:5432`
- `backend` on `127.0.0.1:8000`

Inside Docker, the backend connects to PostgreSQL with host `postgres`.

## Structure

- `src/controllers`: request handlers and request/response schemas.
- `src/routes`: route grouping and URL registration.
- `src/services`: business logic.
- `src/repo`: database access logic.
- `src/db`: SQLAlchemy engine, sessions, and schema models.
- `src/middlewares`: reusable request guards/middleware-style dependencies.
- `src/utils`: small shared helpers.
