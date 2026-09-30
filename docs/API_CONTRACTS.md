# VAYU-SUTRA API & Data Contracts Specification

**Version:** 2.0.0  
**Base URL:** `http://localhost:8000/api/v1` (Local) / `https://<cloud-run-domain>/api/v1` (Production)

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Consumes | Produces |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/incidents/audit` | Audits an uploaded image with Gemini, calculates meteorological dispersion, and returns a verified dispatch ticket. | `multipart/form-data` | `application/json` |
| `GET` | `/incidents/active` | Retrieves all active and recently resolved incidents filtered by city or radius. | Query Params | `application/json` |
| `POST` | `/incidents/{ticket_id}/action` | Dispatches municipal mitigation assets (smog guns, sweepers, notices) for an incident. | `application/json` | `application/json` |
| `GET` | `/telemetry/weather` | Fetches live meteorological vectors (wind speed, direction, temperature, humidity) for given coordinates. | Query Params | `application/json` |
| `GET` | `/telemetry/cities` | Returns pre-configured flagship cities with their bounding boxes and default center coordinates. | None | `application/json` |
| `POST` | `/vernacular/synthesize` | Generates translated advisory strings and audio links for 6 Indian languages. | `application/json` | `application/json` |

---

## 2. Core Endpoint Specifications

### 2.1 Incident Audit & Dispatch (`POST /api/v1/incidents/audit`)

#### Request Form Data (`multipart/form-data`)
```
image: File (Binary JPEG/PNG/WebP, max 10MB)
latitude: Float (e.g., 28.6139)
longitude: Float (e.g., 77.2090)
city_id: String (optional, e.g., "delhi_ncr", "bengaluru", "kanpur", "mumbai", "punjab")
reported_by: String (optional, e.g., "CITIZEN_MOBILE_APP", "FIELD_WARDEN_PATROL")
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
    "address_hint": "Near Ghazipur Landfill Border, East Delhi"
  },
  "verification": {
    "is_valid_environmental_hazard": true,
    "source_classification": "OPEN_MUNICIPAL_WASTE_BURNING",
    "severity_score": 0.88,
    "confidence_score": 0.94,
    "estimated_plume_spread_radius_meters": 450,
    "detected_visual_markers": [
      "Dense black toxic smoke",
      "Combustion of mixed plastics and municipal refuse",
      "Uncontrolled open flame adjacent to transit corridor"
    ],
    "recommended_ulb_action": {
      "intervention_type": "Deploy Water Sprinkler Tanker and Issue Bylaw Fine",
      "target_department": "Municipal Solid Waste Enforcement / East Delhi Municipal Corp",
      "priority_level": "CRITICAL"
    }
  },
  "meteorology": {
    "wind_speed_kmh": 14.2,
    "wind_direction_deg": 285.0,
    "temperature_c": 31.5,
    "humidity_pct": 58.0,
    "planetary_boundary_layer_height_m": 850.0
  },
  "downwind_exposure_cone": {
    "bearing_degrees": 105.0,
    "max_reach_km": 2.45,
    "angular_spread_deg": 45.0,
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
      "id": "INFRA-01",
      "name": "Government Senior Secondary School Ward 12",
      "category": "EDUCATION_FACILITY",
      "lat": 28.6045,
      "lon": 77.2295,
      "distance_meters": 1620,
      "estimated_arrival_minutes": 11,
      "vulnerable_population_estimate": 850
    },
    {
      "id": "INFRA-02",
      "name": "Sanjay Community Healthcare Center",
      "category": "HEALTHCARE_FACILITY",
      "lat": 28.6012,
      "lon": 77.2320,
      "distance_meters": 2210,
      "estimated_arrival_minutes": 15,
      "vulnerable_population_estimate": 320
    }
  ],
  "vernacular_advisories": {
    "en": "Dense toxic smoke detected nearby. Vulnerable groups, elderly, and schools downwind should close windows and avoid outdoor exposure for the next 2 hours.",
    "hi": "आस-पास घना जहरीला धुआं देखा गया है। हवा के बहाव वाले क्षेत्र के स्कूलों और बुजुर्गों से अनुरोध है कि वे खिड़कियां बंद रखें और अगले 2 घंटे बाहर न निकलें।",
    "te": "సమీపంలో దట్టమైన విషపూరిత పొగ కనిపించింది. గాలి ప్రవాహ దిశలోని పాఠశాలలు మరియు వృద్ధులు కిటికీలు మూసివేసి, వచ్చే 2 గంటల పాటు బయటకు రాకుండా ఉండాలి.",
    "kn": "ಹತ್ತಿರದಲ್ಲಿ ದಟ್ಟವಾದ ವಿಷಕಾರಿ ಹೊಗೆ ಪತ್ತೆಯಾಗಿದೆ. ಗಾಳಿಯ ದಿಕ್ಕಿನಲ್ಲಿರುವ ಶಾಲೆಗಳು ಮತ್ತು ಹಿರಿಯ ನಾಗರಿಕರು ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಿ ಮುಂದಿನ 2 ಗಂಟೆಗಳ ಕಾಲ ಹೊರಗೆ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿ.",
    "ta": "அருகில் கடுமையான நச்சுப் புகை கண்டறியப்பட்டுள்ளது. காற்றின் திசையிலுள்ள பள்ளிகள் மற்றும் முதியவர்கள் ஜன்னல்களை மூடி, அடுத்த 2 மணிநேரத்திற்கு வெளியில் செல்வதைத் தவிர்க்கவும்.",
    "ml": "സമീപത്ത് കനത്ത വിഷപ്പുക കണ്ടെത്തി. കാറ്റിന്റെ ദിശയിലുള്ള സ്കൂളുകളും മുതിർന്നവരും ജനലുകൾ അടയ്ക്കുകയും അടുത്ത 2 മണിക്കൂർ പുറത്തിറങ്ങുന്നത് ഒഴിവാക്കുകയും വേണം."
  }
}
```

#### Rejection Response (`422 Unprocessable Entity`)
```json
{
  "status": "REJECTED",
  "reason": "ANTI_SPOOFING_FAILURE",
  "detail": "Image does not depict an outdoor environmental hazard (indoor photo or screen capture detected)."
}
```

---

### 2.2 Municipal Action Dispatch (`POST /api/v1/incidents/{ticket_id}/action`)

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
  "action_timestamp": "2026-09-30T14:38:00Z",
  "eta_minutes": 12,
  "confirmation_code": "DISP-MCD-9823"
}
```

---

### 2.3 City Metadata Reference (`GET /api/v1/telemetry/cities`)

#### Response Body
```json
[
  {
    "id": "delhi_ncr",
    "name": "Delhi-NCR",
    "center": {"lat": 28.6139, "lon": 77.2090},
    "default_zoom": 12,
    "archetype": "High Density Urban & Municipal Solid Waste",
    "ulb_authority": "Municipal Corporation of Delhi (MCD)"
  },
  {
    "id": "bengaluru",
    "name": "Bengaluru",
    "center": {"lat": 12.9716, "lon": 77.5946},
    "default_zoom": 12,
    "archetype": "Construction Corridor & Transit Resuspension",
    "ulb_authority": "Bruhat Bengaluru Mahanagara Palike (BBMP)"
  },
  {
    "id": "kanpur",
    "name": "Kanpur",
    "center": {"lat": 26.4499, "lon": 80.3319},
    "default_zoom": 12,
    "archetype": "Tannery & Industrial Stack Emission Corridor",
    "ulb_authority": "Kanpur Municipal Corporation (KMC)"
  },
  {
    "id": "mumbai",
    "name": "Mumbai Metropolitan",
    "center": {"lat": 19.0760, "lon": 72.8777},
    "default_zoom": 12,
    "archetype": "Coastal Inversion & High-Rise Construction Dust",
    "ulb_authority": "Brihanmumbai Municipal Corporation (BMC)"
  },
  {
    "id": "punjab",
    "name": "Punjab Agrarian Belt (Ludhiana-Sangrur)",
    "center": {"lat": 30.9010, "lon": 75.8573},
    "default_zoom": 11,
    "archetype": "Seasonal Biomass & Agricultural Stubble Burning",
    "ulb_authority": "Punjab Pollution Control Board (PPCB)"
  }
]
```
