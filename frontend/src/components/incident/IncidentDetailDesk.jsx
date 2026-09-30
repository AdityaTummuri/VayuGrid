import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ClassificationTag } from '../ui/ClassificationTag';
import { DispatchActionButton } from './DispatchActionButton';
import { 
  Building2, ShieldAlert, AlertTriangle, CheckCircle, 
  MapPin, Wind, Eye, FileText, Send, Zap, Clock 
} from 'lucide-react';

export function IncidentDetailDesk() {
  const { activeIncident, updateIncidentStatus, addToast } = useApp();
  const [isDispatching, setIsDispatching] = useState(false);

  if (!activeIncident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-app-panel">
        <ShieldAlert className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          No Incident Selected
        </h3>
        <p className="text-2xs text-slate-500 mt-1 max-w-[200px]">
          Select an incident from the queue or map to inspect forensic telemetry and execute statutory dispatches.
        </p>
      </div>
    );
  }

  const isDispatched = activeIncident.status === 'DISPATCHED';

  const handleQuickDispatch = (action) => {
    setIsDispatching(true);
    setTimeout(() => {
      updateIncidentStatus(activeIncident.ticket_id, 'DISPATCHED');
      setIsDispatching(false);
      addToast({
        type: 'SUCCESS',
        title: 'Statutory Action Dispatched',
        message: `${action.label} initiated under CAQM GRAP IV framework.`,
      });
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-app-panel border-l border-border-subtle overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-border-subtle bg-slate-900/60 sticky top-0 z-10 backdrop-blur">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-xs font-bold text-sky-400 font-tabular">
            {activeIncident.ticket_id}
          </span>
          <SeverityBadge score={activeIncident.severity_score} />
        </div>

        <div className="mt-1">
          <ClassificationTag classificationKey={activeIncident.classification} />
        </div>

        <div className="mt-2 text-2xs text-slate-400 flex items-center gap-1.5 font-mono">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>INGESTED: {new Date(activeIncident.timestamp).toLocaleTimeString()}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{activeIncident.status}</span>
        </div>
      </div>

      <div className="p-3.5 space-y-4 text-xs">
        {/* Geolocation Readout */}
        <div className="bg-app-bg/80 border border-border-subtle rounded p-2.5">
          <div className="flex items-center gap-1.5 text-2xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>GEO-VERIFIED LOCATION</span>
          </div>
          <p className="text-2xs text-slate-200 leading-snug font-medium">
            {activeIncident.location.address_hint}
          </p>
          <div className="mt-1 text-3xs font-mono text-slate-500 font-tabular">
            {activeIncident.location.lat.toFixed(4)}°N, {activeIncident.location.lng.toFixed(4)}°E • {activeIncident.location.ward_no}
          </div>
        </div>

        {/* Gemini Forensic Visual Markers */}
        <div className="bg-app-bg/80 border border-border-subtle rounded p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-2xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
              <Eye className="w-3 h-3" />
              <span>GEMINI FORENSIC MARKS</span>
            </div>
            <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-tabular font-bold">
              {(activeIncident.confidence * 100).toFixed(0)}% CONF
            </span>
          </div>

          <div className="space-y-1.5 mt-2">
            {(activeIncident.visual_markers || [
              'Dense toxic particulate plume (>80% Opacity)',
              'Chlorinated PVC & Polymer Pyrolysis Indicators Detected',
              'Open Uncontained Municipal Heap',
            ]).map((marker, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-2xs text-slate-300">
                <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-snug">{marker}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitive Receptors Breach Table */}
        <div className="bg-app-bg/80 border border-border-subtle rounded p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-2xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
              <Building2 className="w-3 h-3" />
              <span>DOWNWIND RECEPTORS</span>
            </div>
            <span className="text-3xs font-mono text-slate-400">
              {activeIncident.impacted_infrastructure?.length || 0} BREACHES
            </span>
          </div>

          <div className="space-y-1.5 mt-2">
            {activeIncident.impacted_infrastructure?.map((infra) => (
              <div
                key={infra.id}
                className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono text-2xs"
              >
                <div className="truncate max-w-[150px]">
                  <span className="text-slate-200 block truncate font-medium">{infra.name}</span>
                  <span className="text-3xs text-slate-500 uppercase">{infra.type || infra.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-red-400 font-bold font-tabular block">
                    ETA {infra.eta_minutes || infra.estimated_arrival_minutes}m
                  </span>
                  <span className="text-3xs text-slate-400 font-tabular">{infra.distance_meters}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Enforcement Actions */}
        <div className="pt-2">
          <div className="text-2xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>STATUTORY MITIGATION ACTIONS</span>
          </div>

          <div className="space-y-2">
            {activeIncident.mitigation_options?.map((action) => (
              <button
                key={action.action_id}
                onClick={() => handleQuickDispatch(action)}
                disabled={isDispatched || isDispatching}
                className={`w-full p-2.5 rounded border text-left font-mono transition-all flex flex-col justify-between ${
                  isDispatched
                    ? 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-civic/10 hover:bg-civic/20 border-civic/40 text-slate-100 hover:border-civic shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold text-white flex items-center gap-1.5">
                    <Send className="w-3 h-3 text-sky-400" />
                    {action.label}
                  </span>
                  {isDispatched && (
                    <span className="text-3xs px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      EXECUTED
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center justify-between text-3xs text-slate-400">
                  <span>{action.depot}</span>
                  <span className="text-sky-300 font-semibold font-tabular">ETA {action.response_eta_minutes}m</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetailDesk;
