import React from 'react';
import { getAqiTier } from '../../constants/cities';

export function CityBarChart({ cities, selectedCityId, onSelectCity }) {
  if (!cities || cities.length === 0) return null;

  const maxAqi = Math.max(...cities.map((c) => c.current_aqi), 400);

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-2xs font-mono text-slate-400 border-b border-border-subtle pb-2">
        <span className="font-semibold uppercase tracking-wider text-slate-300">
          PAN-INDIA STATUTORY ARCHETYPES
        </span>
        <span className="text-3xs text-slate-500 font-sans">
          MAX SCALE: 500 AQI
        </span>
      </div>

      <div className="space-y-2">
        {cities.map((city) => {
          const tier = getAqiTier(city.current_aqi);
          const percent = Math.min((city.current_aqi / maxAqi) * 100, 100);
          const isSelected = city.id === selectedCityId;

          return (
            <div
              key={city.id}
              onClick={() => onSelectCity && onSelectCity(city)}
              className={`p-2.5 rounded transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-slate-800/80 border-sky-500 shadow-md ring-1 ring-sky-500/30'
                  : 'bg-app-surface/60 border-border-subtle hover:border-slate-600 hover:bg-app-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {city.name}
                  </span>
                  <span className="font-mono text-3xs text-slate-400">
                    {city.archetype}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded font-tabular"
                    style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                  >
                    {city.current_aqi} AQI
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative w-full h-2 bg-slate-900 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-700 ease-out"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: tier.color,
                  }}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between text-3xs font-mono text-slate-400">
                <span>{city.cpcb_stations_count} CPCB STATIONS</span>
                <span className="text-amber-400 font-semibold">{city.active_incidents} INCIDENTS ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CityBarChart;
