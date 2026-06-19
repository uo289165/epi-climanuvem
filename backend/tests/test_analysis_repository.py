from app.data.analysis_repository import AnalysisRepository


class FakeScalarResult:
    def __init__(self, value):
        self.value = value

    def scalar(self):
        return self.value


class FakeConnection:
    def __init__(self):
        self.calls = []

    def execute(self, query, params=None):
        self.calls.append((str(query), params))
        if "SELECT id FROM clouds" in str(query):
            return FakeScalarResult(42)
        return FakeScalarResult(None)


class FakeBegin:
    def __init__(self, connection):
        self.connection = connection

    def __enter__(self):
        return self.connection

    def __exit__(self, exc_type, exc, tb):
        return False


class FakeEngine:
    def __init__(self, connection):
        self.connection = connection

    def begin(self):
        return FakeBegin(self.connection)


def test_save_cloud_analysis_maps_known_cloud_and_persists_box(monkeypatch):
    import app.data.analysis_repository as repository_module

    connection = FakeConnection()
    monkeypatch.setattr(repository_module, "engine", FakeEngine(connection))

    AnalysisRepository().save_cloud_analysis(
        9,
        [{"label": "cumulus", "confidence": 0.8, "box_2d": [1, 2, 3, 4]}],
    )

    insert_call = connection.calls[-1]
    assert "INSERT INTO analysis_cloud" in insert_call[0]
    assert insert_call[1] == {
        "analysis_id": 9,
        "cloud_id": 42,
        "confidence": 0.8,
        "box_ymin": 1,
        "box_xmin": 2,
        "box_ymax": 3,
        "box_xmax": 4,
    }


def test_save_cloud_analysis_ignores_unknown_labels(monkeypatch):
    import app.data.analysis_repository as repository_module

    connection = FakeConnection()
    monkeypatch.setattr(repository_module, "engine", FakeEngine(connection))

    AnalysisRepository().save_cloud_analysis(9, [{"label": "unknown"}])

    assert connection.calls == []
