from app.infrastructure.config import TEST_MODE, TEST_TOKEN, TEST_USER_UID
from app.infrastructure.firebase_service import verify_token

def authenticate_user(token: str):
    if TEST_MODE and token:
        return {
            "uid": TEST_USER_UID,
            "firebase": {
                "sign_in_provider": "anonymous" if token != TEST_TOKEN else "custom"
            }
        }

    decoded = verify_token(token)
    if not decoded:
        raise Exception("Invalid token")
    return decoded
