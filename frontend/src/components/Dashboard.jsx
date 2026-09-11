import React, { useState } from 'react';
import WatershedMap from './WatershedMap';
import StatCards from './StatCards';
import TimelineSlider, { TIMELINE_STEPS } from './TimelineSlider';
import UploadModal from './UploadModal';
import ImageDetailDrawer from './ImageDetailDrawer';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({
  watershed,
  images,
  stats,
  onRefreshData,
  onNavigateToReport
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(TIMELINE_STEPS.length - 1);

  // Filter images dynamically based on active timeline step date threshold
  const activeStep = TIMELINE_STEPS[activeStepIndex] || TIMELINE_STEPS[TIMELINE_STEPS.length - 1];
  const activeThresholdDate = activeStep.dateStr;

  const filteredImages = images.filter((img) => img.date <= activeThresholdDate);

  // Adjust stats dynamically based on timeline step for seamless time-lapse demonstration
  const historicalList = stats?.historical || [];
  const matchedHistorical = historicalList.find((h) => h.quarter === activeStep.label) || historicalList[historicalList.length - 1];

  const dynamicStats = {
    ...stats,
    vegetationCoverPct: matchedHistorical?.vegetationCoverPct ?? stats?.vegetationCoverPct,
    waterBodyAreaHectares: matchedHistorical?.waterBodyAreaHectares ?? stats?.waterBodyAreaHectares,
    structureCount: matchedHistorical?.structureCount ?? stats?.structureCount,
    healthScore: matchedHistorical?.healthScore ?? stats?.healthScore,
    imageCount: filteredImages.length
  };

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="dashboard-main">
        {/* Map & Timeline Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          <WatershedMap
            watershed={watershed}
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />

          {/* Horizontal Time-Series Timeline Slider */}
          <TimelineSlider
            activeStepIndex={activeStepIndex}
            onChangeStep={setActiveStepIndex}
          />
        </div>

        {/* Sidebar Telemetry Stats & Activity Feed */}
        <StatCards stats={dynamicStats} watershedName={watershed?.name} />
      </main>

      {/* Bottom Action Bar */}
      <footer className="bottom-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginRight: 'auto', fontSize: '0.8rem', color: '#64748b' }}>
          <Sparkles size={16} className="text-primary" />
          <span>Active Timeline: <strong>{activeStep.label}</strong> ({filteredImages.length} field markers active)</span>
        </div>

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

      {/* Image Inspection Drawer Side-Panel */}
      <ImageDetailDrawer
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </motion.div>
  );
}
