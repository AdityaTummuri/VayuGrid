"""
VayuGrid Telemetry API Routes.
Exposes endpoints for live and archetype weather telemetry and city configurations.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException

from app.models.weather import WeatherTelemetry, CityMetadata
from app.services.weather_service import WeatherService
from app.services.aqi_service import aqi_service, StationTelemetry

router = APIRouter(prefix="/telemetry", tags=["Telemetry & Micrometeorology"])
weather_service = WeatherService()


@router.get(
    "/weather",
    response_model=WeatherTelemetry,
    summary="Fetch live micrometeorological vectors",
)
async def get_weather_telemetry(
    latitude: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Latitude in decimal degrees"),
    longitude: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Longitude in decimal degrees"),
    lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Latitude alias"),
    lon: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Longitude alias"),
    city_id: Optional[str] = Query(
        None, description="Optional city archetype slug (e.g., 'delhi_ncr')"
    ),
):
    actual_lat = latitude if latitude is not None else (lat if lat is not None else 28.6139)
    actual_lon = longitude if longitude is not None else (lon if lon is not None else 77.2090)
    """
    Retrieves live boundary layer height, wind speed, wind direction, downwind advection bearing,
    and Pasquill-Gifford atmospheric stability classification from Open-Meteo.
    Automatically applies regional microclimate fallback if external APIs are unreachable.
    """
    try:
        telemetry = await weather_service.get_live_weather(
            lat=actual_lat,
            lon=actual_lon,
            city_id=city_id,
        )
        return telemetry
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve weather telemetry: {str(exc)}"
        )


@router.get(
    "/cities",
    response_model=List[CityMetadata],
    summary="Get pre-configured flagship cities",
)
async def get_supported_cities():
    """
    Returns pre-configured Indian regional archetypes with coordinate centers,
    recommended zoom levels, ULB authority names, and typical seasonal mixing heights.
    """
    return weather_service.get_supported_cities()


@router.get(
    "/aqi",
    response_model=List[StationTelemetry],
    summary="Retrieve ground-truth CPCB / OpenAQ ambient AQI station telemetry",
)
async def get_ambient_aqi(
    city_id: Optional[str] = Query(
        None, description="Optional city identifier (e.g., 'delhi_ncr', 'bengaluru', 'kanpur')"
    ),
):
    """
    Returns live Tier-B station observations (PM2.5, PM10, NO2, NAQI Category)
    for official monitoring stations across Indian cities.
    """
    try:
        return await aqi_service.get_city_stations(city_id=city_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve AQI telemetry: {str(exc)}")

