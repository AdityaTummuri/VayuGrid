# VayuGrid System Architecture & Mathematical Foundations

**Verifiable Air-Quality Yield & Unified Spatio-Temporal Resilience Architecture**  
*A Federated, Multi-Tier Planetary-to-Pavement Digital Public Good for Pan-India Air Pollution Governance*

---

## 1. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. INGESTION TIER                                      │
├───────────────────────────────┬───────────────────────────────┬────────────────────────┤
│ TIER-A: MACRO PLANETARY       │ TIER-B: MESO GROUND TRUTH     │ TIER-C: MICRO EDGE     │
│ - Sentinel-5P Level-3 (NO2/CO)│ - CPCB Official Stations      │ - Mobile Web App / PWA │
│ - Google Earth Engine Tiles   │ - OpenAQ Global Sensors       │ - Geotagged Photos     │
│ - VIIRS/MODIS Thermal Spots   │ - Low-cost PMS5003 IoT Arrays │ - Device Compass & GPS │
└───────────────────────────────┴───────────────────────────────┴────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        2. GOOGLE AI REASONING & FORENSICS                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • Gemini 1.5/2.5 Flash Multimodal Pipeline                                             │
│ • Anti-Spoofing & Environmental Validation Check                                       │
│ • 6-Class Emission Diagnostic (Waste / Dust / Industrial / Biomass / Traffic / Road)  │
│ • Optical Smoke Opacity Index (0.0 to 1.0) & Origin Radius Estimation                  │
│ • Statutory Municipal Intervention Protocol Synthesis                                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   3. PHYSICS DISPERSION & SPATIOTEMPORAL ENGINE                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • Real-Time Wind Vector Ingestion (Open-Meteo & IMD Telemetry: Speed, Bearing, PBL)    │
│ • Steady-State Gaussian Plume Advection Modeling                                       │
│ • Dynamic Exposure Cone Projection (±22.5° expansion over Downwind Vector)             │
│ • Shapely Spatial Intersection with Critical Receptors (Schools, Hospitals, Wards)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             4. DUAL-DISPATCH DELIVERY                                  │
├───────────────────────────────────────────────┬────────────────────────────────────────┤
│ URBAN LOCAL BODY (ULB) COMMAND DESK           │ CITIZEN RESILIENCE HYPER-LOCAL NODE    │
│ • Interactive Google Maps Vector Overlay      │ • 1-Tap Geotagged Incident Reporter    │
│ • Automated Enforcement Work-Order Generator  │ • 6-Language Vernacular Audio Alerts   │
│ • Asset Routing (Smog Guns, Water Sprinklers) │ • Low-Exposure Commute Safe Corridors  │
└───────────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 2. Mathematical Foundation: Gaussian Plume Dispersion Model

To avoid computationally prohibitive CFD (Computational Fluid Dynamics) simulations in real-time operational environments, VayuGrid employs an adapted **Gaussian Steady-State Plume Dispersion Formula**:

$$C(x, y, z) = \frac{Q}{2 \pi u \sigma_y \sigma_z} \exp\left( -\frac{y^2}{2 \sigma_y^2} \right) \left[ \exp\left( -\frac{(z - H)^2}{2 \sigma_z^2} \right) + \exp\left( -\frac{(z + H)^2}{2 \sigma_z^2} \right) \right]$$

### Parameter Definitions:
* $C(x, y, z)$: Downwind pollutant concentration at spatial coordinates $(x, y, z)$ ($mg/m^3$).
* $Q$: Effective source emission rate ($g/s$). In VayuGrid, this is derived empirically from the Gemini Forensic Model:
  $$Q = k_{source} \times \text{SeverityScore} \times \pi R_{origin}^2$$
  where $k_{source}$ is a class-specific emission density factor (e.g., Waste Burning $= 4.2$, Industrial Stack $= 8.5$).
* $u$: Wind speed at effective release height ($m/s$), ingested in real time from meteorological telemetry.
* $\sigma_y, \sigma_z$: Pasquill-Gifford dispersion coefficients representing lateral and vertical standard deviations of the plume concentration:
  $$\sigma_y = a \cdot x^b, \quad \sigma_z = c \cdot x^d$$
  where $a, b, c, d$ are empirical constants determined by atmospheric stability classes (Class A to F).
* $H$: Effective stack/release height ($m$). For ground-level open fires, $H \approx 1.5 - 3.0\,m$.
* $y$: Crosswind horizontal distance from the plume centerline ($m$).
* $z$: Receptor vertical height ($1.5\,m$, corresponding to the human inhalation zone).

---

## 3. Dynamic Exposure Cone Vector Generation

```
                     Plume Centerline Vector
                     Bearing = (WindDir + 180°) mod 360°
                         ────────────────────────►
                      ▲                           ▲
                     / \                         / \
                    /   \                       /   \
                   /     \                     /     \
                  /       \                   /       \
                 /  +22.5° \                 / -22.5°  \
    (Lat0, Lon0) ─────────── [ EXPOSURE CONE ] ────────── [ Maximum Reach D ]
    Source Incident                                       D = f(WindSpd, Severity)
```

1. **Centerline Direction:** Plume travels downwind:
   $$\theta_{travel} = (\theta_{wind} + 180^\circ) \pmod{360^\circ}$$
2. **Maximum Reach Distance ($D_{max}$):**
   $$D_{max} = \max\left(0.5, \left(u_{km/h} \times 0.25\right) \times \text{Severity} \times 2.0\right) \text{ km}$$
3. **Polygon Vertices:**
   * Origin $(Lat_0, Lon_0)$
   * Left Boundary: Point calculated along bearing $(\theta_{travel} - 22.5^\circ)$ at distance $D_{max}$
   * Center Far Point: Point calculated along bearing $\theta_{travel}$ at distance $D_{max}$
   * Right Boundary: Point calculated along bearing $(\theta_{travel} + 22.5^\circ)$ at distance $D_{max}$
4. **Spatial Intersection:** Evaluated against geo-indexed vulnerable assets using Great-Circle distance and `Shapely.Polygon.contains()` checks.

---

## 4. Google Technologies Integration Matrix

| Google Technology | Role in VayuGrid | Implementation Specifics |
| :--- | :--- | :--- |
| **Gemini 1.5/2.5 Flash** | Multimodal forensic image inspection & structuring | Uses `response_mime_type: "application/json"` with schema constraints to extract opacity, source classification, and ULB action orders. |
| **Google Maps JavaScript API** | Dynamic command center vector rendering | Custom vector overlays displaying real-time downwind polygons, hotspot circles, and receptor markers. |
| **Google Earth Engine (GEE)** | Macro atmospheric baseline mapping | Ingests Sentinel-5P Level-3 tropospheric $NO_2$, Carbon Monoxide ($CO$), and Aerosol Optical Depth ($AOD$). |
| **Google Cloud Translation & TTS** | Vernacular resilience pipeline | Translates dynamic English incident advisories into Hindi, Telugu, Kannada, Tamil, and Malayalam; synthesizes natural speech audio for mobile browsers. |
| **Google Cloud Run** | Scalable microservice container execution | Hosts containerized FastAPI backend and React frontend with sub-second cold starts and zero-capex scaling. |
