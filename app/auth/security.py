import os
from datetime import datetime, timedelta, timezone
from secrets import compare_digest

from jose import JWTError, jwt

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "480"))

DEMO_USERNAME = os.getenv("DEMO_USERNAME")
DEMO_EMAIL = os.getenv("DEMO_EMAIL")
DEMO_PASSWORD = os.getenv("DEMO_PASSWORD")


def auth_is_configured() -> bool:
    return bool(JWT_SECRET_KEY and DEMO_PASSWORD and (DEMO_USERNAME or DEMO_EMAIL))


def verify_demo_credentials(identifier: str, password: str) -> bool:
    if not auth_is_configured():
        return False

    valid_identifiers = [value for value in (DEMO_USERNAME, DEMO_EMAIL) if value]
    identifier_matches = any(compare_digest(identifier, value) for value in valid_identifiers)
    password_matches = compare_digest(password, DEMO_PASSWORD or "")
    return identifier_matches and password_matches


def create_access_token(subject: str) -> tuple[str, int]:
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is not configured")

    expires_in = JWT_EXPIRE_MINUTES * 60
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    payload = {
        "sub": subject,
        "exp": expires_at,
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token, expires_in


def decode_access_token(token: str) -> str | None:
    if not JWT_SECRET_KEY:
        return None

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
