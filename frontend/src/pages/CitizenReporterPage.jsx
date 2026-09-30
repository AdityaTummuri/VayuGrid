import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { PhotoUploader } from '../components/reporter/PhotoUploader';
import { GpsCapture } from '../components/reporter/GpsCapture';
import { LoadingSkeleton } from '../components/reporter/LoadingSkeleton';
import { AuditResultCard } from '../components/reporter/AuditResultCard';
import { useGeolocation } from '../hooks/useGeolocation';
import { submitAuditReport } from '../api/vayugridApi';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Send, Sparkles, RefreshCw } from 'lucide-react';

export function CitizenReporterPage() {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const { coords, status: gpsStatus, error: gpsError, acquireLocation, setManualCoords } = useGeolocation();
  const { showToast } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please attach emission photo evidence before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setAuditResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (coords) {
        formData.append('latitude', coords.lat);
        formData.append('longitude', coords.lng);
      }
      if (notes) {
        formData.append('notes', notes);
      }

      const result = await submitAuditReport(formData);
      setAuditResult(result);
      showToast(`Audit Verified: Ticket ${result.ticket_id} created`, 'success');
    } catch (err) {
      showToast('Forensic submission failed: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setNotes('');
    setAuditResult(null);
  };

  return (
    <PageShell className="py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-border-subtle pb-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono text-2xs mb-2">
            <Sparkles className="h-3 w-3" />
            <span>AI MULTIMODAL FORENSICS (GEMINI 1.5 PRO)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Citizen Environmental Grievance & Forensic Ingest
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Submit verified photographic evidence of illegal municipal solid waste fires, industrial stack flares, or fugitive construction dust.
          </p>
        </div>

        {/* Audit Form or Result View */}
        {auditResult ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-emerald-400">
                AUDIT COMPLETED SUCCESSFULLY
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-app-surface hover:bg-app-hover border border-border-subtle text-xs font-mono text-slate-300"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Submit Another Grievance</span>
              </button>
            </div>
            <AuditResultCard result={auditResult} />
          </div>
        ) : isSubmitting ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                Initiating Multimodal Emission Audit...
              </h3>
              <p className="text-2xs text-slate-400 mt-1 font-mono">
                Running optical density, chemical pyrolysis indicators, and statutory rule matching
              </p>
            </div>
            <LoadingSkeleton />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-app-panel border border-border-subtle p-6 rounded-lg shadow-xl">
            {/* Step 1: Photo Upload */}
            <PhotoUploader file={file} onFileSelect={setFile} />

            {/* Step 2: GPS Acquisition */}
            <GpsCapture
              coords={coords}
              status={gpsStatus}
              error={gpsError}
              onAcquire={acquireLocation}
              onManualSet={setManualCoords}
            />

            {/* Step 3: Additional Ground Context */}
            <div className="space-y-2">
              <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-300">
                Ground Observations (Optional Landmark / Odor Notes)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Heavy black smoke near eastern gate, sharp plastic odor, fire started approximately 20 mins ago..."
                rows={3}
                className="w-full bg-app-surface border border-border-subtle rounded p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submission Action */}
            <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
              <div className="text-2xs font-mono text-slate-400">
                PROTECTION: SATELLITE EXIF TAMPER-RESISTANT HASH
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !file}
                className="flex items-center gap-2 px-6 py-2.5 rounded bg-civic hover:bg-civic-hover text-white text-xs font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <Send className="h-4 w-4" />
                <span>SUBMIT FOR FORENSIC AUDIT</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
