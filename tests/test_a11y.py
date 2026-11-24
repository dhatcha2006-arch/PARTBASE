import pytest

def test_navbar_accessibility_attributes(client):
    res = client.get("/")
    assert res.status_code == 200
    assert b'aria-label="Main Navigation"' in res.data
    assert b'aria-label="PARTBASE Home"' in res.data
    assert b'alt="PARTBASE Icon"' in res.data

def test_footer_structure(client):
    res = client.get("/")
    assert res.status_code == 200
    assert b"Trust &amp; Governance" in res.data or b"Trust" in res.data

def test_config_security_headers_defined():
    from config import SECURITY_HEADERS
    assert SECURITY_HEADERS['X-Frame-Options'] == 'DENY'
    assert SECURITY_HEADERS['X-Content-Type-Options'] == 'nosniff'
