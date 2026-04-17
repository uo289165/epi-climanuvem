import httpx
import json
from app.infrastructure.config import OLLAMA_URL

class OllamaClient:
    """Cliente para interactuar con la API de Ollama de forma asíncrona."""

    PROMPT_CLASSIFIER = """
    You are an expert meteorological classifier specialized in cloud identification.

    Classes:

    * cirrus
    * cirrocumulus
    * cirrostratus
    * altocumulus
    * altostratus
    * nimbostratus
    * stratocumulus
    * stratus
    * cumulus
    * cumulonimbus
    * contrail

    Cloud definitions:

    cirrus: thin, wispy, high-altitude clouds
    cirrocumulus: small white patches in rows
    cirrostratus: thin veil covering the sky
    altocumulus: mid-level patches with shading
    altostratus: gray layer covering most of the sky
    nimbostratus: thick rain clouds
    stratocumulus: low, patchy gray clouds
    stratus: uniform gray layer
    cumulus: puffy clouds with defined edges
    cumulonimbus: tall storm clouds
    contrail: straight line from aircraft

    Task:
    Classify the given image.

    Rules:

    * Only classify real clouds.
    * Return ONLY 1 label if there is a single dominant cloud type.
    * Return a 2nd label ONLY IF you are absolutely certain that a secondary, distinct cloud type is present. DO NOT force a second prediction.
    * Assign a confidence score (0 to 1) to each detected cloud type.
    * Confidence should reflect BOTH:
      * likelihood of correct identification
      * relative presence in the image
    * If no clouds: {"label": "no_cloud", "confidence": 1.0}

    Return strictly valid JSON and NOTHING ELSE.
    DO NOT use markdown formatting. DO NOT wrap the output in ```json ... ``` blocks.
    DO NOT add any conversational text or comments.
    Your output must start exactly with { and end with } and be parseable by json.loads.

    Format:

    {
      "predictions": [
        {"label": "<class_name>", "confidence": <value_between_0_and_1>}
      ]
    }
    """
    
    def __init__(self):
        self.url = OLLAMA_URL
        self.model = "gemma4:e4b"
        self.prompt = self.PROMPT_CLASSIFIER
        
    async def analyze_image(self, base64_image: str) -> list:
        payload = {
            "model": self.model,
            "prompt": self.prompt,
            "images": [base64_image],
            "stream": False,
            "options": {
                "seed": 42,
                "temperature": 0,
                "top_p": 1
            }
        }
        
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(self.url, json=payload)
            response.raise_for_status()
            
            raw_output = response.json().get("response", "")
            result = json.loads(raw_output)
            return result.get("predictions", [])
