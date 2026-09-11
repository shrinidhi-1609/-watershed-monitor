import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Calendar, FastForward } from 'lucide-react';

export const TIMELINE_STEPS = [
  { label: "2023 Q2", year: 2023, dateStr: "2023-06-30" },
  { label: "2023 Q4", year: 2023, dateStr: "2023-12-31" },
  { label: "2024 Q2", year: 2024, dateStr: "2024-06-30" },
  { label: "2024 Q4", year: 2024, dateStr: "2024-12-31" },
  { label: "2025 Q2", year: 2025, dateStr: "2025-06-30" },
  { label: "2025 Q4", year: 2025, dateStr: "2025-12-31" },
  { label: "2026 Q2", year: 2026, dateStr: "2026-06-30" },
  { label: "2026 Q3 (Current)", year: 2026, dateStr: "2026-09-30" }
];

export default function TimelineSlider({ activeStepIndex, onChangeStep }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onChangeStep((prev) => {
          if (prev >= TIMELINE_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500); // 1.5s step interval for smooth time-lapse demonstration
    }
    return () => clearInterval(interval);
  }, [isPlaying, onChangeStep]);

  const togglePlay = () => {
    if (activeStepIndex >= TIMELINE_STEPS.length - 1) {
      onChangeStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    onChangeStep(TIMELINE_STEPS.length - 1);
  };

  const currentStep = TIMELINE_STEPS[activeStepIndex] || TIMELINE_STEPS[TIMELINE_STEPS.length - 1];

  return (
    <div className="timeline-container">
      <div className="timeline-controls">
        <button
          className={`timeline-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? "Pause Time-Lapse" : "Play Time-Lapse Progress"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
          <span>{isPlaying ? 'Pause' : 'Time-Lapse'}</span>
        </button>

        <button
          className="timeline-reset-btn"
          onClick={handleReset}
          title="Reset to latest 2026 telemetry"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="timeline-slider-wrapper">
        <div className="timeline-ticks">
          {TIMELINE_STEPS.map((step, idx) => (
            <span
              key={idx}
              className={`timeline-tick-label ${idx === activeStepIndex ? 'active' : ''}`}
              onClick={() => {
                setIsPlaying(false);
                onChangeStep(idx);
              }}
            >
              {step.label}
            </span>
          ))}
        </div>

        <input
          type="range"
          min="0"
          max={TIMELINE_STEPS.length - 1}
          value={activeStepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            onChangeStep(parseInt(e.target.value, 10));
          }}
          className="timeline-range-input"
        />
      </div>

      <div className="timeline-badge">
        <Calendar size={14} className="text-primary" />
        <span>Active Horizon: <strong>{currentStep.label}</strong></span>
      </div>
    </div>
  );
}
