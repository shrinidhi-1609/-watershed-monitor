import React from 'react';
import { Camera, Satellite, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function ActivityFeed({ logs = [] }) {
  const getLogIcon = (type) => {
    switch (type) {
      case 'upload':
        return <Camera size={14} style={{ color: '#15803d' }} />;
      case 'satellite':
        return <Satellite size={14} style={{ color: '#0284c7' }} />;
      case 'alert':
        return <AlertTriangle size={14} style={{ color: '#ea580c' }} />;
      default:
        return <CheckCircle2 size={14} style={{ color: '#92400e' }} />;
    }
  };

  return (
    <div className="activity-feed-card">
      <div className="activity-feed-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.85rem' }}>
          <Clock size={16} className="text-muted" />
          Live Field & Satellite Activity Feed
        </div>
        <span className="live-pill">● LIVE</span>
      </div>

      <div className="activity-feed-list">
        {logs.map((log) => (
          <div key={log.id} className="activity-item">
            <div className="activity-icon-wrapper">
              {getLogIcon(log.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div className="activity-item-title">{log.title}</div>
              <div className="activity-item-desc">{log.desc}</div>
              <div className="activity-item-meta">
                <span>{log.author}</span> • <span>{log.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
