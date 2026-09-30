import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { 
  Wind, ShieldAlert, School, Hospital, Train, Building2, 
  Layers, Compass, Eye, AlertTriangle, CheckCircle, Navigation 
} from 'lucide-react';
import { CLASSIFICATION_META } from '../../constants/classifications';

// Custom Leaflet DivIcon factory for incident epicenters
function createIncidentIcon(severity, isSelected) {
  const isCritical = severity >= 0.8;
  const isHigh = severity >= 0.6 && severity < 0.8;
  
  const ringColor = isCritical ? 'border-red-500 bg-red-500/20' : isHigh ? 'border-amber-500 bg-amber-500/20' : 'border-sky-500 bg-sky-500/20';
  const coreColor = isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-500' : 'bg-sky-400';
  const pulseClass = isSelected ? 'ring-4 ring-white/70 scale-125' : isCritical ? 'animate-pulse' : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-200 ${pulseClass}">
        <div class="absolute inset-0 rounded-full border-2 ${ringColor} animate-ping-slow"></div>
        <div class="w-4 h-4 rounded-full ${coreColor} shadow-lg border-2 border-slate-900 flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Custom Leaflet DivIcon factory for sensitive infrastructure receptors
function createReceptorIcon(type) {
  let symbol = '🏛️';
  let bgColor = 'bg-slate-800 border-slate-600';
  
  if (type === 'SCHOOL' || type === 'EDUCATION_FACILITY') {
    symbol = '🏫';
    bgColor = 'bg-amber-950/80 border-amber-600/80 text-amber-300';
  } else if (type === 'HOSPITAL' || type === 'HEALTHCARE') {
    symbol = '🏥';
    bgColor = 'bg-rose-950/80 border-rose-600/80 text-rose-300';
  } else if (type === 'TRANSIT') {
    symbol = '🚇';
    bgColor = 'bg-blue-950/80 border-blue-600/80 text-blue-300';
  }

  return L.divIcon({
    className: 'custom-receptor-marker',
    html: `
      <div class="w-6 h-6 rounded-md border flex items-center justify-center text-xs shadow-md ${bgColor}">
        <span>${symbol}</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

export function LeafletCommandMap() {
  const { selectedCity, incidents, activeIncident, setActiveIncident, weather } = useApp();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const incidentLayerRef = useRef(null);
  const plumeLayerRef = useRef(null);
  const receptorLayerRef = useRef(null);
  const isobarLayerRef = useRef(null);

  // Layer Visibility Toggles
  const [showPlume, setShowPlume] = useState(true);
  const [showReceptors, setShowReceptors] = useState(true);
  const [showIsobars, setShowIsobars] = useState(true);

  // Compute map center
  const targetCenter = useMemo(() => {
    if (activeIncident?.location?.lat && activeIncident?.location?.lng) {
      return { lat: activeIncident.location.lat, lng: activeIncident.location.lng };
    }
    return selectedCity?.center || { lat: 28.6139, lng: 77.2090 };
  }, [activeIncident, selectedCity]);

  // Downwind direction and wind speed display
  const windBearing = activeIncident?.weather_context?.wind_bearing_deg ?? weather?.wind_direction_deg ?? 45;
  const windSpeed = activeIncident?.weather_context?.wind_speed_mps ?? weather?.wind_speed_mps ?? 4.8;
  const windDirName = activeIncident?.weather_context?.wind_direction ?? weather?.wind_direction ?? 'NE';

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [targetCenter.lat, targetCenter.lng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    // CartoDB Dark Matter Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    }).addTo(map);

    // Initialize feature layer groups
    plumeLayerRef.current = L.layerGroup().addTo(map);
    isobarLayerRef.current = L.layerGroup().addTo(map);
    receptorLayerRef.current = L.layerGroup().addTo(map);
    incidentLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Smoothly reposition & fly to active center
  useEffect(() => {
    if (!mapInstanceRef.current || !targetCenter.lat || !targetCenter.lng) return;
    mapInstanceRef.current.flyTo(
      [targetCenter.lat, targetCenter.lng],
      activeIncident ? 14 : 12,
      { duration: 1.2, easeLinearity: 0.25 }
    );
  }, [targetCenter, activeIncident]);

  // 3. Render Incident Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !incidentLayerRef.current) return;
    incidentLayerRef.current.clearLayers();

    incidents.forEach((incident) => {
      const isSelected = activeIncident?.ticket_id === incident.ticket_id;
      const pos = [incident.location.lat, incident.location.lng];
      const meta = CLASSIFICATION_META[incident.classification] || {
        label: incident.classification,
        color: '#94A3B8',
      };

      const marker = L.marker(pos, {
        icon: createIncidentIcon(incident.severity_score, isSelected),
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on('click', () => {
        setActiveIncident(incident);
      });

      const popupContent = `
        <div class="p-3 bg-slate-900 border border-slate-700 rounded text-slate-100 min-w-[240px]">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span class="font-mono text-2xs font-bold text-sky-400">${incident.ticket_id}</span>
            <span class="text-2xs font-semibold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/50">
              SEV ${(incident.severity_score * 100).toFixed(0)}%
            </span>
          </div>
          <div class="mt-2 text-xs font-bold text-white">${meta.label}</div>
          <p class="mt-1 text-2xs text-slate-400 leading-snug">${incident.location.address_hint}</p>
          <div class="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-2xs font-mono text-slate-400">
            <span>CONF: ${(incident.confidence * 100).toFixed(0)}%</span>
            <span class="text-amber-400 font-semibold">${incident.status}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      incidentLayerRef.current.addLayer(marker);
    });
  }, [incidents, activeIncident, setActiveIncident]);

  // 4. Render Plume Polygon
  useEffect(() => {
    if (!mapInstanceRef.current || !plumeLayerRef.current) return;
    plumeLayerRef.current.clearLayers();

    if (!showPlume || !activeIncident?.downwind_exposure_cone?.boundary_polygon) return;

    const coords = activeIncident.downwind_exposure_cone.boundary_polygon.map((p) => [
      p.lat !== undefined ? p.lat : p[0],
      p.lng !== undefined ? p.lng : p.lon !== undefined ? p.lon : p[1],
    ]);

    const polygon = L.polygon(coords, {
      color: '#EF4444',
      weight: 2,
      opacity: 0.85,
      fillColor: '#EF4444',
      fillOpacity: 0.22,
      dashArray: '6, 6',
    });

    plumeLayerRef.current.addLayer(polygon);
  }, [activeIncident, showPlume]);

  // 5. Render Isobars
  useEffect(() => {
    if (!mapInstanceRef.current || !isobarLayerRef.current) return;
    isobarLayerRef.current.clearLayers();

    if (!showIsobars || !activeIncident?.location) return;

    const center = [activeIncident.location.lat, activeIncident.location.lng];

    const circle1 = L.circle(center, {
      radius: 800,
      color: '#EF4444',
      weight: 1,
      opacity: 0.45,
      fillColor: '#EF4444',
      fillOpacity: 0.08,
      dashArray: '4, 4',
    });

    const circle2 = L.circle(center, {
      radius: 1800,
      color: '#F59E0B',
      weight: 1,
      opacity: 0.35,
      fillColor: '#F59E0B',
      fillOpacity: 0.04,
      dashArray: '5, 5',
    });

    const circle3 = L.circle(center, {
      radius: 3000,
      color: '#38BDF8',
      weight: 1,
      opacity: 0.25,
      fillColor: '#38BDF8',
      fillOpacity: 0.02,
      dashArray: '6, 6',
    });

    isobarLayerRef.current.addLayer(circle1);
    isobarLayerRef.current.addLayer(circle2);
    isobarLayerRef.current.addLayer(circle3);
  }, [activeIncident, showIsobars]);

  // 6. Render Sensitive Infrastructure Receptors
  useEffect(() => {
    if (!mapInstanceRef.current || !receptorLayerRef.current) return;
    receptorLayerRef.current.clearLayers();

    if (!showReceptors || !activeIncident?.impacted_infrastructure) return;

    activeIncident.impacted_infrastructure.forEach((infra) => {
      const pos = [infra.lat, infra.lng || infra.lon];
      const marker = L.marker(pos, {
        icon: createReceptorIcon(infra.type || infra.category),
      });

      const popupContent = `
        <div class="p-2.5 bg-slate-900 border border-slate-700 rounded text-slate-100 min-w-[200px]">
          <div class="font-bold text-xs text-amber-300">${infra.name}</div>
          <div class="mt-1 text-2xs font-mono text-slate-400 flex items-center justify-between">
            <span>DIST: ${infra.distance_meters}m</span>
            <span class="text-red-400 font-bold">ETA: ${infra.eta_minutes || infra.estimated_arrival_minutes}m</span>
          </div>
          ${infra.alert_status ? `<div class="mt-1.5 text-2xs text-red-300 font-semibold bg-red-950/60 px-1 py-0.5 rounded">STATUS: ${infra.alert_status}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      receptorLayerRef.current.addLayer(marker);
    });
  }, [activeIncident, showReceptors]);

  return (
    <div className="relative w-full h-full bg-[#090D16] select-none overflow-hidden flex flex-col">
      {/* Native Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating HUD: Real-time GIS Telemetry & Layer Controls */}
      <div className="absolute top-3 left-3 right-3 pointer-events-none flex items-start justify-between z-[400]">
        {/* Active Coordinate & Sector Chip */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 rounded px-3 py-2 text-xs font-mono shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-2xs">GIS LIVE</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300 text-2xs">
            <span className="text-slate-500 mr-1">SECTOR:</span>
            <span className="font-bold text-white">{selectedCity.name.toUpperCase()}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-400 text-2xs hidden sm:flex items-center gap-1 font-tabular">
            <span>{targetCenter.lat.toFixed(4)}°N</span>
            <span>,</span>
            <span>{targetCenter.lng.toFixed(4)}°E</span>
          </div>
        </div>

        {/* Tactical Layer Visibility Toggles */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 rounded p-1 shadow-xl flex items-center gap-1 text-2xs font-mono">
          <button
            onClick={() => setShowPlume(!showPlume)}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              showPlume ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Gaussian Plume Cone"
          >
            <ShieldAlert className="w-3 h-3" />
            <span className="hidden md:inline">PLUME</span>
          </button>

          <button
            onClick={() => setShowReceptors(!showReceptors)}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              showReceptors ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Receptors (Schools, Hospitals)"
          >
            <School className="w-3 h-3" />
            <span className="hidden md:inline">RECEPTORS</span>
          </button>

          <button
            onClick={() => setShowIsobars(!showIsobars)}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              showIsobars ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Concentric Isobars"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden md:inline">ISOBARS</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Telemetry Overlay */}
      <div className="absolute bottom-3 left-3 pointer-events-none z-[400] flex items-center gap-3">
        {/* Wind Vector Compass Widget */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 rounded px-3 py-2 text-2xs font-mono shadow-xl flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-full border border-sky-400/40 flex items-center justify-center text-sky-400 transition-transform duration-700"
            style={{ transform: `rotate(${windBearing}deg)` }}
            title={`Wind Bearing: ${windBearing}°`}
          >
            <Navigation className="w-3 h-3 fill-sky-400" />
          </div>
          <div>
            <div className="text-slate-400 font-sans uppercase text-3xs font-semibold">ADVECTION VECTOR</div>
            <div className="text-slate-200 font-bold font-tabular">
              {windDirName} ({windBearing}°) @ {windSpeed} m/s
            </div>
          </div>
        </div>

        {/* Active Incident Plume Metrics Chip */}
        {activeIncident && (
          <div className="pointer-events-auto hidden sm:flex bg-slate-900/90 backdrop-blur border border-slate-800 rounded px-3 py-2 text-2xs font-mono shadow-xl items-center gap-3">
            <div>
              <div className="text-slate-400 font-sans uppercase text-3xs font-semibold">PLUME SPREAD</div>
              <div className="text-red-400 font-bold font-tabular">
                {activeIncident.downwind_exposure_cone?.max_reach_meters 
                  ? `${(activeIncident.downwind_exposure_cone.max_reach_meters / 1000).toFixed(1)} km`
                  : '2.5 km'} REACH
              </div>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <div className="text-slate-400 font-sans uppercase text-3xs font-semibold">EXPOSED POP.</div>
              <div className="text-amber-400 font-bold font-tabular">
                ~5,200 CITIZENS
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend (Bottom Right) */}
      <div className="absolute bottom-3 right-3 pointer-events-none z-[400]">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 rounded px-2.5 py-1.5 text-3xs font-mono text-slate-400 shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Epicenter</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1 border border-dashed border-red-500 bg-red-500/20"></span>
            <span>Plume Cone</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-amber-600/80"></span>
            <span>Receptors</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeafletCommandMap;
