import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, MapPin, Check } from 'lucide-react';
import { getAqiTier } from '../../constants/classifications';

export function CitySelector() {
  const { cities, selectedCity, setSelectedCity } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTier = getAqiTier(selectedCity.current_aqi);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded bg-app-surface hover:bg-app-hover border border-border-subtle hover:border-border-strong transition-colors text-left"
        aria-label="Select City Archetype"
      >
        <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-white">{selectedCity.name}</span>
            <span
              className="text-2xs font-mono font-bold px-1.5 py-0.2 rounded"
              style={{ backgroundColor: currentTier.bg, color: currentTier.color }}
            >
              AQI {selectedCity.current_aqi}
            </span>
          </div>
          <span className="text-2xs text-slate-400 block truncate max-w-[140px] sm:max-w-[200px]">
            {selectedCity.state}
          </span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-80 rounded bg-app-panel border border-border-strong shadow-2xl z-50 py-1 divide-y divide-border-subtle">
          <div className="px-3 py-2 bg-app-bg text-2xs font-semibold text-slate-400 uppercase tracking-wider">
            Statutory Archetype Monitoring Grids
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {cities.map((city) => {
              const tier = getAqiTier(city.current_aqi);
              const isSelected = city.id === selectedCity.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    setSelectedCity(city.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 flex items-start justify-between gap-3 hover:bg-app-hover transition-colors ${
                    isSelected ? 'bg-civic-subtle' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                        {city.name}
                      </span>
                      <span className="text-2xs text-slate-400">({city.state})</span>
                    </div>
                    <p className="text-2xs text-slate-400 mt-0.5 line-clamp-1">
                      {city.archetype}
                    </p>
                    <div className="flex items-center gap-2 mt-1 font-mono text-2xs text-slate-500">
                      <span>{city.cpcb_stations_count} CPCB STATIONS</span>
                      <span>•</span>
                      <span>{city.active_incidents} ACTIVE INCIDENTS</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: tier.bg, color: tier.color }}
                    >
                      AQI {city.current_aqi}
                    </div>
                    <span className="text-2xs text-slate-400 block mt-0.5">{tier.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
