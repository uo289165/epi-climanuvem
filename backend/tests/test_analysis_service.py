from unittest.mock import Mock

import pytest

from app.business.analysis_service import AnalysisService


class FakeOllamaClient:
    def __init__(self):
        self.analyze_image_calls = []
        self.explainability_calls = []

    async def analyze_image(self, image_b64):
        self.analyze_image_calls.append(image_b64)
        return [{"label": "cumulus", "confidence": 0.91}]

    async def get_explainability_boxes(self, image_b64, labels):
        self.explainability_calls.append((image_b64, labels))
        return [{"label": "cumulus", "box_2d": [10, 20, 30, 40]}]


@pytest.mark.asyncio
async def test_process_image_saves_predictions_with_explainability(tmp_path):
    image_path = tmp_path / "cloud.jpg"
    image_path.write_bytes(b"image-bytes")
    service = AnalysisService()
    service.ollama_client = FakeOllamaClient()
    service.repository = Mock()
    service._send_notification = Mock()

    await service.process_image(7, str(image_path), "fcm-token", explainability=True)

    service.repository.save_cloud_analysis.assert_called_once_with(
        7,
        [{"label": "cumulus", "confidence": 0.91, "box_2d": [10, 20, 30, 40]}],
    )
    service.repository.update_status.assert_called_once_with(7, "completed")
    service._send_notification.assert_called_once()


@pytest.mark.asyncio
async def test_process_image_marks_analysis_cancelled_on_error(tmp_path):
    image_path = tmp_path / "cloud.jpg"
    image_path.write_bytes(b"image-bytes")
    service = AnalysisService()
    service.ollama_client = Mock()
    service.ollama_client.analyze_image.side_effect = RuntimeError("ollama down")
    service.repository = Mock()
    service._send_notification = Mock()

    await service.process_image(7, str(image_path), explainability=False)

    service.repository.save_cloud_analysis.assert_not_called()
    service.repository.update_status.assert_called_once_with(7, "cancelled")
    service._send_notification.assert_called_once()
