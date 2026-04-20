import base64
import anyio
from firebase_admin import messaging
from app.infrastructure.ollama_client import OllamaClient
from app.data.analysis_repository import AnalysisRepository

class AnalysisService:
    
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.repository = AnalysisRepository()

    async def process_image(self, analysis_id: int, file_path: str, fcm_token: str = ""):
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
            self._send_notification(fcm_token, analysis_id, "Análisis Completado", "Tu imagen de nubes ha sido analizada con éxito.")
            
        except Exception as e:
            print(f"Error procesando el análisis {analysis_id}: {e}")
            # 4. En caso de error, marcar como cancelado
            self.repository.update_status(analysis_id, 'cancelled')
            self._send_notification(fcm_token, analysis_id, "Error en el Análisis", "Hubo un problema al procesar tu imagen. Abre para más detalles.")

    def _send_notification(self, fcm_token: str, analysis_id: int, title: str, body: str):
        if not fcm_token:
            return
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                data={
                    "analysis_id": str(analysis_id)
                },
                token=fcm_token,
            )
            response = messaging.send(message)
            print(f"Successfully sent message: {response}")
        except Exception as e:
            print(f"Error sending FCM notification: {e}")
