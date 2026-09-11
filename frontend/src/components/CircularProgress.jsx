import React from 'react';

export default function CircularProgress({ score, size = 110, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let color = '#15803d'; // green
  if (score < 70) color = '#ca8a04'; // yellow
  if (score < 50) color = '#dc2626'; // red

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease' }}
        />
      </svg>
      {/* Centered Score Label */}
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', lineHeight: '1' }}>
          {score}
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>
          / 100
        </div>
      </div>
    </div>
  );
}
