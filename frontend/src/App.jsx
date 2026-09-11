import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [watersheds, setWatersheds] = useState([]);
  const [selectedWatershedId, setSelectedWatershedId] = useState('');
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'report'
  const [dateRange, setDateRange] = useState('1Y');
  const [loading, setLoading] = useState(true);

  // Fetch watershed list on mount
  useEffect(() => {
    fetchWatersheds();
  }, []);

  // Fetch images and stats whenever selected watershed changes
  useEffect(() => {
    if (selectedWatershedId) {
      fetchWatershedDetails(selectedWatershedId);
    }
  }, [selectedWatershedId]);

  const fetchWatersheds = async () => {
    try {
      const res = await axios.get(`${API_BASE}/watersheds`);
      setWatersheds(res.data);
      if (res.data.length > 0) {
        setSelectedWatershedId(res.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching watersheds:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWatershedDetails = async (id) => {
    try {
      const [imagesRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/watersheds/${id}/images`),
        axios.get(`${API_BASE}/watersheds/${id}/stats`)
      ]);
      setImages(imagesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching watershed details:', err);
    }
  };

  const handleRefresh = () => {
    if (selectedWatershedId) {
      fetchWatershedDetails(selectedWatershedId);
    }
  };

  const activeWatershed = watersheds.find(w => w.id === selectedWatershedId);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        watersheds={watersheds}
        selectedWatershedId={selectedWatershedId}
        onSelectWatershed={setSelectedWatershedId}
        currentView={currentView}
        onSwitchView={setCurrentView}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, height: 'calc(100vh - 70px)' }}>
          <div style={{ color: '#15803d', fontWeight: '600' }}>Initializing Watershed Spatial Engine...</div>
        </div>
      ) : (
        <>
          {currentView === 'dashboard' ? (
            <Dashboard
              watershed={activeWatershed}
              images={images}
              stats={stats}
              onRefreshData={handleRefresh}
              onNavigateToReport={() => setCurrentView('report')}
            />
          ) : (
            <ReportView
              watershedId={selectedWatershedId}
              onBackToDashboard={() => setCurrentView('dashboard')}
            />
          )}
        </>
      )}
    </div>
  );
}
