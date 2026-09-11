import React from 'react';
import { Mountain, Satellite, ShieldCheck, Database, Layers, ArrowLeft, Cpu, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutView({ onBack }) {
  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-badge">Smart India Hackathon Project Demo</div>
        <h1>Watershed Development Monitoring System</h1>
        <p className="about-hero-lead">
          An integrated geospatial telemetry and AI analytics platform designed to track, measure, and optimize watershed conservation interventions (land, water, vegetation) using satellite remote sensing and ground-truth field data.
        </p>
      </div>

      {/* Core Technology Pillars */}
      <div className="about-grid">
        <div className="about-card">
          <div className="about-card-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>
            <Satellite size={24} />
          </div>
          <h3>Multi-Spectral Remote Sensing</h3>
          <p>
            Integrates Sentinel-2 L2A & ISRO Bhuvan satellite NDVI (Normalized Difference Vegetation Index) and NDWI rasters to monitor canopy biomass expansion and surface water spread across temporal quarters.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <Database size={24} />
          </div>
          <h3>Field Geo-Tagged Telemetry</h3>
          <p>
            Enables ground surveyors, Panchayats, and NGOs to upload geo-tagged field photos of check dams, farm ponds, afforestation blocks, and soil erosion zones for immediate spatial verification.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon" style={{ background: '#fffbeb', color: '#92400e' }}>
            <Cpu size={24} />
          </div>
          <h3>AI Narrative & Predictive Engine</h3>
          <p>
            Generates automated multi-lingual natural language progress reports, trend detection alerts, and machine-learning trajectory forecasts for upcoming rain cycles.
          </p>
        </div>
      </div>

      {/* System Architecture & Data Sources Section */}
      <div className="about-section">
        <h2 className="section-title">
          <Layers size={22} className="text-primary" />
          System Data Pipeline & Sources
        </h2>
        <div className="pipeline-flow">
          <div className="pipeline-step">
            <div className="step-num">1</div>
            <h4>Satellite Imagery Passes</h4>
            <p>Sentinel-2 Multispectral & ISRO Bhuvan Portal (10m Resolution)</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="step-num">2</div>
            <h4>Ground Truth Geo-Photos</h4>
            <p>Mobile App & Web Survey Uploads with EXIF GPS Coordinates</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="step-num">3</div>
            <h4>AI Spatial Analytics</h4>
            <p>Change Detection, Biomass Calculation & Hydrological Modeling</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <div className="step-num">4</div>
            <h4>Decision Support Dashboard</h4>
            <p>Interactive Map, Multi-Year Time-Lapse & PDF AI Reports</p>
          </div>
        </div>
      </div>

      {/* Problem Statement Context */}
      <div className="about-section" style={{ background: '#f8fafc' }}>
        <h2 className="section-title">
          <Mountain size={22} className="text-primary" />
          Problem Statement & Hackathon Context
        </h2>
        <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1rem' }}>
          Rainfed agricultural regions across India suffer from severe topsoil erosion, declining water tables, and biomass degradation. While watershed management projects (PMKSY-WDC) invest heavily in bunding, check dams, and tree planting, tracking multi-year progress across remote rural basins has historically lacked real-time spatial verification.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
          This prototype bridges the gap by combining high-frequency satellite telemetry with crowd-verified field photography to provide actionable insights to government administrators, village panchayats, and environmental scientists.
        </p>
      </div>
    </motion.div>
  );
}
