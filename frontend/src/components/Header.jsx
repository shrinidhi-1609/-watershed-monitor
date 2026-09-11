import React from 'react';
import { Mountain, LayoutDashboard, FileText, Calendar, MapPin } from 'lucide-react';

export default function Header({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
  currentView,
  onSwitchView,
  dateRange,
  setDateRange
}) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Mountain size={22} />
        </div>
        <div>
          <div className="brand-title">Watershed Monitor</div>
          <div className="brand-subtitle">AI & Geospatial Conservation System</div>
        </div>
      </div>

      <div className="header-controls">
        {/* Watershed Selector */}
        <div className="control-group">
          <MapPin size={16} className="text-muted" />
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
          <span className="control-label">Range:</span>
          <select
            className="date-input"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="1Y">Last 12 Months (2025 - 2026)</option>
            <option value="6M">Last 6 Months</option>
            <option value="3M">Last 3 Months</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="view-tabs">
          <button
            className={`tab-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onSwitchView('dashboard')}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            className={`tab-btn ${currentView === 'report' ? 'active' : ''}`}
            onClick={() => onSwitchView('report')}
          >
            <FileText size={16} />
            AI Report
          </button>
        </div>
      </div>
    </header>
  );
}
