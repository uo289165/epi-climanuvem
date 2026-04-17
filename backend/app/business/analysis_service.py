import base64
import anyio
from app.infrastructure.ollama_client import OllamaClient
from app.data.analysis_repository import AnalysisRepository

class AnalysisService:
    
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.repository = AnalysisRepository()

    async def process_image(self, analysis_id: int, file_path: str):
        try:
            # 1. Leer imagen y convertir a base64
            async with await anyio.open_file(file_path, "rb") as f:
                content = await f.read()
                img_b64 = base64.b64encode(content).decode('utf-8')
            
            # 2. Llamada a Ollama
            predictions = await self.ollama_client.analyze_image(img_b64)
            
            # 3. Guardar resultados y actualizar estado a completado exitosamente
            self.repository.save_cloud_analysis(analysis_id, predictions)
            self.repository.update_status(analysis_id, 'completed')
            
        except Exception as e:
            print(f"Error procesando el análisis {analysis_id}: {e}")
            # 4. En caso de error, marcar como cancelado
            self.repository.update_status(analysis_id, 'cancelled')
