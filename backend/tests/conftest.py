import os

os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("TEST_MODE", "true")
os.environ.setdefault("DISABLE_WORKER", "true")
