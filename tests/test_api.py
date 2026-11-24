"""Unit tests for JSON REST API endpoints."""
import pytest
from app import create_app
from app.extensions import db
from config import TestConfig

@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_api_jobs_list(client):
    """Test getting public jobs feed as JSON."""
    response = client.get('/api/jobs')
    assert response.status_code == 200
    assert response.is_json
    data = response.get_json()
    assert "jobs" in data or "data" in data or isinstance(data, list)

def test_api_scam_check(client):
    """Test real-time scam keyword validation endpoint."""
    response = client.post('/api/scam-check', json={
        "title": "Shop Helper",
        "details": "Pay 500 registration fee before interview"
    })
    assert response.status_code == 200
    assert response.is_json
    data = response.get_json()
    assert data["ok"] is False or len(data.get("data", {}).get("flags", [])) > 0

def test_api_health_endpoint(client):
    """Test the /api/health status endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.is_json
    payload = response.get_json()
    assert payload["ok"] is True
    assert payload["data"]["status"] == "healthy"
    assert payload["data"]["service"] == "partbase"
    assert payload["data"]["version"] == "1.2.0"

def test_api_locations_endpoint(client):
    res = client.get('/api/locations')
    assert res.status_code == 200
    assert res.is_json
    payload = res.get_json()
    assert payload["ok"] is True
    assert "Velachery" in payload["data"]["zones"]
