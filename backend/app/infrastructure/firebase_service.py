from firebase_admin import credentials, initialize_app, auth
from app.infrastructure.config import FIREBASE_KEY_PATH

if not FIREBASE_KEY_PATH:
    raise ValueError("FIREBASE_KEY_PATH environment variable is not set. Please check your .env file.")

cred = credentials.Certificate(FIREBASE_KEY_PATH)

initialize_app(cred)

def verify_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None