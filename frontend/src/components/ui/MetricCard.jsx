import React from 'react';

export function MetricCard({ title, value, unit, delta, deltaLabel, icon: Icon, provenance }) {
  return (
    <div className="bg-app-surface border border-border-subtle p-3 rounded flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 mb-1">
        <span className="text-2xs font-semibold uppercase tracking-wider font-sans">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-slate-100 font-tabular">{value}</span>
          {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
        </div>
        {delta !== undefined && (
          <div className="flex items-center gap-1.5 mt-1 text-2xs">
            <span className={delta >= 0 ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
              {delta > 0 ? `+${delta}` : delta}
            </span>
            {deltaLabel && <span className="text-slate-400">{deltaLabel}</span>}
          </div>
        )}
      </div>
      {provenance && (
        <div className="mt-2 pt-2 border-t border-border-subtle/60 text-2xs text-slate-400 font-mono flex items-center justify-between">
          <span>SOURCE: {provenance}</span>
        </div>
      )}
    </div>
  );
}
