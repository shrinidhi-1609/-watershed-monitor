import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Clock, Compass, Navigation } from 'lucide-react';

// In-memory cache for Nominatim reverse geocoding results
const geocodeCache = new Map();

// Helper to trigger map size invalidation after mounting inside thumbnail
function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (e) {
        // fail silently
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Mini pin icon for thumbnail
const miniPinIcon = L.divIcon({
  html: `
    <div style="
      width: 12px;
      height: 12px;
      background: #ef4444;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(0,0,0,0.5);
    "></div>
  `,
  className: 'geotag-pin-marker',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

export default function GeoTagOverlay({
  image,
  lat: propLat,
  lng: propLng,
  date: propDate,
  capturedAt: propCapturedAt,
  size = 'default',
  className = '',
  style = {}
}) {
  const lat = propLat ?? image?.lat;
  const lng = propLng ?? image?.lng;
  const date = propDate ?? image?.date;
  const capturedAt = propCapturedAt ?? image?.capturedAt;

  const [placeName, setPlaceName] = useState('');
  const isMountedRef = useRef(true);

  // Reverse geocoding via Nominatim
  useEffect(() => {
    isMountedRef.current = true;
    if (lat === undefined || lng === undefined) return;

    const cacheKey = `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`;
    if (geocodeCache.has(cacheKey)) {
      setPlaceName(geocodeCache.get(cacheKey));
      return;
    }

    const controller = new AbortController();
    const fetchPlace = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!isMountedRef.current) return;

        // Construct short, readable place name
        const addr = data.address || {};
        const local = addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || addr.road || '';
        const city = addr.city || addr.town || addr.county || addr.state_district || '';
        let formatted = '';
        if (local && city) {
          formatted = `${local}, ${city}`;
        } else if (local) {
          formatted = local;
        } else if (city) {
          formatted = city;
        } else if (data.display_name) {
          formatted = data.display_name.split(',').slice(0, 2).join(',').trim();
        }

        if (formatted) {
          geocodeCache.set(cacheKey, formatted);
          setPlaceName(formatted);
        }
      } catch (err) {
        // Fail silently - never block rendering
      }
    };

    fetchPlace();

    return () => {
      isMountedRef.current = false;
      controller.abort();
    };
  }, [lat, lng]);

  if (lat === undefined || lng === undefined) return null;

  // Format timestamp: show date + time if capturedAt is present, otherwise fallback to date only
  const formatDateTime = () => {
    if (capturedAt) {
      try {
        const d = new Date(capturedAt);
        if (!isNaN(d.getTime())) {
          return d.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
        }
      } catch (e) {
        // fallback
      }
    }
    return date || 'Date Unavailable';
  };

  const isCompact = size === 'compact';

  return (
    <div
      className={`geotag-overlay ${isCompact ? 'geotag-compact' : 'geotag-default'} ${className}`}
      style={style}
    >
      {/* Static Map Thumbnail */}
      <div className={`geotag-map-thumb ${isCompact ? 'thumb-compact' : 'thumb-default'}`}>
        <MapContainer
          key={`geotag-map-${Number(lat).toFixed(5)}-${Number(lng).toFixed(5)}-${size}`}
          center={[lat, lng]}
          zoom={15}
          dragging={false}
          zoomControl={false}
          scrollWheelZoom={false}
          attributionControl={false}
          doubleClickZoom={false}
          touchZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapInvalidator />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} icon={miniPinIcon} />
        </MapContainer>
        <div className="geotag-gps-badge">GPS</div>
      </div>

      {/* Telemetry Metadata Block */}
      <div className="geotag-meta">
        {/* Header line: Stamp & Place */}
        <div className="geotag-stamp-row">
          <span className="geotag-tag">
            <Compass size={isCompact ? 10 : 12} />
            GEO-STAMP
          </span>
          {image?.isSampleData && (
            <span style={{
              background: 'rgba(234, 88, 12, 0.35)',
              color: '#fdba74',
              border: '1px solid rgba(251, 146, 60, 0.5)',
              fontSize: isCompact ? '0.525rem' : '0.6rem',
              fontWeight: '800',
              padding: '1px 4px',
              borderRadius: '3px',
              letterSpacing: '0.4px'
            }}>
              SAMPLE DATA
            </span>
          )}
          {placeName && (
            <span className="geotag-place" title={placeName}>
              <MapPin size={isCompact ? 10 : 12} />
              {placeName}
            </span>
          )}
        </div>

        {/* Coordinates */}
        <div className="geotag-coords">
          <Navigation size={isCompact ? 10 : 12} className="geotag-icon" />
          <span>
            Lat: <strong>{Number(lat).toFixed(5)}</strong>, Lng: <strong>{Number(lng).toFixed(5)}</strong>
          </span>
        </div>

        {/* Timestamp */}
        <div className="geotag-timestamp">
          <Clock size={isCompact ? 10 : 12} className="geotag-icon" />
          <span>{formatDateTime()}</span>
        </div>
      </div>
    </div>
  );
}
