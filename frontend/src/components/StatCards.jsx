import React from 'react';
import { TreePine, Droplets, Building2, Camera, Activity, TrendingUp } from 'lucide-react';

export default function StatCards({ stats, watershedName }) {
  if (!stats) return <div className="sidebar">Loading statistics...</div>;

  const {
    vegetationCoverPct = 0,
    waterBodyAreaHectares = 0,
    structureCount = 0,
    imageCount = 0,
    healthScore = 0
  } = stats;

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <Activity size={18} className="text-muted" />
        Watershed Telemetry & Metrics
      </div>

      <div className="stats-grid">
        {/* Vegetation Card */}
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
        </div>

        {/* Water Body Card */}
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
        </div>

        {/* Structure Count Card */}
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
        </div>

        {/* Image Count Card */}
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
        </div>

        {/* Health Score Card */}
        <div className="stat-card full-width">
          <div className="stat-header">
            <span className="stat-label">Overall Ecosystem Health Index</span>
            <span className={`health-badge ${healthScore >= 70 ? 'health-good' : 'health-moderate'}`}>
              <TrendingUp size={14} />
              {healthScore >= 70 ? 'Optimal Growth' : 'Moderate Stress'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.2rem' }}>
            <span className="stat-value" style={{ fontSize: '1.8rem', color: healthScore >= 70 ? '#15803d' : '#ca8a04' }}>
              {healthScore}
            </span>
            <span className="stat-unit" style={{ fontSize: '1rem' }}>/ 100</span>
          </div>
        </div>
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem', borderRadius: '8px', marginTop: 'auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.2rem' }}>
          SURVEY LOCATION
        </div>
        <div style={{ fontSize: '0.825rem', color: '#0f172a', fontWeight: '500' }}>
          {watershedName || 'Coimbatore Region'}
        </div>
        <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.3rem' }}>
          Satellite Sentinel-2 & ISRO Bhuvan composite imagery synced.
        </div>
      </div>
    </aside>
  );
}
