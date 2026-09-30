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
    <div className="flex flex-col h-full bg-slate-50 border-r border-border-subtle">
      {/* Header & Controls */}
      <div className="p-3.5 border-b border-border-subtle bg-white sticky top-0 z-10 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
              Active Enforcement Queue
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-bold font-tabular">
              {incidents.length} IN BUFFER
            </span>
            <button
              onClick={refreshIncidents}
              disabled={isLoadingIncidents}
              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
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
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap border text-2xs ${
                filter === tab.id
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
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
          <div className="p-8 text-center border border-dashed border-slate-300 rounded-lg my-4 bg-white">
            <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-bold text-slate-800">No Incidents in Filter View</p>
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

export default IncidentQueue;
