import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import L from 'leaflet';
import { Layers, ChevronDown, ChevronUp, Eye, MapPin } from 'lucide-react';

// Helper component to center and fit bounds smoothly
function MapRecenter({ center, boundary }) {
  const map = useMap();
  useEffect(() => {
    if (boundary && boundary.length > 0) {
      const bounds = L.latLngBounds(boundary);
      map.fitBounds(bounds, { padding: [40, 40], animate: true, duration: 1.2 });
    } else if (center) {
      map.setView(center, 13, { animate: true, duration: 1.2 });
    }
  }, [center, boundary, map]);
  return null;
}

// Custom DivIcons per category
const createCustomIcon = (category) => {
  let color = '#15803d'; // vegetation green
  if (category === 'water_body') color = '#0284c7'; // water blue
  if (category === 'check_dam') color = '#92400e'; // earth brown
  if (category === 'soil_erosion') color = '#ea580c'; // erosion orange

  const html = `
    <div style="
      background-color: ${color};
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    ">
      <div style="width: 7px; height: 7px; background-color: white; border-radius: 50%;"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13]
  });
};

export default function WatershedMap({ watershed, images, onSelectImage }) {
  const defaultCenter = watershed?.center || [10.99, 76.75];
  const boundary = watershed?.boundary || [];

  // Map Layer State: 'osm' or 'satellite'
  const [mapLayer, setMapLayer] = useState('osm');
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={defaultCenter} boundary={boundary} />

        {/* Dynamic Tile Layer Switching */}
        {mapLayer === 'osm' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Watershed Boundary Polygon with Glowing Dashed Line Effect */}
        {boundary.length > 0 && (
          <Polygon
            positions={boundary}
            pathOptions={{
              color: mapLayer === 'satellite' ? '#4ade80' : '#15803d',
              weight: 3.5,
              fillColor: '#16a34a',
              fillOpacity: mapLayer === 'satellite' ? 0.22 : 0.12,
              dashArray: '8, 8',
              className: 'animated-boundary-polygon'
            }}
          />
        )}

        {/* Marker Clustering Group */}
        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {images.map((img) => (
            <Marker
              key={img.id}
              position={[img.lat, img.lng]}
              icon={createCustomIcon(img.category)}
            >
              <Popup>
                <div className="popup-card">
                  <img
                    src={img.imageUrl}
                    alt={img.description}
                    className="popup-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop';
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span className={`popup-category category-${img.category}`}>
                      {img.category.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{img.date}</span>
                  </div>
                  <div className="popup-desc">{img.description}</div>
                  
                  <button
                    className="popup-detail-btn"
                    onClick={() => onSelectImage(img)}
                  >
                    <Eye size={13} /> View Full Inspection Panel
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Layer Switcher Floating Button */}
      <div className="map-layer-switcher">
        <button
          className={`layer-btn ${mapLayer === 'osm' ? 'active' : ''}`}
          onClick={() => setMapLayer('osm')}
        >
          <Layers size={14} /> Street Map
        </button>
        <button
          className={`layer-btn ${mapLayer === 'satellite' ? 'active' : ''}`}
          onClick={() => setMapLayer('satellite')}
        >
          <Layers size={14} /> Esri Satellite
        </button>
      </div>

      {/* Collapsible Map Legend */}
      <div className="map-legend">
        <div
          className="legend-header"
          onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
          title="Toggle Legend"
        >
          <div className="legend-title">Spatial Legend</div>
          {isLegendCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>

        {!isLegendCollapsed && (
          <div className="legend-body">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#15803d' }}></span>
              Vegetation Canopy
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#0284c7' }}></span>
              Water Body / Pond
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#92400e' }}></span>
              Check Dam Structure
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#ea580c' }}></span>
              Soil Erosion Zone
            </div>
            <div className="legend-item" style={{ marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0', fontSize: '0.725rem', color: '#64748b' }}>
              <span style={{ borderBottom: '2px dashed #15803d', width: '14px', height: '0', display: 'inline-block' }}></span>
              Watershed Boundary
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
