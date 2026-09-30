import React from 'react';
import { TopBar } from './TopBar';
import { Toast } from './Toast';

export function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-slate-100 font-sans">
      <TopBar />
      <main className={`flex-1 flex flex-col ${className}`}>
        {children}
      </main>
      <Toast />
      
      {/* Statutory Footer */}
      <footer className="bg-app-panel border-t border-border-subtle py-2.5 px-4 text-slate-500 text-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span>VayuGrid (वायु-सूत्र) Architecture v1.0.4</span>
          <span>•</span>
          <span>Federated Pan-India Air Quality Resilience</span>
          <span>•</span>
          <span>MoEFCC / CPCB Statutory Standards Aligned</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span>SECURE PROTOCOL TLS 1.3</span>
          <span>•</span>
          <span>AIR (P&CP) ACT 1981 COMPLIANT</span>
        </div>
      </footer>
    </div>
  );
}
