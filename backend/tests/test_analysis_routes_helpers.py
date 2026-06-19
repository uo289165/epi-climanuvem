from datetime import datetime
from types import SimpleNamespace

from app.presentation.routes.analysis_routes import (
    _initialize_analysis_record,
    _update_analysis_results,
)


def test_initialize_analysis_record_uses_defaults_for_missing_values():
    row = SimpleNamespace(
        status="completed",
        datetime=None,
        location=None,
        latitude=None,
        longitude=None,
        image_path=None,
    )

    record = _initialize_analysis_record(row, "12")

    assert record["id"] == "12"
    assert record["date"] is None
    assert record["location"] == "Ubicación desconocida"
    assert record["imageUrl"].startswith("https://picsum.photos/")
    assert record["results"] == {
        "cloudTypes": [],
        "cloudDetails": [],
        "forecast": "",
        "warnings": [],
    }


def test_update_analysis_results_deduplicates_clouds_forecasts_and_warnings():
    results = {
        "cloudTypes": [],
        "cloudDetails": [],
        "forecast": "",
        "warnings": [],
    }
    row_without_box = SimpleNamespace(
        cloud_type="Cúmulos",
        box_ymin=None,
        box_xmin=None,
        box_ymax=None,
        box_xmax=None,
        forecast="Buen tiempo",
        warning="Sin avisos",
        warning_level=0,
    )
    row_with_box = SimpleNamespace(
        cloud_type="Cúmulos",
        box_ymin=1,
        box_xmin=2,
        box_ymax=3,
        box_xmax=4,
        forecast="Buen tiempo",
        warning="Sin avisos",
        warning_level=0,
    )

    _update_analysis_results(results, row_without_box)
    _update_analysis_results(results, row_with_box)

    assert results["cloudTypes"] == ["cumulus"]
    assert results["cloudDetails"] == [
        {
            "type": "cumulus",
            "originalType": "Cúmulos",
            "box": [1, 2, 3, 4],
        }
    ]
    assert results["forecast"] == "Buen tiempo"
    assert results["warnings"] == [
        {"type": "cumulus", "text": "Sin avisos", "level": 0}
    ]
