from app.infrastructure.ollama_client import OllamaClient


def test_extract_predictions_accepts_string_predictions():
    client = OllamaClient()

    predictions = client._extract_predictions({"predictions": ["cumulus"]})

    assert predictions == [{"label": "cumulus", "confidence": 0.0}]


def test_extract_predictions_accepts_single_prediction_object():
    client = OllamaClient()

    predictions = client._extract_predictions(
        {"predictions": {"label": "cirrus", "confidence": "0.8"}}
    )

    assert predictions == [{"label": "cirrus", "confidence": 0.8}]


def test_extract_predictions_ignores_invalid_items():
    client = OllamaClient()

    predictions = client._extract_predictions(
        {
            "predictions": [
                {"label": "cumulus", "confidence": 2},
                {"label": ""},
                123,
                {"confidence": 0.4},
            ]
        }
    )

    assert predictions == [{"label": "cumulus", "confidence": 1.0}]


def test_extract_predictions_rejects_invalid_predictions_payload():
    client = OllamaClient()

    predictions = client._extract_predictions({"predictions": 123})

    assert predictions == []
