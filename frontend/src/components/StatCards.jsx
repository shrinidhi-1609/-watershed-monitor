import React from 'react';
import { TreePine, Droplets, Building2, Camera, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CircularProgress from './CircularProgress';
import ActivityFeed from './ActivityFeed';

export default function StatCards({ stats, watershedName }) {
  if (!stats) return null;

  const {
    vegetationCoverPct = 0,
    prevVegetationPct = 0,
    waterBodyAreaHectares = 0,
    prevWaterBodyArea = 0,
    structureCount = 0,
    prevStructureCount = 0,
    imageCount = 0,
    healthScore = 0,
    prevHealthScore = 0,
    activityLogs = []
  } = stats;

  const vegDiff = Number((vegetationCoverPct - prevVegetationPct).toFixed(1));
  const waterDiff = Number((waterBodyAreaHectares - prevWaterBodyArea).toFixed(1));
  const structDiff = structureCount - prevStructureCount;

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <Activity size={18} className="text-primary" />
        Watershed Telemetry & Health Index
      </div>

      <div className="stats-grid">
        {/* Ecosystem Health Score with Circular Ring */}
        <div className="stat-card full-width health-ring-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <CircularProgress score={healthScore} size={90} strokeWidth={9} />
            <div style={{ flex: 1 }}>
              <div className="stat-label" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                OVERALL ECOSYSTEM HEALTH INDEX
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: healthScore >= 70 ? '#15803d' : '#ca8a04' }}>
                {healthScore >= 70 ? 'Optimal Condition' : 'Moderate Stress'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                Synced with ISRO Bhuvan & Sentinel-2 rasters
              </div>

              <div className={`trend-badge ${healthScore >= prevHealthScore ? 'trend-up' : 'trend-down'}`} style={{ marginTop: '0.5rem' }}>
                {healthScore >= prevHealthScore ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{healthScore >= prevHealthScore ? `+${healthScore - prevHealthScore}` : `${healthScore - prevHealthScore}`} pts vs last quarter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vegetation Cover Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Vegetation Cover</span>
            <div className="stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>
              <TreePine size={18} />
            </div>
          </div>
          <div>
            <span className="stat-value">{vegetationCoverPct}</span>
            <span className="stat-unit">%</span>
          </div>
          <div className={`trend-badge ${vegDiff >= 0 ? 'trend-up' : 'trend-down'}`}>
            {vegDiff >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            <span>{vegDiff >= 0 ? `+${vegDiff}%` : `${vegDiff}%`}</span>
          </div>
        </div>

        {/* Water Body Area Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Water Body Area</span>
            <div className="stat-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
              <Droplets size={18} />
            </div>
          </div>
          <div>
            <span className="stat-value">{waterBodyAreaHectares}</span>
            <span className="stat-unit">ha</span>
          </div>
          <div className={`trend-badge ${waterDiff >= 0 ? 'trend-up' : 'trend-down'}`}>
            {waterDiff >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            <span>{waterDiff >= 0 ? `+${waterDiff} ha` : `${waterDiff} ha`}</span>
          </div>
        </div>

        {/* Check Dams / Bunds Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Check Dams / Bunds</span>
            <div className="stat-icon" style={{ background: '#fffbeb', color: '#92400e' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div>
            <span className="stat-value">{structureCount}</span>
            <span className="stat-unit">units</span>
          </div>
          <div className="trend-badge trend-up">
            <ArrowUpRight size={13} />
            <span>+{structDiff} structures</span>
          </div>
        </div>

        {/* Field Verification Photos Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Field Verification</span>
            <div className="stat-icon" style={{ background: '#f8fafc', color: '#64748b' }}>
              <Camera size={18} />
            </div>
          </div>
          <div>
            <span className="stat-value">{imageCount}</span>
            <span className="stat-unit">photos</span>
          </div>
          <div className="trend-badge trend-neutral">
            <span>Verified Ground Truth</span>
          </div>
        </div>
      </div>

      {/* Activity Log Feed */}
      <ActivityFeed logs={activityLogs} />
    </aside>
  );
}
