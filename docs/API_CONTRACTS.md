# VayuGrid API & Data Contracts Specification

**Version:** 2.1.0  
**Base URL:** `http://localhost:8000/api/v1` (Local) / `https://<cloud-run-domain>/api/v1` (Production)

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Consumes | Produces |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/incidents/audit` | Audits an uploaded image with Gemini, calculates meteorological dispersion, and returns a verified dispatch ticket with both physical isopleths and legacy cone. | `multipart/form-data` | `application/json` |
| `GET` | `/incidents/active` | Retrieves all active and recently resolved incidents filtered by city or radius. | Query Params | `application/json` |
| `POST` | `/incidents/{ticket_id}/action` | Dispatches municipal mitigation assets (smog guns, sweepers, notices) for an incident. | `application/json` | `application/json` |
| `POST` | `/dispersion/simulate` | Executes dedicated atmospheric physics simulation returning analytical isopleths, puff milestone isochrones, and receptor intersections. | `application/json` | `application/json` |
| `GET` | `/dispersion/receptors` | Spatial lookup of geo-indexed sensitive infrastructure (schools, hospitals, informal settlements) within a radius. | Query Params | `application/json` |
| `GET` | `/telemetry/weather` | Fetches live boundary layer, wind vectors, and stability class for coordinates with regional fallback. | Query Params | `application/json` |
| `GET` | `/telemetry/cities` | Returns pre-configured flagship cities with their bounding boxes, terrain, and typical winter/summer PBL heights. | None | `application/json` |
| `POST` | `/vernacular/synthesize` | Generates translated advisory strings and audio links for 6 Indian languages. | `application/json` | `application/json` |

---

## 2. Core Endpoint Specifications

### 2.1 Incident Audit & Dispatch (`POST /api/v1/incidents/audit`)

#### Request Form Data (`multipart/form-data`)
```
image: File (Binary JPEG/PNG/WebP, max 10MB, optional for headless audit)
latitude: Float (e.g., 28.6139)
longitude: Float (e.g., 77.2090)
city_id: String (optional, e.g., "delhi_ncr", "bengaluru", "kanpur", "mumbai", "punjab")
reported_by: String (optional, default "FIELD_TELEMETRY")
compass_heading_deg: Float (optional, e.g., 185.0)
```

#### Successful Response (`200 OK`)
```json
{
  "ticket_id": "VAYU-DEL-2861-7720-A4F9",
  "status": "VERIFIED_HAZARD",
  "created_at": "2026-09-30T14:30:00Z",
  "coordinates": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address_hint": "Co-ordinates (28.6139, 77.2090)"
  },
  "verification": {
    "is_valid_environmental_hazard": true,
    "source_classification": "OPEN_MUNICIPAL_WASTE_BURNING",
    "severity_score": 0.85,
    "confidence_score": 0.94,
    "estimated_plume_spread_radius_meters": 2450,
    "detected_visual_markers": [
      "Dense toxic particulate plume (Open Municipal Waste Burning)",
      "Calculated effective emission rate: 45.2 g/s",
      "Briggs effective plume rise: 18.4m"
    ],
    "recommended_ulb_action": {
      "intervention_type": "Deploy Water Sprinkler Tanker and Smog Mist Canon",
      "target_department": "Municipal Solid Waste Enforcement / Urban Local Body",
      "priority_level": "CRITICAL"
    }
  },
  "meteorology": {
    "wind_speed_kmh": 14.5,
    "wind_direction_deg": 285.0,
    "temperature_c": 29.5,
    "humidity_pct": 56.0,
    "planetary_boundary_layer_height_m": 480.0,
    "stability_class": "C"
  },
  "downwind_exposure_cone": {
    "bearing_degrees": 105.0,
    "max_reach_km": 2.45,
    "angular_spread_deg": 38.2,
    "boundary_polygon": [
      {"lat": 28.6139, "lon": 77.2090},
      {"lat": 28.6085, "lon": 77.2280},
      {"lat": 28.6010, "lon": 77.2340},
      {"lat": 28.5940, "lon": 77.2260},
      {"lat": 28.6139, "lon": 77.2090}
    ]
  },
  "impacted_infrastructure": [
    {
      "id": "DEL-EDU-01",
      "name": "Government Senior Secondary School Ward 12",
      "category": "EDUCATION_FACILITY",
      "lat": 28.6185,
      "lon": 77.2280,
      "distance_meters": 1850.2,
      "downwind_distance_meters": 1820.0,
      "crosswind_offset_meters": 320.0,
      "estimated_arrival_minutes": 8,
      "modeled_concentration_ug_m3": 148.5,
      "hazard_level": "SEVERE",
      "vulnerable_population_estimate": 850
    }
  ],
  "physics_simulation": {
    "simulation_id": "SIM-774A2DF1",
    "timestamp": "2026-09-30T14:30:00Z",
    "plume_dynamics": {
      "physical_stack_height_m": 1.5,
      "buoyancy_flux_m4_s3": 32.4,
      "momentum_flux_m4_s2": 3.24,
      "plume_rise_delta_h_m": 18.4,
      "effective_release_height_m": 19.9,
      "effective_wind_speed_ms": 4.6,
      "stability_class": "C",
      "mixing_height_capping_m": 480.0,
      "inversion_reflection_active": true
    },
    "max_ground_concentration_ug_m3": 380.2,
    "distance_of_max_ground_concentration_m": 220.0,
    "downwind_reach_km": 2.45,
    "isopleth_contours": [
      {
        "tier": "HAZARDOUS",
        "threshold_ug_m3": 250.0,
        "area_sq_km": 0.45,
        "max_downwind_reach_km": 0.85,
        "max_lateral_width_m": 180.0,
        "boundary_polygon": [{"lat": 28.6139, "lon": 77.2090}]
      }
    ],
    "time_series_snapshots": [
      {
        "elapsed_minutes": 5,
        "leading_edge_distance_km": 1.25,
        "active_puffs_count": 5,
        "perimeter_polygon": [{"lat": 28.6139, "lon": 77.2090}]
      }
    ],
    "execution_time_ms": 11.45
  },
  "vernacular_advisories": {
    "en": "Dense toxic smoke detected nearby...",
    "hi": "आस-पास घना जहरीला धुआं देखा गया है..."
  }
}
```

---

### 2.2 Physical Dispersion Simulation (`POST /api/v1/dispersion/simulate`)

#### Request Body (`application/json`)
```json
{
  "origin_lat": 28.6139,
  "origin_lon": 77.2090,
  "source_type": "OPEN_MUNICIPAL_WASTE_BURNING",
  "severity_score": 0.85,
  "smoke_opacity": 0.90,
  "origin_radius_meters": 20.0,
  "physical_stack_height_m": 1.5,
  "source_temperature_k": 650.0,
  "simulation_duration_minutes": 60
}
```

#### Successful Response (`200 OK`)
Returns full `DispersionSimulationResult` object with `plume_dynamics`, `isopleth_contours`, `time_series_snapshots`, `puff_sample`, and `impacted_infrastructure`. Execution time guaranteed `< 25ms`.

---

### 2.3 Municipal Action Dispatch (`POST /api/v1/incidents/{ticket_id}/action`)

#### Request Body
```json
{
  "action_type": "DISPATCH_SMOG_GUN",
  "assigned_unit": "EAST_DELHI_SMOG_GUN_04",
  "operator_notes": "Dispatched water tanker with mist canon to Ghazipur perimeter.",
  "officer_badge_id": "MCD-ENF-8821"
}
```

#### Successful Response (`200 OK`)
```json
{
  "ticket_id": "VAYU-DEL-2861-7720-A4F9",
  "status": "DISPATCHED",
  "action_timestamp": "2026-09-30T14:32:00Z",
  "eta_minutes": 12,
  "confirmation_code": "DISP-89FA11"
}
```

---

### 2.4 Weather Telemetry (`GET /api/v1/telemetry/weather`)

#### Query Parameters
* `latitude` (Float, required)
* `longitude` (Float, required)
* `city_id` (String, optional)

#### Successful Response (`200 OK`)
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "wind_speed_kmh": 14.5,
  "wind_speed_ms": 4.03,
  "wind_direction_deg": 285.0,
  "downwind_bearing_deg": 105.0,
  "temperature_c": 29.5,
  "temperature_k": 302.65,
  "humidity_pct": 56.0,
  "planetary_boundary_layer_height_m": 480.0,
  "surface_pressure_hpa": 1011.0,
  "solar_radiation_w_m2": 450.0,
  "is_day": true,
  "stability_class": "C",
  "terrain": "URBAN",
  "friction_velocity_u_star_ms": 0.761,
  "source_attribution": "OPEN_METEO_LIVE"
}
```
