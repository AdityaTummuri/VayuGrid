"""
VayuGrid (वायुग्रिड) - Intelligence Core Entrypoint
FastAPI application with atmospheric dispersion physics, micrometeorological telemetry,
and incident dispatch routing.
"""

import time
import uuid
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.telemetry import router as telemetry_router
from app.api.dispersion import router as dispersion_router
from app.api.incidents import router as incidents_router
from app.api.endpoints.vernacular import router as vernacular_router

logger = logging.getLogger("vayugrid.main")

app = FastAPI(
    title="VayuGrid Intelligence Core",
    description="Federated Planetary-to-Pavement Digital Public Good for Pan-India Air Pollution Governance",
    version="2.1.0",
)

# CORS middleware for local development with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_and_trace_headers(request: Request, call_next):
    """
    Middleware attaching:
    - X-Request-ID: Unique UUID correlation trace header
    - X-Process-Time: Processing time in milliseconds
    """
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    start_time = time.perf_counter()

    try:
        response = await call_next(request)
        process_time = (time.perf_counter() - start_time) * 1000
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
        response.headers["X-Request-ID"] = request_id
        return response
    except Exception as exc:
        process_time = (time.perf_counter() - start_time) * 1000
        logger.error(f"Unhandled exception on request {request_id}: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "detail": str(exc),
                "request_id": request_id,
            },
            headers={
                "X-Process-Time": f"{process_time:.2f}ms",
                "X-Request-ID": request_id,
            },
        )


# Mount API Routers under /api/v1
app.include_router(telemetry_router, prefix="/api/v1")
app.include_router(dispersion_router, prefix="/api/v1")
app.include_router(incidents_router, prefix="/api/v1")
app.include_router(vernacular_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "status": "online",
        "platform": "VayuGrid",
        "version": "2.1.0",
        "physics_engine": "Vectorized Gaussian Plume + Transient Lagrangian Puff",
        "docs_url": "/docs",
        "message": "VayuGrid Intelligence Core is operational. Refer to /docs for API contracts.",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "2.1.0",
        "modules": {
            "dispersion_engine": "operational",
            "weather_service": "operational",
            "geospatial_catalog": "operational",
            "gemini_forensic": "operational",
            "vernacular_service": "operational",
            "ticket_service": "operational",
            "aqi_service": "operational",
        },
    }

