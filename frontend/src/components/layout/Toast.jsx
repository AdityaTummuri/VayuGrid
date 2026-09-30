import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function Toast() {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />,
    info: <Info className="h-4 w-4 text-sky-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/40 bg-slate-900/95 text-slate-100',
    warning: 'border-amber-500/40 bg-slate-900/95 text-slate-100',
    error: 'border-rose-500/40 bg-slate-900/95 text-slate-100',
    info: 'border-sky-500/40 bg-slate-900/95 text-slate-100',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-fade-in pointer-events-auto">
      <div
        className={`flex items-start gap-3 p-3.5 rounded border shadow-lg backdrop-blur-sm ${
          borderColors[toast.type] || borderColors.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-xs leading-relaxed font-sans">
          <p className="font-semibold text-slate-200 uppercase text-2xs tracking-wider mb-0.5">
            System Dispatch Notice
          </p>
          <p className="text-slate-300">{toast.message}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
