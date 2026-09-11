import React, { useState } from 'react';
import { X, Upload, MapPin, Camera } from 'lucide-react';
import axios from 'axios';

export default function UploadModal({ watershedId, defaultLat, defaultLng, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    lat: defaultLat || 10.99,
    lng: defaultLng || 76.75,
    category: 'vegetation',
    description: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
      setError('Please provide a field survey description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        watershedId,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        category: formData.category,
        description: formData.description,
        date: formData.date,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop'
      };

      await axios.post('http://localhost:5000/api/images/upload', payload);
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Make sure backend is running on port 5000.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} className="text-muted" />
            <span className="modal-title">Upload Geo-Tagged Field Photo</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.825rem' }}>
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  name="lat"
                  className="form-input"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  name="lng"
                  className="form-input"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="vegetation">Vegetation Cover</option>
                  <option value="water_body">Water Body / Pond</option>
                  <option value="check_dam">Check Dam / Bund</option>
                  <option value="soil_erosion">Soil Erosion Zone</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Survey Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Photo URL (Unsplash or Direct Link)</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                className="form-input"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                Leave empty to use a default realistic field image preview.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Survey Field Description</label>
              <textarea
                name="description"
                rows="3"
                className="form-textarea"
                placeholder="Describe ground verification observations, crop health, dam structure status..."
                value={formData.description}
                onChange={handleChange}
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
              {loading ? 'Saving...' : 'Submit Photo Marker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
