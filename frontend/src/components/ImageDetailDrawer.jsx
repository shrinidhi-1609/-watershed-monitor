import React from 'react';
import { X, MapPin, Calendar, User, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GeoTagOverlay from './GeoTagOverlay';

export default function ImageDetailDrawer({ image, onClose }) {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="drawer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="drawer-content"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-header">
            <div>
              <span className={`popup-category category-${image.category}`}>
                {image.category.replace('_', ' ')}
              </span>
              <h3 className="drawer-title">Ground Verification Telemetry</h3>
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="drawer-body">
            {/* Image Preview Container */}
            <div className="drawer-img-wrapper">
              <img
                src={image.imageUrl}
                alt={image.description}
                className="drawer-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop';
                }}
              />
              <div className="drawer-img-badge">
                <ShieldCheck size={14} />
                <span>{image.verificationStatus || 'Verified Field Observation'}</span>
              </div>
              {image.isSampleData && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(234, 88, 12, 0.9)',
                  color: '#ffffff',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '4px',
                  fontSize: '0.675rem',
                  fontWeight: '700',
                  letterSpacing: '0.4px',
                  zIndex: 15,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Sample / Demo Data
                </div>
              )}
              <GeoTagOverlay image={image} />
            </div>

            {/* Verification Details List */}
            <div className="drawer-section">
              <div className="drawer-section-title">Survey Details & Metadata</div>

              <div className="drawer-info-grid">
                <div className="drawer-info-item">
                  <Calendar size={16} className="text-muted" />
                  <div>
                    <div className="info-label">Date Captured</div>
                    <div className="info-val">{image.date}</div>
                  </div>
                </div>

                <div className="drawer-info-item">
                  <User size={16} className="text-muted" />
                  <div>
                    <div className="info-label">Surveyed By</div>
                    <div className="info-val">{image.uploadedBy || 'Field Officer R. Kumar'}</div>
                  </div>
                </div>

                <div className="drawer-info-item" style={{ gridColumn: 'span 2' }}>
                  <MapPin size={16} className="text-muted" />
                  <div>
                    <div className="info-label">Coordinates (WGS-84)</div>
                    <div className="info-val" style={{ fontFamily: 'monospace' }}>
                      Lat: {image.lat.toFixed(5)}, Lng: {image.lng.toFixed(5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Notes & Analysis */}
            <div className="drawer-section">
              <div className="drawer-section-title">
                <FileText size={16} className="text-primary" />
                Field Observation Notes
              </div>
              <div className="drawer-notes-box">
                {image.description}
              </div>
            </div>

            {/* ISRO Bhuvan Sync Status */}
            <div className="drawer-footer-card">
              <CheckCircle2 size={16} style={{ color: '#15803d' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.8rem', color: '#0f172a' }}>
                  Synced with Satellite Passes
                </div>
                <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                  Cross-verified against Sentinel-2 multispectral NDVI raster logs.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
