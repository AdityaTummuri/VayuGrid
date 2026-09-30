import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Check, Loader2, AlertCircle } from 'lucide-react';

export function DispatchActionButton({ ticketId, mitigationOption }) {
  const { dispatchAction } = useApp();
  const [status, setStatus] = useState('IDLE'); // IDLE, DISPATCHING, DISPATCHED, ERROR

  const handleDispatch = async (e) => {
    e.stopPropagation();
    if (status === 'DISPATCHING' || status === 'DISPATCHED') return;

    setStatus('DISPATCHING');
    const success = await dispatchAction(ticketId, {
      action_id: mitigationOption?.action_id || 'ACTION-SMOG-GUN',
      type: mitigationOption?.type || 'SMOG_GUN',
      timestamp: new Date().toISOString(),
    });

    if (success) {
      setStatus('DISPATCHED');
    } else {
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  if (status === 'DISPATCHED') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 font-mono text-xs font-semibold">
        <Check className="h-3.5 w-3.5" />
        <span>UNIT DISPATCHED (ETA {mitigationOption?.response_eta_minutes || 12}M)</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDispatch}
      disabled={status === 'DISPATCHING'}
      className={`flex items-center justify-center gap-2 px-3.5 py-1.5 rounded font-mono text-xs font-semibold transition-all border shadow-sm ${
        status === 'DISPATCHING'
          ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-wait'
          : status === 'ERROR'
          ? 'bg-rose-950/80 border-rose-600 text-rose-300'
          : 'bg-red-700 hover:bg-red-600 border-red-500 text-white'
      }`}
    >
      {status === 'DISPATCHING' ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>MOBILIZING ASSET...</span>
        </>
      ) : status === 'ERROR' ? (
        <>
          <AlertCircle className="h-3.5 w-3.5" />
          <span>RETRY DISPATCH</span>
        </>
      ) : (
        <>
          <Truck className="h-3.5 w-3.5" />
          <span>{mitigationOption?.label || 'DISPATCH MUNICIPAL SMOG GUN'}</span>
        </>
      )}
    </button>
  );
}
