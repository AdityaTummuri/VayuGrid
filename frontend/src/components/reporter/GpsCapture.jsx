import React, { useState } from 'react';
import { MapPin, Crosshair, CheckCircle2, AlertTriangle, Edit3 } from 'lucide-react';

export function GpsCapture({ coords, status, error, onAcquire, onManualSet }) {
  const [isManual, setIsManual] = useState(false);
  const [manualLat, setManualLat] = useState('28.6289');
  const [manualLng, setManualLng] = useState('77.2065');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onManualSet(manualLat, manualLng);
    setIsManual(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-300">
          Geospatial Position (GPS / Ground Coordinates)
        </label>
        <button
          type="button"
          onClick={() => setIsManual(prev => !prev)}
          className="text-2xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Edit3 className="h-3 w-3" />
          <span>{isManual ? 'Use Automated GPS' : 'Manual Coordinates'}</span>
        </button>
      </div>

      {isManual ? (
        <form onSubmit={handleManualSubmit} className="grid grid-cols-2 gap-2 bg-app-surface p-3 rounded border border-border-subtle">
          <div>
            <span className="text-2xs font-mono text-slate-400 block mb-1">LATITUDE (°N)</span>
            <input
              type="number"
              step="any"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="w-full bg-app-bg border border-border-strong rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <span className="text-2xs font-mono text-slate-400 block mb-1">LONGITUDE (°E)</span>
            <input
              type="number"
              step="any"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              className="w-full bg-app-bg border border-border-strong rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="col-span-2 pt-1 flex justify-end">
            <button
              type="submit"
              className="px-3 py-1 bg-civic hover:bg-civic-hover text-white text-xs font-mono rounded"
            >
              Set GPS Anchor
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between p-3 rounded bg-app-surface border border-border-subtle">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded flex items-center justify-center ${
              status === 'ACQUIRED'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/60'
                : 'bg-app-bg text-slate-400 border border-border-subtle'
            }`}>
              {status === 'ACQUIRED' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </div>

            <div>
              {status === 'ACQUIRED' && coords ? (
                <div>
                  <div className="font-mono text-xs font-bold text-slate-200 font-tabular">
                    {coords.lat.toFixed(6)}°N, {coords.lng.toFixed(6)}°E
                  </div>
                  <div className="text-2xs font-mono text-emerald-400 mt-0.5">
                    PRECISION: ±{coords.accuracy || 15}m (SATELLITE LOCK)
                  </div>
                </div>
              ) : status === 'ACQUIRING' ? (
                <div>
                  <div className="text-xs font-semibold text-sky-400 flex items-center gap-2">
                    <Crosshair className="h-3.5 w-3.5 animate-spin" />
                    <span>Querying GNSS Satellite Constellation...</span>
                  </div>
                  <div className="text-2xs font-mono text-slate-400 mt-0.5">
                    Acquiring sub-meter coordinates
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-semibold text-slate-300">
                    GPS Coordinates Unattached
                  </div>
                  <div className="text-2xs text-slate-400 mt-0.5">
                    Click Acquire to lock current device coordinates
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onAcquire}
            disabled={status === 'ACQUIRING'}
            className="px-3 py-1.5 rounded bg-app-panel hover:bg-app-hover border border-border-strong text-slate-200 text-xs font-mono font-semibold transition-colors shrink-0"
          >
            {status === 'ACQUIRED' ? 'Re-acquire' : 'Acquire GPS'}
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-2xs text-amber-400 font-mono">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
