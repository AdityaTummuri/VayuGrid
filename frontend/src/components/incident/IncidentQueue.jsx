import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentCard } from './IncidentCard';
import { Filter, Layers, RefreshCw, AlertCircle } from 'lucide-react';

export function IncidentQueue() {
  const { incidents, activeIncident, setActiveIncident, refreshIncidents, isLoadingIncidents } = useApp();
  const [filter, setFilter] = useState('ALL'); // ALL, CRITICAL, PENDING, DISPATCHED

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === 'CRITICAL') return inc.severity_score >= 0.8;
    if (filter === 'PENDING') return inc.status !== 'DISPATCHED';
    if (filter === 'DISPATCHED') return inc.status === 'DISPATCHED';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-app-panel border-r border-border-subtle">
      {/* Header & Controls */}
      <div className="p-3.5 border-b border-border-subtle bg-app-panel/95 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-sans">
              Active Incident Enforcement Queue
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 font-semibold font-tabular">
              {incidents.length} IN BUFFER
            </span>
            <button
              onClick={refreshIncidents}
              disabled={isLoadingIncidents}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-app-hover transition-colors disabled:opacity-50"
              title="Refresh Telemetry Queue"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingIncidents ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 font-mono text-2xs overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'ALL' },
            { id: 'CRITICAL', label: 'CRITICAL (P0)' },
            { id: 'PENDING', label: 'PENDING' },
            { id: 'DISPATCHED', label: 'DISPATCHED' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap border ${
                filter === tab.id
                  ? 'bg-civic border-blue-500 text-white font-semibold'
                  : 'bg-app-surface border-border-subtle text-slate-400 hover:text-slate-200 hover:bg-app-hover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border-subtle rounded my-4">
            <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold text-slate-300">No Incidents in Filter View</p>
            <p className="text-2xs text-slate-500 mt-1">All active emission clusters meet statutory compliance bounds.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.ticket_id}
              incident={incident}
              isSelected={activeIncident?.ticket_id === incident.ticket_id}
              onSelect={setActiveIncident}
            />
          ))
        )}
      </div>
    </div>
  );
}
