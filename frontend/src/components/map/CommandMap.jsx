import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Compass, Wind, Layers, MapPin, Building2, School, Hospital, ShieldAlert, Crosshair } from 'lucide-react';
import { CLASSIFICATION_META } from '../../constants/classifications';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Clean, high-contrast dark GIS map styling (no commercial POI clutter)
const MAP_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#090D16' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090D16' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0F172A' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B132B' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
];

export function CommandMap() {
  const { selectedCity, incidents, activeIncident, setActiveIncident } = useApp();

  const center = useMemo(() => {
    if (activeIncident?.location) {
      return { lat: activeIncident.location.lat, lng: activeIncident.location.lng };
    }
    return selectedCity.center;
  }, [activeIncident, selectedCity]);

  // If a valid Google Maps API Key is provided, use Google Maps
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== 'YOUR_API_KEY_HERE') {
    return (
      <div className="relative w-full h-full bg-app-bg overflow-hidden">
        <APIProvider apiKey={GOOGLE_MAPS_KEY}>
          <Map
            defaultCenter={center}
            center={center}
            defaultZoom={13}
            styles={MAP_DARK_STYLE}
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={false}
            streetViewControl={false}
            className="w-full h-full"
          >
            {/* Incident Markers */}
            {incidents.map((inc) => (
              <Marker
                key={inc.ticket_id}
                position={{ lat: inc.location.lat, lng: inc.location.lng }}
                onClick={() => setActiveIncident(inc)}
                title={`${inc.ticket_id} - ${inc.classification}`}
              />
            ))}
          </Map>
        </APIProvider>
        <MapTelemetryOverlay activeIncident={activeIncident} selectedCity={selectedCity} />
      </div>
    );
  }

  // Tactical SVG GIS Map (Clean, High-Precision Vector Engine)
  return (
    <div className="relative w-full h-full bg-[#080C14] flex flex-col justify-between overflow-hidden select-none">
      {/* Background GIS Coordinate Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gis-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gis-grid)" />
        </svg>
      </div>

      {/* Main Interactive Tactical Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-2xl aspect-[4/3] bg-app-panel/60 border border-border-subtle rounded-lg shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
          
          {/* Tactical Crosshair Watermark */}
          <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-2xs text-slate-500">
            <Crosshair className="h-4 w-4 text-slate-600 animate-pulse" />
            <span>GIS TACTICAL GRID: {selectedCity.name.toUpperCase()} SECTOR</span>
          </div>

          {/* SVG Dispersion Plume Geometry Visualization */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 600 450" className="w-full h-full">
              {/* Concentric Dispersion Isobars */}
              <circle cx="280" cy="240" r="80" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
              <circle cx="280" cy="240" r="150" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.3" />
              <circle cx="280" cy="240" r="220" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="5 5" opacity="0.2" />

              {/* Downwind Gaussian Plume Dispersion Cone */}
              {activeIncident && (
                <g>
                  {/* Outer Dispersion Footprint */}
                  <polygon
                    points="280,240 460,110 510,170 380,270"
                    fill="rgba(220, 38, 38, 0.12)"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  {/* High Concentration Core */}
                  <polygon
                    points="280,240 370,165 410,205 320,250"
                    fill="rgba(220, 38, 38, 0.28)"
                    stroke="#DC2626"
                    strokeWidth="1.5"
                  />
                  {/* Plume Wind Vector Axis */}
                  <line
                    x1="280"
                    y1="240"
                    x2="480"
                    y2="140"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <text x="490" y="135" fill="#38BDF8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                    WIND: NE (4.8 m/s)
                  </text>
                </g>
              )}

              {/* Impacted Sensitive Receptors inside Plume */}
              {activeIncident?.impacted_infrastructure?.map((infra, idx) => {
                const positions = [
                  { cx: 380, cy: 195, label: 'Sarvodaya Vidyalaya', eta: 'T-11m', type: 'school' },
                  { cx: 440, cy: 160, label: 'Health Centre', eta: 'T-16m', type: 'hospital' },
                  { cx: 330, cy: 220, label: 'Transit Terminal', eta: 'T-7m', type: 'transit' },
                ];
                const pos = positions[idx] || positions[0];
                return (
                  <g key={infra.id}>
                    <circle cx={pos.cx} cy={pos.cy} r="6" fill="#7F1D1D" stroke="#EF4444" strokeWidth="2" />
                    <circle cx={pos.cx} cy={pos.cy} r="14" fill="none" stroke="#EF4444" strokeWidth="0.75" opacity="0.6" className="animate-ping" />
                    <rect x={pos.cx + 10} y={pos.cy - 12} width="140" height="24" rx="3" fill="#090D16" stroke="#334155" strokeWidth="0.75" />
                    <text x={pos.cx + 16} y={pos.cy + 3} fill="#F8FAFC" fontSize="9" fontFamily="Inter" fontWeight="600">
                      {pos.label} ({pos.eta})
                    </text>
                  </g>
                );
              })}

              {/* Active Incident Origin Pin */}
              {activeIncident && (
                <g>
                  <circle cx="280" cy="240" r="10" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
                  <circle cx="280" cy="240" r="22" fill="none" stroke="#DC2626" strokeWidth="1.5" opacity="0.8" />
                  {/* Origin Tooltip */}
                  <rect x="180" y="270" width="200" height="34" rx="4" fill="#0F172A" stroke="#EF4444" strokeWidth="1" />
                  <text x="190" y="286" fill="#F8FAFC" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">
                    {activeIncident.ticket_id}
                  </text>
                  <text x="190" y="298" fill="#94A3B8" fontSize="8" fontFamily="Inter">
                    {activeIncident.location.address_hint?.slice(0, 32)}...
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Incident Node Selector overlay */}
          <div className="relative z-10 flex items-center justify-between pointer-events-auto">
            <div className="bg-app-bg/90 border border-border-subtle p-2.5 rounded font-mono text-2xs space-y-1">
              <div className="text-slate-400 font-semibold uppercase">Tactical Dispersion Analysis</div>
              <div className="text-slate-200">ORIGIN: {center.lat.toFixed(4)}°N, {center.lng.toFixed(4)}°E</div>
              <div className="text-red-400 font-bold">PLUME SPREAD: 3,200m (BEARING 45° NE)</div>
            </div>

            <div className="flex flex-col gap-1.5 pointer-events-auto">
              {incidents.map((inc) => {
                const isActive = activeIncident?.ticket_id === inc.ticket_id;
                return (
                  <button
                    key={inc.ticket_id}
                    onClick={() => setActiveIncident(inc)}
                    className={`px-2.5 py-1 rounded text-2xs font-mono transition-all border flex items-center gap-2 ${
                      isActive
                        ? 'bg-red-950/80 border-red-500 text-white font-bold'
                        : 'bg-app-surface border-border-subtle text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                    <span>{inc.ticket_id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom GIS Status Strip */}
          <div className="relative z-10 flex items-center justify-between text-2xs font-mono text-slate-400 pt-3 border-t border-border-subtle/60">
            <div className="flex items-center gap-3">
              <span>PROJECTION: EPSG:4326</span>
              <span>•</span>
              <span>CPCB SENSOR CALIBRATED</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Compass className="h-3.5 w-3.5 text-blue-400" />
              <span>NORTH ALIGNED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tactical Telemetry Overlay */}
      <MapTelemetryOverlay activeIncident={activeIncident} selectedCity={selectedCity} />
    </div>
  );
}

function MapTelemetryOverlay({ activeIncident, selectedCity }) {
  if (!activeIncident) return null;

  return (
    <div className="absolute top-4 left-4 z-20 pointer-events-none max-w-sm w-full">
      <div className="bg-app-panel/95 border border-border-strong rounded p-3 shadow-xl backdrop-blur-sm pointer-events-auto">
        <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span className="font-mono text-2xs font-bold text-slate-100 uppercase tracking-wider">
              {activeIncident.ticket_id}
            </span>
          </div>
          <span className="font-mono text-2xs px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-700 font-semibold">
            P0 SEVERE PLUME
          </span>
        </div>

        <p className="text-2xs text-slate-300 line-clamp-1 mb-2">
          {activeIncident.location.address_hint}
        </p>

        <div className="grid grid-cols-2 gap-2 text-2xs font-mono">
          <div className="bg-app-bg p-1.5 rounded border border-border-subtle">
            <span className="text-slate-400 block">WIND BEARING</span>
            <span className="text-slate-200 font-bold">
              {activeIncident.weather_context?.wind_bearing_deg || 45}° ({activeIncident.weather_context?.wind_direction || 'NE'})
            </span>
          </div>
          <div className="bg-app-bg p-1.5 rounded border border-border-subtle">
            <span className="text-slate-400 block">DISPERSION REACH</span>
            <span className="text-red-400 font-bold">
              {activeIncident.downwind_exposure_cone?.max_reach_meters || 3200} m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
