"""
CORS middleware configuration for the TULóng API.

Pulls allowed origins from settings (environment-driven) so the same code
works on localhost, staging, and production without any changes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings


def setup_cors(app: FastAPI) -> None:
    """Attach CORSMiddleware to the given FastAPI application.

    Origin list is resolved from ``settings.cors_origins``, which parses
    the ``ALLOWED_ORIGINS`` env var.  Falls back to ``["*"]`` when unset.
    """
    # When wildcard is used, credentials must be False (browser requirement)
    origins = settings.cors_origins
    allow_credentials = "*" not in origins

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
