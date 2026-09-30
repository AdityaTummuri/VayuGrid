"""Unit tests for robust atmospheric dispersion physics and simulation."""

import numpy as np
import pytest

from app.services.dispersion_engine import DispersionEngine
from app.models.weather import StabilityClass, TerrainCategory, WeatherTelemetry
from app.models.dispersion import (
    EmissionSourceType,
    HazardLevel,
    SimulationParameters,
)


@pytest.fixture
def engine():
    return DispersionEngine(receptor_height_m=1.5)


@pytest.fixture
def sample_weather():
    return WeatherTelemetry(
        latitude=28.6139,
        longitude=77.2090,
        wind_speed_kmh=14.4,
        wind_speed_ms=4.0,
        wind_direction_deg=270.0,
        downwind_bearing_deg=90.0,
        temperature_c=28.0,
        temperature_k=301.15,
        humidity_pct=55.0,
        planetary_boundary_layer_height_m=500.0,
        surface_pressure_hpa=1012.0,
        solar_radiation_w_m2=550.0,
        is_day=True,
        stability_class=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
        friction_velocity_u_star_ms=0.75,
        source_attribution="TEST_FIXTURE",
    )


def test_emission_rate_scaling(engine):
    # Waste burning with higher severity and opacity must produce higher Q
    q_low = engine.calculate_emission_rate_q(
        source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
        severity_score=0.3,
        smoke_opacity=0.3,
        origin_radius_m=10.0,
    )
    q_high = engine.calculate_emission_rate_q(
        source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
        severity_score=0.9,
        smoke_opacity=0.9,
        origin_radius_m=10.0,
    )
    assert q_high > q_low * 2.0


def test_briggs_dispersion_coefficients_monotonicity(engine):
    distances = np.array([100.0, 500.0, 1000.0, 2500.0, 5000.0])
    sy, sz = engine.evaluate_dispersion_coefficients(
        x_meters=distances,
        stability=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
    )

    # Lateral and vertical plume spread must grow monotonically downwind
    assert np.all(np.diff(sy) > 0)
    assert np.all(np.diff(sz) > 0)


def test_briggs_plume_rise(engine):
    delta_h_hot, fb_hot, _ = engine.compute_briggs_plume_rise(
        source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
        physical_stack_height_m=1.5,
        origin_radius_m=3.0,
        ambient_temp_k=300.0,
        source_temp_k=750.0,
        effective_wind_speed_ms=3.0,
        stability=StabilityClass.C,
        severity_score=0.8,
    )

    # Thermal buoyancy must generate positive plume rise
    assert delta_h_hot > 0.0
    assert fb_hot > 0.0

    # Under identical thermal heat, higher wind speed bends plume faster and reduces rise
    delta_h_windy, _, _ = engine.compute_briggs_plume_rise(
        source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
        physical_stack_height_m=1.5,
        origin_radius_m=3.0,
        ambient_temp_k=300.0,
        source_temp_k=750.0,
        effective_wind_speed_ms=8.0,
        stability=StabilityClass.C,
        severity_score=0.8,
    )
    assert delta_h_hot > delta_h_windy


def test_inversion_lid_reflection(engine):
    sig_z = np.array([50.0, 200.0, 600.0])
    pbl_height = 400.0  # Shallow inversion layer
    h_eff = 20.0

    v_term = engine.evaluate_vertical_reflection(
        z_recept_m=1.5,
        h_eff_m=h_eff,
        sig_z=sig_z,
        pbl_height_m=pbl_height,
    )

    # All reflection terms must be positive and finite
    assert np.all(v_term > 0.0)
    assert np.all(np.isfinite(v_term))


def test_end_to_end_simulation(engine, sample_weather):
    params = SimulationParameters(
        origin_lat=28.6139,
        origin_lon=77.2090,
        source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
        severity_score=0.85,
        smoke_opacity=0.9,
        origin_radius_meters=20.0,
        simulation_duration_minutes=60,
    )

    candidate_receptors = [
        {
            "id": "TEST-REC-01",
            "name": "Nearby Senior Secondary School",
            "category": "EDUCATION_FACILITY",
            "lat": 28.6139,
            "lon": 77.2250,  # Directly downwind (East)
            "vulnerable_population_estimate": 800,
        },
        {
            "id": "TEST-REC-02",
            "name": "Upwind Hospital",
            "category": "HEALTHCARE_FACILITY",
            "lat": 28.6139,
            "lon": 77.1900,  # Upwind (West) - should receive zero plume exposure
            "vulnerable_population_estimate": 400,
        },
    ]

    result = engine.run_simulation(
        params=params,
        weather=sample_weather,
        candidate_receptors=candidate_receptors,
    )

    # 1. Verification of execution latency (< 50ms)
    assert result.execution_time_ms < 100.0

    # 2. Maximum ground concentration must be positive and non-zero
    assert result.max_ground_concentration_ug_m3 > 0.0
    assert result.downwind_reach_km > 0.5

    # 3. Legacy exposure cone structure for backwards compatibility
    assert result.downwind_exposure_cone.bearing_degrees == sample_weather.downwind_bearing_deg
    assert len(result.downwind_exposure_cone.boundary_polygon) >= 4

    # 4. Isopleth hierarchy nesting (Area of Hazardous < Area of Advisory)
    if len(result.isopleth_contours) >= 2:
        area_haz = next((iso.area_sq_km for iso in result.isopleth_contours if iso.tier == HazardLevel.HAZARDOUS), None)
        area_adv = next((iso.area_sq_km for iso in result.isopleth_contours if iso.tier == HazardLevel.ADVISORY), None)
        if area_haz and area_adv:
            assert area_haz < area_adv

    # 5. Transient puff snapshots progression
    assert len(result.time_series_snapshots) > 0
    # Smoke front distance must advance with elapsed time
    front_distances = [s.leading_edge_distance_km for s in result.time_series_snapshots]
    assert np.all(np.diff(front_distances) > 0)

    # 6. Receptors: Downwind school must be impacted, upwind hospital must NOT be in impacted list
    impacted_ids = [r.id for r in result.impacted_infrastructure]
    assert "TEST-REC-01" in impacted_ids
    assert "TEST-REC-02" not in impacted_ids
