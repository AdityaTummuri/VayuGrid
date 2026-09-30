# VayuGrid Backend Service

FastAPI-powered spatiotemporal atmospheric dispersion and incident verification service for VayuGrid.

---

## 🚀 Key Features

* **Real-Time Atmospheric Dispersion Engine:** Vectorized steady-state Gaussian Plume and Lagrangian Gaussian Puff kinematics.
* **Briggs Thermal Plume Rise:** Convective heat release rate and buoyancy flux parameterization for ground fires and industrial stacks.
* **Planetary Boundary Layer Trapping:** Method-of-images reflection handling nocturnal capping inversions common in North Indian winter smog.
* **Statutory Isopleth Extraction:** Analytical lateral half-width derivations for CPCB tiers (`HAZARDOUS`, `SEVERE`, `MODERATE`, `ADVISORY`).
* **Micro-Meteorological Telemetry:** Real-time Open-Meteo boundary layer and wind ingestion with regional fallbacks for 5 Indian archetypes.
* **Sensitive Infrastructure Geocoding:** Real-world schools, healthcare centers, and dense residential wards across Delhi-NCR, Bengaluru, Kanpur, Mumbai, and Punjab.
* **Weak-PC Optimized:** Evaluates simulations in **< 15ms median latency** consuming **< 12MB RAM** on commodity CPU hardware.

---

## 🛠️ Tooling & Quickstart

We use **`uv`** for Python package and environment management.

### 1. Environment Setup
```bash
# Create virtual environment and sync dependencies
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

### 2. Run the Development Server
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

* API Health: `http://localhost:8000/health`
* Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 3. Run Automated Tests
```bash
# Run all 38 tests
uv run pytest -v

# Run weak-PC latency benchmark
uv run pytest -v tests/test_benchmark_weak_pc.py -s

# Code quality and style check
uv run flake8 app tests --max-line-length=120 --extend-ignore=E203,W503
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status |
| `GET` | `/api/v1/telemetry/cities` | Regional city archetypes catalog |
| `GET` | `/api/v1/telemetry/weather` | Live micro-meteorology with regional fallback |
| `POST` | `/api/v1/dispersion/simulate` | Standalone atmospheric physics dispersion simulation |
| `GET` | `/api/v1/dispersion/receptors` | Spatial lookup of geo-indexed sensitive infrastructure |
| `POST` | `/api/v1/incidents/audit` | Incident audit with dual-cone/isopleth output |
| `GET` | `/api/v1/incidents/active` | Query active municipal incident tickets |
| `POST` | `/api/v1/incidents/{ticket_id}/action` | Dispatch mitigation assets (smog guns, tankers) |

---

## 📁 Package Architecture

```
backend/
├── app/
│   ├── api/             # REST endpoints (telemetry, dispersion, incidents)
│   ├── data/            # Sensitive infrastructure geo-database
│   ├── models/          # Pydantic schemas (weather, dispersion, receptors)
│   ├── services/        # Physics engine & meteorological ingestion
│   └── main.py          # FastAPI application factory
└── tests/               # 38 unit, integration, and performance tests
```
