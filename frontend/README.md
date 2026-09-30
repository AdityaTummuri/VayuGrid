# VayuGrid Frontend (React + Vite)

This directory contains the user interface for **VayuGrid**, comprising the **Urban Local Body (ULB) Executive Command Desk** and the **Citizen Hyper-Local Resilience Node**.

## Tech Stack
* **Framework:** React 18 + Vite
* **Styling:** Vanilla CSS & Tailwind CSS tokens
* **Icons:** `lucide-react`
* **Maps:** Google Maps JavaScript API (`@vis.gl/react-google-maps`) / Vector Polygon Overlays
* **Audio:** HTML5 Audio API & Web Speech API

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Ensure `../.env` has:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_BACKEND_URL=http://localhost:8000
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173`.

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Development Guidelines
* Refer to [`../docs/TEAM_WORK_ALLOCATION.md`](../docs/TEAM_WORK_ALLOCATION.md) for Member 1 responsibilities.
* Refer to [`../docs/API_CONTRACTS.md`](../docs/API_CONTRACTS.md) for backend endpoints and JSON response schemas.
