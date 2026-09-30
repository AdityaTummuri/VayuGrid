import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, MapPin, Check, ShieldAlert } from 'lucide-react';
import { getAqiTier } from '../../constants/classifications';

/**
 * CitySelector - Statutory Municipal Grid Selector
 * 
 * Provides an authoritative dropdown allowing ULB officers and citizens to switch
 * between regional air quality archetypes across India (Delhi-NCR, Kanpur, Bengaluru, Mumbai, Punjab).
 * Equipped with high-visibility CPCB tier badges and z-index elevation to prevent map occlusion.
 */
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

  // Close smoothly on window scroll to prevent clipping or viewport misalignment
  useEffect(() => {
    if (!isOpen) return;
    function handleScroll() {
      setIsOpen(false);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const currentTier = getAqiTier(selectedCity?.current_aqi);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 shadow-2xs transition-all text-left group"
        aria-label="Select City Archetype"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
          <MapPin className="h-4 w-4 text-blue-600" />
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
              {selectedCity?.name || 'Select City'}
            </span>
            <span
              className="text-3xs font-mono font-bold px-1.5 py-0.5 rounded border"
              style={{
                backgroundColor: `${currentTier.color}15`,
                color: currentTier.color,
                borderColor: `${currentTier.color}40`,
              }}
            >
              AQI {selectedCity?.current_aqi || 250}
            </span>
          </div>
          <span className="text-3xs text-slate-500 font-medium block truncate max-w-[130px] sm:max-w-[180px]">
            {selectedCity?.state || 'India'}
          </span>
        </div>
        
        <ChevronDown 
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Elevated Dropdown Menu (Guaranteed to float above Leaflet Panes and Hero Cards) */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-300 shadow-2xl z-[99999] py-1 divide-y divide-slate-100 overflow-hidden"
          style={{ filter: 'drop-shadow(0 20px 25px rgba(15, 23, 42, 0.15))' }}
        >
          {/* Header Banner */}
          <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <span className="text-3xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              Statutory Archetype Monitoring Grids
            </span>
            <span className="text-3xs font-mono text-slate-500">
              {cities.length} REGIONS
            </span>
          </div>

          {/* Scrollable City List */}
          <div className="max-h-80 overflow-y-auto py-1 divide-y divide-slate-50">
            {cities.map((city) => {
              const tier = getAqiTier(city.current_aqi);
              const isSelected = city.id === selectedCity?.id;

              return (
                <button
                  key={city.id}
                  onClick={() => {
                    setSelectedCity(city.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-start justify-between gap-3 transition-colors ${
                    isSelected 
                      ? 'bg-blue-50/80 border-l-4 border-l-blue-600' 
                      : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {city.name}
                      </span>
                      <span className="text-3xs text-slate-500 font-medium">({city.state})</span>
                    </div>

                    <p className="text-2xs text-slate-600 mt-0.5 line-clamp-1">
                      {city.archetype}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 font-mono text-3xs text-slate-500">
                      <span className="font-semibold text-slate-700">{city.cpcb_stations_count || 12} CAAQMS STATIONS</span>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">{city.active_incidents || 4} ACTIVE INCIDENTS</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: `${tier.color}15`,
                        color: tier.color,
                        borderColor: `${tier.color}40`,
                      }}
                    >
                      AQI {city.current_aqi}
                    </div>
                    <span className="text-3xs font-bold text-slate-600 block mt-0.5 font-mono uppercase">
                      {tier.label}
                    </span>
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

export default CitySelector;
