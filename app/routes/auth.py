from fastapi import APIRouter, HTTPException, status

from app.auth.security import (
    auth_is_configured,
    create_access_token,
    verify_demo_credentials,
)
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter()


@router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    if not auth_is_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Authentication is not configured. Set JWT_SECRET_KEY, "
                "DEMO_PASSWORD and DEMO_USERNAME or DEMO_EMAIL in .env."
            ),
        )

    identifier = payload.username or payload.email or ""
    if not verify_demo_credentials(identifier, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token, expires_in = create_access_token(identifier)
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": expires_in,
        "user": {"username": identifier, "role": "demo"},
    }
