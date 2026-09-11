import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  FileText,
  Volume2,
  Globe,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  Droplets,
  TreePine,
  CheckCircle2
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportView({ watershedId, onBackToDashboard }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [watershedId]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/watersheds/${watershedId}/report`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleListenClick = () => {
    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(report?.narrativeReport || 'Loading report...');
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 4000);
    }
  };

  if (loading || !report) {
    return (
      <div className="report-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <Sparkles size={32} className="text-muted" style={{ animation: 'spin 2s linear infinite' }} />
        <div style={{ marginTop: '1rem', fontWeight: '600', color: '#64748b' }}>
          Generating AI Assessment & Remote Sensing Analytics...
        </div>
      </div>
    );
  }

  // Chart Data: Historical Vegetation vs Water Body Area
  const quarters = (report.historical || []).map(h => h.quarter);
  const vegData = (report.historical || []).map(h => h.vegetationCoverPct);
  const waterData = (report.historical || []).map(h => h.waterBodyAreaHectares);

  const mainChartData = {
    labels: quarters,
    datasets: [
      {
        type: 'line',
        label: 'Vegetation Cover (%)',
        borderColor: '#15803d',
        backgroundColor: '#15803d',
        data: vegData,
        borderWidth: 3,
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: 'Water Body Area (Hectares)',
        backgroundColor: 'rgba(2, 132, 199, 0.65)',
        data: waterData,
        borderRadius: 4,
        yAxisID: 'y1'
      }
    ]
  };

  const mainChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Vegetation Cover %' },
        min: 20,
        max: 60
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Water Body Area (ha)' },
        min: 0,
        max: 30
      }
    }
  };

  // Mini Trend Forecast Chart
  const predictionLabels = [...quarters, report.prediction.nextYear];
  const predictionVegData = [...vegData, report.prediction.predictedVegetation];

  const predictionChartData = {
    labels: predictionLabels,
    datasets: [
      {
        label: 'Vegetation Trajectory (%)',
        data: predictionVegData,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        fill: true,
        borderDash: (ctx) => (ctx.index >= quarters.length - 1 ? [6, 6] : []),
        pointRadius: 5,
        tension: 0.3
      }
    ]
  };

  return (
    <div className="report-container">
      {/* Back button */}
      <button className="btn-secondary" onClick={onBackToDashboard} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Header Banner */}
      <div className="report-header-banner">
        <div className="report-title-area">
          <h1>{report.watershedName} - Development Report</h1>
          <div className="report-meta">
            <div className="report-meta-item">
              <FileText size={15} />
              <span>Assessment Period: <strong>{report.period}</strong></span>
            </div>
            <div className="report-meta-item">
              <ShieldCheck size={15} />
              <span>AI Confidence Score: <strong>94.2%</strong></span>
            </div>
          </div>
        </div>

        <div className="report-actions">
          {/* Audio Placeholder */}
          <button
            className={`btn-secondary ${isPlayingAudio ? 'active' : ''}`}
            onClick={handleListenClick}
            style={{ borderColor: isPlayingAudio ? '#15803d' : '#e2e8f0' }}
          >
            <Volume2 size={16} className={isPlayingAudio ? 'text-primary' : ''} />
            {isPlayingAudio ? 'Speaking Report...' : '🔊 Listen to Report'}
          </button>

          {/* Language Selector Dropdown */}
          <div className="control-group" style={{ background: '#ffffff' }}>
            <Globe size={16} className="text-muted" />
            <select
              className="select-input"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Change Detection Cards Grid */}
      <div className="change-cards-grid">
        <div className="change-card">
          <div className="change-card-title">VEGETATION CHANGE</div>
          <div className={`change-card-val ${report.vegIsPositive ? 'positive' : 'negative'}`}>
            {report.vegetationChange}
          </div>
          <div className="change-card-sub">NDVI Satellite Index Change</div>
        </div>

        <div className="change-card">
          <div className="change-card-title">WATER RETENTION AREA</div>
          <div className={`change-card-val ${report.waterIsPositive ? 'positive' : 'negative'}`}>
            {report.waterBodyChange}
          </div>
          <div className="change-card-sub">Surface Reservoir Capacity</div>
        </div>

        <div className="change-card">
          <div className="change-card-title">STRUCTURES CONSTRUCTED</div>
          <div className="change-card-val" style={{ color: '#92400e' }}>
            +{report.newCheckDams} Check Dams
          </div>
          <div className="change-card-sub">Field verified masonry bunds</div>
        </div>

        <div className="change-card">
          <div className="change-card-title">SOIL EROSION CONTROL</div>
          <div className={`change-card-val ${report.soilIsPositive ? 'positive' : 'negative'}`}>
            {report.soilErosion}
          </div>
          <div className="change-card-sub">Topsoil displacement index</div>
        </div>
      </div>

      {/* AI Narrative Section */}
      <div className="report-section">
        <div className="section-heading">
          <Sparkles size={20} style={{ color: '#15803d' }} />
          AI Narrative Synthesis & Geospatial Insights
        </div>
        <div className="narrative-box">
          {report.narrativeReport}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="chart-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="chart-card">
          <div className="section-heading" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={18} />
            Quarterly Trajectory: Vegetation vs. Surface Water
          </div>
          <Bar data={mainChartData} options={mainChartOptions} height={190} />
        </div>

        <div className="chart-card">
          <div className="section-heading" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            <Sparkles size={18} style={{ color: '#16a34a' }} />
            Predictive Model (2027)
          </div>
          <Line data={predictionChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={190} />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem', textAlign: 'center' }}>
            Forecasted Vegetation: <strong>{report.prediction.predictedVegetation}%</strong> by {report.prediction.nextYear}
          </div>
        </div>
      </div>

      {/* Actionable Recommendations Section */}
      <div className="report-section">
        <div className="section-heading">
          <CheckCircle2 size={20} style={{ color: '#15803d' }} />
          Prioritized Conservation Recommendations
        </div>
        <ul className="recommendations-list">
          {report.recommendations.map((rec, idx) => (
            <li key={idx} className="recommendation-item">
              <CheckCircle2 size={18} className="recommendation-icon" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
