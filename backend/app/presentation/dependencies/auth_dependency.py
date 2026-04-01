from typing import Annotated
from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.business.auth_service import authenticate_user

security = HTTPBearer()

def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
):
    try:
        token = credentials.credentials
        return authenticate_user(token)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )