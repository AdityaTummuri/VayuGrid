import React from 'react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ClassificationTag } from '../ui/ClassificationTag';
import { DispatchActionButton } from './DispatchActionButton';
import { MapPin, Navigation, Clock, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function IncidentCard({ incident, isSelected = false, onSelect }) {
  if (!incident) return null;

  const isDispatched = incident.status === 'DISPATCHED';

  return (
    <div
      onClick={() => onSelect?.(incident)}
      className={`p-4 rounded border transition-all cursor-pointer ${
        isSelected
          ? 'bg-app-surface border-blue-500 shadow-md ring-1 ring-blue-500/50'
          : 'bg-app-panel/90 border-border-subtle hover:border-border-strong hover:bg-app-surface'
      } ${isDispatched ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'}`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-100 font-tabular">
              {incident.ticket_id}
            </span>
            <span className="text-2xs font-mono text-slate-400">
              {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="mt-1">
            <ClassificationTag classificationKey={incident.classification} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <SeverityBadge score={incident.severity_score} />
          <span className="text-2xs font-mono text-slate-400">
            CONF: {(incident.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Geospatial Location */}
      <div className="flex items-start gap-1.5 text-xs text-slate-300 mb-3 bg-app-bg/60 p-2 rounded border border-border-subtle/50">
        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-2xs leading-normal">
          <span className="font-medium text-slate-200">{incident.location.address_hint}</span>
          <div className="font-mono text-slate-400 mt-0.5">
            {incident.location.lat.toFixed(4)}°N, {incident.location.lng.toFixed(4)}°E • {incident.location.ward_no}
          </div>
        </div>
      </div>

      {/* Plume Dynamics & Receptors */}
      <div className="grid grid-cols-2 gap-2 text-2xs mb-3 font-mono">
        <div className="p-2 rounded bg-app-bg/80 border border-border-subtle">
          <span className="text-slate-400 block uppercase">Max Dispersion</span>
          <span className="font-bold text-slate-200 font-tabular">
            {incident.downwind_exposure_cone?.max_reach_meters || 2800} m
          </span>
          <span className="text-slate-400 block text-2xs">
            Bearing: {incident.weather_context?.wind_bearing_deg || 45}° ({incident.weather_context?.wind_direction || 'NE'})
          </span>
        </div>

        <div className="p-2 rounded bg-app-bg/80 border border-border-subtle">
          <span className="text-slate-400 block uppercase">Receptors at Risk</span>
          <span className="font-bold text-amber-400 font-tabular">
            {incident.impacted_infrastructure?.length || 0} Facilities
          </span>
          <span className="text-slate-400 block text-2xs">
            Fastest ETA: {incident.impacted_infrastructure?.[0]?.eta_minutes || 11} min
          </span>
        </div>
      </div>

      {/* Impacted Infrastructure Badges */}
      {incident.impacted_infrastructure?.length > 0 && (
        <div className="mb-3 space-y-1">
          <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider block">
            Critical Receptor Breach Proximity:
          </span>
          {incident.impacted_infrastructure.slice(0, 2).map((infra) => (
            <div
              key={infra.id}
              className="flex items-center justify-between text-2xs px-2 py-1 rounded bg-slate-900/60 border border-border-subtle font-mono"
            >
              <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                <Building2 className="h-3 w-3 text-red-400 shrink-0" />
                <span className="text-slate-200 truncate">{infra.name}</span>
              </div>
              <span className="text-red-400 font-semibold font-tabular shrink-0">
                T-{infra.eta_minutes}m ({infra.distance_meters}m)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Enforcement Dispatch Action */}
      <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-3">
        <div className="text-2xs text-slate-400 font-mono">
          STATUS: <span className="text-slate-200 font-semibold">{incident.status}</span>
        </div>

        <DispatchActionButton
          ticketId={incident.ticket_id}
          mitigationOption={incident.mitigation_options?.[0]}
        />
      </div>
    </div>
  );
}
