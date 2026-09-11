import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper component to center map on boundary change
function MapRecenter({ center, boundary }) {
  const map = useMap();
  useEffect(() => {
    if (boundary && boundary.length > 0) {
      const bounds = L.latLngBounds(boundary);
      map.fitBounds(bounds, { padding: [30, 30] });
    } else if (center) {
      map.setView(center, 13);
    }
  }, [center, boundary, map]);
  return null;
}

// Custom Leaflet DivIcons for color-coded category markers
const createCustomIcon = (category) => {
  let color = '#15803d'; // vegetation green
  if (category === 'water_body') color = '#0284c7'; // blue
  if (category === 'check_dam') color = '#92400e'; // brown
  if (category === 'soil_erosion') color = '#ea580c'; // orange

  const html = `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function WatershedMap({ watershed, images }) {
  const defaultCenter = watershed?.center || [10.99, 76.75];
  const boundary = watershed?.boundary || [];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={defaultCenter} boundary={boundary} />
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
              weight: 3,
              fillColor: '#16a34a',
              fillOpacity: 0.15,
              dashArray: '6, 6'
            }}
          />
        )}

        {/* Field Photo Markers */}
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
                <span className={`popup-category category-${img.category}`}>
                  {img.category.replace('_', ' ')}
                </span>
                <div className="popup-date">📅 {img.date}</div>
                <div className="popup-desc">{img.description}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                  📍 Lat: {img.lat.toFixed(4)}, Lng: {img.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="map-legend">
        <div className="legend-title">Map Legend</div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#15803d' }}></span>
          Vegetation Cover
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#0284c7' }}></span>
          Water Body
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#92400e' }}></span>
          Check Dam / Bund
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#ea580c' }}></span>
          Soil Erosion Area
        </div>
        <div className="legend-item" style={{ marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
          <span style={{ borderBottom: '2px dashed #15803d', width: '14px', height: '0', display: 'inline-block' }}></span>
          Watershed Boundary
        </div>
      </div>
    </div>
  );
}
