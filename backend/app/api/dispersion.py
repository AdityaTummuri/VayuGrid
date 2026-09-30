"""
VayuGrid Physical Dispersion API Routes.
Exposes endpoints for running lightweight Gaussian Plume and Transient Puff simulations,
generating statutory isopleths, and calculating sensitive receptor exposure.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Body

from app.models.dispersion import (
    SimulationParameters,
    DispersionSimulationResult,
)
from app.services.dispersion_engine import DispersionEngine
from app.services.weather_service import WeatherService
from app.data.sensitive_infrastructure import get_candidate_receptors

router = APIRouter(prefix="/dispersion", tags=["Atmospheric Physics & Dispersion Engine"])

dispersion_engine = DispersionEngine()
weather_service = WeatherService()


@router.post(
    "/simulate",
    response_model=DispersionSimulationResult,
    summary="Execute lightweight atmospheric dispersion simulation",
)
async def simulate_dispersion(
    params: SimulationParameters = Body(
        ...,
        description="Source parameters (coordinates, source type, severity, opacity, duration)",
    ),
    city_id: Optional[str] = Query(None, description="Optional city identifier for localized weather/receptors"),
):
    """
    Executes a high-precision, lightweight atmospheric dispersion simulation:
    - Ingests live weather & mixing height from Open-Meteo.
    - Evaluates Deacon wind shear & Briggs thermal plume rise.
    - Computes Briggs Urban/Rural dispersion coefficients and inversion lid reflection.
    - Generates statutory iso-concentration polygons (Hazardous, Severe, Moderate, Advisory).
    - Simulates transient Gaussian puff advection with advancing smoke front countdowns.
    - Intersects downwind exposure corridor with geo-indexed sensitive infrastructure.
    - Benchmarked to execute in < 20ms on weak/low-power PCs.
    """
    try:
        # Ingest live or fallback weather telemetry
        weather = await weather_service.get_live_weather(
            lat=params.origin_lat,
            lon=params.origin_lon,
            city_id=city_id,
        )

        # Retrieve candidate receptors in hazard vicinity
        candidates = get_candidate_receptors(
            origin_lat=params.origin_lat,
            origin_lon=params.origin_lon,
            max_search_radius_km=15.0,
            city_id=city_id,
        )

        # Run simulation
        result = dispersion_engine.run_simulation(
            params=params,
            weather=weather,
            candidate_receptors=candidates,
        )

        return result
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Atmospheric dispersion simulation error: {str(exc)}",
        )


@router.get(
    "/receptors",
    response_model=List[dict],
    summary="Query nearby sensitive infrastructure receptors",
)
async def query_receptors(
    latitude: float = Query(..., ge=-90.0, le=90.0),
    longitude: float = Query(..., ge=-180.0, le=180.0),
    radius_km: float = Query(10.0, ge=1.0, le=50.0),
    city_id: Optional[str] = Query(None),
):
    """
    Retrieves geo-indexed vulnerable assets (schools, hospitals, residential wards, informal settlements)
    within the specified kilometer radius.
    """
    receptors = get_candidate_receptors(
        origin_lat=latitude,
        origin_lon=longitude,
        max_search_radius_km=radius_km,
        city_id=city_id,
    )
    return receptors
