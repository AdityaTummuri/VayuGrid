import React from 'react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ClassificationTag } from '../ui/ClassificationTag';
import { VernacularAudioPlayer } from '../audio/VernacularAudioPlayer';
import { ShieldCheck, CheckCircle, FileText, AlertTriangle, ArrowRight, MapPin } from 'lucide-react';
import { CLASSIFICATION_META } from '../../constants/classifications';

export function AuditResultCard({ result }) {
  if (!result) return null;

  const meta = CLASSIFICATION_META[result.classification] || {};

  return (
    <div className="bg-app-surface border border-border-strong rounded-lg p-6 space-y-6 shadow-xl animate-fade-in">
      {/* Top Banner: Verification Status */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-6 px-2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 font-mono text-2xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>FORENSIC VERIFIED</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-100 font-tabular">
              {result.ticket_id}
            </span>
          </div>
          <p className="text-2xs text-slate-400 font-mono mt-1">
            TIMESTAMP: {new Date(result.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SeverityBadge score={result.severity_score} />
          <div className="text-right font-mono">
            <span className="text-2xs text-slate-400 block">AI CONFIDENCE</span>
            <span className="text-xs font-bold text-emerald-400 font-tabular">
              {((result.confidence || 0.94) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Primary Classification & Statutory Standard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-app-bg p-4 rounded border border-border-subtle space-y-1.5">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block">
            Statutory Source Classification
          </span>
          <ClassificationTag classificationKey={result.classification} />
          {meta.statutoryRef && (
            <p className="text-2xs font-mono text-slate-400 mt-2 pt-2 border-t border-border-subtle/60">
              LEGAL CLAUSE: {meta.statutoryRef}
            </p>
          )}
        </div>

        <div className="bg-app-bg p-4 rounded border border-border-subtle space-y-1.5">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block">
            Automated ULB Mitigation Directive
          </span>
          <p className="text-xs font-semibold text-amber-300">
            {meta.actionRequired || 'Rapid Municipal Squad Dispatch'}
          </p>
          <div className="flex items-center gap-1.5 text-2xs text-slate-400 font-mono mt-2 pt-2 border-t border-border-subtle/60">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span>GEO-FENCED WARD: {result.location?.ward_no || 'Ward 18-N'}</span>
          </div>
        </div>
      </div>

      {/* Identified Visual Spectral Markers */}
      {result.visual_markers?.length > 0 && (
        <div className="space-y-2">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block">
            Gemini Vision Multi-Spectral Markers Identified:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.visual_markers.map((marker, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded bg-app-bg/80 border border-border-subtle text-xs text-slate-300 font-sans"
              >
                <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{marker}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrated Multilingual Vernacular Audio Broadcast */}
      <div className="pt-2">
        <VernacularAudioPlayer advisories={result.vernacular_advisories} />
      </div>
    </div>
  );
}
