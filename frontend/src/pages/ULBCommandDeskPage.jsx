import React from 'react';
import { PageShell } from '../components/layout/PageShell';
import { useApp } from '../context/AppContext';
import { CommandMap } from '../components/map/CommandMap';
import { IncidentQueue } from '../components/incident/IncidentQueue';
import { Activity, ShieldAlert, Wind, Truck, AlertTriangle } from 'lucide-react';

export function ULBCommandDeskPage() {
  const { incidents, selectedCity, weather } = useApp();

  const criticalCount = incidents.filter(i => i.severity_score >= 0.8).length;
  const pendingCount = incidents.filter(i => i.status !== 'DISPATCHED').length;

  return (
    <PageShell className="h-[calc(100vh-4rem)] overflow-hidden">
      {/* Executive Command Metric Ribbon */}
      <div className="bg-app-panel border-b border-border-subtle px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-sans font-semibold uppercase text-2xs">MONITORED SECTOR:</span>
            <span className="text-slate-100 font-bold">{selectedCity.name.toUpperCase()} COMMAND GRID</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400 border-l border-border-subtle pl-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-slate-200 font-bold font-tabular">{criticalCount}</span>
              <span className="text-2xs text-slate-400">CRITICAL P0 PLUMES</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold font-tabular">{pendingCount}</span>
              <span className="text-2xs text-slate-400">AWAITING DISPATCH</span>
            </div>
          </div>
        </div>

        {/* Micro-Meteorological Readout */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Wind className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-slate-200 font-tabular">
              {weather?.wind_direction || 'NE'} @ {weather?.wind_speed_mps || 4.8} m/s
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Truck className="h-3.5 w-3.5" />
            <span className="text-2xs">6 SMOG UNITS STANDBY</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Command Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Pane: GIS Command Map (7 cols = ~58%) */}
        <div className="lg:col-span-7 h-full relative border-r border-border-subtle overflow-hidden">
          <CommandMap />
        </div>

        {/* Right Pane: Incident Queue & Enforcement Desk (5 cols = ~42%) */}
        <div className="lg:col-span-5 h-full overflow-hidden">
          <IncidentQueue />
        </div>
      </div>
    </PageShell>
  );
}
