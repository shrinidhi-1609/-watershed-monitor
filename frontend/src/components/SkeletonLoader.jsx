import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-map pulse" />
      <div className="skeleton-sidebar">
        <div className="skeleton-card pulse" />
        <div className="skeleton-card pulse" />
        <div className="skeleton-card pulse" />
        <div className="skeleton-card pulse" />
      </div>
    </div>
  );
}
