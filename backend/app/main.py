import os
import anyio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.infrastructure.database.database import engine
from app.presentation.routes import test_routes, analysis_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    with engine.begin() as conn:
        create_tables_path = os.path.join(os.path.dirname(__file__), "infrastructure", "database", "create_tables.sql")
        create_tables_sql = await anyio.Path(create_tables_path).read_text(encoding="utf-8")
        conn.execute(text(create_tables_sql))
        
        # Check if clouds table is empty
        result = conn.execute(text("SELECT COUNT(*) FROM clouds"))
        count = result.scalar()
        if count == 0:
            seed_clouds_path = os.path.join(os.path.dirname(__file__), "infrastructure", "database", "seed_clouds.sql")
            seed_clouds_sql = await anyio.Path(seed_clouds_path).read_text(encoding="utf-8")
            conn.execute(text(seed_clouds_sql))
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_routes.router)
app.include_router(analysis_routes.router, prefix="/analysis", tags=["Analysis"])

@app.get("/ping")
def ping():
    return {"ping": "pong"}

@app.get("/")
def read_root():
    return {"Hello": "World"}