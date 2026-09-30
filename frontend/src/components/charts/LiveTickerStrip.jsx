import React from 'react';
import { Activity, ShieldCheck, Wind, Radio, Zap } from 'lucide-react';

export function LiveTickerStrip() {
  const items = [
    { label: 'CPCB CAAQMS GRID', value: '218 STATIONS ONLINE', icon: Radio, color: 'text-emerald-400' },
    { label: 'BOUNDARY LAYER (PBL)', value: '480M NOCTURNAL INVERSION', icon: Activity, color: 'text-amber-400' },
    { label: 'PHYSICS SIMULATION', value: 'GAUSSIAN PLUME ACTIVE', icon: Zap, color: 'text-sky-400' },
    { label: 'GEMINI MULTIMODAL', value: '0.94 CONFIDENCE AUDITING', icon: ShieldCheck, color: 'text-indigo-400' },
    { label: 'ADVECTION VECTOR', value: 'NE @ 4.8 M/S', icon: Wind, color: 'text-cyan-400' },
  ];

  return (
    <div className="w-full bg-slate-950 border-t border-border-subtle/80 py-1.5 px-4 overflow-hidden flex items-center justify-between text-2xs font-mono text-slate-400 select-none">
      <div className="flex items-center gap-2 pr-4 border-r border-slate-800 text-slate-300 font-bold shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="tracking-wider">SYSTEM TELEMETRY STREAM</span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <Icon className={`w-3.5 h-3.5 ${it.color}`} />
              <span className="text-slate-400 text-3xs">{it.label}:</span>
              <span className="text-slate-200 font-bold font-tabular text-2xs">{it.value}</span>
              {idx < items.length - 1 && <span className="text-slate-800 ml-3">|</span>}
            </div>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-3xs text-slate-500 shrink-0">
        <span>LATENCY: 42ms</span>
        <span>•</span>
        <span>ENCRYPTION: TLS 1.3</span>
      </div>
    </div>
  );
}

export default LiveTickerStrip;
