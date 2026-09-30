import React, { useEffect, useState, useRef } from 'react';
import { getAqiTier } from '../../constants/cities';

/**
 * Custom hook to smoothly interpolate/animate numeric counter transitions
 * Creates a fluid count-up or count-down effect over durationMs.
 */
function useAnimatedNumber(targetValue, durationMs = 600) {
  const [displayValue, setDisplayValue] = useState(targetValue || 0);
  const startValueRef = useRef(targetValue || 0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const startVal = displayValue;
    const endVal = targetValue || 0;
    if (startVal === endVal) return;

    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth ease-out quad curve
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startVal + (endVal - startVal) * easedProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = null;
      }
    };

    startTimeRef.current = null;
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, durationMs]);

  return displayValue;
}

/**
 * AqiDonutGauge - Precision Radial Air Quality Indicator
 * 
 * Implements a 240-degree open gauge calibrated against the CPCB National
 * Air Quality Index scale (0 - 500 AQI). Uses SVG stroke-dashoffset for hardware-accelerated
 * 60fps transitions and an easing numeric counter.
 *
 * @param {number} value - Active statutory AQI reading (0 to 500)
 * @param {number} size - Outer diameter of the gauge in pixels (default: 200)
 * @param {number} strokeWidth - Gauge track thickness (default: 16)
 * @param {string} title - Micro-label above the value (default: 'LIVE CAAQMS')
 */
export function AqiDonutGauge({ value = 342, size = 200, strokeWidth = 16, title = 'LIVE CAAQMS' }) {
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 250;
  const animatedNumber = useAnimatedNumber(safeValue, 700);
  const tier = getAqiTier(safeValue);
  const clampedValue = Math.min(Math.max(safeValue, 0), 500);

  // Geometry: 240-degree sweep (-210deg to +30deg)
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  // 240 degrees is (240 / 360) = 2/3 of a full circle
  const totalArcLength = circumference * (240 / 360);
  const filledLength = totalArcLength * (clampedValue / 500);
  const dashOffset = totalArcLength - filledLength;

  return (
    <div 
      className="relative flex flex-col items-center justify-center select-none" 
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={500}
      aria-label={`Air Quality Index: ${safeValue} (${tier.label})`}
    >
      <svg 
        width={size} 
        height={size} 
        className="overflow-visible transform rotate-[150deg]"
        style={{ transformOrigin: 'center' }}
      >
        {/* Background Track Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${totalArcLength} ${circumference}`}
        />

        {/* Dynamic Metric Progress Fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${totalArcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease',
            filter: `drop-shadow(0 2px 6px ${tier.color}40)`,
          }}
        />
      </svg>

      {/* Hero Center Numerical Readout (Counter and Statutory Badge) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none pt-2">
        <span className="font-mono text-3xs font-bold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        
        {/* Smoothly Animated Numeric Readout */}
        <div 
          className="font-mono text-4xl lg:text-5xl font-black tracking-tight font-tabular my-0.5 transition-colors duration-300"
          style={{ color: tier.color }}
        >
          {animatedNumber}
        </div>

        <span
          className="px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider font-mono border shadow-2xs transition-colors duration-300"
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
