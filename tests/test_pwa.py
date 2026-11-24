import pytest
import json

def test_pwa_manifest_endpoint(client):
    res = client.get("/static/manifest.json")
    assert res.status_code == 200
    manifest = json.loads(res.data)
    assert manifest["short_name"] == "PARTBASE"
    assert manifest["display"] == "standalone"
    assert len(manifest["icons"]) >= 1

def test_pwa_service_worker_reachable(client):
    res = client.get("/static/sw.js")
    assert res.status_code == 200
    assert b"CACHE_NAME" in res.data
    assert b"addEventListener" in res.data

def test_pwa_service_worker_v3_cache_name(client):
    res = client.get("/static/sw.js")
    assert res.status_code == 200
    assert b"partbase-v3" in res.data
