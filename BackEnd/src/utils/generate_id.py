from uuid import UUID
from uuid import uuid4


def generate_id() -> UUID:
    return uuid4()
