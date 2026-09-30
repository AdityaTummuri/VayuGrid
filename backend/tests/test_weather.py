"""Unit tests for weather telemetry and micrometeorology calculations."""

import pytest
from app.services.weather_service import WeatherService
from app.models.weather import StabilityClass, TerrainCategory


@pytest.fixture
def weather_service():
    return WeatherService()


def test_downwind_bearing_calculation(weather_service):
    # Wind from West (270°) blows East (90°)
    assert weather_service.compute_downwind_bearing(270.0) == 90.0

    # Wind from North (0°) blows South (180°)
    assert weather_service.compute_downwind_bearing(0.0) == 180.0

    # Wind from South (180°) blows North (0°)
    assert weather_service.compute_downwind_bearing(180.0) == 0.0

    # Wind from North-West (315°) blows South-East (135°)
    assert weather_service.compute_downwind_bearing(315.0) == 135.0


def test_stability_class_determination(weather_service):
    # Strong daytime insolation with light wind -> Class A
    stab_day_light_wind = weather_service.determine_stability_class(
        wind_speed_ms=1.5, is_day=True, solar_radiation_w_m2=750.0
    )
    assert stab_day_light_wind in (StabilityClass.A, StabilityClass.B)

    # Daytime high wind -> Class C or D (mechanical turbulence dominates)
    stab_high_wind = weather_service.determine_stability_class(
        wind_speed_ms=7.0, is_day=True, solar_radiation_w_m2=750.0
    )
    assert stab_high_wind in (StabilityClass.C, StabilityClass.D)

    # Nighttime light wind -> Class F (severe inversion)
    stab_night_calm = weather_service.determine_stability_class(
        wind_speed_ms=1.2, is_day=False
    )
    assert stab_night_calm == StabilityClass.F

    # Nighttime moderate wind -> Class D
    stab_night_windy = weather_service.determine_stability_class(
        wind_speed_ms=5.5, is_day=False
    )
    assert stab_night_windy == StabilityClass.D


def test_friction_velocity_estimation(weather_service):
    u_star_urban = weather_service.estimate_friction_velocity(
        wind_speed_ms=4.0, terrain=TerrainCategory.URBAN
    )
    u_star_rural = weather_service.estimate_friction_velocity(
        wind_speed_ms=4.0, terrain=TerrainCategory.RURAL_OPEN
    )

    # Urban terrain has much higher aerodynamic roughness than rural open plain,
    # hence friction velocity u* must be higher
    assert u_star_urban > u_star_rural
    assert u_star_urban > 0.0
    assert u_star_rural > 0.0


def test_regional_fallback_generation(weather_service):
    # Delhi fallback coordinates
    delhi_fallback = weather_service.generate_regional_fallback(
        28.6139, 77.2090, "delhi_ncr"
    )
    assert delhi_fallback.wind_speed_kmh > 0
    assert (
        delhi_fallback.planetary_boundary_layer_height_m <= 600.0
    )  # Strong winter inversion
    assert delhi_fallback.downwind_bearing_deg == 105.0  # 285° + 180° = 105°
    assert delhi_fallback.terrain == TerrainCategory.URBAN

    # Bengaluru fallback
    blr_fallback = weather_service.generate_regional_fallback(
        12.9716, 77.5946, "bengaluru"
    )
    assert blr_fallback.planetary_boundary_layer_height_m > 700.0


def test_supported_cities_catalog(weather_service):
    cities = weather_service.get_supported_cities()
    city_ids = {c.id for c in cities}
    assert "delhi_ncr" in city_ids
    assert "bengaluru" in city_ids
    assert "kanpur" in city_ids
    assert "mumbai" in city_ids
    assert "punjab" in city_ids
