import React, { useState } from 'react';
import WatershedMap from './WatershedMap';
import StatCards from './StatCards';
import UploadModal from './UploadModal';
import { Upload, FileText } from 'lucide-react';

export default function Dashboard({
  watershed,
  images,
  stats,
  onRefreshData,
  onNavigateToReport
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {/* Leaflet Map Area */}
        <WatershedMap watershed={watershed} images={images} />

        {/* Sidebar Stats Area */}
        <StatCards stats={stats} watershedName={watershed?.name} />
      </main>

      {/* Bottom Action Bar */}
      <footer className="bottom-bar">
        <button
          className="btn-secondary"
          onClick={() => setIsModalOpen(true)}
        >
          <Upload size={16} />
          Upload Field Photo
        </button>

        <button
          className="btn-primary"
          onClick={onNavigateToReport}
        >
          <FileText size={16} />
          Generate AI Report
        </button>
      </footer>

      {/* Upload Field Photo Modal */}
      {isModalOpen && (
        <UploadModal
          watershedId={watershed?.id}
          defaultLat={watershed?.center?.[0]}
          defaultLng={watershed?.center?.[1]}
          onClose={() => setIsModalOpen(false)}
          onSuccess={onRefreshData}
        />
      )}
    </div>
  );
}
