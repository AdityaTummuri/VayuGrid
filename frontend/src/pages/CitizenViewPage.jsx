import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { useApp } from '../context/AppContext';
import { getAqiTier } from '../constants/cities';
import { AqiDonutGauge } from '../components/charts/AqiDonutGauge';
import { AqiSparkline } from '../components/charts/AqiSparkline';
import { VernacularAudioPlayer } from '../components/audio/VernacularAudioPlayer';
import { CommandMap } from '../components/map/CommandMap';
import { 
  Eye, ShieldAlert, Wind, MapPin, AlertTriangle, 
  ArrowRight, HeartPulse, ShieldCheck, Navigation, Activity, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function CitizenViewPage() {
  const { selectedCity, incidents, activeIncident, weather } = useApp();
  const tier = getAqiTier(selectedCity.current_aqi);

  // Dynamically compute realistic 24-hour diurnal AQI trajectory matching this city's current AQI
  const sparklineData = React.useMemo(() => {
    const base = selectedCity.current_aqi || 250;
    const factors = [0.86, 0.90, 0.94, 1.06, 1.14, 1.18, 1.10, 0.96, 0.89, 0.95, 1.05, 1.0];
    return factors.map((f) => Math.max(20, Math.round(base * f)));
  }, [selectedCity?.current_aqi]);

  return (
    <PageShell className="py-6 px-4 max-w-7xl mx-auto w-full space-y-8 bg-slate-50 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-2xs font-bold mb-2">
            <Eye className="h-3 w-3 text-amber-600" />
            <span>CITIZEN AIR GUARD • PUBLIC RESILIENCE RADAR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Neighborhood Air Quality & Plume Warning Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time public health monitoring for {selectedCity.name} ({selectedCity.state}) with statutory voice alerts across regional Indian languages.
          </p>
        </div>

        <Link
          to="/report"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all shadow-sm"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>REPORT LOCAL EMISSION</span>
        </Link>
      </div>

      {/* Hero Metrics Row: Radial Gauge + 24h Trend Sparkline + Health Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: AqiDonutGauge Card (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-border-subtle rounded-xl p-6 flex flex-col items-center justify-between shadow-sm">
          <div className="w-full flex items-center justify-between text-2xs font-mono text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">CAAQMS REAL-TIME</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <AqiDonutGauge value={selectedCity.current_aqi} size={200} strokeWidth={16} />

          <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs font-mono text-slate-500">
            <span>POLLUTANT: {selectedCity.primary_pollutant || 'PM2.5'}</span>
            <span className="text-slate-800 font-bold">{selectedCity.cpcb_stations_count || 12} SENSORS SYNCED</span>
          </div>
        </div>

        {/* Right: Health Advisory & 24h Sparkline (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-border-subtle rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-amber-700 mb-2">
              <HeartPulse className="h-4 w-4" />
              <span className="text-2xs font-bold uppercase tracking-wider font-mono">
                Statutory Public Health Directive & Exposure Mitigation
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed font-sans">
              {tier.healthAdvisory || 'Severe particulate loading detected. Avoid all prolonged outdoor exertion. Wear N95 filtration masks and keep indoor air purifiers active.'}
            </p>
          </div>

          {/* 24-Hour Sparkline Micro-Trend dynamically scaled to this city */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <AqiSparkline
              data={sparklineData}
              height={54}
              strokeColor={tier.color}
              label={`24H AQI CONCENTRATION TREND (${selectedCity.name.toUpperCase()})`}
            />
          </div>

          {/* Quick Protective Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-2xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs">
              <span className="text-lg">😷</span>
              <div>
                <span className="text-slate-900 font-bold block">N95 Filtering</span>
                <span className="text-slate-500 text-3xs">Mandatory outdoors</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs">
              <span className="text-lg">🪟</span>
              <div>
                <span className="text-slate-900 font-bold block">Seal Apertures</span>
                <span className="text-slate-500 text-3xs">Close windows & vents</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs">
              <span className="text-lg">🏃</span>
              <div>
                <span className="text-slate-900 font-bold block">No Cardio</span>
                <span className="text-slate-500 text-3xs">Cancel outdoor sports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Plume Threat Map (Spatial Awareness for Citizens with OSM Tiles!) */}
      <div className="bg-white border border-border-subtle rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
              Local Plume Dispersion Threat Map & Walking Corridor Safe Zone
            </h2>
          </div>
          <span className="font-mono text-2xs text-slate-500">
            SHOWING ACTIVE PLUME CONES IN {selectedCity.name.toUpperCase()} (OSM TILES)
          </span>
        </div>

        <div className="h-[360px] w-full rounded-lg border border-slate-200 overflow-hidden relative shadow-inner">
          <CommandMap />
        </div>
      </div>

      {/* Dynamic Multi-Scenario Vernacular Audio Broadcast Player */}
      <VernacularAudioPlayer 
        key={selectedCity.id}
        city={selectedCity} 
        activeIncident={activeIncident} 
      />
    </PageShell>
  );
}

export default CitizenViewPage;
