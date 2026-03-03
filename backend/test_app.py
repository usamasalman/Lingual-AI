import pytest
import json
from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_get_languages(client):
    resp = client.get("/api/languages")
    assert resp.status_code == 200
    data = json.loads(resp.data)
    assert isinstance(data, list)
    assert len(data) > 0
    assert any(lang["code"] == "en" for lang in data)


def test_translate_empty_text(client):
    resp = client.post(
        "/api/translate",
        json={"text": "", "source": "en", "target": "es"},
        content_type="application/json",
    )
    assert resp.status_code == 400
    data = json.loads(resp.data)
    assert "error" in data


def test_translate_same_language(client):
    resp = client.post(
        "/api/translate",
        json={"text": "Hello", "source": "en", "target": "en"},
        content_type="application/json",
    )
    assert resp.status_code == 400
    data = json.loads(resp.data)
    assert "error" in data


def test_translate_text_too_long(client):
    resp = client.post(
        "/api/translate",
        json={"text": "a" * 5001, "source": "en", "target": "es"},
        content_type="application/json",
    )
    assert resp.status_code == 400
    data = json.loads(resp.data)
    assert "error" in data


def test_translate_valid_request(client):
    resp = client.post(
        "/api/translate",
        json={"text": "Hello", "source": "en", "target": "es"},
        content_type="application/json",
    )
    # Either success or API error (502) are acceptable in test env
    assert resp.status_code in [200, 502]
    data = json.loads(resp.data)
    assert "translatedText" in data or "error" in data
