"""
VayuGrid Pydantic Models for Weather & Micrometeorological Telemetry.
Defines strict schemas for atmospheric boundary layer variables, solar radiation,
stability classes, and vector kinematics.
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class StabilityClass(str, Enum):
    """Pasquill-Gifford Atmospheric Stability Classes A through F."""

    A = "A"  # Extremely Unstable (strong daytime solar insolation, low wind)
    B = "B"  # Moderately Unstable
    C = "C"  # Slightly Unstable
    D = "D"  # Neutral (overcast sky or high wind, day or night)
    E = "E"  # Slightly Stable (nighttime with moderate cloud cover)
    F = "F"  # Moderately to Extremely Stable (clear night, low wind, ground inversion)


class TerrainCategory(str, Enum):
    """Terrain roughness classification influencing surface friction and dispersion."""

    URBAN = "URBAN"  # High-density city core, tall buildings (z0 ~ 1.0 - 2.0m)
    SUBURBAN = "SUBURBAN"  # Low-rise residential, mixed vegetation (z0 ~ 0.4m)
    RURAL_OPEN = (
        "RURAL_OPEN"  # Open agricultural, grasslands, flat terrain (z0 ~ 0.03m)
    )
    COASTAL = "COASTAL"  # Marine boundary layer transition (z0 ~ 0.001 - 0.01m)


class WeatherTelemetry(BaseModel):
    """Real-time or archetype meteorological parameters used for dispersion modeling."""

    latitude: float = Field(
        ..., description="Latitude in decimal degrees", ge=-90.0, le=90.0
    )
    longitude: float = Field(
        ..., description="Longitude in decimal degrees", ge=-180.0, le=180.0
    )
    wind_speed_kmh: float = Field(
        ..., description="Wind speed at 10m height (km/h)", ge=0.0
    )
    wind_speed_ms: float = Field(
        ..., description="Wind speed at 10m height (m/s)", ge=0.0
    )
    wind_direction_deg: float = Field(
        ...,
        description="Compass bearing from which wind originates (0°=N, 90°=E, 180°=S, 270°=W)",
        ge=0.0,
        le=360.0,
    )
    downwind_bearing_deg: float = Field(
        ...,
        description="Downwind plume transport bearing: (wind_direction + 180°) % 360°",
        ge=0.0,
        le=360.0,
    )
    temperature_c: float = Field(
        ..., description="Ambient surface temperature in Celsius"
    )
    temperature_k: float = Field(
        ..., description="Ambient surface temperature in Kelvin"
    )
    humidity_pct: float = Field(
        ..., description="Relative humidity percentage (0-100%)", ge=0.0, le=100.0
    )
    planetary_boundary_layer_height_m: float = Field(
        ...,
        description="Height of the atmospheric mixing layer / capping inversion lid (meters)",
        ge=50.0,
        le=5000.0,
    )
    surface_pressure_hpa: float = Field(
        1013.25, description="Surface barometric atmospheric pressure (hPa)"
    )
    solar_radiation_w_m2: Optional[float] = Field(
        None,
        description="Global horizontal solar irradiance (W/m²). Derived from solar zenith if not reported.",
    )
    is_day: bool = Field(
        True, description="True if local time corresponds to daylight hours"
    )
    stability_class: StabilityClass = Field(
        StabilityClass.D,
        description="Computed Pasquill-Gifford-Turner stability category (A through F)",
    )
    terrain: TerrainCategory = Field(
        TerrainCategory.URBAN, description="Surface roughness terrain category"
    )
    friction_velocity_u_star_ms: Optional[float] = Field(
        None, description="Estimated friction velocity u* (m/s)"
    )
    source_attribution: str = Field(
        "OPEN_METEO_LIVE",
        description="Source of data: OPEN_METEO_LIVE, HISTORICAL_CACHE, or REGIONAL_FALLBACK",
    )


class CityMetadata(BaseModel):
    """Regional archetype and geographical boundary definition."""

    id: str = Field(
        ..., description="Unique slug for city archetype (e.g., 'delhi_ncr')"
    )
    name: str = Field(..., description="Official regional name")
    center: dict[str, float] = Field(
        ..., description="Default center latitude and longitude"
    )
    default_zoom: int = Field(12, description="Recommended viewport zoom level")
    archetype: str = Field(
        ..., description="Dominant air pollution and geographic archetype"
    )
    ulb_authority: str = Field(
        ..., description="Urban Local Body or statutory agency responsible"
    )
    terrain: TerrainCategory = Field(
        TerrainCategory.URBAN, description="Dominant aerodynamic roughness"
    )
    typical_pbl_winter_m: float = Field(
        450.0, description="Typical winter boundary layer capping height (m)"
    )
    typical_pbl_summer_m: float = Field(
        1400.0, description="Typical summer boundary layer capping height (m)"
    )
    current_aqi: int = Field(250, description="Representative statutory AQI")
    category: str = Field("POOR", description="AQI category")
    primary_pollutant: str = Field("PM2.5", description="Primary dominant pollutant")
    cpcb_stations_count: int = Field(12, description="Number of CAAQMS monitoring stations")
    state: str = Field("India", description="State or territory name")

