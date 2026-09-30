"""
VayuGrid Telemetry API Routes.
Exposes endpoints for live and archetype weather telemetry and city configurations.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException

from app.models.weather import WeatherTelemetry, CityMetadata
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/telemetry", tags=["Telemetry & Micrometeorology"])
weather_service = WeatherService()


@router.get("/weather", response_model=WeatherTelemetry, summary="Fetch live micrometeorological vectors")
async def get_weather_telemetry(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees"),
    city_id: Optional[str] = Query(None, description="Optional city archetype slug (e.g., 'delhi_ncr')"),
):
    """
    Retrieves live boundary layer height, wind speed, wind direction, downwind advection bearing,
    and Pasquill-Gifford atmospheric stability classification from Open-Meteo.
    Automatically applies regional microclimate fallback if external APIs are unreachable.
    """
    try:
        telemetry = await weather_service.get_live_weather(
            lat=latitude,
            lon=longitude,
            city_id=city_id,
        )
        return telemetry
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve weather telemetry: {str(exc)}"
        )


@router.get("/cities", response_model=List[CityMetadata], summary="Get pre-configured flagship cities")
async def get_supported_cities():
    """
    Returns pre-configured Indian regional archetypes with coordinate centers,
    recommended zoom levels, ULB authority names, and typical seasonal mixing heights.
    """
    return weather_service.get_supported_cities()
