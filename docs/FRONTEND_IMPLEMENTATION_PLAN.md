# VayuGrid — Member 1: Frontend & UX Lead
## Complete Implementation Plan (React 18 + Vite + Tailwind CSS)

> **Role:** Frontend & UX Lead | **Branch:** `feature/m1-frontend-command-desk` | **Dir:** `frontend/`

---

## 1. Scope Analysis — What Member 1 Owns

### Pages & Personas

```
/ (Landing)          → Dual-persona hero + PersonaToggle cards
/admin               → ULB Executive Command Desk (Google Maps + Queue)
/report              → Citizen Photo Upload + Audit Result Display
/citizen             → Citizen Hazard View + Vernacular Audio Player
```

### API Endpoints Consumed

| Endpoint | Called By Component | Purpose |
|:---|:---|:---|
| `GET /api/v1/telemetry/cities` | `CitySelector` | Load 5 city options on init |
| `GET /api/v1/incidents/active?city_id=X` | `CommandMap`, `IncidentQueue` | Poll every 30s |
| `POST /api/v1/incidents/audit` | `CitizenReporterPage` | Submit photo for Gemini audit |
| `POST /api/v1/incidents/{id}/action` | `DispatchActionButton` | Dispatch municipal asset |
| `GET /api/v1/telemetry/weather?lat=X&lon=Y` | `WeatherPanel` | Live wind display |

---

## 2. Complete Directory Structure

```
frontend/src/
├── main.jsx                        # React DOM + BrowserRouter + AppProvider
├── App.jsx                         # Route declarations
│
├── context/
│   └── AppContext.jsx              # Global state: city, incidents, activeIncident, theme
│
├── hooks/
│   ├── useIncidents.js             # Polls /incidents/active every 30s
│   ├── useGeolocation.js           # navigator.geolocation wrapper with 3 states
│   ├── useWeather.js               # Fetches weather on city change
│   └── useAudioPlayer.js           # HTML5 Audio / Web Speech state machine
│
├── api/
│   └── vayugridApi.js              # All fetch calls + error handling + fallbacks
│
├── constants/
│   ├── cities.js                   # MOCK_CITIES (fallback if API down)
│   ├── classifications.js          # Source labels, colors, icons, language codes
│   └── mockData.js                 # MOCK_INCIDENT fixture for demo fallback
│
├── pages/
│   ├── LandingPage.jsx
│   ├── ULBCommandDeskPage.jsx
│   ├── CitizenReporterPage.jsx
│   └── CitizenViewPage.jsx
│
└── components/
    ├── layout/
    │   ├── TopBar.jsx
    │   └── PageShell.jsx
    ├── map/
    │   ├── CommandMap.jsx           # Google Maps + polling + cone + markers
    │   ├── CitizenMap.jsx           # Simplified hazard radius map
    │   ├── PlumeConeOverlay.jsx     # Renders boundary_polygon[] as Polygon
    │   ├── IncidentMarker.jsx       # Pulsing severity-colored pin
    │   └── InfrastructureMarker.jsx # School / hospital icon marker
    ├── incident/
    │   ├── IncidentQueue.jsx        # Sorted scrollable list
    │   ├── IncidentCard.jsx         # Full incident summary card
    │   ├── SeverityBadge.jsx        # CRITICAL / SEVERE / MODERATE pill
    │   ├── ClassificationTag.jsx    # Source type colored pill
    │   └── DispatchActionButton.jsx # Fires POST /incidents/{id}/action
    ├── reporter/
    │   ├── PhotoUploader.jsx        # Drag-drop + camera + file validation
    │   ├── GpsCapture.jsx           # geolocation + manual fallback
    │   ├── AuditResultCard.jsx      # Full forensic result display
    │   └── LoadingSkeleton.jsx      # Shimmer while awaiting API
    ├── audio/
    │   ├── VernacularAudioPlayer.jsx # 6-lang tabs + waveform + play/stop
    │   └── LanguageTab.jsx
    └── ui/
        ├── CitySelector.jsx
        ├── WeatherPanel.jsx
        ├── ThemeToggle.jsx
        ├── Toast.jsx
        ├── Spinner.jsx
        └── MetricCard.jsx
```

---

## 3. Professional Design System & Theme Architecture (Anti-AI Cliché / Enterprise Grade)

### 3.1 Design Philosophy: Mission-Critical Civic & Geospatial Infrastructure
To reflect the scale and seriousness of a Pan-India planetary-to-pavement air quality platform, VayuGrid rejects the "generic AI hackathon dashboard" tropes:
- ❌ **No neon purple/cyan glowing borders** (`box-shadow: 0 0 20px ...` / cyber-glows).
- ❌ **No blurry novelty gradient cards** or floating glass spheres that scream "AI-generated template".
- ❌ **No childish emoji badge clutter** where technical municipal precision is expected.
- ❌ **No generic SaaS pastel palettes** that disregard official environmental standards.

Instead, the UI adopts an **Authoritative Command & Control / GovTech Standard** inspired by **Palantir Foundry / Gotham, Copernicus Sentinel Browser, Datadog Enterprise, and India's Central Pollution Control Board (CPCB) Digital Public Infrastructure**:
- ✔️ **High Data Density & Spatial Rigor:** Clean 1px hairline dividers (`border-slate-800`), crisp panel docks, collapsible telemetry sidebars, tabular data alignments.
- ✔️ **Official CPCB Color Harmonies:** Strict adherence to India's National Air Quality Index (NAQI) statutory color tiers for environmental categories.
- ✔️ **Technical Typography:** Sans-serif UI (`Inter`) paired with monospaced tabular numerals (`JetBrains Mono` / `IBM Plex Mono`) for GPS coordinates, timestamps (IST/UTC), dispersion velocities, and ticket hashes.
- ✔️ **Scientific Cartography:** Vector map styling with minimal commercial POI clutter; Gaussian dispersion cones rendered as crisp GIS polygon geometries with technical opacity and boundary isopleths.
- ✔️ **Civic Public Good Header:** Official institutional cues (CPCB Ingestion Sync status, live telemetry heartbeat, sub-50ms latency badge, IST live clock, bilingual English/Hindi portal seal).

---

### 3.2 Color Palette Tokens (Enterprise Command Palette)

```css
:root {
  /* Slate / Obsidian Neutral Hierarchy */
  --bg-app:             #090D16;   /* Deep mission-control slate */
  --bg-panel:           #0F172A;   /* Structured panel background */
  --bg-surface:         #151F32;   /* Elevated cards, table rows */
  --bg-hover:           #1E293B;   /* Interactive hover fill */
  
  /* Borders & Hairlines */
  --border-subtle:      #1E293B;   /* Hairline container borders */
  --border-strong:      #334155;   /* Active boundaries & input outlines */
  --border-focus:       #38BDF8;   /* High-visibility active focus ring */

  /* Text & Contrast (WCAG AAA/AA Compliant) */
  --text-primary:       #F8FAFC;   /* Crisp white for headlines & values */
  --text-secondary:     #94A3B8;   /* Muted gray for labels & metadata */
  --text-tertiary:      #64748B;   /* De-emphasized timestamps & unit labels */
  --text-mono:          #E2E8F0;   /* High-legibility monospaced values */

  /* Institutional Accent (Federal / Municipal Slate Blue - Not Neon) */
  --civic-blue:         #2563EB;   /* Primary Gov action / telemetry link */
  --civic-blue-hover:   #1D4ED8;
  --civic-blue-subtle:  rgba(37, 99, 235, 0.12);

  /* Statutory CPCB National Air Quality Index (NAQI) Severity Tokens */
  --aqi-good:           #16A34A;   /* 0 - 50: Clean / Good */
  --aqi-satisfactory:   #65A30D;   /* 51 - 100: Satisfactory */
  --aqi-moderate:       #D97706;   /* 101 - 200: Moderate */
  --aqi-poor:           #EA580C;   /* 201 - 300: Poor */
  --aqi-very-poor:      #DC2626;   /* 301 - 400: Very Poor */
  --aqi-severe:         #7F1D1D;   /* 401 - 500: Severe / Emergency */

  /* Operational Status Indicators */
  --status-active:      #10B981;   /* Live stream operational */
  --status-pending:     #F59E0B;   /* Ingest buffer / awaiting dispatch */
  --status-alert:       #EF4444;   /* Breach threshold exceeded */
}
```

### 3.3 Typography & Font Setup
- **Headings & Primary Interface:** `Inter` (Weights: 400, 500, 600, 700)
- **Data, Coordinates, Timestamps, Hashes:** `JetBrains Mono` (Weights: 400, 500) with `tabular-nums font-mono`

In `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### 3.4 Statutory Classifications & Metadata

```javascript
// src/constants/classifications.js

export const CPCB_AQI_TIERS = {
  GOOD:         { label: 'Good',          range: '0-50',    color: '#16A34A', bg: 'rgba(22, 163, 74, 0.15)', text: '#4ADE80' },
  SATISFACTORY: { label: 'Satisfactory',  range: '51-100',  color: '#65A30D', bg: 'rgba(101, 163, 13, 0.15)', text: '#A3E635' },
  MODERATE:     { label: 'Moderate',      range: '101-200', color: '#D97706', bg: 'rgba(217, 119, 6, 0.15)', text: '#FBBF24' },
  POOR:         { label: 'Poor',          range: '201-300', color: '#EA580C', bg: 'rgba(234, 88, 12, 0.15)', text: '#FB923C' },
  VERY_POOR:    { label: 'Very Poor',     range: '301-400', color: '#DC2626', bg: 'rgba(220, 38, 38, 0.15)', text: '#F87171' },
  SEVERE:       { label: 'Severe',        range: '401-500', color: '#7F1D1D', bg: 'rgba(127, 29, 29, 0.25)', text: '#FCA5A5' },
};

export const SEVERITY_CONFIG = {
  CRITICAL:  { label: 'CRITICAL',  scoreThreshold: 0.8, color: '#DC2626', bg: 'rgba(220, 38, 38, 0.12)', border: '#EF4444' },
  SEVERE:    { label: 'SEVERE',    scoreThreshold: 0.5, color: '#EA580C', bg: 'rgba(234, 88, 12, 0.12)', border: '#F97316' },
  MODERATE:  { label: 'MODERATE',  scoreThreshold: 0.3, color: '#D97706', bg: 'rgba(217, 119, 6, 0.12)', border: '#F59E0B' },
  LOW:       { label: 'ADVISORY',  scoreThreshold: 0.0, color: '#16A34A', bg: 'rgba(22, 163, 74, 0.12)', border: '#22C55E' },
};

export const CLASSIFICATION_META = {
  OPEN_MUNICIPAL_WASTE_BURNING: {
    code: 'SRC-01',
    label: 'Open Municipal Waste Fire',
    category: 'Civic Solid Waste',
    color: '#EA580C',
    actionRequired: 'Rapid Smog Gun & Municipal Squad Intercept',
  },
  CONSTRUCTION_DEMOLITION_DUST: {
    code: 'SRC-02',
    label: 'C&D Fugitive Dust Plume',
    category: 'Urban Infrastructure',
    color: '#CA8A04',
    actionRequired: 'Automated Dust-Suppressant Mist Cannon',
  },
  INDUSTRIAL_STACK_EMISSION: {
    code: 'SRC-03',
    label: 'Point-Source Industrial Flare',
    category: 'Industrial Point',
    color: '#DC2626',
    actionRequired: 'Statutory Section 31A Show-Cause Order',
  },
  BIOMASS_STUBBLE_BURNING: {
    code: 'SRC-04',
    label: 'Agricultural Biomass Pyrolysis',
    category: 'Regional Biomass',
    color: '#B45309',
    actionRequired: 'Sub-divisional Flying Squad Deployment',
  },
  HIGH_DENSITY_VEHICULAR_IDLING: {
    code: 'SRC-05',
    label: 'Heavy Transit Corridor Idling',
    category: 'Mobile Vehicular',
    color: '#2563EB',
    actionRequired: 'Traffic Police ITS Route Divergence Advisory',
  },
  UNPAVED_ROAD_SUSPENSION: {
    code: 'SRC-06',
    label: 'Unpaved Arterial Road Resuspension',
    category: 'Roadways Infrastructure',
    color: '#64748B',
    actionRequired: 'Mechanical Road Sweeper Dispatch',
  },
};

export const LANGUAGE_META = [
  { code: 'en', label: 'English',   nativeName: 'English',  bcp47: 'en-IN' },
  { code: 'hi', label: 'Hindi',     nativeName: 'हिंदी',    bcp47: 'hi-IN' },
  { code: 'te', label: 'Telugu',    nativeName: 'తెలుగు',   bcp47: 'te-IN' },
  { code: 'kn', label: 'Kannada',   nativeName: 'ಕನ್ನಡ',   bcp47: 'kn-IN' },
  { code: 'ta', label: 'Tamil',     nativeName: 'தமிழ்',   bcp47: 'ta-IN' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം',  bcp47: 'ml-IN' },
];
```

---

## 4. Phase 1 — Foundation (Day 2 Tasks)

### Step 1.1 — Install react-router-dom
```bash
cd frontend && npm install react-router-dom@6
```

### Step 1.2 — Configure Tailwind CSS
**`frontend/tailwind.config.js`:**
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#090D16',       // Deep mission slate base
          panel: '#0F172A',    // Structured container/sidebar
          surface: '#151F32',  // Table row / card surface
          elevated: '#1E293B', // High-contrast popovers / headers
          hover: '#1E2A3E',    // Interactive state
        },
        border: {
          subtle: '#1E293B',
          strong: '#334155',
          active: '#38BDF8',
        },
        civic: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: 'rgba(37, 99, 235, 0.12)',
        },
        cpcb: {
          good: '#16A34A',
          satisfactory: '#65A30D',
          moderate: '#D97706',
          poor: '#EA580C',
          veryPoor: '#DC2626',
          severe: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
```

**`frontend/postcss.config.js`:**
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

### Step 1.3 — App Shell + Router
**`src/main.jsx`:** Wrap with `<BrowserRouter>` + `<AppProvider>`
**`src/App.jsx`:** Define routes for `/`, `/admin`, `/report`, `/citizen`

### Step 1.4 — AppContext
**`src/context/AppContext.jsx`:**
- State: `selectedCity`, `incidents[]`, `activeIncident`, `theme`
- Actions: `setSelectedCity`, `setIncidents`, `selectIncident`, `setTheme`

### Step 1.5 — API Layer
**`src/api/vayugridApi.js`:** Implement all 5 fetch functions with proper error handling.

### Step 1.6 — Mock Data
**`src/constants/mockData.js`:** Full MOCK_INCIDENT and MOCK_CITIES so app never crashes without backend.

### Day 2 Verification:
- [ ] All 4 routes load without crash
- [ ] Dark background visible on all pages
- [ ] AppContext state flows to nested components

---

## 5. Phase 2 — Core Components (Day 3 Tasks)

### Step 2.1 — LandingPage
- Full-viewport dark hero
- Animated gradient background
- Two persona cards: "ULB Command Desk" → `/admin`, "Citizen Alert" → `/citizen`
- Hover lift animation on cards

### Step 2.2 — TopBar (Shared)
- Left: VayuGrid logo + Sanskrit tagline
- Center: CitySelector dropdown
- Right: WeatherPanel strip + ThemeToggle

### Step 2.3 — CitySelector
- Styled glass dropdown with 5 cities
- Shows city name + archetype tag
- On select: update `AppContext.selectedCity`
- Fallback: MOCK_CITIES if API fails

### Step 2.4 — CommandMap ⭐ (Most Important)
Using `@vis.gl/react-google-maps`:
```jsx
<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
  <Map mapId="vayugrid-dark-map" defaultCenter={...} defaultZoom={12}>
    {incidents.map(inc => <IncidentMarker key={inc.ticket_id} incident={inc} />)}
    {activeIncident && <PlumeConeOverlay cone={activeIncident.downwind_exposure_cone} />}
    {activeIncident?.impacted_infrastructure.map(infra => (
      <InfrastructureMarker key={infra.id} infra={infra} />
    ))}
  </Map>
</APIProvider>
```

**PlumeConeOverlay:** Renders `boundary_polygon[]` as a `<Polygon>` with:
```js
{ fillColor: '#FF3B30', fillOpacity: 0.18, strokeColor: '#FF3B30', strokeWeight: 2 }
```

### Step 2.5 — IncidentQueue + IncidentCard
- IncidentQueue: sorted by severity, shows count badge
- IncidentCard shows:
  - Classification icon + label + SeverityBadge
  - `ticket_id`, `address_hint`
  - Severity score bar + confidence %
  - Wind + reach stats
  - Impacted infrastructure ETAs (🏫 School 11 min, 🏥 Clinic 15 min)
  - DispatchActionButton (SMOG_GUN + ISSUE_NOTICE)

### Step 2.6 — DispatchActionButton
States: `idle → loading → dispatched | error`
- Idle: Red button "🚒 Dispatch Smog Gun"
- Loading: Spinner inside button, disabled
- Dispatched: Green "✓ Dispatched (ETA 12 min)" — card border turns green
- Error: Toast notification, button reverts

### Step 2.7 — PhotoUploader
- Drag-drop zone + `<input type="file" accept="image/*" capture="environment">`
- Image preview thumbnail after selection
- Validation: jpeg/png/webp, max 10MB

### Step 2.8 — GpsCapture
Three states:
1. Acquiring: pulsing `📍 Acquiring location...`
2. Acquired: `📍 28.6139°N, 77.2090°E (±12m)`
3. Failed: Manual lat/lon input fields

### Step 2.9 — AuditResultCard
Shows full incident ticket from API:
- Verification status badge
- Classification + severity bar
- Recommended ULB action
- Detected visual markers list
- VernacularAudioPlayer embedded below

### Step 2.10 — LoadingSkeleton
- Shimmer animation matching AuditResultCard shape
- Visible while `POST /incidents/audit` is in-flight

### Step 2.11 — VernacularAudioPlayer
- 6 language tabs (EN / हि / తె / ಕ / த / മ)
- Advisory text in selected language
- Play button using Web Speech API:
```js
const utt = new SpeechSynthesisUtterance(text);
utt.lang = 'hi-IN'; // per selected language
window.speechSynthesis.speak(utt);
```
- Stop/Play/Replay controls
- Animated waveform bars while speaking

### Day 3 Verification:
- [ ] Map renders with dark theme, centered on selected city
- [ ] Cone polygon visible using mock incident data
- [ ] Infrastructure markers appear on map inside the cone
- [ ] Photo upload shows preview and GPS coordinates
- [ ] AuditResultCard shows all mock data fields
- [ ] Audio plays for at least English and Hindi

---

## 6. Phase 3 — Integration (Day 4 Tasks)

### Step 3.1 — Wire Citizen Upload Flow
```
Select Photo → GPS Acquired → Click Submit
  → isLoading = true → LoadingSkeleton
  → POST /api/v1/incidents/audit
  → SUCCESS: AuditResultCard + VernacularAudioPlayer
  → FAILURE: Toast("Audit failed: {msg}") + retry button
```

### Step 3.2 — Wire Admin Command Flow
```
Select City from CitySelector
  → fetchActiveIncidents(city.id)
  → setIncidents(data) || setIncidents([MOCK_INCIDENT])
  → CommandMap re-centers (smooth pan)
  → IncidentQueue populates
  → Click IncidentCard → selectIncident(inc)
  → PlumeConeOverlay renders on map
  → Click Dispatch → dispatchAction() → card status → DISPATCHED
```

### Step 3.3 — Incident Polling (useIncidents hook)
- Auto-refreshes every 30 seconds when on `/admin`
- Cleans up interval on page unmount

### Step 3.4 — Multi-City Demo Flow
- Delhi → Bengaluru → Kanpur switch must show different map center, different archetypes in TopBar
- Brief 200ms loading shimmer on map during transition

---

## 7. Phase 4 — Polish (Day 5 Tasks)

### Step 4.1 — Error Handling
- Toast system: success (green), error (red), warning (yellow)
- All API calls wrapped in try/catch with Toast on failure

### Step 4.2 — Loading States
- Every API call has a skeleton or spinner
- Never show empty/broken state — always fallback to mock data

### Step 4.3 — Responsive Layout
- Desktop: Map (60%) + Sidebar (40%) — flex row
- Mobile: Map full-screen + cards as bottom sheet

### Step 4.4 — Micro-Animations
- Incident cards: `animate-slide-up` on appear
- Map cone: draw-in animation on activation
- Dispatch button: spinner → checkmark transition
- SeverityBadge: pulse animation for CRITICAL incidents

### Step 4.5 — Final Build Verification
```bash
npm run build   # must exit code 0, zero errors
npm run lint    # must pass
```

---

## 8. Component Priority Matrix

| Component | Priority | Reason |
|:---|:---|:---|
| CommandMap + PlumeConeOverlay | P0 ⭐ | Central demo visual — judges must see it |
| CitizenReporterPage full flow | P0 ⭐ | Core hackathon feature — Gemini result display |
| VernacularAudioPlayer | P0 ⭐ | Differentiator — 6-language audio |
| IncidentCard + DispatchActionButton | P0 | Completes admin workflow |
| CitySelector (5 cities) | P0 | Multi-city scalability demo |
| LandingPage | P1 | First impression |
| WeatherPanel | P1 | Supports meteorology narrative |
| CitizenViewPage | P1 | Second citizen persona |
| ThemeToggle | P2 | Nice to have |

---

## 9. Key Integration Notes for Team Coordination

### From Member 2 (Backend):
- Need backend running on `localhost:8000` with CORS enabled by Day 3
- If backend not ready: all components work with `MOCK_INCIDENT` from `mockData.js`

### From Member 3 (AI/ML):
- `vernacular_advisories` JSON block in audit response feeds directly into `VernacularAudioPlayer`
- Audio synthesis is done client-side via Web Speech API — no extra API from Member 3 needed for basic demo

### From Member 4 (Physics):
- `downwind_exposure_cone.boundary_polygon[]` feeds directly into `PlumeConeOverlay`
- `impacted_infrastructure[]` feeds directly into `InfrastructureMarker` components

---

## 10. Acceptance Checklist

### Must-Pass Before Team Demo:
- [ ] `/admin` loads, shows map centered on selected city
- [ ] City dropdown switches between all 5 cities with map pan
- [ ] Incident cone polygon visible on map (with mock data if backend down)
- [ ] Impacted school/hospital markers visible inside cone
- [ ] IncidentCard shows all data fields + CRITICAL badge
- [ ] Dispatch button fires, flips to "Dispatched" green state
- [ ] `/report` accepts photo upload + GPS
- [ ] Forensic audit submits to backend, shows AuditResultCard
- [ ] LoadingSkeleton shown during audit wait
- [ ] VernacularAudioPlayer: all 6 language tabs visible + audio plays
- [ ] No white flicker, no JS console errors
- [ ] `npm run build` succeeds with exit code 0
