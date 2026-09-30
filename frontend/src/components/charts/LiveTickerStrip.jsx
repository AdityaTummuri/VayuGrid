import React from 'react';
import { Activity, ShieldCheck, Wind, Radio, Zap } from 'lucide-react';

export function LiveTickerStrip() {
  const items = [
    { label: 'CPCB CAAQMS GRID', value: '218 STATIONS ONLINE', icon: Radio, color: 'text-emerald-700' },
    { label: 'BOUNDARY LAYER (PBL)', value: '480M INVERSION CAPPING', icon: Activity, color: 'text-amber-700' },
    { label: 'PHYSICS SIMULATION', value: 'GAUSSIAN PLUME ACTIVE', icon: Zap, color: 'text-blue-700' },
    { label: 'GEMINI MULTIMODAL', value: '0.94 CONFIDENCE AUDITING', icon: ShieldCheck, color: 'text-indigo-700' },
    { label: 'OPENWEATHER / OPEN-METEO', value: 'NE @ 4.8 M/S', icon: Wind, color: 'text-sky-700' },
  ];

  return (
    <div className="w-full bg-slate-100 border-t border-slate-200 py-1.5 px-4 overflow-hidden flex items-center justify-between text-2xs font-mono text-slate-700 select-none shadow-inner">
      <div className="flex items-center gap-2 pr-4 border-r border-slate-300 text-slate-900 font-bold shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
        <span className="tracking-wider">SYSTEM TELEMETRY STREAM</span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <Icon className={`w-3.5 h-3.5 ${it.color}`} />
              <span className="text-slate-500 text-3xs font-semibold">{it.label}:</span>
              <span className="text-slate-900 font-bold font-tabular text-2xs">{it.value}</span>
              {idx < items.length - 1 && <span className="text-slate-300 ml-3">|</span>}
            </div>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-300 text-3xs text-slate-500 shrink-0">
        <span>LATENCY: 42ms</span>
        <span>•</span>
        <span>ENCRYPTION: TLS 1.3</span>
      </div>
    </div>
  );
}

export default LiveTickerStrip;
