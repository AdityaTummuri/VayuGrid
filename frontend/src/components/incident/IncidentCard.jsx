import React from 'react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ClassificationTag } from '../ui/ClassificationTag';
import { MapPin, Navigation, Clock, Building2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export function IncidentCard({ incident, isSelected = false, onSelect }) {
  if (!incident) return null;

  const isDispatched = incident.status === 'DISPATCHED';
  const isCritical = incident.severity_score >= 0.8;

  return (
    <div
      onClick={() => onSelect?.(incident)}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20 translate-x-0.5'
          : 'bg-white hover:bg-slate-50/70 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-sm'
      }`}
    >
      {/* High-visibility left severity status gutter */}
      <div 
        className={`absolute top-3 bottom-3 left-0 w-1.5 rounded-r ${
          isDispatched ? 'bg-emerald-500' : isCritical ? 'bg-red-500' : 'bg-amber-500'
        }`}
      />

      <div className="pl-2">
        {/* Header Row: Ticket ID, Time, Severity Badge */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 tracking-tight font-tabular">
                {incident.ticket_id}
              </span>
              <span className="text-3xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60 font-medium">
                {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
              </span>
            </div>
            <div className="mt-1.5">
              <ClassificationTag classificationKey={incident.classification} />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <SeverityBadge score={incident.severity_score} />
            <span className="text-3xs font-mono text-slate-500 font-medium">
              CONF: {(incident.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Location Box */}
        <div className="flex items-start gap-2 text-xs mb-3 bg-slate-50/90 p-2.5 rounded-lg border border-slate-200/70">
          <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-2xs leading-normal">
            <span className="font-semibold text-slate-900 block">{incident.location.address_hint}</span>
            <div className="font-mono text-slate-500 text-3xs mt-0.5 flex items-center gap-2">
              <span>{incident.location.lat.toFixed(4)}°N, {incident.location.lng.toFixed(4)}°E</span>
              <span>•</span>
              <span className="font-semibold text-slate-600">{incident.location.ward_no}</span>
            </div>
          </div>
        </div>

        {/* Micro-telemetry & Dispersion Matrix */}
        <div className="grid grid-cols-2 gap-2 text-2xs mb-3 font-mono">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-slate-400 text-3xs uppercase tracking-wider block font-semibold">Max Plume Spread</span>
            <span className="font-bold text-slate-900 text-xs font-tabular">
              {incident.downwind_exposure_cone?.max_reach_meters || 2800} m
            </span>
            <span className="text-slate-500 block text-3xs mt-0.5">
              Vector: {incident.weather_context?.wind_direction || 'NE'} ({incident.weather_context?.wind_bearing_deg || 45}°)
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-slate-400 text-3xs uppercase tracking-wider block font-semibold">Receptors at Risk</span>
            <span className="font-bold text-amber-700 text-xs font-tabular">
              {incident.impacted_infrastructure?.length || 0} Facilities
            </span>
            <span className="text-slate-500 block text-3xs mt-0.5">
              Fastest ETA: <strong className="text-red-600">{incident.impacted_infrastructure?.[0]?.eta_minutes || 11}m</strong>
            </span>
          </div>
        </div>

        {/* Impacted Infrastructure Breach Preview */}
        {incident.impacted_infrastructure?.length > 0 && (
          <div className="mb-3 space-y-1.5">
            <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider block">
              Immediate Sensitive Receptors:
            </span>
            {incident.impacted_infrastructure.slice(0, 2).map((infra) => (
              <div
                key={infra.id}
                className="flex items-center justify-between text-2xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-mono shadow-2xs"
              >
                <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                  <Building2 className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span className="text-slate-800 truncate font-semibold">{infra.name}</span>
                </div>
                <span className="text-red-700 font-bold font-tabular shrink-0 text-3xs bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                  T-{infra.eta_minutes}m ({infra.distance_meters}m)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-3xs font-mono text-slate-500 uppercase">Status:</span>
            <span
              className={`text-3xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                isDispatched
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isCritical
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {incident.status}
            </span>
          </div>

          <span className="text-3xs font-mono font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
            <span>{isSelected ? 'INSPECTING' : 'INSPECT'}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default IncidentCard;
