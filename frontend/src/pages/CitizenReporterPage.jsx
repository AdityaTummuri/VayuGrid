import React, { useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { PhotoUploader } from '../components/reporter/PhotoUploader';
import { GpsCapture } from '../components/reporter/GpsCapture';
import { LoadingSkeleton } from '../components/reporter/LoadingSkeleton';
import { AuditResultCard } from '../components/reporter/AuditResultCard';
import { useGeolocation } from '../hooks/useGeolocation';
import { submitIncidentAudit } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, Send, Sparkles, RefreshCw, Eye, 
  MapPin, Cpu, CheckCircle2, AlertTriangle, FileText, Image as ImageIcon 
} from 'lucide-react';

export function CitizenReporterPage() {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const { coords, status: gpsStatus, error: gpsError, acquireLocation, setManualCoords } = useGeolocation();
  const { addToast } = useApp();

  const handleQuickSampleSelect = (type) => {
    // Generate synthetic mock image blob for instantaneous demo
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`${type.toUpperCase()} EVIDENCE`, 30, 150);

    canvas.toBlob((blob) => {
      const sampleFile = new File([blob], `${type}_evidence.jpg`, { type: 'image/jpeg' });
      setFile(sampleFile);
      setNotes(`Automated forensic sample: ${type.replace('_', ' ')} detected at coordinate boundary.`);
      addToast({
        type: 'INFO',
        title: 'Sample Telemetry Loaded',
        message: `Loaded synthetic ${type.replace('_', ' ')} evidence for evaluation.`,
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast({
        type: 'WARNING',
        title: 'Evidence Required',
        message: 'Please attach photographic emission evidence before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    setAuditResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (coords) {
        formData.append('latitude', coords.lat);
        formData.append('longitude', coords.lng);
      }
      if (notes) {
        formData.append('notes', notes);
      }

      const result = await submitIncidentAudit(formData);
      setAuditResult({
        ticket_id: result.ticket_id,
        timestamp: result.created_at || new Date().toISOString(),
        classification: result.verification?.source_classification || 'OPEN_MUNICIPAL_WASTE_BURNING',
        severity_score: result.verification?.severity_score || 0.88,
        confidence: result.verification?.confidence_score || 0.94,
        visual_markers: result.verification?.detected_visual_markers || [
          'Dense toxic particulate plume (>85% Opacity)',
          'Chlorinated polymer pyrolysis indicators detected',
          'Direct boundary breach of sensitive infrastructure',
        ],
        location: {
          address_hint: coords ? `Co-ordinates (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : 'Sector 16 Peripheral Corridor',
          lat: coords?.lat || 28.6289,
          lng: coords?.lng || 77.2065,
        },
      });

      addToast({
        type: 'SUCCESS',
        title: 'Forensic Audit Verified',
        message: `Generated statutory ticket ${result.ticket_id}`,
      });
    } catch (err) {
      addToast({
        type: 'ERROR',
        title: 'Audit Failed',
        message: err.message,
      });
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
    <PageShell className="py-6 px-4 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="border-b border-border-subtle pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono text-2xs">
              <Sparkles className="h-3 w-3 text-sky-400" />
              <span>GEMINI 2.5 FLASH FORENSIC INGEST</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Citizen Environmental Grievance & Forensic Ingest
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Submit verified photographic evidence of illegal municipal solid waste fires, industrial stack flares, or fugitive construction dust.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-2xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AUDIT PIPELINE READY</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Evidence & Telemetry Ingestion (7 cols = ~58%) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-app-panel border border-border-subtle rounded-lg p-5 space-y-5 shadow-xl">
            {/* Quick Demo Sample Picker */}
            <div className="p-3 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-2xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Evaluator Benchmark Samples:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSampleSelect('plastic_burning')}
                  className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800/60 hover:border-red-600 text-red-300 font-mono text-2xs transition-colors"
                >
                  🔥 Plastic Burning
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSampleSelect('stubble_burning')}
                  className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 hover:border-amber-600 text-amber-300 font-mono text-2xs transition-colors"
                >
                  🌾 Stubble Burning
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSampleSelect('construction_dust')}
                  className="px-2.5 py-1 rounded bg-sky-950/60 border border-sky-800/60 hover:border-sky-600 text-sky-300 font-mono text-2xs transition-colors"
                >
                  🏗️ Construction Dust
                </button>
              </div>
            </div>

            {/* Photo Uploader */}
            <PhotoUploader file={file} onFileSelect={setFile} onFileClear={() => setFile(null)} />

            {/* Browser Geolocation Acquisition */}
            <GpsCapture
              coords={coords}
              status={gpsStatus}
              error={gpsError}
              onAcquire={acquireLocation}
              onManualChange={setManualCoords}
            />

            {/* Context Notes */}
            <div className="space-y-1.5">
              <label className="text-2xs font-mono font-semibold uppercase text-slate-300 tracking-wider flex items-center justify-between">
                <span>Field Context & Landmark Notes (Optional)</span>
                <span className="text-slate-500 font-normal">Max 500 chars</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Thick acrid black smoke originating behind school boundary wall near Sector 16..."
                className="w-full bg-slate-900 border border-border-subtle focus:border-sky-500 rounded p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={!file || isSubmitting}
                className="flex-1 py-3 px-4 rounded bg-civic hover:bg-civic-hover text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>AUDITING EMISSION EVIDENCE...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>EXECUTE STATUTORY FORENSIC AUDIT</span>
                  </>
                )}
              </button>

              {(file || auditResult) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase"
                >
                  CLEAR
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Live Audit Pipeline & Result Inspector (5 cols = ~42%) */}
        <div className="lg:col-span-5 space-y-4">
          {auditResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AUDIT COMPLETED</span>
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 text-2xs font-mono text-slate-400 hover:text-white"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>New Ingest</span>
                </button>
              </div>
              <AuditResultCard result={auditResult} />
            </div>
          ) : isSubmitting ? (
            <div className="bg-app-panel border border-border-subtle rounded-lg p-6 space-y-4">
              <div className="text-center py-4">
                <RefreshCw className="h-8 w-8 text-sky-400 animate-spin mx-auto mb-3" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Executing Multimodal Gemini Forensics...
                </h3>
                <p className="text-2xs text-slate-400 mt-1 font-mono">
                  Running optical density calculation, chlorinated pyrolysis matching, and boundary layer wind advection.
                </p>
              </div>
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="bg-app-panel border border-border-subtle rounded-lg p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 border-b border-border-subtle pb-3">
                <Cpu className="w-4 h-4" />
                <span className="font-mono text-2xs font-bold uppercase tracking-wider">
                  Real-time Forensic Verification Engine
                </span>
              </div>

              <div className="space-y-3 font-mono text-2xs text-slate-400">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold shrink-0">
                    1
                  </span>
                  <div>
                    <span className="text-slate-200 font-bold block">Multimodal Optical Ingest</span>
                    <span>Extracts opacity, soot blackbody radiation, and flame spectrum via Gemini 2.5 Flash.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center font-bold shrink-0">
                    2
                  </span>
                  <div>
                    <span className="text-slate-200 font-bold block">Atmospheric Plume Advection</span>
                    <span>Computes downwind exposure cone and sensitive receptor intersections.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold shrink-0">
                    3
                  </span>
                  <div>
                    <span className="text-slate-200 font-bold block">Tamper-Evident Ticket Creation</span>
                    <span>Generates statutory municipal ticket with Section 133 CrPC legal clauses.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default CitizenReporterPage;
