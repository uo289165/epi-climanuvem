import os
import asyncio
import anyio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.infrastructure.database.database import engine
from app.presentation.routes import test_routes, analysis_routes
from app.business.worker import analysis_worker

def _cleanup_obsolete_analyses(conn):
    cleanup_query = text("""
        SELECT id, image_path 
        FROM analysis 
        WHERE is_anon = TRUE AND datetime < NOW() - INTERVAL '3 days'
    """)
    obsolete_analyses = conn.execute(cleanup_query).fetchall()
    
    if not obsolete_analyses:
        return
        
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
    
    for row in obsolete_analyses:
        if row.image_path:
            filename = row.image_path.split("/")[-1]
            file_path = os.path.join(uploads_dir, filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Error deleting file {file_path}: {e}")
                    
        conn.execute(text("DELETE FROM analysis_cloud WHERE analysis_id = :id"), {"id": row.id})
        conn.execute(text("DELETE FROM analysis WHERE id = :id"), {"id": row.id})

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
            
        # Cleanup obsolete anonymous analyses (older than 3 days)
        _cleanup_obsolete_analyses(conn)
                
    # Start the analysis background worker
    worker_task = asyncio.create_task(analysis_worker())
    
    yield
    
    # Cancel the worker upon shutdown
    worker_task.cancel()
    # Esperamos a que la tarea termine limpiamente sin propagar su excepción de cancelación
    await asyncio.gather(worker_task, return_exceptions=True)

app = FastAPI(lifespan=lifespan)

# Mount the static directory for uploads
uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

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