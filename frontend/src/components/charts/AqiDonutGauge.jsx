import React from 'react';
import { getAqiTier } from '../../constants/cities';

export function AqiDonutGauge({ value = 342, size = 180, strokeWidth = 14, title = 'LIVE AQI' }) {
  const tier = getAqiTier(value);
  const clampedValue = Math.min(Math.max(value, 0), 500);

  // SVG circular arc calculations (240-degree open gauge)
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const startAngle = 150;
  const endAngle = 390;
  const totalAngle = endAngle - startAngle;

  // Arc path generator
  const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (cx, cy, r, startA, endA) => {
    const start = polarToCartesian(cx, cy, r, endA);
    const end = polarToCartesian(cx, cy, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const backgroundArc = describeArc(center, center, radius, startAngle, endAngle);
  const progressAngle = startAngle + (clampedValue / 500) * totalAngle;
  const progressArc = describeArc(center, center, radius, startAngle, Math.max(progressAngle, startAngle + 0.1));

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Track background */}
        <path
          d={backgroundArc}
          fill="none"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Dynamic Colored Value Progress */}
        <path
          d={progressArc}
          fill="none"
          stroke={tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${tier.color}40)`,
          }}
        />

        {/* Threshold Markers */}
        {[50, 100, 200, 300, 400].map((t) => {
          const tAngle = startAngle + (t / 500) * totalAngle;
          const pos1 = polarToCartesian(center, center, radius - strokeWidth / 2 - 2, tAngle);
          const pos2 = polarToCartesian(center, center, radius + strokeWidth / 2 + 2, tAngle);
          return (
            <line
              key={t}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="#090D16"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* Hero Center Numerical Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
        <span className="font-mono text-3xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <span
          className="font-mono text-4xl lg:text-5xl font-extrabold tracking-tight font-tabular my-0.5"
          style={{ color: tier.color }}
        >
          {value}
        </span>
        <span
          className="px-2 py-0.5 rounded text-3xs font-bold uppercase tracking-wider font-mono border"
          style={{
            backgroundColor: `${tier.color}15`,
            color: tier.color,
            borderColor: `${tier.color}40`,
          }}
        >
          {tier.label}
        </span>
      </div>
    </div>
  );
}

export default AqiDonutGauge;
