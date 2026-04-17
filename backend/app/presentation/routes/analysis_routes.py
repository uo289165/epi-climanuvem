import os
import uuid
import asyncio
import anyio
from typing import Annotated, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.presentation.dependencies.auth_dependency import get_current_user
from app.infrastructure.database.database import get_db, engine
from app.business.analysis_service import AnalysisService

router = APIRouter()

USER_ID_NOT_FOUND_MSG = "User ID not found in token"

async def process_analysis_task(analysis_id: int, file_path: str):
    service = AnalysisService()
    await service.process_image(analysis_id, file_path)

@router.post("/upload", responses={401: {"description": "Unauthorized"}})
async def upload_image(
    background_tasks: BackgroundTasks,
    user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    file: Annotated[UploadFile, File(...)],
    location: Annotated[str, Form()] = "Ubicación desconocida"
):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail=USER_ID_NOT_FOUND_MSG)

    file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
    unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
    
    # Calculate path from this file's location to the root 'uploads' folder
    # this file: backend/app/presentation/routes/analysis_routes.py
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads")
    await anyio.Path(uploads_dir).mkdir(parents=True, exist_ok=True)
    file_path = os.path.join(uploads_dir, unique_filename)
    
    content = await file.read()
    async with await anyio.open_file(file_path, "wb") as f:
        await f.write(content)
        
    image_db_path = f"/uploads/{unique_filename}"
    
    firebase_claim = user.get("firebase", {})
    is_anon = firebase_claim.get("sign_in_provider") == "anonymous"
    
    insert_analysis_query = text("""
        INSERT INTO analysis (uid, image_path, location, is_anon, status)
        VALUES (:uid, :image_path, :location, :is_anon, 'analyzing')
        RETURNING id
    """)
    result = db.execute(insert_analysis_query, {
        "uid": uid,
        "image_path": image_db_path,
        "location": location,
        "is_anon": is_anon
    })
    analysis_id = result.scalar()
    
    db.commit()
    
    background_tasks.add_task(process_analysis_task, analysis_id, file_path)
    
    return {
        "message": "Imagen recibida correctamente. Iniciando análisis...",
        "status": "analyzing",
        "analysis_id": analysis_id
    }

def _initialize_analysis_record(row, analysis_id: str) -> dict:
    return {
        "id": analysis_id,
        "status": row.status,
        "date": row.datetime.isoformat() if row.datetime else None,
        "location": row.location or "Ubicación desconocida",
        "imageUrl": row.image_path or "https://picsum.photos/id/1015/800/600",  # Placeholder para testing
        "results": {
            "cloudTypes": [],
            "forecast": "",
            "warnings": []
        }
    }

def _update_analysis_results(res: dict, row):
    if row.cloud_type and row.cloud_type not in res["cloudTypes"]:
        res["cloudTypes"].append(row.cloud_type)
        
    if row.forecast and row.forecast not in res["forecast"]:
        res["forecast"] = (res["forecast"] + " " + row.forecast).strip()
        
    if row.warning and row.warning not in res["warnings"]:
        res["warnings"].append(row.warning)

@router.get("/history", responses={401: {"description": "Unauthorized"}})
def get_analysis_history(
    user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail=USER_ID_NOT_FOUND_MSG)

    query = """
        SELECT 
            a.id, 
            a.status, 
            a.datetime, 
            a.location, 
            a.image_path,
            c.name as cloud_type,
            c.forecast,
            c.warning
        FROM analysis a
        LEFT JOIN analysis_cloud ac ON a.id = ac.analysis_id
        LEFT JOIN clouds c ON ac.cloud_id = c.id
        WHERE a.uid = :uid
        ORDER BY a.datetime DESC
    """
    
    result = db.execute(text(query), {"uid": uid}).fetchall()
    
    analyses_dict = {}
    
    for row in result:
        analysis_id = str(row.id)
        if analysis_id not in analyses_dict:
            analyses_dict[analysis_id] = _initialize_analysis_record(row, analysis_id)
            
        _update_analysis_results(analyses_dict[analysis_id]["results"], row)
            
    # List of analyses, maintaining the descending order
    return list(analyses_dict.values())

def _remove_analysis_file(image_path, uploads_dir):
    if not image_path:
        return
    filename = image_path.split("/")[-1]
    file_path = os.path.join(uploads_dir, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Error removing file {file_path}: {e}")

@router.delete("/user-data", responses={401: {"description": "Unauthorized"}})
def delete_user_data(
    user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail=USER_ID_NOT_FOUND_MSG)

    query = text("SELECT id, image_path FROM analysis WHERE uid = :uid")
    analyses = db.execute(query, {"uid": uid}).fetchall()
    
    if not analyses:
        return {"message": "Datos de usuario eliminados correctamente."}
        
    # Calculate path to the uploads directory
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "uploads")
    
    for row in analyses:
        _remove_analysis_file(row.image_path, uploads_dir)
        db.execute(text("DELETE FROM analysis_cloud WHERE analysis_id = :id"), {"id": row.id})
        db.execute(text("DELETE FROM analysis WHERE id = :id"), {"id": row.id})
        
    db.commit()
    
    return {"message": "Datos de usuario eliminados correctamente."}
