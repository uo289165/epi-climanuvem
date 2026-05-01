from sqlalchemy import text
from app.infrastructure.database.database import engine

CLOUD_NAME_MAPPING = {
    "cirrus": "Cirros",
    "cirrocumulus": "Cirrocúmulos",
    "cirrostratus": "Cirrostratos",
    "altocumulus": "Altocúmulos",
    "altostratus": "Altoestratos",
    "nimbostratus": "Nimboestratos",
    "stratocumulus": "Estratocúmulos",
    "stratus": "Estratos",
    "cumulus": "Cúmulos",
    "cumulonimbus": "Cumulonimbos",
    "contrail": "Estelas de avión",
    "no_cloud": "Sin nubes"
}

class AnalysisRepository:
    
    def update_status(self, analysis_id: int, status: str):
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE analysis SET status = :status WHERE id = :id"), 
                {"status": status, "id": analysis_id}
            )

    def save_cloud_analysis(self, analysis_id: int, predictions: list):
        with engine.begin() as conn:
            for pred in predictions:
                label = pred.get("label")
                confidence = pred.get("confidence", 0.0)
                
                mapped_name = CLOUD_NAME_MAPPING.get(label.lower() if label else "")
                
                if not mapped_name:
                    continue
                
                cloud_query = text("SELECT id FROM clouds WHERE name = :name")
                cloud_id = conn.execute(cloud_query, {"name": mapped_name}).scalar()
                
                if cloud_id:
                    box_2d = pred.get("box_2d")
                    box_ymin, box_xmin, box_ymax, box_xmax = (None, None, None, None)
                    if box_2d and isinstance(box_2d, list) and len(box_2d) == 4:
                        box_ymin, box_xmin, box_ymax, box_xmax = box_2d
                        
                    insert_assoc = text("""
                        INSERT INTO analysis_cloud (analysis_id, cloud_id, confidence, box_ymin, box_xmin, box_ymax, box_xmax)
                        VALUES (:analysis_id, :cloud_id, :confidence, :box_ymin, :box_xmin, :box_ymax, :box_xmax)
                    """)
                    conn.execute(insert_assoc, {
                        "analysis_id": analysis_id,
                        "cloud_id": cloud_id,
                        "confidence": confidence,
                        "box_ymin": box_ymin,
                        "box_xmin": box_xmin,
                        "box_ymax": box_ymax,
                        "box_xmax": box_xmax
                    })
