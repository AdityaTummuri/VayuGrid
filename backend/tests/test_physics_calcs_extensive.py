"""
Extensive Mathematical and Physical Calculation Rigor Tests for VayuGrid.
Verifies:
1. Conservation of Mass and Crosswind Integral: int_{-inf}^{inf} u C(x,y,z) dy = Q * V(z)
2. Symmetry & Extrema: Centerline peak dC/dy = 0, C(x, +y) == C(x, -y)
3. Coordinate Invariant Round-Trip: (x, y) -> (lat, lon) -> (x', y') < 0.25m error
4. Inversion Trapping Enhancement: Shallow PBL concentration >= Unconfined PBL concentration
5. Stability Regime Monotonicity across all 12 combinations (6 classes x Urban/Rural)
6. Asymptotic decay as x -> infinity and non-singularity at calm wind u -> 0
7. Plume rise scaling across thermal extremes
8. Isopleth exact threshold verification
9. Receptor arrival time monotonicity
"""

import math
import numpy as np
import pytest

from app.services.dispersion_engine import DispersionEngine
from app.services.weather_service import WeatherService
from app.models.weather import StabilityClass, TerrainCategory, WeatherTelemetry
from app.models.dispersion import EmissionSourceType, SimulationParameters


@pytest.fixture
def engine():
    return DispersionEngine(receptor_height_m=1.5)


@pytest.fixture
def weather_svc():
    return WeatherService()


# =============================================================================
# 1. CROSSWIND SYMMETRY & MAXIMUM VERIFICATION
# =============================================================================


def test_crosswind_symmetry(engine):
    """Verifies C(x, +y, z) == C(x, -y, z) across multiple downwind distances."""
    x_test = np.array([50.0, 200.0, 1000.0, 3000.0])
    y_pos = np.array([25.0, 75.0, 150.0, 300.0])
    y_neg = -y_pos

    c_pos = engine.compute_steady_state_concentration(
        x_m=x_test,
        y_m=y_pos,
        z_recept_m=1.5,
        q_g_s=50.0,
        u_eff_ms=4.0,
        h_eff_m=15.0,
        stability=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=600.0,
    )

    c_neg = engine.compute_steady_state_concentration(
        x_m=x_test,
        y_m=y_neg,
        z_recept_m=1.5,
        q_g_s=50.0,
        u_eff_ms=4.0,
        h_eff_m=15.0,
        stability=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=600.0,
    )

    np.testing.assert_allclose(c_pos, c_neg, rtol=1e-12)


def test_centerline_maximum(engine):
    """Verifies that concentration is strictly maximal at the centerline y=0 for any downwind x."""
    x_val = np.array([500.0])
    c_center = engine.compute_steady_state_concentration(
        x_m=x_val,
        y_m=np.array([0.0]),
        z_recept_m=1.5,
        q_g_s=40.0,
        u_eff_ms=3.5,
        h_eff_m=10.0,
        stability=StabilityClass.D,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=500.0,
    )[0]

    for offset in [5.0, 15.0, 50.0, 100.0]:
        c_off = engine.compute_steady_state_concentration(
            x_m=x_val,
            y_m=np.array([offset]),
            z_recept_m=1.5,
            q_g_s=40.0,
            u_eff_ms=3.5,
            h_eff_m=10.0,
            stability=StabilityClass.D,
            terrain=TerrainCategory.URBAN,
            pbl_height_m=500.0,
        )[0]
        assert c_center > c_off, f"Centerline concentration {c_center} not greater than offset {offset}m: {c_off}"


# =============================================================================
# 2. NUMERICAL INTEGRATION: CONSERVATION OF MASS
# =============================================================================


def test_crosswind_mass_conservation(engine):
    """
    Integrates the crosswind concentration profile:
    int_{-inf}^{inf} C(x, y, z) dy = [Q / (sqrt(2*pi) * u * sig_z)] * V(z, H, sig_z, PBL)
    Checks analytical Gaussian integral identity: int_{-inf}^{inf} exp(-y^2 / 2*sig_y^2) dy = sqrt(2*pi) * sig_y.
    """
    x_m = np.array([400.0])
    q_g_s = 25.0
    u_eff_ms = 4.0
    h_eff_m = 12.0
    stab = StabilityClass.C
    terrain = TerrainCategory.URBAN
    pbl_m = 800.0

    sig_y, sig_z = engine.evaluate_dispersion_coefficients(x_m, stab, terrain)
    sy = float(sig_y[0])
    sz = float(sig_z[0])

    # Dense trapezoidal crosswind numerical integration over [-5*sy, +5*sy] (captures 99.9999% mass)
    y_grid = np.linspace(-5.0 * sy, 5.0 * sy, 1001)
    x_grid = np.full_like(y_grid, 400.0)

    c_vals_ug = engine.compute_steady_state_concentration(
        x_m=x_grid,
        y_m=y_grid,
        z_recept_m=1.5,
        q_g_s=q_g_s,
        u_eff_ms=u_eff_ms,
        h_eff_m=h_eff_m,
        stability=stab,
        terrain=terrain,
        pbl_height_m=pbl_m,
    )
    # Convert ug/m3 back to g/m3 for flux comparison
    c_vals_g = c_vals_ug / 1e6

    # Numerical integral (trapezoidal rule)
    numerical_integral = np.trapezoid(c_vals_g, y_grid)

    # Theoretical analytical value: (Q / (sqrt(2*pi) * u * sz)) * V_term
    v_term = float(engine.evaluate_vertical_reflection(1.5, h_eff_m, np.array([sz]), pbl_m)[0])
    theoretical_integral = (q_g_s / (math.sqrt(2.0 * math.pi) * u_eff_ms * sz)) * v_term

    relative_error = abs(numerical_integral - theoretical_integral) / theoretical_integral
    assert relative_error < 0.001, f"Crosswind mass integral relative error {relative_error:.5f} exceeds 0.1%"


# =============================================================================
# 3. GEODESIC AND CARTESIAN ROUND-TRIP INVARIANCE
# =============================================================================


def test_geodesic_roundtrip_precision(engine):
    """
    Projects local (x, y) to (lat, lon) on WGS84 and rotates back via evaluate_receptor_impacts logic.
    Residual displacement must be less than 0.25 meters.
    """
    origin_lat = 28.6139
    origin_lon = 77.2090

    test_bearings = [0.0, 45.0, 90.0, 135.0, 180.0, 225.0, 270.0, 315.0]
    test_points = [
        (100.0, 0.0),
        (500.0, 50.0),
        (1500.0, -120.0),
        (4000.0, 250.0),
    ]

    for bearing in test_bearings:
        bearing_rad = math.radians(bearing)
        for x_true, y_true in test_points:
            # Forward projection
            geo_pt = engine.project_geodesic(origin_lat, origin_lon, bearing, x_true, y_true)

            # Inverse transformation
            d_lat = math.radians(geo_pt.lat - origin_lat)
            d_lon = math.radians(geo_pt.lon - origin_lon)
            north_m = d_lat * engine.earth_radius_m
            east_m = d_lon * (engine.earth_radius_m * math.cos(math.radians(origin_lat)))

            x_reconstructed = east_m * math.sin(bearing_rad) + north_m * math.cos(bearing_rad)
            y_reconstructed = east_m * math.cos(bearing_rad) - north_m * math.sin(bearing_rad)

            err_x = abs(x_reconstructed - x_true)
            err_y = abs(y_reconstructed - y_true)

            assert err_x < 0.25, f"Geodesic x roundtrip error {err_x:.3f}m exceeds 0.25m at bearing {bearing}"
            assert err_y < 0.25, f"Geodesic y roundtrip error {err_y:.3f}m exceeds 0.25m at bearing {bearing}"


# =============================================================================
# 4. INVERSION LID TRAPPING ENHANCEMENT
# =============================================================================


def test_pbl_inversion_trapping_enhancement(engine):
    """
    Under shallow nocturnal capping inversions (zi = 300m), pollutants are trapped
    between the ground and the lid, producing higher far-downwind ground concentrations
    than an unconfined atmosphere (zi = 3000m).
    """
    x_far = np.array([4500.0])
    y_center = np.array([0.0])

    c_trapped = engine.compute_steady_state_concentration(
        x_m=x_far,
        y_m=y_center,
        z_recept_m=1.5,
        q_g_s=60.0,
        u_eff_ms=3.0,
        h_eff_m=10.0,
        stability=StabilityClass.D,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=300.0,  # Shallow winter smog inversion
    )[0]

    c_unconfined = engine.compute_steady_state_concentration(
        x_m=x_far,
        y_m=y_center,
        z_recept_m=1.5,
        q_g_s=60.0,
        u_eff_ms=3.0,
        h_eff_m=10.0,
        stability=StabilityClass.D,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=3000.0,  # Deep convective atmosphere
    )[0]

    # Inversion trapping must concentrate ground level smoke downwind
    assert c_trapped > c_unconfined
    assert c_trapped > c_unconfined * 1.25, (
        f"Inversion lid ({c_trapped:.1f}) should amplify far-downwind ground concentration over unconfined ({c_unconfined:.1f})"
    )


# =============================================================================
# 5. STABILITY REGIME MATRIX TESTING (ALL 12 REGIMES)
# =============================================================================


@pytest.mark.parametrize("terrain", [TerrainCategory.URBAN, TerrainCategory.RURAL_OPEN])
@pytest.mark.parametrize(
    "stability",
    [
        StabilityClass.A,
        StabilityClass.B,
        StabilityClass.C,
        StabilityClass.D,
        StabilityClass.E,
        StabilityClass.F,
    ],
)
def test_all_stability_regimes_validity(engine, terrain, stability):
    """
    Verifies that for every single stability class (A-F) in both Urban and Rural terrains:
    - Dispersion coefficients sig_y and sig_z are positive, strictly increasing downwind.
    - Ground concentrations are positive and finite.
    - No NaN, Inf, or negative values.
    """
    x_eval = np.array([20.0, 100.0, 500.0, 2000.0, 10000.0])
    sig_y, sig_z = engine.evaluate_dispersion_coefficients(x_eval, stability, terrain)

    assert np.all(sig_y > 0.0)
    assert np.all(sig_z > 0.0)
    assert np.all(np.diff(sig_y) > 0.0), f"sig_y not strictly monotonic for {terrain} {stability}"
    assert np.all(np.diff(sig_z) > 0.0), f"sig_z not strictly monotonic for {terrain} {stability}"

    c_vals = engine.compute_steady_state_concentration(
        x_m=x_eval,
        y_m=np.zeros_like(x_eval),
        z_recept_m=1.5,
        q_g_s=30.0,
        u_eff_ms=3.0,
        h_eff_m=10.0,
        stability=stability,
        terrain=terrain,
        pbl_height_m=600.0,
    )

    assert np.all(np.isfinite(c_vals))
    assert np.all(c_vals >= 0.0)


# =============================================================================
# 6. ASYMPTOTIC DECAY AND CALM WIND SAFEGUARD
# =============================================================================


def test_asymptotic_decay(engine):
    """Verifies that concentration decays towards zero as downwind distance approaches infinity."""
    x_near = np.array([300.0])
    x_far = np.array([25000.0])

    c_near = engine.compute_steady_state_concentration(
        x_m=x_near,
        y_m=np.array([0.0]),
        z_recept_m=1.5,
        q_g_s=50.0,
        u_eff_ms=4.0,
        h_eff_m=15.0,
        stability=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=1000.0,
    )[0]

    c_far = engine.compute_steady_state_concentration(
        x_m=x_far,
        y_m=np.array([0.0]),
        z_recept_m=1.5,
        q_g_s=50.0,
        u_eff_ms=4.0,
        h_eff_m=15.0,
        stability=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=1000.0,
    )[0]

    assert c_near > c_far * 10.0
    assert c_far > 0.0


def test_calm_wind_safeguard(engine):
    """
    When wind speed approaches zero (calm wind stagnation),
    engine must clamp velocity to minimum 0.5 m/s to prevent zero division or infinity.
    """
    u_calm = engine.compute_wind_at_height(
        u10_ms=0.01,
        height_m=20.0,
        stability=StabilityClass.F,
        terrain=TerrainCategory.URBAN,
    )
    assert u_calm >= 0.5
    assert np.isfinite(u_calm)


# =============================================================================
# 7. BRIGGS PLUME RISE THERMAL SCALING
# =============================================================================


def test_plume_rise_temperature_scaling(engine):
    """
    Plume rise must scale monotonically with flue gas temperature delta_T = Ts - Ta.
    A hotter fire generates greater buoyancy flux Fb and thus higher Delta H.
    """
    temps = [350.0, 500.0, 750.0, 1000.0]
    rises = []

    for ts in temps:
        dh, fb, _ = engine.compute_briggs_plume_rise(
            source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
            physical_stack_height_m=2.0,
            origin_radius_m=3.0,
            ambient_temp_k=300.0,
            source_temp_k=ts,
            effective_wind_speed_ms=3.0,
            stability=StabilityClass.C,
            severity_score=0.8,
        )
        rises.append(dh)

    assert np.all(np.diff(rises) >= 0.0)


# =============================================================================
# 8. ISOPLETH EXACT THRESHOLD VERIFICATION
# =============================================================================


def test_isopleth_boundary_concentration_exactness(engine):
    """
    Verifies that the boundary polygon points of the isopleth correspond exactly
    to the statutory concentration threshold (within numerical discretization tolerance).
    """
    params = SimulationParameters(
        origin_lat=28.6139,
        origin_lon=77.2090,
        source_type=EmissionSourceType.OPEN_MUNICIPAL_WASTE_BURNING,
        severity_score=0.9,
        smoke_opacity=0.9,
        origin_radius_meters=20.0,
        simulation_duration_minutes=60,
    )

    weather = WeatherTelemetry(
        latitude=28.6139,
        longitude=77.2090,
        wind_speed_kmh=12.0,
        wind_speed_ms=3.33,
        wind_direction_deg=270.0,
        downwind_bearing_deg=90.0,
        temperature_c=25.0,
        temperature_k=298.15,
        humidity_pct=60.0,
        planetary_boundary_layer_height_m=500.0,
        surface_pressure_hpa=1013.0,
        solar_radiation_w_m2=400.0,
        is_day=True,
        stability_class=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
        friction_velocity_u_star_ms=0.6,
        source_attribution="TEST",
    )

    result = engine.run_simulation(params=params, weather=weather)

    for isopleth in result.isopleth_contours:
        threshold = isopleth.threshold_ug_m3
        # Pick the apex point (max downwind distance along centerline y=0)
        apex_dist_m = isopleth.max_downwind_reach_km * 1000.0

        c_apex = engine.compute_steady_state_concentration(
            x_m=np.array([apex_dist_m]),
            y_m=np.array([0.0]),
            z_recept_m=1.5,
            q_g_s=result.source_parameters["emission_rate_q_g_s"],
            u_eff_ms=result.plume_dynamics.effective_wind_speed_ms,
            h_eff_m=result.plume_dynamics.effective_release_height_m,
            stability=weather.stability_class,
            terrain=weather.terrain,
            pbl_height_m=weather.planetary_boundary_layer_height_m,
        )[0]

        # Apex concentration must be closely matching the threshold
        # (discretization on downwind grid is within 15%)
        rel_diff = abs(c_apex - threshold) / threshold
        assert rel_diff < 0.15, (
            f"Isopleth {isopleth.tier} apex concentration {c_apex:.1f} differs from threshold {threshold} by {rel_diff:.2%}"
        )


# =============================================================================
# 9. RECEPTOR ARRIVAL TIME MONOTONICITY
# =============================================================================


def test_receptor_arrival_time_monotonicity(engine):
    """
    Arrival time of advancing smoke front must increase strictly with downwind distance.
    Receptor at 1000m must have shorter arrival countdown than receptor at 3000m.
    """
    origin_lat, origin_lon = 28.6139, 77.2090
    bearing = 90.0  # Blowing East

    # Two receptors along the downwind track (East)
    rec_near_geo = engine.project_geodesic(origin_lat, origin_lon, bearing, 800.0, 0.0)
    rec_far_geo = engine.project_geodesic(origin_lat, origin_lon, bearing, 2400.0, 0.0)

    candidates = [
        {"id": "NEAR", "name": "Near Ward", "lat": rec_near_geo.lat, "lon": rec_near_geo.lon},
        {"id": "FAR", "name": "Far Ward", "lat": rec_far_geo.lat, "lon": rec_far_geo.lon},
    ]

    impacts = engine.evaluate_receptor_impacts(
        origin_lat=origin_lat,
        origin_lon=origin_lon,
        downwind_bearing_deg=bearing,
        q_g_s=50.0,
        u_eff_ms=4.0,
        h_eff_m=10.0,
        stability=StabilityClass.C,
        terrain=TerrainCategory.URBAN,
        pbl_height_m=500.0,
        candidate_receptors=candidates,
        max_reach_m=5000.0,
    )

    near_imp = next(r for r in impacts if r.id == "NEAR")
    far_imp = next(r for r in impacts if r.id == "FAR")

    assert near_imp.estimated_arrival_minutes < far_imp.estimated_arrival_minutes
    assert near_imp.modeled_concentration_ug_m3 > far_imp.modeled_concentration_ug_m3
