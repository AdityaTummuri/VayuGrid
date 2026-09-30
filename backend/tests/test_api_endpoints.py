"""Integration tests for FastAPI endpoints."""

from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_and_health():
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["platform"] == "VayuGrid"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_telemetry_cities():
    res = client.get("/api/v1/telemetry/cities")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) >= 5
    city_ids = [c["id"] for c in cities]
    assert "delhi_ncr" in city_ids
    assert "bengaluru" in city_ids


def test_telemetry_weather():
    res = client.get("/api/v1/telemetry/weather?latitude=28.6139&longitude=77.2090&city_id=delhi_ncr")
    assert res.status_code == 200
    data = res.json()
    assert "wind_speed_kmh" in data
    assert "downwind_bearing_deg" in data
    assert "stability_class" in data
    assert "planetary_boundary_layer_height_m" in data


def test_dispersion_simulation_endpoint():
    payload = {
        "origin_lat": 28.6139,
        "origin_lon": 77.2090,
        "source_type": "OPEN_MUNICIPAL_WASTE_BURNING",
        "severity_score": 0.85,
        "smoke_opacity": 0.90,
        "origin_radius_meters": 20.0,
        "simulation_duration_minutes": 60,
    }
    res = client.post("/api/v1/dispersion/simulate?city_id=delhi_ncr", json=payload)
    assert res.status_code == 200
    sim = res.json()
    assert "simulation_id" in sim
    assert "plume_dynamics" in sim
    assert "isopleth_contours" in sim
    assert "downwind_exposure_cone" in sim
    assert "time_series_snapshots" in sim
    assert sim["execution_time_ms"] > 0


def test_incident_audit_endpoint():
    # Audit without binary file (testing JSON response structure)
    res = client.post(
        "/api/v1/incidents/audit",
        data={
            "latitude": "28.6139",
            "longitude": "77.2090",
            "city_id": "delhi_ncr",
            "reported_by": "CITIZEN_TEST_RUNNER",
        },
    )
    assert res.status_code == 200
    ticket = res.json()
    assert ticket["status"] == "VERIFIED_HAZARD"
    assert "ticket_id" in ticket
    assert "downwind_exposure_cone" in ticket
    assert "physics_simulation" in ticket
    assert "vernacular_advisories" in ticket
    assert "impacted_infrastructure" in ticket
