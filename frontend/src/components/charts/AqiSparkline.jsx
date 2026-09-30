import React, { useState } from 'react';
import { getAqiTier } from '../../constants/cities';

export function AqiSparkline({ 
  data = [180, 195, 210, 240, 280, 310, 345, 360, 375, 390, 365, 342], 
  height = 48, 
  strokeColor = '#F59E0B', 
  label = '24H TELEMETRY' 
}) {
  const [hoverIdx, setHoverIdx] = useState(null);

  if (!data || data.length < 2) return null;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const width = 200;
  const paddingY = 6;
  const usableHeight = height - paddingY * 2;

  // Generate coordinate points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - minVal) / range) * usableHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1];
  const activeTier = getAqiTier(activePoint.val);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
        <span className="uppercase tracking-wider font-semibold">{label}</span>
        <span className="font-tabular font-bold" style={{ color: activeTier.color }}>
          {activePoint.val} AQI
        </span>
      </div>

      <div className="relative w-full h-[48px] bg-slate-900/50 rounded border border-slate-800/80 p-1 flex items-center">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Underfill Area */}
          <path d={areaD} fill="url(#sparklineGrad)" />

          {/* Sparkline Line */}
          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Hover Hitboxes */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoverIdx === idx ? 4 : 2}
              fill={hoverIdx === idx ? activeTier.color : strokeColor}
              stroke="#090D16"
              strokeWidth={1.5}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoverIdx(idx)}
            />
          ))}

          {/* Hover Crosshair */}
          {hoverIdx !== null && (
            <line
              x1={activePoint.x}
              y1={0}
              x2={activePoint.x}
              y2={height}
              stroke="#94A3B8"
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.6}
            />
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-3xs font-mono text-slate-500">
        <span>MIN {minVal}</span>
        <span>MAX {maxVal}</span>
      </div>
    </div>
  );
}

export default AqiSparkline;
