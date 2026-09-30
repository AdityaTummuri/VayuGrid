import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import { 
  Wind, ShieldAlert, School, Hospital, Train, Building2, 
  Layers, Compass, Eye, AlertTriangle, CheckCircle, Navigation, Map as MapIcon 
} from 'lucide-react';
import { CLASSIFICATION_META } from '../../constants/classifications';

// Custom Leaflet DivIcon factory for incident epicenters in light mode
function createIncidentIcon(severity, isSelected) {
  const isCritical = severity >= 0.8;
  const isHigh = severity >= 0.6 && severity < 0.8;
  
  const ringColor = isCritical ? 'border-red-500 bg-red-500/20' : isHigh ? 'border-amber-500 bg-amber-500/20' : 'border-blue-500 bg-blue-500/20';
  const coreColor = isCritical ? 'bg-red-600' : isHigh ? 'bg-amber-500' : 'bg-blue-600';
  const pulseClass = isSelected ? 'ring-4 ring-blue-500/50 scale-125' : isCritical ? 'animate-pulse' : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-200 ${pulseClass}">
        <div class="absolute inset-0 rounded-full border-2 ${ringColor} animate-ping-slow"></div>
        <div class="w-4 h-4 rounded-full ${coreColor} shadow-md border-2 border-white flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Custom Leaflet DivIcon factory for sensitive infrastructure receptors in light mode
function createReceptorIcon(type) {
  let symbol = '🏛️';
  let bgColor = 'bg-slate-100 border-slate-300 text-slate-800';
  
  if (type === 'SCHOOL' || type === 'EDUCATION_FACILITY') {
    symbol = '🏫';
    bgColor = 'bg-amber-50 border-amber-300 text-amber-900';
  } else if (type === 'HOSPITAL' || type === 'HEALTHCARE') {
    symbol = '🏥';
    bgColor = 'bg-rose-50 border-rose-300 text-rose-900';
  } else if (type === 'TRANSIT') {
    symbol = '🚇';
    bgColor = 'bg-blue-50 border-blue-300 text-blue-900';
  }

  return L.divIcon({
    className: 'custom-receptor-marker',
    html: `
      <div class="w-6 h-6 rounded-md border flex items-center justify-center text-xs shadow-sm font-semibold ${bgColor}">
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
  const tileLayerRef = useRef(null);
  const incidentLayerRef = useRef(null);
  const plumeLayerRef = useRef(null);
  const receptorLayerRef = useRef(null);
  const isobarLayerRef = useRef(null);

  // Map Tile Style: 'osm' (OpenStreetMap Standard) vs 'positron' (CartoDB Light)
  const [mapStyle, setMapStyle] = useState('osm');

  // Layer Visibility Toggles
  const [showPlume, setShowPlume] = useState(true);
  const [showReceptors, setShowReceptors] = useState(true);
  const [showIsobars, setShowIsobars] = useState(true);

  // Compute map center
  const targetCenter = useMemo(() => {
    if (activeIncident?.location?.lat && (activeIncident?.location?.lng ?? activeIncident?.location?.lon)) {
      return { 
        lat: activeIncident.location.lat, 
        lng: activeIncident.location.lng ?? activeIncident.location.lon 
      };
    }
    const cLat = selectedCity?.center?.lat ?? 28.6139;
    const cLng = selectedCity?.center?.lng ?? selectedCity?.center?.lon ?? 77.2090;
    return { lat: cLat, lng: cLng };
  }, [activeIncident, selectedCity]);

  // Downwind direction and wind speed display
  const windBearing = activeIncident?.weather_context?.wind_bearing_deg ?? weather?.wind_direction_deg ?? 45;
  const windSpeed = activeIncident?.weather_context?.wind_speed_mps ?? weather?.wind_speed_mps ?? 4.8;
  const windDirName = activeIncident?.weather_context?.wind_direction ?? weather?.wind_direction ?? 'NE';

  // 1. Initialize Leaflet Map once with OpenStreetMap Standard Tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = selectedCity?.center?.lat ?? 28.6139;
    const initialLng = selectedCity?.center?.lng ?? selectedCity?.center?.lon ?? 77.2090;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    // Default to OpenStreetMap Standard Tiles
    tileLayerRef.current = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

  // Update Tile Layer when Map Style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    if (mapStyle === 'positron') {
      tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
      }).addTo(mapInstanceRef.current);
    } else {
      tileLayerRef.current = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }
  }, [mapStyle]);

  // 2a. Fly smoothly to city center whenever user switches city
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCity) return;
    const cLat = selectedCity.center?.lat ?? 28.6139;
    const cLng = selectedCity.center?.lng ?? selectedCity.center?.lon ?? 77.2090;
    const zoom = selectedCity.zoom || selectedCity.default_zoom || 12;

    mapInstanceRef.current.flyTo([cLat, cLng], zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedCity?.id]);

  // 2b. Smoothly fly to incident epicenter when an incident is selected
  useEffect(() => {
    if (!mapInstanceRef.current || !activeIncident?.location) return;
    const lat = activeIncident.location.lat;
    const lng = activeIncident.location.lng ?? activeIncident.location.lon;
    if (lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], 14, {
        duration: 0.9,
        easeLinearity: 0.25,
      });
    }
  }, [activeIncident?.ticket_id]);

  // 3. Render Incident Markers with clean light theme popups
  useEffect(() => {
    if (!mapInstanceRef.current || !incidentLayerRef.current) return;
    incidentLayerRef.current.clearLayers();

    incidents.forEach((incident) => {
      const isSelected = activeIncident?.ticket_id === incident.ticket_id;
      const lat = incident.location?.lat;
      const lng = incident.location?.lng ?? incident.location?.lon;
      if (!lat || !lng) return;

      const pos = [lat, lng];
      const meta = CLASSIFICATION_META[incident.classification] || {
        label: incident.classification,
        color: '#64748B',
      };

      const marker = L.marker(pos, {
        icon: createIncidentIcon(incident.severity_score, isSelected),
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on('click', () => {
        setActiveIncident(incident);
      });

      const popupContent = `
        <div class="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 min-w-[240px] shadow-lg">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <span class="font-mono text-2xs font-bold text-blue-600">${incident.ticket_id}</span>
            <span class="text-3xs font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono">
              SEV ${(incident.severity_score * 100).toFixed(0)}%
            </span>
          </div>
          <div class="mt-2 text-xs font-bold text-slate-900">${meta.label}</div>
          <p class="mt-1 text-2xs text-slate-600 leading-snug">${incident.location.address_hint}</p>
          <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-2xs font-mono text-slate-500">
            <span>CONF: ${(incident.confidence * 100).toFixed(0)}%</span>
            <span class="text-amber-700 font-bold bg-amber-50 px-1 py-0.5 rounded border border-amber-200">${incident.status}</span>
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
      color: '#DC2626',
      weight: 2,
      opacity: 0.9,
      fillColor: '#EF4444',
      fillOpacity: 0.25,
      dashArray: '6, 6',
    });

    plumeLayerRef.current.addLayer(polygon);
  }, [activeIncident, showPlume]);

  // 5. Render Isobars
  useEffect(() => {
    if (!mapInstanceRef.current || !isobarLayerRef.current) return;
    isobarLayerRef.current.clearLayers();

    if (!showIsobars || !activeIncident?.location) return;

    const centerLat = activeIncident.location.lat;
    const centerLng = activeIncident.location.lng ?? activeIncident.location.lon;
    if (!centerLat || !centerLng) return;

    const center = [centerLat, centerLng];

    const circle1 = L.circle(center, {
      radius: 800,
      color: '#DC2626',
      weight: 1.5,
      opacity: 0.6,
      fillColor: '#DC2626',
      fillOpacity: 0.08,
      dashArray: '4, 4',
    });

    const circle2 = L.circle(center, {
      radius: 1800,
      color: '#D97706',
      weight: 1.5,
      opacity: 0.5,
      fillColor: '#D97706',
      fillOpacity: 0.05,
      dashArray: '5, 5',
    });

    const circle3 = L.circle(center, {
      radius: 3000,
      color: '#2563EB',
      weight: 1.5,
      opacity: 0.4,
      fillColor: '#2563EB',
      fillOpacity: 0.03,
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
        <div class="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 min-w-[200px] shadow-lg">
          <div class="font-bold text-xs text-amber-900 flex items-center gap-1.5">${infra.name}</div>
          <div class="mt-1 text-2xs font-mono text-slate-600 flex items-center justify-between">
            <span>DIST: ${infra.distance_meters}m</span>
            <span class="text-red-600 font-bold">ETA: ${infra.eta_minutes || infra.estimated_arrival_minutes}m</span>
          </div>
          ${infra.alert_status ? `<div class="mt-1.5 text-3xs text-red-700 font-semibold bg-red-50 border border-red-200 px-1 py-0.5 rounded font-mono">STATUS: ${infra.alert_status}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      receptorLayerRef.current.addLayer(marker);
    });
  }, [activeIncident, showReceptors]);

  return (
    <div className="relative w-full h-full bg-[#F1F5F9] select-none overflow-hidden flex flex-col">
      {/* Native Leaflet Map DOM Container with OpenStreetMap Tiles */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating HUD: Real-time GIS Telemetry & Layer Controls */}
      <div className="absolute top-3 left-3 right-3 pointer-events-none flex items-start justify-between z-[400]">
        {/* Active Coordinate & Sector Chip */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono shadow-md flex items-center gap-3 text-slate-700">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold uppercase tracking-wider text-2xs">OSM GIS LIVE</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="text-slate-600 text-2xs">
            <span className="text-slate-400 mr-1">SECTOR:</span>
            <span className="font-bold text-slate-900">{selectedCity.name.toUpperCase()}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="text-slate-500 text-2xs hidden sm:flex items-center gap-1 font-tabular">
            <span>{targetCenter.lat.toFixed(4)}°N</span>
            <span>,</span>
            <span>{targetCenter.lng.toFixed(4)}°E</span>
          </div>
        </div>

        {/* Tactical Layer Visibility Toggles & OSM Tile Switcher */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur border border-slate-200 rounded-lg p-1 shadow-md flex items-center gap-1 text-2xs font-mono">
          {/* Tile Source Toggle */}
          <button
            onClick={() => setMapStyle(mapStyle === 'osm' ? 'positron' : 'osm')}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors flex items-center gap-1"
            title="Toggle OSM Standard vs Positron Light Tiles"
          >
            <MapIcon className="w-3 h-3 text-blue-600" />
            <span>{mapStyle === 'osm' ? 'OSM STD' : 'OSM LIGHT'}</span>
          </button>

          <span className="text-slate-300">|</span>

          <button
            onClick={() => setShowPlume(!showPlume)}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              showPlume ? 'bg-red-50 text-red-700 border border-red-200 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Toggle Gaussian Plume Cone"
          >
            <ShieldAlert className="w-3 h-3" />
            <span className="hidden md:inline">PLUME</span>
          </button>

          <button
            onClick={() => setShowReceptors(!showReceptors)}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              showReceptors ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Toggle Receptors (Schools, Hospitals)"
          >
            <School className="w-3 h-3" />
            <span className="hidden md:inline">RECEPTORS</span>
          </button>

          <button
            onClick={() => setShowIsobars(!showIsobars)}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              showIsobars ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold' : 'text-slate-500 hover:text-slate-800'
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
        <div className="pointer-events-auto bg-white/95 backdrop-blur border border-slate-200 rounded-lg px-3 py-2 text-2xs font-mono shadow-md flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-full border border-blue-400/50 flex items-center justify-center text-blue-600 transition-transform duration-700 bg-blue-50"
            style={{ transform: `rotate(${windBearing}deg)` }}
            title={`Wind Bearing: ${windBearing}°`}
          >
            <Navigation className="w-3 h-3 fill-blue-600" />
          </div>
          <div>
            <div className="text-slate-400 font-sans uppercase text-3xs font-semibold">ADVECTION VECTOR</div>
            <div className="text-slate-800 font-bold font-tabular">
              {windDirName} ({windBearing}°) @ {windSpeed} m/s
            </div>
          </div>
        </div>

        {/* Active Incident Plume Metrics Chip */}
        {activeIncident && (
          <div className="pointer-events-auto hidden sm:flex bg-white/95 backdrop-blur border border-slate-200 rounded-lg px-3 py-2 text-2xs font-mono shadow-md items-center gap-3">
            <div>
              <div className="text-slate-400 font-sans uppercase text-3xs font-semibold">PLUME SPREAD</div>
              <div className="text-red-600 font-bold font-tabular">
                {activeIncident.downwind_exposure_cone?.max_reach_meters 
                  ? `${(activeIncident.downwind_exposure_cone.max_reach_meters / 1000).toFixed(1)} km`
                  : '2.5 km'} REACH
              </div>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <div className="text-slate-400 font-sans uppercase text-3xs font-semibold">EXPOSED POP.</div>
              <div className="text-amber-700 font-bold font-tabular">
                ~5,200 CITIZENS
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend (Bottom Right) */}
      <div className="absolute bottom-3 right-3 pointer-events-none z-[400]">
        <div className="pointer-events-auto bg-white/95 backdrop-blur border border-slate-200 rounded-lg px-2.5 py-1.5 text-3xs font-mono text-slate-600 shadow-md flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Epicenter</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1 border border-dashed border-red-600 bg-red-500/20"></span>
            <span>Plume Cone</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-amber-500"></span>
            <span>Receptors</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeafletCommandMap;
