import logging
from firebase_admin import credentials, initialize_app, auth
from app.infrastructure.config import FIREBASE_KEY_PATH, TEST_MODE

logger = logging.getLogger(__name__)

_firebase_enabled = bool(FIREBASE_KEY_PATH) and not TEST_MODE

if _firebase_enabled:
    cred = credentials.Certificate(FIREBASE_KEY_PATH)
    initialize_app(cred)
elif TEST_MODE:
    logger.info("Firebase initialization skipped because TEST_MODE=true")
else:
    raise ValueError("FIREBASE_KEY_PATH environment variable is not set. Please check your .env file.")

def verify_token(token: str):
    if not _firebase_enabled:
        logger.warning("Firebase token verification requested while Firebase is disabled")
        return None

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error("Error verifying Firebase token: %s", e)
        return None
