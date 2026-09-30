import React from 'react';
import { getAqiTier } from '../../constants/cities';

export function CityBarChart({ cities, selectedCityId, onSelectCity }) {
  if (!cities || cities.length === 0) return null;

  const maxAqi = Math.max(...cities.map((c) => c.current_aqi), 400);

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-2xs font-mono text-slate-500 border-b border-border-subtle pb-2">
        <span className="font-bold uppercase tracking-wider text-slate-800">
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
              className={`p-3 rounded-lg transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-white border-border-subtle hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                    {city.name}
                  </span>
                  <span className="font-mono text-3xs text-slate-500">
                    {city.archetype}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded-full font-tabular border"
                    style={{ 
                      backgroundColor: `${tier.color}15`, 
                      color: tier.color,
                      borderColor: `${tier.color}40`,
                    }}
                  >
                    {city.current_aqi} AQI
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: tier.color,
                  }}
                />
              </div>

              <div className="mt-1.5 flex items-center justify-between text-3xs font-mono text-slate-500">
                <span>{city.cpcb_stations_count} CPCB STATIONS</span>
                <span className="text-amber-800 font-semibold">{city.active_incidents} INCIDENTS ACTIVE</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CityBarChart;
