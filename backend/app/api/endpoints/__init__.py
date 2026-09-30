"""VayuGrid Modular Endpoints Subsystem."""

from app.api.endpoints.incidents import router as incidents_router
from app.api.endpoints.telemetry import router as telemetry_router
from app.api.endpoints.dispersion import router as dispersion_router
from app.api.endpoints.vernacular import router as vernacular_router

__all__ = [
    "incidents_router",
    "telemetry_router",
    "dispersion_router",
    "vernacular_router",
]
