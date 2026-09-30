import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Wind, ShieldAlert, Radio, Activity, MapPin, Eye } from 'lucide-react';
import { CitySelector } from '../ui/CitySelector';

export function TopBar() {
  const location = useLocation();
  const { weather, istTime, selectedCity } = useApp();

  const navLinks = [
    { to: '/admin', label: 'ULB Command Desk', icon: Activity },
    { to: '/report', label: 'Citizen Forensic Ingest', icon: ShieldAlert },
    { to: '/citizen', label: 'Public Air Guard', icon: Eye },
  ];

  return (
    <header className="sticky top-0 z-50 bg-app-panel border-b border-border-subtle text-slate-200">
      {/* Statutory Top Banner Strip */}
      <div className="bg-app-bg px-4 py-1 text-2xs text-slate-400 flex items-center justify-between border-b border-border-subtle/60">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300 tracking-wider">
            GOVT OF INDIA DIGITAL PUBLIC INFRASTRUCTURE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Track 2: Clean Air & Climate Resilience</span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-2xs font-medium">CPCB CENTRAL INGESTION: OPERATIONAL</span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-slate-300">
          <span className="text-slate-500 text-2xs">LATENCY: 38ms</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-200 font-medium font-tabular">{istTime}</span>
        </div>
      </div>

      {/* Main Command Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded border border-blue-500/30 bg-blue-950/40 flex items-center justify-center text-blue-400 font-mono font-bold text-sm tracking-tight shadow-sm">
              VG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  VayuGrid
                </span>
                <span className="text-xs text-blue-400/80 font-medium tracking-wide">
                  (वायु-सूत्र)
                </span>
              </div>
              <p className="text-2xs text-slate-400 tracking-normal font-normal">
                National Air Quality Intelligence & Enforcement Desk
              </p>
            </div>
          </Link>

          {/* Navigation Route Tabs */}
          <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-border-subtle pl-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                    isActive
                      ? 'bg-civic text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-app-hover'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* City Selector & Weather Telemetry */}
        <div className="flex items-center gap-3">
          <CitySelector />

          {/* Micro-Meteorology Strip */}
          {weather && (
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded bg-app-surface border border-border-subtle text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Wind className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-2xs text-slate-400 uppercase tracking-wider font-semibold">Surface Wind:</span>
                <span className="font-mono font-medium text-slate-200 font-tabular">
                  {weather.wind_direction} @ {weather.wind_speed_mps} m/s
                </span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="text-2xs text-slate-400 font-mono">
                {weather.ambient_temp_c}°C • {weather.atmospheric_stability?.split(' ')[1] || 'Neutral'}
              </div>
            </div>
          )}

          {/* Active Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300 text-2xs uppercase tracking-wider">SECURE GRID</span>
          </div>
        </div>
      </div>
    </header>
  );
}
