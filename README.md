<div align="center">

# 🌬️ VAYU-SUTRA (वायु-सूत्र)
### Verifiable Air-Quality Yield & Unified Spatio-Temporal Resilience Architecture

**A Federated, Multi-Tier Planetary-to-Pavement Digital Public Good for Pan-India Air Pollution Governance**

[![Hackathon](https://img.shields.io/badge/Event-Build%20with%20AI%3A%20Code%20for%20Communities-blue?style=for-the-badge&logo=google)](https://hack2skill.com)
[![Track](https://img.shields.io/badge/Track-Clean%20Air%20%26%20Climate%20Resilience-green?style=for-the-badge)](https://hack2skill.com)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini%20Flash%20Multimodal-orange?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Architecture](docs/ARCHITECTURE.md) • [4-Member Work Allocation](docs/TEAM_WORK_ALLOCATION.md) • [API Contracts](docs/API_CONTRACTS.md) • [Pitch Deck](docs/PITCH_DECK.md) • [Demo Script](docs/DEMO_SCRIPT.md)

</div>

---

## 📌 Executive Summary

India's National Clean Air Programme (NCAP) monitors ambient air through Continuous Ambient Air Quality Monitoring Stations (CAAQMS). However, systemic operational barriers limit effective intervention:
1. **Capex & Spatial Gaps:** Each station costs ₹1.0–1.5 Crore to deploy and maintain, leaving Tier-2/3 industrial towns and rural districts underserved.
2. **Elevation vs. Breathing Zone Mismatch:** CAAQMS units are installed 10–15m atop government rooftops, measuring regional averages while missing acute toxic plumes at the 0–2m human breathing zone.
3. **Passive Metric Display vs. Proactive Enforcement:** Current platforms report numbers (*"AQI is 342 - Very Poor"*) without identifying the emission source, predicting the downwind exposure corridor, or dispatching municipal assets.

**VAYU-SUTRA** breaks this paradigm by fusing **macro satellite feeds (Sentinel-5P via Google Earth Engine)**, **meso ground sensors (CPCB/OpenAQ)**, and **micro crowdsourced citizen telemetry** through **Google Gemini Flash Multimodal Forensics** and a **Physics-Constrained Gaussian Plume Dispersion Model**.

---

## 🏛️ System Architecture

```
+---------------------------------------------------------------------------------------------------------+
|                                         1. INGESTION LAYER                                              |
|                                                                                                         |
|   [Macro Satellite Feeds]             [Micro Terrestrial Feeds]           [Crowdsourced Citizen Telemetry]
|   - Google Earth Engine               - CPCB / OpenAQ APIs (Official)      - Geo-tagged Mobile Web App  |
|   - Sentinel-5P (NO2, SO2, CO, AOD)   - Low-Cost Modbus/MQTT IoT Arrays    - Progressive Web App (PWA)  |
|   - VIIRS / MODIS Thermal Fire Spots  - Open-Meteo / IMD Wind Vectors      - Compressed Multi-Angle JPEGs|
+---------------------------------------------------------------------------------------------------------+
                                                     │
                                                     ▼
+---------------------------------------------------------------------------------------------------------+
|                                    2. COMPUTATION & REASONING CORE                                      |
|                                                                                                         |
|   A. Multimodal Emission Forensic Agent (Gemini 1.5 / 2.5 Flash via Google AI Studio / Vertex AI)       |
|      - Strict JSON Structured Output Schema                                                             |
|      - Anti-spoofing verification (rejects indoor captures, screenshots)                                |
|      - 6-Class Source Diagnostic (Waste, Construction Dust, Industrial Stack, Biomass, Traffic, Road)   |
|      - Optical smoke opacity (0.0 to 1.0) & origin footprint estimation                                 |
|                                                                                                         |
|   B. Hybrid Spatiotemporal Dispersion Engine (FastAPI + Shapely + Open-Meteo)                           |
|      - Gaussian steady-state plume advection: C(x,y,z) = [Q / (2 * pi * u * sig_y * sig_z)] * [...]    |
|      - Real-time wind vector projection: (bearing = (wind_dir + 180°) mod 360°)                         |
|      - Downwind Polygon Intersection: Identifies vulnerable schools, hospitals, and informal wards      |
+---------------------------------------------------------------------------------------------------------+
                                                     │
                                                     ▼
+---------------------------------------------------------------------------------------------------------+
|                                        3. DUAL-DISPATCH LAYER                                           |
|                                                                                                         |
|   A. ULB / Administrative Command Desk (React + Vite)  | B. Hyper-Local Citizen Resilience Node         |
|   - Dynamic Google Maps Vector Overlay (Hotspot Mesh)  | - Web Audio Vernacular Broadcast               |
|   - Auto-generated Enforcement Incident Tickets        |   (English, Hindi, Telugu, Kannada, Tamil, ML) |
|   - Automated Mitigation Resource Routing              | - 1-Tap Geotagged Hazard Reporting             |
|     (Water tanker, smog gun, inspection patrol)        | - Low-Exposure Commute Safe Corridors          |
+---------------------------------------------------------------------------------------------------------+
```

---

## 👥 4-Member Professional Work Allocation

To ensure rapid, modular, and balanced execution during the hackathon, the system is split across four distinct engineering leads with defined interfaces:

| Member & Role | Core Domain & Ownership | Primary Deliverables | Detailed Plan |
| :--- | :--- | :--- | :--- |
| **Member 1: Frontend & UX Lead** | ULB Administrative Command Desk & Citizen PWA | React UI, Google Maps polygon vector rendering, Multi-city selector, Vernacular audio player | [Details](docs/TEAM_WORK_ALLOCATION.md#member-1-frontend--ux-lead-ulb-executive-command--citizen-pwa) |
| **Member 2: Backend & Systems Lead** | FastAPI REST Core, Ingestion Engine & Dispatch Queue | Data contracts, `/api/v1/incidents/audit`, ticket lifecycle, database models | [Details](docs/TEAM_WORK_ALLOCATION.md#member-2-backend--distributed-systems-lead-fastapi-core--ingestion-engine) |
| **Member 3: AI/ML & Vernacular Lead** | Gemini Multimodal Forensics & Multilingual Audio | Strict JSON schema prompts, anti-spoofing filter, 6-language translation & speech synthesis | [Details](docs/TEAM_WORK_ALLOCATION.md#member-3-aiml--vernacular-intelligence-lead-gemini-multimodal--speech-engine) |
| **Member 4: Geospatial & Cloud Lead** | Gaussian Plume Dispersion, Weather APIs & Cloud Run | Open-Meteo integration, Shapely spatial intersections, Docker containers, Cloud Run deploy | [Details](docs/TEAM_WORK_ALLOCATION.md#member-4-geospatial-physics--cloud-lead-gaussian-dispersion-weather--deployment) |

👉 Full breakdown, milestone schedule, and branch strategy: **[`docs/TEAM_WORK_ALLOCATION.md`](docs/TEAM_WORK_ALLOCATION.md)**

---

## 🌆 Multi-City Demonstration Regional Archetypes

VAYU-SUTRA comes pre-configured with 5 distinct regional archetypes across India:

1. **Delhi-NCR:** Municipal solid waste burning & seasonal inversion smog (MCD).
2. **Bengaluru (BBMP):** High-density tech corridor construction dust & transit resuspension.
3. **Kanpur (KMC):** Industrial stack emissions & tannery cluster pollutants.
4. **Mumbai (BMC):** Coastal inversion & transit canyon pollution.
5. **Punjab Agrarian Belt:** Seasonal biomass & post-harvest agricultural stubble burning.

---

## 🗣️ Vernacular Audio Resilience (6 Languages)

To protect non-literate and regional populations, emergency advisories are synthesized in real-time across:
* **English (en)**
* **Hindi (hi - हिंदी)**
* **Telugu (te - తెలుగు)**
* **Kannada (kn - ಕನ್ನಡ)**
* **Tamil (ta - தமிழ்)**
* **Malayalam (ml - മലയാളം)**

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
* **Python 3.11+** or **3.12**
* **Node.js v18+** & **npm**
* (Optional) **Docker** & **Docker Compose**

### 1. Clone & Configure Environment
```bash
git clone https://github.com/your-org/VayuGrid.git
cd VayuGrid

# Copy environment template
cp .env.example .env
```
Edit `.env` and insert your credentials:
```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. Run via Docker Compose (Recommended)
```bash
docker-compose up --build
```
* **Frontend:** `http://localhost:5173`
* **Backend API Docs:** `http://localhost:8000/docs`

### 3. Manual Local Setup

#### Backend (FastAPI):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Repository Tree

```
VayuGrid/
├── .env.example                 # Environment configuration template
├── .gitignore                   # Multi-tier ignore rules
├── docker-compose.yml           # Unified orchestration file
├── README.md                    # Main Project Documentation
│
├── docs/                        # Complete Hackathon Deliverables & Specifications
│   ├── ARCHITECTURE.md          # System architecture & Gaussian plume mathematics
│   ├── TEAM_WORK_ALLOCATION.md  # 4-Member professional split, milestones & git flow
│   ├── API_CONTRACTS.md         # Full REST endpoints & Pydantic JSON schemas
│   ├── PITCH_DECK.md            # 12-Slide hackathon presentation framework
│   └── DEMO_SCRIPT.md           # 4-Minute video demonstration script & narrative
│
├── backend/                     # Python 3.12 FastAPI Core
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py              # Application entrypoint
│       ├── api/                 # Endpoints & route handlers
│       ├── core/                # Config, prompts & security
│       ├── models/              # Pydantic schemas & data contracts
│       ├── services/            # Gemini AI, Dispersion & Weather services
│       └── data/                # Sensitive infrastructure GeoJSON datasets
│
├── frontend/                    # React 18 + Vite Web App
│   ├── Dockerfile
│   ├── package.json
│   └── src/                     # UI components, Google Maps wrapper & audio player
│
└── scripts/                     # Deployment and simulation scripts
```

---

## 🏆 Hackathon Compliance & Deliverables Checklist

* [x] **Public GitHub Repository:** Documented `README.md`, setup scripts, and modular source tree.
* [x] **4-Member Work Allocation:** Documented in [`docs/TEAM_WORK_ALLOCATION.md`](docs/TEAM_WORK_ALLOCATION.md).
* [x] **Architecture & Mathematical Specification:** Documented in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
* [x] **10-12 Slide Pitch Deck Framework:** Documented in [`docs/PITCH_DECK.md`](docs/PITCH_DECK.md).
* [x] **3-to-5 Minute Demo Video Script:** Documented in [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).
* [x] **Production API Contracts:** Documented in [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md).
* [x] **Google AI Utilization:** Gemini 1.5/2.5 Flash, Google Maps Platform, Google Earth Engine, Cloud TTS/Translation.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
