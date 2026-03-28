from typing import Annotated, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.presentation.dependencies.auth_dependency import get_current_user
from app.infrastructure.database.database import get_db

router = APIRouter()

@router.get("/history", responses={401: {"description": "Unauthorized"}})
def get_analysis_history(
    user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    uid = user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="User ID not found in token")

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
            analyses_dict[analysis_id] = {
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
        res = analyses_dict[analysis_id]["results"]
        
        if row.cloud_type and row.cloud_type not in res["cloudTypes"]:
            res["cloudTypes"].append(row.cloud_type)
            
        if row.forecast and row.forecast not in res["forecast"]:
            res["forecast"] = (res["forecast"] + " " + row.forecast).strip()
            
        if row.warning and row.warning not in res["warnings"]:
            res["warnings"].append(row.warning)
            
    # List of analyses, maintaining the descending order
    return list(analyses_dict.values())
