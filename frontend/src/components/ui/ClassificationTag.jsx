import React from 'react';
import { CLASSIFICATION_META } from '../../constants/classifications';

export function ClassificationTag({ classificationKey, className = '' }) {
  const meta = CLASSIFICATION_META[classificationKey] || {
    code: 'SRC-GEN',
    label: classificationKey?.replace(/_/g, ' ') || 'Unclassified Event',
    color: '#94A3B8',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-mono text-2xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
        {meta.code}
      </span>
      <span className="text-xs font-medium text-slate-200 truncate">
        {meta.label}
      </span>
    </div>
  );
}
