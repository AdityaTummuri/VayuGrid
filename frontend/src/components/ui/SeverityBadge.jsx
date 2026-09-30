import React from 'react';
import { getSeverityConfig } from '../../constants/classifications';

export function SeverityBadge({ score, label, className = '' }) {
  const config = label ? null : getSeverityConfig(score);
  const displayLabel = label || config?.label || 'ADVISORY';

  const styleMap = {
    CRITICAL: 'bg-red-950/60 text-red-400 border-red-700/60',
    SEVERE: 'bg-orange-950/60 text-orange-400 border-orange-700/60',
    MODERATE: 'bg-amber-950/60 text-amber-400 border-amber-700/60',
    ADVISORY: 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60',
    LOW: 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60',
  };

  const badgeStyle = styleMap[displayLabel] || styleMap.ADVISORY;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-mono font-semibold uppercase tracking-wider border ${badgeStyle} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      <span>{displayLabel}</span>
      {score !== undefined && (
        <span className="opacity-80 font-normal">({(score * 100).toFixed(0)}%)</span>
      )}
    </span>
  );
}
