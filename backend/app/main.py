"""
VayuGrid (वायुग्रिड) - Intelligence Core Entrypoint
FastAPI application skeleton with health check and route discovery.
Application implementation logic will be added by the respective backend leads.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="VayuGrid Intelligence Core",
    description="Federated Planetary-to-Pavement Digital Public Good for Pan-India Air Pollution Governance",
    version="2.0.0"
)

# CORS middleware for local development with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register Subsystem Routers
from app.api.endpoints.vernacular import router as vernacular_router

app.include_router(vernacular_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "status": "online",
        "platform": "VayuGrid",
        "version": "2.0.0",
        "docs_url": "/docs",
        "message": "VayuGrid Intelligence Core is operational. Refer to /docs for API contracts."
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
