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

## 3. Design System Tokens

### Colors (CSS Custom Properties in `src/styles/index.css`)

```css
:root {
  --bg-base:        #0A0E1A;   /* Deep navy — main background */
  --bg-surface:     #111827;   /* Card surfaces */
  --bg-elevated:    #1C2333;   /* Modals, hover panels */
  --brand-primary:  #00C2FF;   /* Electric teal — VayuGrid brand */
  --brand-secondary:#7C3AED;   /* Purple — AI/Gemini accent */
  --severity-critical: #FF3B30;
  --severity-severe:   #FF9500;
  --severity-moderate: #FFD60A;
  --severity-low:      #34C759;
  --text-primary:   #F9FAFB;
  --text-secondary: #9CA3AF;
  --border-subtle:  rgba(255,255,255,0.06);
  --border-active:  rgba(0,194,255,0.3);
}
```

### Typography
- **Headings:** `Space Grotesk` (700) — from Google Fonts
- **UI / Body:** `Inter` (400, 500, 600) — from Google Fonts
- **Data / Coords:** `font-mono` (Tailwind)

Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

### Severity Helper (use everywhere severity is displayed)
```js
// src/constants/classifications.js
export function getSeverityLevel(score) {
  if (score >= 0.8) return 'CRITICAL';
  if (score >= 0.5) return 'SEVERE';
  if (score >= 0.3) return 'MODERATE';
  return 'LOW';
}

export const SEVERITY_COLORS = {
  CRITICAL:  { bg: '#FF3B30', text: '#fff' },
  SEVERE:    { bg: '#FF9500', text: '#fff' },
  MODERATE:  { bg: '#FFD60A', text: '#000' },
  LOW:       { bg: '#34C759', text: '#fff' },
};

export const CLASSIFICATION_META = {
  OPEN_MUNICIPAL_WASTE_BURNING:  { label: 'Municipal Waste Fire', color: '#FF6B35', icon: '🔥' },
  CONSTRUCTION_DEMOLITION_DUST:  { label: 'Construction Dust',    color: '#C4A35A', icon: '🏗️' },
  INDUSTRIAL_STACK_EMISSION:     { label: 'Industrial Stack',     color: '#FF3B30', icon: '🏭' },
  BIOMASS_STUBBLE_BURNING:       { label: 'Stubble Burning',      color: '#7ED321', icon: '🌾' },
  HIGH_DENSITY_VEHICULAR_IDLING: { label: 'Vehicle Idling',       color: '#4A9EFF', icon: '🚗' },
  UNPAVED_ROAD_SUSPENSION:       { label: 'Road Dust',            color: '#9B8EA0', icon: '🛣️' },
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
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { base: '#0A0E1A', surface: '#111827', elevated: '#1C2333' },
        brand: { primary: '#00C2FF', secondary: '#7C3AED' },
        severity: { critical: '#FF3B30', severe: '#FF9500', moderate: '#FFD60A', low: '#34C759' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
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
