import os
from dotenv import load_dotenv

load_dotenv()

FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
DATABASE_URL = os.getenv("DATABASE_URL")
OLLAMA_URL = os.getenv("OLLAMA_URL")