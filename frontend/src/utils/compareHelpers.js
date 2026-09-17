/**
 * compareHelpers.js
 * Utility calculations for Temporal Comparison & Spatial Change Detection.
 */

/**
 * Haversine formula to calculate great-circle distance in meters between two coordinates.
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }
  const R = 6371e3; // Earth radius in meters
  const φ1 = (Number(lat1) * Math.PI) / 180;
  const φ2 = (Number(lat2) * Math.PI) / 180;
  const Δφ = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
  const Δλ = ((Number(lon2) - Number(lon1)) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Calculate absolute days elapsed between two dates.
 */
export function calculateDaysElapsed(dateStrA, dateStrB) {
  if (!dateStrA || !dateStrB) return 0;
  const tA = new Date(dateStrA).getTime();
  const tB = new Date(dateStrB).getTime();
  if (isNaN(tA) || isNaN(tB)) return 0;
  return Math.abs(Math.round((tB - tA) / (1000 * 60 * 60 * 24)));
}

/**
 * Extract distinct sorted years from an array of images, optionally filtered by category.
 */
export function extractDistinctYears(images = [], category = 'all') {
  const filtered = category === 'all'
    ? images
    : images.filter((img) => img.category === category);

  const yearsSet = new Set();
  filtered.forEach((img) => {
    if (img.date) {
      const year = img.date.split('-')[0];
      if (year && !isNaN(Number(year))) {
        yearsSet.add(year);
      }
    }
  });

  return Array.from(yearsSet).sort((a, b) => Number(a) - Number(b));
}
