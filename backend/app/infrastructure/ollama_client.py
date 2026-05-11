import httpx
import json
import logging
import re
from app.infrastructure.config import OLLAMA_URL

logger = logging.getLogger(__name__)

class OllamaClient:
    """Cliente para interactuar con la API de Ollama de forma asíncrona."""

    PROMPT_EXPLAINER = """
    You are an expert meteorological classifier specialized in cloud identification.

    In a previous analysis, the following cloud types were identified in this image:
    {labels_str}

    Task:
    For EACH cloud type mentioned above, you MUST provide exactly ONE bounding box (box_2d) that encloses its presence in the image.

    Rules:
    * For each cloud type provided in the list, return one bounding box.
    * box_2d format: [ymin, xmin, ymax, xmax]
    * Coordinates must be normalized between 0.0 and 1.0 relative to the image dimensions.
    * If a cloud type is scattered, provide ONE generalized bounding box for the main group.
    * CRITICAL: ONLY draw boxes around actual clouds in the SKY. DO NOT confuse rocks, snow, terrain, or ground features with clouds.
    * Return strictly valid JSON and NOTHING ELSE.
    * DO NOT use markdown formatting. DO NOT wrap the output in ```json ... ``` blocks.
    * DO NOT add any conversational text or comments.
    * Your output must start exactly with {{ and end with }} and be parseable by json.loads.

    Format:
    {{
      "predictions": [
        {{
          "label": "<class_name>",
          "box_2d": [<ymin>, <xmin>, <ymax>, <xmax>]
        }}
      ]
    }}
    """

    PROMPT_CLASSIFIER_SIMPLE = """
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
        {
          "label": "<class_name>",
          "confidence": <value_between_0_and_1>
        }
      ]
    }
    """
    
    def __init__(self):
        self.url = OLLAMA_URL
        self.model = "gemma4:e4b"
        
    def _clean_and_parse_json(self, text: str) -> dict:
        """Limpia la respuesta del modelo e intenta parsearla como JSON."""
        # 1. Intentar encontrar el bloque JSON si el modelo incluyó texto extra o markdown
        cleaned = text.strip()
        
        # Si contiene bloques de código markdown, extraer el contenido
        if "```" in cleaned:
            # Intentar extraer lo que hay dentro de los bloques ```json o ```
            json_match = re.search(r'```(?:json)?\s*([^`]+)\s*```', cleaned, re.DOTALL)
            if json_match:
                cleaned = json_match.group(1).strip()
        
        # 2. Si todavía no es un JSON puro, intentar encontrar el primer '{' y el último '}'
        if not (cleaned.startswith('{') and cleaned.endswith('}')):
            start_idx = cleaned.find('{')
            end_idx = cleaned.rfind('}')
            if start_idx != -1 and end_idx != -1:
                cleaned = cleaned[start_idx:end_idx+1]

        # 3. Intentar parsear
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.warning("Error parsing model JSON response: %s", e)
            logger.debug("Raw model response: %s", text)
            # Si falla, devolvemos un objeto vacío para evitar que el worker rompa
            return {"predictions": []}

    async def analyze_image(self, base64_image: str) -> list:
        """Realiza un análisis simple de la imagen para clasificar las nubes."""
        payload = {
            "model": self.model,
            "prompt": self.PROMPT_CLASSIFIER_SIMPLE,
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
            result = self._clean_and_parse_json(raw_output)
            return result.get("predictions", [])

    async def get_explainability_boxes(self, base64_image: str, labels: list) -> list:
        """Obtiene las bounding boxes para una lista específica de etiquetas de nubes."""
        labels_str = ", ".join(labels)
        prompt = self.PROMPT_EXPLAINER.format(labels_str=labels_str)
        
        payload = {
            "model": self.model,
            "prompt": prompt,
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
            result = self._clean_and_parse_json(raw_output)
            return result.get("predictions", [])
