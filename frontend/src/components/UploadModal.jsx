import React, { useState } from 'react';
import { X, Upload, MapPin, Camera, CheckCircle2, Image as ImageIcon, FileUp, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import exifr from 'exifr';

function LocationPicker({ position, setPosition }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      setPosition({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) });
    }
  });

  React.useEffect(() => {
    if (position?.lat && position?.lng) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function UploadModal({ watershedId, defaultLat, defaultLng, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    category: 'vegetation',
    description: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    uploadedBy: 'Field Officer R. Kumar'
  });

  const [coords, setCoords] = useState({
    lat: defaultLat || 10.99,
    lng: defaultLng || 76.75
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [exifStatus, setExifStatus] = useState(null); // null | { hasGps: bool, hasDate: bool }
  const [capturedAt, setCapturedAt] = useState('');
  const [fileName, setFileName] = useState('');

  const sampleImages = [
    { label: "Dense Forest Canopy", url: "https://images.unsplash.com/photo-1511497584788-876761c139ab?w=800&auto=format&fit=crop" },
    { label: "Percolation Pond", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop" },
    { label: "Check Dam Bund", url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop" },
    { label: "Erosion Gully", url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop" }
  ];

  const handleSelectSample = (url) => {
    setFormData({ ...formData, imageUrl: url });
    setPreviewUrl(url);
    setExifStatus(null);
    setFileName('');
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setPreviewUrl(url);
    setExifStatus(null);
    setFileName('');
  };

  // Real EXIF extraction from uploaded image file
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read as Data URL so image persists in backend memory
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);

    try {
      // 1. Extract GPS data
      const gps = await exifr.gps(file);
      // 2. Extract capture timestamp
      const parsed = await exifr.parse(file, ['DateTimeOriginal']);

      const hasGps = Boolean(gps && gps.latitude !== undefined && gps.longitude !== undefined);
      const hasDate = Boolean(parsed && parsed.DateTimeOriginal);

      if (hasGps) {
        setCoords({
          lat: Number(gps.latitude.toFixed(5)),
          lng: Number(gps.longitude.toFixed(5))
        });
      }

      if (hasDate) {
        const d = new Date(parsed.DateTimeOriginal);
        if (!isNaN(d.getTime())) {
          setFormData(prev => ({
            ...prev,
            date: d.toISOString().split('T')[0]
          }));
          setCapturedAt(d.toISOString());
        }
      }

      setExifStatus({ hasGps, hasDate });
    } catch (err) {
      console.warn('EXIF parse error:', err);
      setExifStatus({ hasGps: false, hasDate: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
      setError('Please provide a survey field description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalImage = previewUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop';
      const payload = {
        watershedId,
        lat: coords.lat,
        lng: coords.lng,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        capturedAt: capturedAt || (formData.date ? `${formData.date}T${new Date().toISOString().split('T')[1]}` : new Date().toISOString()),
        imageUrl: finalImage,
        uploadedBy: formData.uploadedBy,
        isSampleData: false
      };

      await axios.post('http://localhost:5000/api/images/upload', payload);
      setLoading(false);
      setShowToast(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setError('Failed to submit field photo. Please verify backend is running on port 5000.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} className="text-primary" />
            <span className="modal-title">Upload Field Verification Photo</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {showToast ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <CheckCircle2 size={48} style={{ color: '#15803d', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
              Field Telemetry Successfully Synced!
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              Marker pin and ISRO satellite logs updated on watershed map.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.825rem' }}>
                  {error}
                </div>
              )}

              {/* Click-to-Pin Mini Map Selector */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📍 Pin Exact Survey Location on Map</span>
                  <span style={{ color: '#15803d', fontWeight: '600', fontSize: '0.75rem' }}>
                    Click mini-map to adjust coordinates
                  </span>
                </label>
                <div style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <MapContainer
                    center={[coords.lat, coords.lng]}
                    zoom={13}
                    style={{ width: '100%', height: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker position={coords} setPosition={setCoords} />
                  </MapContainer>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Selected Coordinates: <strong>Lat {coords.lat}, Lng {coords.lng}</strong>
                </div>
              </div>

              {/* Form Grid */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Intervention Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="vegetation">Vegetation / Afforestation</option>
                    <option value="water_body">Water Body / Pond</option>
                    <option value="check_dam">Check Dam / Masonry Bund</option>
                    <option value="soil_erosion">Soil Erosion Zone</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Survey Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Real Photo File Upload with EXIF Extraction */}
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileUp size={15} className="text-primary" />
                    <strong>Upload Real Field Photo (EXIF GPS Extraction)</strong>
                  </span>
                </label>
                <div style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    id="real-photo-file-input"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="real-photo-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    <Camera size={22} style={{ color: '#15803d' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                      {fileName ? `Selected: ${fileName}` : 'Choose Phone / Camera Photo File'}
                    </span>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      Auto-extracts GPS coordinates & capture timestamp from photo EXIF metadata
                    </span>
                  </label>
                </div>

                {/* EXIF feedback badges */}
                {exifStatus?.hasGps && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    marginTop: '0.45rem'
                  }}>
                    <CheckCircle2 size={15} />
                    <span>✓ GPS & date read from photo (Pinned to Lat {coords.lat}, Lng {coords.lng})</span>
                  </div>
                )}

                {exifStatus && !exifStatus.hasGps && (
                  <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.775rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    marginTop: '0.45rem'
                  }}>
                    <Info size={15} />
                    <span>No GPS data found in this photo — please pin the location manually on the map above.</span>
                  </div>
                )}
              </div>

              {/* Or Quick Select Preset / Image URL */}
              <div className="form-group">
                <label className="form-label">Or Use Preset Demo Image / URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={handleUrlChange}
                />
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`sample-img-btn ${formData.imageUrl === s.url ? 'active' : ''}`}
                      onClick={() => handleSelectSample(s.url)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {previewUrl && (
                  <div className="upload-preview-box">
                    <img src={previewUrl} alt="Upload Preview" className="upload-preview-img" />
                    <span className="upload-preview-tag">Image Preview Ready</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Survey Observation & Field Notes</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  placeholder="Enter detailed observation notes on structure condition, crop canopy health, or silt levels..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                <Upload size={16} />
                {loading ? 'Syncing Telemetry...' : 'Submit Photo Marker'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
