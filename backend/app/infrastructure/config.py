import os
from dotenv import load_dotenv

load_dotenv()

FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
FIREBASE_CLOCK_SKEW_SECONDS = int(os.getenv("FIREBASE_CLOCK_SKEW_SECONDS", "5"))
DATABASE_URL = os.getenv("DATABASE_URL")
OLLAMA_URL = os.getenv("OLLAMA_URL")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
TEST_MODE = os.getenv("TEST_MODE", "false").lower() == "true"
TEST_TOKEN = os.getenv("TEST_TOKEN", "test-token-climanuvem")
TEST_USER_UID = os.getenv("TEST_USER_UID", "test-user-e2e")
DISABLE_WORKER = os.getenv("DISABLE_WORKER", "false").lower() == "true"

DEFAULT_CORS_ALLOW_ORIGINS = (
    "http://localhost:8081,"
    "http://localhost:19006,"
    "http://127.0.0.1:8081,"
    "http://127.0.0.1:19006"
)
CORS_ALLOW_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOW_ORIGINS", DEFAULT_CORS_ALLOW_ORIGINS).split(",")
    if origin.strip()
]
