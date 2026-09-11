import React from 'react';
import { Mountain, LayoutDashboard, FileText, Upload, Info, MapPin, Calendar } from 'lucide-react';

export default function Header({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
  currentView,
  onSwitchView,
  dateRange,
  setDateRange,
  onOpenUpload
}) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Mountain size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="brand-title">Watershed Monitor</span>
            <span className="sih-tag">SIH Demo</span>
          </div>
          <div className="brand-subtitle">AI & Satellite Conservation Telemetry Platform</div>
        </div>
      </div>

      <div className="header-controls">
        {/* Watershed Selector */}
        <div className="control-group">
          <MapPin size={16} className="text-primary" />
          <span className="control-label">Watershed:</span>
          <select
            className="select-input"
            value={selectedWatershedId}
            onChange={(e) => onSelectWatershed(e.target.value)}
          >
            {watersheds.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Selector */}
        <div className="control-group">
          <Calendar size={16} className="text-muted" />
          <span className="control-label">Period:</span>
          <select
            className="date-input"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="4Y">Multi-Year (2023 - 2026)</option>
            <option value="1Y">Last 12 Months</option>
            <option value="6M">Last 6 Months</option>
          </select>
        </div>

        {/* Multi-Page Navigation Bar */}
        <div className="view-tabs">
          <button
            className={`tab-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSwitchView('dashboard')}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>

          <button
            className={`tab-btn ${currentView === 'report' ? 'active' : ''}`}
            onClick={() => onSwitchView('report')}
          >
            <FileText size={15} />
            AI Reports
          </button>

          <button
            className="tab-btn"
            onClick={onOpenUpload}
          >
            <Upload size={15} />
            Upload
          </button>

          <button
            className={`tab-btn ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => onSwitchView('about')}
          >
            <Info size={15} />
            About System
          </button>
        </div>
      </div>
    </header>
  );
}
