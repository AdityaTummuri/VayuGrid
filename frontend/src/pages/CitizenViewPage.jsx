import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { useApp } from '../context/AppContext';
import { getAqiTier } from '../constants/classifications';
import { VernacularAudioPlayer } from '../components/audio/VernacularAudioPlayer';
import { Eye, ShieldAlert, Wind, MapPin, AlertTriangle, ArrowRight, HeartPulse, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CitizenViewPage() {
  const { selectedCity, incidents, activeIncident, weather } = useApp();
  const tier = getAqiTier(selectedCity.current_aqi);

  return (
    <PageShell className="py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-2xs mb-2">
              <Eye className="h-3 w-3" />
              <span>CITIZEN AIR GUARD • PUBLIC RESILIENCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Neighborhood Air Quality & Plume Warning Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Active health alerts for {selectedCity.name} ({selectedCity.state}) with statutory advisories in 6 Indian languages.
            </p>
          </div>

          <Link
            to="/report"
            className="flex items-center gap-2 px-4 py-2 rounded bg-civic hover:bg-civic-hover text-white text-xs font-mono font-bold transition-all shadow-sm"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>REPORT NEW EMISSION</span>
          </Link>
        </div>

        {/* Current Statutory AQI Readout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Gauge Card */}
          <div className="bg-app-panel border border-border-subtle p-6 rounded-lg flex flex-col justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              CPCB REAL-TIME AIR QUALITY INDEX
            </span>

            <div className="my-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold font-mono text-white font-tabular">
                  {selectedCity.current_aqi}
                </span>
                <span className="text-xs font-mono text-slate-400">NAQI</span>
              </div>
              <div
                className="inline-block mt-2 font-mono text-xs font-bold px-2.5 py-1 rounded"
                style={{ backgroundColor: tier.bg, color: tier.color }}
              >
                CATEGORY: {tier.label.toUpperCase()}
              </div>
            </div>

            <div className="text-2xs font-mono text-slate-400 pt-3 border-t border-border-subtle/60 flex items-center justify-between">
              <span>PRIMARY: {selectedCity.primary_pollutant || 'PM2.5'}</span>
              <span>{selectedCity.cpcb_stations_count} SENSORS SYNCED</span>
            </div>
          </div>

          {/* Statutory Health Advisory Card */}
          <div className="md:col-span-2 bg-app-panel border border-border-subtle p-6 rounded-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <HeartPulse className="h-4 w-4" />
                <span className="text-2xs font-semibold uppercase tracking-wider font-mono">
                  Statutory Medical & Public Health Directive
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200 leading-relaxed font-sans">
                {tier.healthAdvisory}
              </p>
            </div>

            {/* Micro-wind & Outdoor Exposure Warning */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle/60 font-mono text-2xs">
              <div className="bg-app-bg p-2.5 rounded border border-border-subtle">
                <span className="text-slate-400 block">SURFACE WIND DISPERSION</span>
                <span className="text-slate-200 font-bold">
                  {weather?.wind_direction || 'NE'} @ {weather?.wind_speed_mps || 4.8} m/s
                </span>
              </div>
              <div className="bg-app-bg p-2.5 rounded border border-border-subtle">
                <span className="text-slate-400 block">OUTDOOR EXERTION RISK</span>
                <span className="text-red-400 font-bold">HIGH (REDUCE PROLONGED OUTDOOR TRIPS)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vernacular Audio Broadcast (6 Languages) */}
        <div>
          <VernacularAudioPlayer advisories={activeIncident?.vernacular_advisories} />
        </div>

        {/* Nearby Active Hazard Plumes within 5km */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-sans">
              Active Downwind Emission Cones ({incidents.length} Detected in Metropolitan Area)
            </h3>
            <span className="text-2xs font-mono text-slate-400">RADIAL RANGE: 5,000 METERS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map((incident) => (
              <div
                key={incident.ticket_id}
                className="bg-app-panel border border-border-subtle p-4 rounded-lg flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {incident.ticket_id}
                    </span>
                    <span className="font-mono text-2xs px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-700/60 font-semibold">
                      {(incident.severity_score * 100).toFixed(0)}% SEVERITY
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans font-medium line-clamp-2">
                    {incident.location.address_hint}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-2xs font-mono text-slate-400">
                  <span>DISPERSION: {incident.downwind_exposure_cone?.max_reach_meters}m</span>
                  <span className="text-emerald-400 font-semibold">
                    STATUS: {incident.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
