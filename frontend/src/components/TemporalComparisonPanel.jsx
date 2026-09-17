import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Calendar,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  Columns2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  Layers,
  Eye,
  Info,
  Satellite
} from 'lucide-react';
import GeoTagOverlay from './GeoTagOverlay';
import { calculateDistanceMeters, calculateDaysElapsed, extractDistinctYears } from '../utils/compareHelpers';

const GIBS_ERROR_TILE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' fill='%230f172a'><rect width='256' height='256'/><text x='50%' y='45%' fill='%23f87171' font-size='12' font-weight='bold' text-anchor='middle' font-family='sans-serif'>Satellite Imagery Unavailable</text><text x='50%' y='60%' fill='%2394a3b8' font-size='10' text-anchor='middle' font-family='sans-serif'>Try an earlier or cloud-free date</text></svg>";

const CATEGORIES = [
  { id: 'vegetation', label: 'Vegetation Canopy' },
  { id: 'water_body', label: 'Water Body / Lake Basin' },
  { id: 'check_dam', label: 'Check Dam / Structure' },
  { id: 'soil_erosion', label: 'Soil Erosion Zone' }
];

// Helper to fit bounds on the spatial comparison map
function MapBoundsFitter({ center, boundary, markers = [] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const latLngs = markers.map(m => [m.lat, m.lng]);
      if (boundary && boundary.length > 0) {
        latLngs.push(...boundary);
      }
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15, animate: true });
    } else if (boundary && boundary.length > 0) {
      const bounds = L.latLngBounds(boundary);
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15, animate: true });
    } else if (center) {
      map.setView(center, 13);
    }
  }, [center, boundary, markers, map]);
  return null;
}

// Marker icon for Year A and Year B
const createMarkerIcon = (label, isYearA) => {
  const bgColor = isYearA ? '#ea580c' : '#15803d'; // Orange for Year A, Green for Year B
  return L.divIcon({
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        font-weight: 800;
        font-size: 10px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.45);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 1;
      ">
        <span style="font-size: 8px; opacity: 0.85;">${isYearA ? 'YR-A' : 'YR-B'}</span>
        <span style="font-size: 10px; font-weight: 900;">${label.slice(-2)}</span>
      </div>
    `,
    className: 'temporal-map-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function TemporalComparisonPanel({
  images = [],
  watershed,
  className = ''
}) {
  const [selectedCategory, setSelectedCategory] = useState('water_body');
  const [yearA, setYearA] = useState('');
  const [yearB, setYearB] = useState('');
  const [selectedImageIdA, setSelectedImageIdA] = useState('');
  const [selectedImageIdB, setSelectedImageIdB] = useState('');
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side'
  const [mapTab, setMapTab] = useState('gibs'); // 'gibs' (NASA Satellite Passes) | 'stations' (Ground Field Stations)
  const [gibsDateA, setGibsDateA] = useState('');
  const [gibsDateB, setGibsDateB] = useState('');

  const containerRef = useRef(null);

  // Extract distinct years present in the watershed for this category
  const availableYears = useMemo(() => {
    return extractDistinctYears(images, selectedCategory);
  }, [images, selectedCategory]);

  // When category changes or years populate, pick defaults if currently invalid
  useEffect(() => {
    if (availableYears.length >= 2) {
      // Default to earliest vs latest available years as a convenient starting point
      if (!availableYears.includes(yearA)) {
        setYearA(availableYears[0]);
      }
      if (!availableYears.includes(yearB) || yearB === yearA) {
        setYearB(availableYears[availableYears.length - 1]);
      }
    } else if (availableYears.length === 1) {
      setYearA(availableYears[0]);
      setYearB(availableYears[0]);
    } else {
      setYearA('');
      setYearB('');
    }
  }, [availableYears]);

  // Filter images for Year A and Year B in selected category
  const imagesInYearA = useMemo(() => {
    if (!yearA) return [];
    return images.filter(
      (img) => img.category === selectedCategory && img.date?.startsWith(yearA)
    );
  }, [images, selectedCategory, yearA]);

  const imagesInYearB = useMemo(() => {
    if (!yearB) return [];
    return images.filter(
      (img) => img.category === selectedCategory && img.date?.startsWith(yearB)
    );
  }, [images, selectedCategory, yearB]);

  // Handle selected image for Year A
  useEffect(() => {
    if (imagesInYearA.length > 0) {
      if (!imagesInYearA.some((img) => img.id === selectedImageIdA)) {
        setSelectedImageIdA(imagesInYearA[0].id);
      }
    } else {
      setSelectedImageIdA('');
    }
  }, [imagesInYearA]);

  // Handle selected image for Year B
  useEffect(() => {
    if (imagesInYearB.length > 0) {
      if (!imagesInYearB.some((img) => img.id === selectedImageIdB)) {
        setSelectedImageIdB(imagesInYearB[0].id);
      }
    } else {
      setSelectedImageIdB('');
    }
  }, [imagesInYearB]);

  const imageA = useMemo(
    () => imagesInYearA.find((img) => img.id === selectedImageIdA) || imagesInYearA[0],
    [imagesInYearA, selectedImageIdA]
  );

  const imageB = useMemo(
    () => imagesInYearB.find((img) => img.id === selectedImageIdB) || imagesInYearB[0],
    [imagesInYearB, selectedImageIdB]
  );

  // Synchronize NASA GIBS dates to image dates or mid-year baseline
  useEffect(() => {
    if (imageA?.date) {
      setGibsDateA(imageA.date);
    } else if (yearA) {
      setGibsDateA(`${yearA}-06-15`);
    }
  }, [yearA, imageA]);

  useEffect(() => {
    if (imageB?.date) {
      setGibsDateB(imageB.date);
    } else if (yearB) {
      setGibsDateB(`${yearB}-06-15`);
    }
  }, [yearB, imageB]);

  // Swap Year A and Year B
  const handleSwapYears = () => {
    const tempY = yearA;
    const tempId = selectedImageIdA;
    setYearA(yearB);
    setYearB(tempY);
    setSelectedImageIdA(selectedImageIdB);
    setSelectedImageIdB(tempId);
  };

  // Slider Drag logic
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };
    const onTouchMove = (e) => {
      if (!isDragging || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    };
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchend', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging, handleMove]);

  // Telemetry Calculations
  const daysElapsed = calculateDaysElapsed(imageA?.date, imageB?.date);
  const distanceMeters = calculateDistanceMeters(
    imageA?.lat,
    imageA?.lng,
    imageB?.lat,
    imageB?.lng
  );
  const isExactLocation = distanceMeters <= 35;

  // Markers to display on the spatial change map
  const mapMarkers = useMemo(() => {
    const list = [];
    if (imageA) list.push({ ...imageA, isYearA: true, label: yearA });
    if (imageB && imageB.id !== imageA?.id) list.push({ ...imageB, isYearA: false, label: yearB });
    return list;
  }, [imageA, imageB, yearA, yearB]);

  const defaultCenter = watershed?.center || [10.9863, 76.9649];
  const boundary = watershed?.boundary || [];

  return (
    <div className={`report-section temporal-comparison-section ${className}`}>
      {/* Section Header with Verbatim SIH Problem Statement Phrasing */}
      <div className="section-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={22} style={{ color: '#15803d' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Temporal Comparison — Spatial Change Detection
            </h2>
            <div style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
              Multi-Year Land Cover & Structure Verification Engine (SIH Ground Truth Telemetry)
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="compare-mode-toggle no-print">
          <button
            className={`mode-btn ${viewMode === 'slider' ? 'active' : ''}`}
            onClick={() => setViewMode('slider')}
          >
            <SlidersHorizontal size={14} /> Split Slider
          </button>
          <button
            className={`mode-btn ${viewMode === 'side-by-side' ? 'active' : ''}`}
            onClick={() => setViewMode('side-by-side')}
          >
            <Columns2 size={14} /> Side-by-Side
          </button>
        </div>
      </div>

      {/* Control Bar: Category Dropdown & Year A / Year B Selectors */}
      <div className="temporal-controls-card no-print">
        <div className="temporal-controls-grid">
          {/* 1. Category Dropdown */}
          <div className="temporal-control-group">
            <label className="temporal-control-label">
              <Layers size={14} className="text-primary" />
              <span>Domain Category:</span>
            </label>
            <select
              className="temporal-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({extractDistinctYears(images, cat.id).length} recorded years)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Year A Dropdown */}
          <div className="temporal-control-group">
            <label className="temporal-control-label">
              <span className="dot-before"></span>
              <span>Year A (Baseline):</span>
            </label>
            <select
              className="temporal-select"
              value={yearA}
              onChange={(e) => setYearA(e.target.value)}
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            className="swap-btn"
            onClick={handleSwapYears}
            title="Swap Year A and Year B"
            style={{ marginTop: 'auto', marginBottom: '4px' }}
          >
            <ArrowLeftRight size={15} />
          </button>

          {/* 3. Year B Dropdown */}
          <div className="temporal-control-group">
            <label className="temporal-control-label">
              <span className="dot-after"></span>
              <span>Year B (Follow-up):</span>
            </label>
            <select
              className="temporal-select"
              value={yearB}
              onChange={(e) => setYearB(e.target.value)}
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Photo Selectors if multiple photos exist in selected years */}
        {(imagesInYearA.length > 1 || imagesInYearB.length > 1) && (
          <div className="secondary-selectors-row">
            {imagesInYearA.length > 1 && (
              <div className="secondary-select-wrap">
                <span className="secondary-label">Photo for Year A ({imagesInYearA.length} available):</span>
                <select
                  className="secondary-select"
                  value={selectedImageIdA}
                  onChange={(e) => setSelectedImageIdA(e.target.value)}
                >
                  {imagesInYearA.map((img) => (
                    <option key={img.id} value={img.id}>
                      {img.date} — {img.description.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>
            )}

            {imagesInYearB.length > 1 && (
              <div className="secondary-select-wrap">
                <span className="secondary-label">Photo for Year B ({imagesInYearB.length} available):</span>
                <select
                  className="secondary-select"
                  value={selectedImageIdB}
                  onChange={(e) => setSelectedImageIdB(e.target.value)}
                >
                  {imagesInYearB.map((img) => (
                    <option key={img.id} value={img.id}>
                      {img.date} — {img.description.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Message: If either selected year has no image in this category */}
      {(!yearA || imagesInYearA.length === 0) && (
        <div className="temporal-warning-msg">
          <AlertTriangle size={18} />
          <span>No <strong>{selectedCategory.replace('_', ' ')}</strong> photos recorded for Year A ({yearA || 'Unselected'}).</span>
        </div>
      )}

      {(!yearB || imagesInYearB.length === 0) && (
        <div className="temporal-warning-msg">
          <AlertTriangle size={18} />
          <span>No <strong>{selectedCategory.replace('_', ' ')}</strong> photos recorded for Year B ({yearB || 'Unselected'}).</span>
        </div>
      )}

      {/* Main Comparison Section when both Year A and Year B have photos */}
      {imageA && imageB && (
        <div className="temporal-display-container">
          {/* 1. Spatial & Satellite Telemetry Map Card */}
          <div className="temporal-map-card">
            <div className="temporal-map-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Satellite size={16} className="text-primary" />
                <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>
                  Spatial &amp; Satellite Telemetry Verification
                </span>
              </div>

              {/* Mode Tabs: NASA Satellite Passes vs Ground Stations */}
              <div className="temporal-map-tabs no-print">
                <button
                  type="button"
                  className={`temporal-map-tab-btn ${mapTab === 'gibs' ? 'active' : ''}`}
                  onClick={() => setMapTab('gibs')}
                  title="Compare real NASA MODIS satellite passes by date"
                >
                  <Satellite size={13} /> NASA Satellite Passes (Side-by-Side)
                </button>
                <button
                  type="button"
                  className={`temporal-map-tab-btn ${mapTab === 'stations' ? 'active' : ''}`}
                  onClick={() => setMapTab('stations')}
                  title="View ground observation pin locations"
                >
                  <MapPin size={13} /> Field Ground Stations
                </button>
              </div>
            </div>

            {mapTab === 'gibs' ? (
              /* NASA GIBS Real Historical Satellite Imagery Side-by-Side */
              <>
                <div className="temporal-gibs-grid">
                  {/* Left: Year A Satellite Pass */}
                  <div className="gibs-map-subcard">
                    <div className="gibs-subcard-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="dot-before"></span>
                        <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#f8fafc' }}>
                          Year A ({yearA}) NASA Pass
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Date:</label>
                        <input
                          type="date"
                          className="gibs-date-input"
                          value={gibsDateA}
                          onChange={(e) => setGibsDateA(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="temporal-map-box" style={{ height: '270px' }}>
                      <MapContainer
                        key={`gibs-map-a-${watershed?.id}-${yearA}-${gibsDateA}-${imageA?.id}`}
                        center={defaultCenter}
                        zoom={12}
                        scrollWheelZoom={false}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <MapBoundsFitter
                          center={defaultCenter}
                          boundary={boundary}
                          markers={imageA ? [imageA] : []}
                        />
                        <TileLayer
                          key={`gibs-tile-a-${gibsDateA}`}
                          attribution="NASA EOSDIS GIBS | MODIS Terra Corrected Reflectance"
                          url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${gibsDateA}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
                          maxNativeZoom={9}
                          maxZoom={18}
                          tileSize={256}
                          errorTileUrl={GIBS_ERROR_TILE}
                        />
                        {boundary.length > 0 && (
                          <Polygon
                            positions={boundary}
                            pathOptions={{
                              color: '#4ade80',
                              weight: 2.5,
                              fillColor: '#22c55e',
                              fillOpacity: 0.16,
                              dashArray: '6, 6'
                            }}
                          />
                        )}
                        {imageA && (
                          <Marker
                            position={[imageA.lat, imageA.lng]}
                            icon={createMarkerIcon(yearA, true)}
                          >
                            <Popup>
                              <div style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                                <strong style={{ color: '#ea580c' }}>Year A ({yearA}) Field Site</strong>
                                <div>{imageA.date}</div>
                                <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
                                  {imageA.description}
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </div>
                  </div>

                  {/* Right: Year B Satellite Pass */}
                  <div className="gibs-map-subcard">
                    <div className="gibs-subcard-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="dot-after"></span>
                        <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#f8fafc' }}>
                          Year B ({yearB}) NASA Pass
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Date:</label>
                        <input
                          type="date"
                          className="gibs-date-input"
                          value={gibsDateB}
                          onChange={(e) => setGibsDateB(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="temporal-map-box" style={{ height: '270px' }}>
                      <MapContainer
                        key={`gibs-map-b-${watershed?.id}-${yearB}-${gibsDateB}-${imageB?.id}`}
                        center={defaultCenter}
                        zoom={12}
                        scrollWheelZoom={false}
                        style={{ width: '100%', height: '100%' }}
                      >
                        <MapBoundsFitter
                          center={defaultCenter}
                          boundary={boundary}
                          markers={imageB ? [imageB] : []}
                        />
                        <TileLayer
                          key={`gibs-tile-b-${gibsDateB}`}
                          attribution="NASA EOSDIS GIBS | MODIS Terra Corrected Reflectance"
                          url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${gibsDateB}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
                          maxNativeZoom={9}
                          maxZoom={18}
                          tileSize={256}
                          errorTileUrl={GIBS_ERROR_TILE}
                        />
                        {boundary.length > 0 && (
                          <Polygon
                            positions={boundary}
                            pathOptions={{
                              color: '#4ade80',
                              weight: 2.5,
                              fillColor: '#22c55e',
                              fillOpacity: 0.16,
                              dashArray: '6, 6'
                            }}
                          />
                        )}
                        {imageB && (
                          <Marker
                            position={[imageB.lat, imageB.lng]}
                            icon={createMarkerIcon(yearB, false)}
                          >
                            <Popup>
                              <div style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                                <strong style={{ color: '#15803d' }}>Year B ({yearB}) Field Site</strong>
                                <div>{imageB.date}</div>
                                <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
                                  {imageB.description}
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </div>
                  </div>
                </div>

                <div className="gibs-info-footer">
                  <Info size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <span>
                    <strong>NASA GIBS MODIS Terra True-Color (250m WMTS):</strong> Macro-scale surface reflectance comparison between {gibsDateA} and {gibsDateB}. Green dashed boundary represents the {watershed?.name || 'watershed'} Area of Interest (AOI).
                  </span>
                </div>
              </>
            ) : (
              /* Single Ground Telemetry Station Map */
              <>
                <div className="temporal-map-header" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <div className="temporal-map-legend-pills">
                    <span className="map-legend-pill pill-a">
                      <span className="dot-before"></span> Year A ({yearA}) Site Pin
                    </span>
                    <span className="map-legend-pill pill-b">
                      <span className="dot-after"></span> Year B ({yearB}) Site Pin
                    </span>
                    <span className="map-legend-pill" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                      Watershed AOI
                    </span>
                  </div>
                </div>

                <div className="temporal-map-box">
                  <MapContainer
                    key={`temporal-map-${watershed?.id}-${yearA}-${yearB}-${imageA?.id}-${imageB?.id}`}
                    center={defaultCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <MapBoundsFitter
                      center={defaultCenter}
                      boundary={boundary}
                      markers={mapMarkers}
                    />

                    {/* Standard OSM Tile Layer */}
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Watershed Boundary Polygon */}
                    {boundary.length > 0 && (
                      <Polygon
                        positions={boundary}
                        pathOptions={{
                          color: '#15803d',
                          weight: 2.5,
                          fillColor: '#16a34a',
                          fillOpacity: 0.12,
                          dashArray: '6, 6'
                        }}
                      />
                    )}

                    {/* Year A Marker */}
                    <Marker
                      position={[imageA.lat, imageA.lng]}
                      icon={createMarkerIcon(yearA, true)}
                    >
                      <Popup>
                        <div style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                          <strong style={{ color: '#ea580c' }}>Year A ({yearA})</strong>
                          <div>{imageA.date}</div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '3px' }}>
                            {imageA.description}
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Year B Marker */}
                    <Marker
                      position={[imageB.lat, imageB.lng]}
                      icon={createMarkerIcon(yearB, false)}
                    >
                      <Popup>
                        <div style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                          <strong style={{ color: '#15803d' }}>Year B ({yearB})</strong>
                          <div>{imageB.date}</div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '3px' }}>
                            {imageB.description}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </>
            )}
          </div>

          {/* 2. Before / After Image Slider with GeoTag Overlays */}
          {viewMode === 'slider' ? (
            <div className="compare-visualizer-section">
              <div
                ref={containerRef}
                className="compare-slider-box"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                {/* Year B Image (Background Layer) */}
                <div className="slider-layer layer-after">
                  <img
                    src={imageB.imageUrl}
                    alt={imageB.description}
                    className="slider-img"
                  />
                  <div className="slider-label-badge label-right">
                    YEAR B: {yearB} ({imageB.date})
                  </div>
                  <GeoTagOverlay image={imageB} />
                </div>

                {/* Year A Image (Top Layer clipped by sliderPos %) */}
                <div
                  className="slider-layer layer-before"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
                  }}
                >
                  <img
                    src={imageA.imageUrl}
                    alt={imageA.description}
                    className="slider-img"
                  />
                  <div className="slider-label-badge label-left">
                    YEAR A: {yearA} ({imageA.date})
                  </div>
                  <GeoTagOverlay image={imageA} />
                </div>

                {/* Draggable Divider Line & Handle */}
                <div
                  className="slider-divider"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="slider-divider-line"></div>
                  <div className="slider-handle" title="Drag to compare years">
                    <span style={{ fontSize: '10px', userSelect: 'none', fontWeight: 800 }}>◂ ▸</span>
                  </div>
                </div>
              </div>

              {/* Accessible range slider */}
              <div className="slider-range-control no-print">
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Year A ({yearA})</span>
                <input
                  type="range"
                  min="2"
                  max="98"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="slider-range-input"
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Year B ({yearB})</span>
              </div>
            </div>
          ) : (
            /* Side-by-Side Mode */
            <div className="compare-side-by-side-grid">
              <div className="compare-side-card">
                <div className="side-card-header">
                  <span className="dot-before"></span>
                  <span>YEAR A ({yearA}): {imageA.date}</span>
                </div>
                <div className="side-img-wrapper">
                  <img
                    src={imageA.imageUrl}
                    alt={imageA.description}
                    className="side-img"
                  />
                  <GeoTagOverlay image={imageA} />
                </div>
              </div>

              <div className="compare-side-card">
                <div className="side-card-header">
                  <span className="dot-after"></span>
                  <span>YEAR B ({yearB}): {imageB.date}</span>
                </div>
                <div className="side-img-wrapper">
                  <img
                    src={imageB.imageUrl}
                    alt={imageB.description}
                    className="side-img"
                  />
                  <GeoTagOverlay image={imageB} />
                </div>
              </div>
            </div>
          )}

          {/* 3. Analytical Metrics Panel Below */}
          <div className="compare-analysis-card">
            <div className="analysis-card-header">
              <Sparkles size={18} className="text-primary" />
              <h3 className="analysis-card-title">Comparative Analysis & Change Telemetry</h3>
            </div>

            {/* Metric Boxes */}
            <div className="analysis-metrics-row">
              {/* Metric 1: Temporal Interval */}
              <div className="metric-box">
                <div className="metric-icon-wrap" style={{ background: '#f0fdf4', color: '#15803d' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="metric-label">Temporal Interval</div>
                  <div className="metric-value">
                    {daysElapsed} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Days</span>
                  </div>
                  <div className="metric-sub">
                    Between {yearA} baseline and {yearB} survey ({(daysElapsed / 365.25).toFixed(1)} years)
                  </div>
                </div>
              </div>

              {/* Metric 2: Spatial Site Proximity */}
              <div className="metric-box">
                <div
                  className="metric-icon-wrap"
                  style={{
                    background: isExactLocation ? '#f0fdf4' : '#fff7ed',
                    color: isExactLocation ? '#15803d' : '#ea580c'
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="metric-label">Spatial Station Separation</div>
                  <div className="metric-value">
                    {distanceMeters} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Meters</span>
                  </div>
                  <div className="metric-sub">
                    {isExactLocation ? (
                      <span style={{ color: '#15803d', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={12} /> Exact Same Ground Station (&lt; 35m)
                      </span>
                    ) : (
                      <span style={{ color: '#ea580c', fontWeight: 600 }}>
                        Adjacent Station in Basin ({distanceMeters}m offset)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Metric 3: Observation Domain */}
              <div className="metric-box">
                <div className="metric-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="metric-label">Target Category</div>
                  <div className="metric-value" style={{ textTransform: 'capitalize' }}>
                    {selectedCategory.replace('_', ' ')}
                  </div>
                  <div className="metric-sub">
                    Consistent Ground-Truth Domain Class
                  </div>
                </div>
              </div>
            </div>

            {/* Coordinates Comparison Table */}
            <div className="coords-compare-table">
              <div className="coords-col">
                <div className="coords-col-title">
                  <span className="dot-before"></span> Year A ({yearA}) Coordinates
                </div>
                <div className="coords-mono">
                  Lat: {Number(imageA.lat).toFixed(5)}, Lng: {Number(imageA.lng).toFixed(5)}
                </div>
                <div className="coords-meta">
                  Captured: {imageA.date} • {imageA.uploadedBy || 'Field Officer'}
                </div>
              </div>

              <div className="coords-divider">
                <div className="dist-pill">
                  {distanceMeters}m spatial offset
                </div>
              </div>

              <div className="coords-col">
                <div className="coords-col-title">
                  <span className="dot-after"></span> Year B ({yearB}) Coordinates
                </div>
                <div className="coords-mono">
                  Lat: {Number(imageB.lat).toFixed(5)}, Lng: {Number(imageB.lng).toFixed(5)}
                </div>
                <div className="coords-meta">
                  Captured: {imageB.date} • {imageB.uploadedBy || 'Field Officer'}
                </div>
              </div>
            </div>

            {/* Field Notes Comparison Side-by-Side */}
            <div className="field-notes-compare-grid">
              <div className="note-card note-card-before">
                <div className="note-card-header">
                  <FileText size={15} style={{ color: '#ea580c' }} />
                  <span>Year A Observation ({imageA.date})</span>
                </div>
                <p className="note-text">{imageA.description}</p>
                <div className="note-footer">
                  Status: <strong>{imageA.verificationStatus || 'Verified Ground Truth'}</strong>
                </div>
              </div>

              <div className="note-card note-card-after">
                <div className="note-card-header">
                  <FileText size={15} style={{ color: '#15803d' }} />
                  <span>Year B Observation ({imageB.date})</span>
                </div>
                <p className="note-text">{imageB.description}</p>
                <div className="note-footer">
                  Status: <strong>{imageB.verificationStatus || 'Verified Ground Truth'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
