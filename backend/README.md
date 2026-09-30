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
# Run all 62 tests
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
| `GET` | `/health` | Service health status with 7 subsystem checks |
| `GET` | `/api/v1/telemetry/cities` | Regional city archetypes catalog |
| `GET` | `/api/v1/telemetry/weather` | Live micro-meteorology with regional fallback |
| `GET` | `/api/v1/telemetry/aqi` | Tier-B CPCB & OpenAQ ambient monitoring station feed |
| `POST` | `/api/v1/dispersion/simulate` | Standalone atmospheric physics dispersion simulation |
| `GET` | `/api/v1/dispersion/receptors` | Spatial lookup of geo-indexed sensitive infrastructure |
| `POST` | `/api/v1/incidents/audit` | Multipart incident audit with AI forensics & dispersion |
| `POST` | `/api/v1/incidents/audit/json` | Base64 JSON incident audit for edge PWA devices |
| `GET` | `/api/v1/incidents/active` | Query active municipal incident tickets with filters |
| `GET` | `/api/v1/incidents/{ticket_id}` | Retrieve statutory incident dossier by ticket ID |
| `POST` | `/api/v1/incidents/{ticket_id}/action` | Dispatch mitigation assets (smog guns, tankers) |
| `POST` | `/api/v1/incidents/{ticket_id}/resolve` | Close incident upon mitigation completion |
| `POST` | `/api/v1/vernacular/synthesize` | Multi-language translation & TTS speech synthesis |

---

## 📁 Package Architecture

```
backend/
├── app/
│   ├── api/             # REST endpoints (telemetry, dispersion, incidents, vernacular)
│   ├── core/            # Configuration & forensic system prompts
│   ├── data/            # Sensitive infrastructure & sample audit payloads
│   ├── models/          # Pydantic v2 schemas (incident, dispersion, weather, forensic)
│   ├── services/        # Physics engine, weather, forensics, speech, tickets, AQI
│   └── main.py          # FastAPI application factory with tracing & timing middleware
└── tests/               # 62 unit, integration, lifecycle, and performance tests
```

