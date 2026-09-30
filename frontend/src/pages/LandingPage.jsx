import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { useApp } from '../context/AppContext';
import { CityBarChart } from '../components/charts/CityBarChart';
import { LiveCounter } from '../components/charts/LiveCounter';
import { LiveTickerStrip } from '../components/charts/LiveTickerStrip';
import { 
  Activity, ShieldAlert, Eye, ArrowRight, Wind, Layers, 
  Cpu, Compass, CheckCircle2, Radio, Zap, AlertTriangle, Building2 
} from 'lucide-react';

export function LandingPage() {
  const { cities, setSelectedCity } = useApp();

  return (
    <PageShell className="flex flex-col justify-between">
      {/* Top Mission-Critical Briefing & Hero */}
      <section className="relative border-b border-border-subtle bg-gradient-to-b from-slate-950 via-app-panel to-app-bg px-4 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Institutional Badge & Live Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="font-semibold">HACKATHON TRACK 2: CLEAN AIR & CLIMATE RESILIENCE</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-2xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>FEDERATED GRID: ACTIVE</span>
              </span>
              <span>•</span>
              <span>CAQM GRAP IV PROTOCOL</span>
            </div>
          </div>

          {/* Title & Vision */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
              Federated Planetary-to-Pavement Digital Public Good for Air Pollution Governance
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-3xl">
              <strong className="text-sky-400">VayuGrid (वायु-सूत्र)</strong> connects statutory CPCB IoT sensor telemetry, multimodal Gemini 2.5 Flash forensic image verification, and atmospheric Gaussian plume physics into an automated municipal enforcement grid.
            </p>
          </div>

          {/* Live National KPI Ribbon (Numbers Above the Fold!) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-lg bg-slate-900/80 border border-border-subtle hover:border-red-500/50 transition-colors">
              <div className="flex items-center justify-between text-2xs font-mono text-slate-400 mb-1">
                <span>ACTIVE CRITICAL PLUMES</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-red-400 font-tabular">
                <LiveCounter value={12} duration={900} />
              </div>
              <span className="text-3xs text-slate-500 mt-1 block font-mono">P0 STATUTORY BREACHES</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/80 border border-border-subtle hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between text-2xs font-mono text-slate-400 mb-1">
                <span>DOWNWIND EXPOSED CITIZENS</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 font-tabular">
                <LiveCounter value={42850} duration={1100} />
              </div>
              <span className="text-3xs text-slate-500 mt-1 block font-mono">WITHIN 2.5KM PLUME ENVELOPE</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/80 border border-border-subtle hover:border-sky-500/50 transition-colors">
              <div className="flex items-center justify-between text-2xs font-mono text-slate-400 mb-1">
                <span>CAAQMS STATIONS ONLINE</span>
                <Radio className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-400 font-tabular">
                <LiveCounter value={218} duration={800} />
              </div>
              <span className="text-3xs text-slate-500 mt-1 block font-mono">CONTINUOUS TELEMETRY</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/80 border border-border-subtle hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between text-2xs font-mono text-slate-400 mb-1">
                <span>GEMINI AUDIT CONFIDENCE</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 font-tabular">
                94.2%
              </div>
              <span className="text-3xs text-slate-500 mt-1 block font-mono">STRICT PYDANTIC SCHEMAS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Gateways & Live Archetype Matrix */}
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-12 w-full">
        {/* Persona Action Cards */}
        <div>
          <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-sans">
                Operational Persona Access
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Role-based interfaces for municipal executives, forensic reporters, and vulnerable communities
              </p>
            </div>
            <span className="font-mono text-2xs text-slate-500 hidden sm:inline">DUAL-PERSONA FEDERATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Persona 1: ULB Executive Command Desk */}
            <Link
              to="/admin"
              className="group p-6 rounded-lg bg-app-surface border border-border-subtle hover:border-sky-500/80 hover:bg-app-hover transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-400">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                  ULB Executive Command Desk
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real Leaflet CartoDB dark GIS map, dynamic Gaussian plume dispersion cones, school/hospital breach ETAs, and automated statutory smog gun mobilization.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/80 flex items-center justify-between font-mono text-xs font-semibold text-sky-400">
                <span>OPEN DESK (/admin)</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Persona 2: Citizen Forensic Ingest */}
            <Link
              to="/report"
              className="group p-6 rounded-lg bg-app-surface border border-border-subtle hover:border-emerald-500/80 hover:bg-app-hover transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Citizen Forensic Ingest
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload emission evidence with browser GPS acquisition. Instant Gemini multimodal forensic audit and immediate tamper-evident statutory ticket.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/80 flex items-center justify-between font-mono text-xs font-semibold text-emerald-400">
                <span>SUBMIT EVIDENCE (/report)</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Persona 3: Citizen Air Guard */}
            <Link
              to="/citizen"
              className="group p-6 rounded-lg bg-app-surface border border-border-subtle hover:border-amber-500/80 hover:bg-app-hover transition-all flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Public Health Air Guard
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hyper-local AQI gauge, regional plume radar, and 6-language vernacular voice broadcasts for vulnerable populations and school corridors.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/80 flex items-center justify-between font-mono text-xs font-semibold text-amber-400">
                <span>VIEW RADAR (/citizen)</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Pan-India Archetype Telemetry Matrix */}
        <div className="bg-app-panel border border-border-subtle rounded-lg p-6 space-y-4">
          <CityBarChart 
            cities={cities} 
            selectedCityId="delhi" 
            onSelectCity={(city) => setSelectedCity(city)} 
          />
        </div>

        {/* Technical Architecture Depth Strip */}
        <div className="border border-border-subtle rounded-lg bg-app-surface/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Algorithmic & Forensic Verification Pipeline
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-1.5 border-l-2 border-indigo-500 pl-3">
              <span className="font-bold text-white font-mono block">1. GEMINI 2.5 FLASH FORENSICS</span>
              <p className="text-2xs text-slate-400 leading-relaxed">
                Multimodal classification checks for optical smoke density, flame spectra, and chlorinated polymer pyrolysis with strict JSON schema validation.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-sky-500 pl-3">
              <span className="font-bold text-white font-mono block">2. GAUSSIAN DISPERSION PHYSICS</span>
              <p className="text-2xs text-slate-400 leading-relaxed">
                Real-time atmospheric advection equations driven by Pasquill-Gifford stability, boundary layer inversion capping, and wind vectors.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-emerald-500 pl-3">
              <span className="font-bold text-white font-mono block">3. AUTOMATED STATUTORY DISPATCH</span>
              <p className="text-2xs text-slate-400 leading-relaxed">
                CAQM Section 31A statutory notices and municipal anti-smog water canon truck routing triggered automatically upon verified infraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Live System Ticker */}
      <div className="shrink-0">
        <LiveTickerStrip />
      </div>
    </PageShell>
  );
}

export default LandingPage;
