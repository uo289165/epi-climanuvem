from app.infrastructure.firebase_service import verify_token

def authenticate_user(token: str):
    decoded = verify_token(token)
    if not decoded:
        raise Exception("Invalid token")
    return decoded