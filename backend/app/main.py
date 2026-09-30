"""
VayuGrid (वायुग्रिड) - Intelligence Core Entrypoint
FastAPI application with atmospheric dispersion physics, micrometeorological telemetry,
and incident dispatch routing.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.telemetry import router as telemetry_router
from app.api.dispersion import router as dispersion_router
from app.api.incidents import router as incidents_router

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

# Mount API Routers under /api/v1
app.include_router(telemetry_router, prefix="/api/v1")
app.include_router(dispersion_router, prefix="/api/v1")
app.include_router(incidents_router, prefix="/api/v1")


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
        },
    }
