import React from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { useApp } from '../context/AppContext';
import { getAqiTier } from '../constants/classifications';
import { Activity, ShieldAlert, Eye, ArrowRight, Wind, Layers, Cpu, Compass, CheckCircle2 } from 'lucide-react';

export function LandingPage() {
  const { cities } = useApp();

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative border-b border-border-subtle bg-gradient-to-b from-app-panel to-app-bg px-4 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="font-semibold">HACKATHON TRACK 2: CLEAN AIR & CLIMATE RESILIENCE</span>
          </div>

          {/* Title & Vision */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans leading-tight">
              Federated Planetary-to-Pavement Digital Public Good for Air Pollution Governance
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-3xl">
              VayuGrid (वायु-सूत्र) connects central CPCB IoT telemetry, multimodal Gemini 1.5 Pro forensic auditing, and physics-driven Gaussian dispersion modeling into an automated municipal enforcement grid.
            </p>
          </div>

          {/* Persona Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            
            {/* Persona 1: ULB Command Desk */}
            <Link
              to="/admin"
              className="group p-6 rounded-lg bg-app-surface border border-border-subtle hover:border-blue-500/80 hover:bg-app-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded bg-blue-950 border border-blue-600/40 flex items-center justify-center text-blue-400">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  ULB Executive Command Desk
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time GIS command map, live atmospheric plume dispersion cones, school/hospital breach ETAs, and automated smog-gun mobilization.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/80 flex items-center justify-between font-mono text-xs font-semibold text-blue-400">
                <span>OPEN DESK</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Persona 2: Citizen Forensic Ingest */}
            <Link
              to="/report"
              className="group p-6 rounded-lg bg-app-surface border border-border-subtle hover:border-emerald-500/80 hover:bg-app-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Citizen Forensic Ingest
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submit photographic emission evidence with satellite GPS. Instant Gemini 1.5 Pro forensic audit with verified statutory infraction ticket.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/80 flex items-center justify-between font-mono text-xs font-semibold text-emerald-400">
                <span>SUBMIT EVIDENCE</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Persona 3: Citizen Air Guard */}
            <Link
              to="/citizen"
              className="group p-6 rounded-lg bg-app-surface border border-border-subtle hover:border-amber-500/80 hover:bg-app-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-10 w-10 rounded bg-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-400">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Public Health Air Guard
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Localized neighborhood hazard alerts and multi-lingual voice broadcasts across 6 Indian vernacular languages for vulnerable populations.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle/80 flex items-center justify-between font-mono text-xs font-semibold text-amber-400">
                <span>VIEW RADAR</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Monitored Indian Archetypes Grid */}
      <section className="px-4 py-12 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider font-sans">
              Statutory Urban Archetype Telemetry Grids
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active CPCB continuous emission monitoring across 5 distinct geographical zones
            </p>
          </div>
          <div className="font-mono text-2xs text-slate-500">
            UPDATED: CONTINUOUS INGEST
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {cities.map((city) => {
            const tier = getAqiTier(city.current_aqi);
            return (
              <div
                key={city.id}
                className="bg-app-surface border border-border-subtle p-3.5 rounded flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">{city.name}</span>
                    <span
                      className="font-mono text-2xs font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: tier.bg, color: tier.color }}
                    >
                      {city.current_aqi}
                    </span>
                  </div>
                  <span className="text-2xs text-slate-400 block line-clamp-2">
                    {city.archetype}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-border-subtle/60 text-2xs font-mono text-slate-500 flex items-center justify-between">
                  <span>{city.cpcb_stations_count} CPCB STATIONS</span>
                  <span className="text-slate-300 font-semibold">{city.active_incidents} INCIDENTS</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
