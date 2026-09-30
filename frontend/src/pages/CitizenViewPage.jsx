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

  // Default localized advisories fallback
  const advisories = activeIncident?.vernacular_advisories || {
    en: `URGENT HEALTH ADVISORY (${selectedCity.name}): Air quality index is ${selectedCity.current_aqi} (${tier.label}). High PM2.5 particulate loading. Vulnerable individuals, elderly, and children should avoid all strenuous outdoor activities.`,
    hi: `अति आवश्यक स्वास्थ्य चेतावनी (${selectedCity.name}): वायु गुणवत्ता सूचकांक ${selectedCity.current_aqi} (${tier.label}) दर्ज किया गया है। बच्चे, बुजुर्ग व सांस के मरीज बाहर जाने से बचें और मास्क का उपयोग करें।`,
    te: `ముఖ్యమైన ఆరోగ్య హెచ్చరిక (${selectedCity.name}): గాలి నాణ్యత సూచీ ${selectedCity.current_aqi} (${tier.label}) గా నమోదైంది. పిల్లలు మరియు వృద్ధులు బయట తిరగడం మానుకోండి.`,
    kn: `ತುರ್ತು ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ (${selectedCity.name}): ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕ ${selectedCity.current_aqi} (${tier.label}) ತಲುಪಿದೆ. ಮಕ್ಕಳು ಮತ್ತು ವೃದ್ಧರು ಮನೆಯೊಳಗೆ ಇರಲು ಸೂಚಿಸಲಾಗಿದೆ.`,
    ta: `அவசர சுகாதார எச்சரிக்கை (${selectedCity.name}): காற்றின் தரம் ${selectedCity.current_aqi} (${tier.label}) பதிவாகியுள்ளது. முதியவர்களும் குழந்தைகளும் வெளியில் செல்வதைத் தவிர்க்கவும்.`,
    ml: `അടിയന്തര ആരോഗ്യ മുന്നറിയിപ്പ് (${selectedCity.name}): വായു ഗുണനിലവാര സൂചിക ${selectedCity.current_aqi} (${tier.label}) ആയി ഉയർന്നു. കുട്ടികളും മുതിർന്നവരും വീടുകളിൽ തുടരുക.`,
  };

  return (
    <PageShell className="py-6 px-4 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-2xs mb-2">
            <Eye className="h-3 w-3" />
            <span>CITIZEN AIR GUARD • PUBLIC RESILIENCE RADAR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Neighborhood Air Quality & Plume Warning Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time public health monitoring for {selectedCity.name} ({selectedCity.state}) with statutory voice alerts across 6 Indian languages.
          </p>
        </div>

        <Link
          to="/report"
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-civic hover:bg-civic-hover text-white text-xs font-mono font-bold transition-all shadow-md"
        >
          <ShieldAlert className="h-4 w-4" />
          <span>REPORT LOCAL EMISSION</span>
        </Link>
      </div>

      {/* Hero Metrics Row: Radial Gauge + 24h Trend Sparkline + Health Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: AqiDonutGauge Card (4 cols) */}
        <div className="lg:col-span-4 bg-app-panel border border-border-subtle rounded-lg p-6 flex flex-col items-center justify-between shadow-xl">
          <div className="w-full flex items-center justify-between text-2xs font-mono text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">CAAQMS REAL-TIME</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <AqiDonutGauge value={selectedCity.current_aqi} size={200} strokeWidth={16} />

          <div className="w-full mt-4 pt-3 border-t border-border-subtle/80 flex items-center justify-between text-2xs font-mono text-slate-400">
            <span>POLLUTANT: {selectedCity.primary_pollutant || 'PM2.5'}</span>
            <span className="text-slate-200">{selectedCity.cpcb_stations_count} SENSORS SYNCED</span>
          </div>
        </div>

        {/* Right: Health Advisory & 24h Sparkline (8 cols) */}
        <div className="lg:col-span-8 bg-app-panel border border-border-subtle rounded-lg p-6 flex flex-col justify-between space-y-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <HeartPulse className="h-4 w-4" />
              <span className="text-2xs font-semibold uppercase tracking-wider font-mono">
                Statutory Public Health Directive & Exposure Mitigation
              </span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed font-sans">
              {tier.healthAdvisory || 'Severe particulate loading detected. Avoid all prolonged outdoor exertion. Wear N95 filtration masks and keep indoor air purifiers active.'}
            </p>
          </div>

          {/* 24-Hour Sparkline Micro-Trend */}
          <div className="bg-app-bg/80 border border-border-subtle rounded p-4">
            <AqiSparkline
              data={[210, 230, 245, 280, 310, 335, 360, 375, 385, 365, 350, selectedCity.current_aqi]}
              height={54}
              strokeColor={tier.color}
              label={`24H AQI CONCENTRATION TREND (${selectedCity.name.toUpperCase()})`}
            />
          </div>

          {/* Quick Protective Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-2xs">
            <div className="p-2.5 rounded bg-app-bg border border-border-subtle flex items-center gap-2">
              <span className="text-base">😷</span>
              <div>
                <span className="text-slate-200 font-bold block">N95 Filtering</span>
                <span className="text-slate-400 text-3xs">Mandatory outdoors</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-app-bg border border-border-subtle flex items-center gap-2">
              <span className="text-base">🪟</span>
              <div>
                <span className="text-slate-200 font-bold block">Seal Apertures</span>
                <span className="text-slate-400 text-3xs">Close windows & vents</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-app-bg border border-border-subtle flex items-center gap-2">
              <span className="text-base">🏃</span>
              <div>
                <span className="text-slate-200 font-bold block">No Cardio</span>
                <span className="text-slate-400 text-3xs">Cancel outdoor sports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Plume Threat Map (Spatial Awareness for Citizens!) */}
      <div className="bg-app-panel border border-border-subtle rounded-lg p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-sky-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-sans">
              Local Plume Dispersion Threat Map & Walking Corridor Safe Zone
            </h2>
          </div>
          <span className="font-mono text-2xs text-slate-400">
            SHOWING ACTIVE PLUME CONES IN {selectedCity.name.toUpperCase()}
          </span>
        </div>

        <div className="h-[360px] w-full rounded border border-border-subtle overflow-hidden relative">
          <CommandMap />
        </div>
      </div>

      {/* Vernacular Audio Broadcast Player (6 Indian Languages) */}
      <div className="bg-app-panel border border-border-subtle rounded-lg p-6 shadow-xl space-y-4">
        <VernacularAudioPlayer advisories={advisories} defaultLanguage="hi" />
      </div>
    </PageShell>
  );
}

export default CitizenViewPage;
