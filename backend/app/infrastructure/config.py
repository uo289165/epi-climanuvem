import os
from dotenv import load_dotenv

load_dotenv()

FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
DATABASE_URL = os.getenv("DATABASE_URL")
OLLAMA_URL = os.getenv("OLLAMA_URL")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
TEST_MODE = os.getenv("TEST_MODE", "false").lower() == "true"
TEST_TOKEN = os.getenv("TEST_TOKEN", "test-token-climanuvem")
TEST_USER_UID = os.getenv("TEST_USER_UID", "test-user-e2e")
DISABLE_WORKER = os.getenv("DISABLE_WORKER", "false").lower() == "true"
