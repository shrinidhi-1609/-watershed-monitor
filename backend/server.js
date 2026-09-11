import express from 'express';
import cors from 'cors';
import { watersheds, images as initialImages, watershedStatsData, activityLogs } from './data/mockData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory stores
let imagesList = [...initialImages];
let logsList = [...activityLogs];

// GET /api/watersheds -> returns list of watersheds
app.get('/api/watersheds', (req, res) => {
  res.json(watersheds);
});

// GET /api/watersheds/:id/images -> returns geo-tagged images for watershed
app.get('/api/watersheds/:id/images', (req, res) => {
  const { id } = req.params;
  const filteredImages = imagesList.filter(img => img.watershedId === id);
  res.json(filteredImages);
});

// GET /api/watersheds/:id/stats -> returns watershed stats
app.get('/api/watersheds/:id/stats', (req, res) => {
  const { id } = req.params;
  const stats = watershedStatsData[id] || {
    vegetationCoverPct: 35.0,
    prevVegetationPct: 32.0,
    waterBodyAreaHectares: 15.0,
    prevWaterBodyArea: 14.0,
    structureCount: 10,
    prevStructureCount: 8,
    healthScore: 70,
    prevHealthScore: 65,
    historical: []
  };

  const count = imagesList.filter(img => img.watershedId === id).length;

  res.json({
    vegetationCoverPct: stats.vegetationCoverPct,
    prevVegetationPct: stats.prevVegetationPct,
    waterBodyAreaHectares: stats.waterBodyAreaHectares,
    prevWaterBodyArea: stats.prevWaterBodyArea,
    structureCount: stats.structureCount,
    prevStructureCount: stats.prevStructureCount,
    imageCount: count,
    healthScore: stats.healthScore,
    prevHealthScore: stats.prevHealthScore,
    historical: stats.historical,
    activityLogs: logsList
  });
});

// POST /api/images/upload -> accepts geo-tagged image and adds to in-memory list
app.post('/api/images/upload', (req, res) => {
  const { watershedId, lat, lng, category, description, date, imageUrl, uploadedBy } = req.body;

  if (!watershedId || !lat || !lng || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newImage = {
    id: `img_${Date.now()}`,
    watershedId,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    category: category || 'vegetation',
    description: description || 'Field survey submission',
    date: date || new Date().toISOString().split('T')[0],
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
    uploadedBy: uploadedBy || 'Field Officer',
    verificationStatus: 'Field Geo-Tagged'
  };

  imagesList.unshift(newImage);

  // Add to live activity feed
  logsList.unshift({
    id: Date.now(),
    type: 'upload',
    title: `New Photo Uploaded (${category.replace('_', ' ')})`,
    desc: description.substring(0, 45) + '...',
    time: 'Just now',
    author: uploadedBy || 'Field Surveyor'
  });

  if (category === 'check_dam' && watershedStatsData[watershedId]) {
    watershedStatsData[watershedId].structureCount += 1;
  }

  res.status(201).json(newImage);
});

// GET /api/watersheds/:id/report -> returns report object
app.get('/api/watersheds/:id/report', (req, res) => {
  const { id } = req.params;
  const watershed = watersheds.find(w => w.id === id) || watersheds[0];
  const stats = watershedStatsData[id] || watershedStatsData['Coimbatore_01'];
  const historical = stats.historical || [];

  const firstQ = historical[0] || { vegetationCoverPct: 28.5, waterBodyAreaHectares: 9.2 };
  const lastQ = historical[historical.length - 1] || { vegetationCoverPct: stats.vegetationCoverPct, waterBodyAreaHectares: stats.waterBodyAreaHectares };

  const vegDiff = Number((lastQ.vegetationCoverPct - firstQ.vegetationCoverPct).toFixed(1));
  const waterDiff = Number((lastQ.waterBodyAreaHectares - firstQ.waterBodyAreaHectares).toFixed(1));

  const vegChangeText = vegDiff >= 0 ? `+${vegDiff}%` : `${vegDiff}%`;
  const waterChangeText = waterDiff >= 0 ? `+${waterDiff} ha` : `${waterDiff} ha`;

  let narrativeReport = '';
  const recommendations = [];

  if (vegDiff >= 0) {
    narrativeReport += `Over the 4-year remote sensing assessment window (2023 to 2026), ${watershed.name} has demonstrated significant ecological recovery. Multispectral Sentinel-2 & ISRO Bhuvan imagery records a ${vegChangeText} net increase in canopy biomass, driven by targeted ridge-to-valley afforestation across upper slopes. `;
  } else {
    narrativeReport += `Over the multi-year assessment period, ${watershed.name} registered a ${vegChangeText} decline in green biomass index. Remote sensing thermal and moisture rasters highlight localized vegetation stress due to erratic precipitation and surface runoff loss. `;
  }

  if (waterDiff >= 0) {
    narrativeReport += `Surface water retention area grew by ${waterChangeText}, reinforced by strategic percolation bunding and desiltation of village tanks. Ground water recharge sensors reflect a 1.8-meter rise in local aquifer levels. `;
  } else {
    narrativeReport += `Surface water body area shrank by ${waterChangeText}, calling for urgent desiltation of primary drainage channels before the next monsoon season. `;
  }

  narrativeReport += `Field verification logs from local officers confirm active community participation and structural maintenance. Predictive spatial models project continued positive trajectory under sustained conservation protocols.`;

  if (vegDiff < 0) {
    recommendations.push('Initiate high-density native afforestation along upper catchment slopes to reverse canopy loss.');
  } else {
    recommendations.push('Maintain protective bio-fencing and conduct quarterly survival audits on young plantations.');
  }

  if (waterDiff < 0) {
    recommendations.push('Execute priority desiltation of major percolation ponds before the northeast monsoon.');
  } else {
    recommendations.push('Construct emergency masonry spillways on check dams to handle peak discharge events safely.');
  }

  recommendations.push('Install automated telemetry water level sensors at key check dam nodes for real-time hydrological tracking.');
  recommendations.push('Deploy community ridge-to-valley contour bunding teams in high-gradient erosion sectors.');

  const predictedVeg = vegDiff >= 0 ? Number((stats.vegetationCoverPct + 3.4).toFixed(1)) : Number((stats.vegetationCoverPct + 1.2).toFixed(1));

  res.json({
    watershedId: id,
    watershedName: watershed.name,
    period: '2023 - 2026 Multi-Year Assessment',
    vegetationChange: vegChangeText,
    vegIsPositive: vegDiff >= 0,
    waterBodyChange: waterChangeText,
    waterIsPositive: waterDiff >= 0,
    newCheckDams: stats.structureCount >= 10 ? 4 : 2,
    soilErosion: vegDiff >= 0 ? 'Reduced by 22.4%' : 'Increased by 9.1%',
    soilIsPositive: vegDiff >= 0,
    healthScore: stats.healthScore,
    narrativeReport,
    historical,
    prediction: {
      nextYear: '2027 (Forecast)',
      predictedVegetation: predictedVeg
    },
    recommendations
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
