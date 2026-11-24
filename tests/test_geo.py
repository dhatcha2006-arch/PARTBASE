import pytest
from app.utils.geo import haversine_distance, build_google_maps_url

def test_haversine_distance_same_point():
    # Thoraipakkam to Thoraipakkam
    dist = haversine_distance(12.9249, 80.2272, 12.9249, 80.2272)
    assert dist == 0.0

def test_haversine_distance_omr_to_annanagar():
    # Thoraipakkam (OMR) to Anna Nagar (~16-18km)
    dist = haversine_distance(12.9249, 80.2272, 13.0850, 80.2101)
    assert 16.0 <= dist <= 20.0

def test_haversine_distance_none_handling():
    assert haversine_distance(None, 80.2272, 13.0850, 80.2101) == 0.0
    assert haversine_distance(12.9249, None, 13.0850, 80.2101) == 0.0

def test_build_google_maps_url():
    url = build_google_maps_url("Sri Murugan Tailors", "Thoraipakkam")
    assert "https://www.google.com/maps/dir/?api=1" in url
    assert "travelmode=walking" in url
    assert "Sri+Murugan+Tailors" in url or "Sri%20Murugan" in url or "Sri" in url

def test_haversine_distance_velachery_to_adyar():
    from app.utils.geo import CHENNAI_AREAS
    v_lat, v_lon = CHENNAI_AREAS["Velachery"]
    a_lat, a_lon = CHENNAI_AREAS["Adyar"]
    dist = haversine_distance(v_lat, v_lon, a_lat, a_lon)
    assert 4.0 <= dist <= 6.5

def test_chennai_areas_catalog():
    from app.utils.geo import CHENNAI_AREAS, get_area_coordinates
    assert "Velachery" in CHENNAI_AREAS
    assert "Adyar" in CHENNAI_AREAS
    lat, lon = get_area_coordinates("Velachery")
    assert lat == 12.9815
