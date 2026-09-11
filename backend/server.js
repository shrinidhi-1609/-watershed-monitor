import express from 'express';
import cors from 'cors';
import { watersheds, images as initialImages, watershedStatsData } from './data/mockData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory images store
let imagesList = [...initialImages];

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
    waterBodyAreaHectares: 15.0,
    structureCount: 10,
    healthScore: 70,
    historical: []
  };

  // Dynamically count current images for this watershed
  const count = imagesList.filter(img => img.watershedId === id).length;

  res.json({
    vegetationCoverPct: stats.vegetationCoverPct,
    waterBodyAreaHectares: stats.waterBodyAreaHectares,
    structureCount: stats.structureCount,
    imageCount: count,
    healthScore: stats.healthScore,
    historical: stats.historical
  });
});

// POST /api/images/upload -> accepts geo-tagged image and adds to in-memory list
app.post('/api/images/upload', (req, res) => {
  const { watershedId, lat, lng, category, description, date, imageUrl } = req.body;

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
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop'
  };

  imagesList.unshift(newImage);

  // Optionally update structure count if category is check_dam
  if (category === 'check_dam' && watershedStatsData[watershedId]) {
    watershedStatsData[watershedId].structureCount += 1;
  }

  res.status(201).json(newImage);
});

// GET /api/watersheds/:id/report -> returns AI-style report object with dynamic logic
app.get('/api/watersheds/:id/report', (req, res) => {
  const { id } = req.params;
  const watershed = watersheds.find(w => w.id === id) || watersheds[0];
  const stats = watershedStatsData[id] || watershedStatsData['Coimbatore_01'];
  const historical = stats.historical || [];

  const firstQ = historical[0] || { vegetationCoverPct: 35, waterBodyAreaHectares: 12 };
  const lastQ = historical[historical.length - 1] || { vegetationCoverPct: stats.vegetationCoverPct, waterBodyAreaHectares: stats.waterBodyAreaHectares };

  const vegDiff = Number((lastQ.vegetationCoverPct - firstQ.vegetationCoverPct).toFixed(1));
  const waterDiff = Number((lastQ.waterBodyAreaHectares - firstQ.waterBodyAreaHectares).toFixed(1));

  const vegChangeText = vegDiff >= 0 ? `+${vegDiff}%` : `${vegDiff}%`;
  const waterChangeText = waterDiff >= 0 ? `+${waterDiff} ha` : `${waterDiff} ha`;

  // Generate Narrative Report
  let narrativeReport = '';
  const recommendations = [];

  if (vegDiff >= 0) {
    narrativeReport += `Over the monitoring cycle (Q3 2025 to Q3 2026), ${watershed.name} has demonstrated substantial environmental regeneration. Satellite remote sensing data indicates a ${vegChangeText} increase in overall canopy density, primarily driven by successful afforestation along slope contours and stream buffer zones. `;
  } else {
    narrativeReport += `Over the monitoring cycle, ${watershed.name} exhibited a ${vegChangeText} decline in green biomass coverage. Satellite NDVI signals indicate localized canopy stress near lower agricultural boundaries due to delayed monsoon precipitation and topsoil run-off. `;
  }

  if (waterDiff >= 0) {
    narrativeReport += `Surface water retention expanded by ${waterChangeText}, boosted by the strategic placement of check dams and desilted farm ponds. Ground recharge indicators show improved water table levels across surrounding community borewells. `;
  } else {
    narrativeReport += `Water body surface area decreased by ${waterChangeText}, indicating silt accumulation in primary drainage channels and reduced seasonal holding capacity. `;
  }

  narrativeReport += `Field verification photo logs confirm active community involvement and steady structure installation. Predictive AI spatial models forecast continued positive trajectory if soil conservation measures are sustained through the upcoming rainfall season.`;

  // Recommendations logic based on thresholds
  if (vegDiff < 0) {
    recommendations.push('Initiate high-density native tree plantation drives along upper catchment slopes to combat biomass loss.');
  } else {
    recommendations.push('Maintain existing plantation fencing and monitor seedling survival rates during the dry quarter.');
  }

  if (waterDiff < 0) {
    recommendations.push('Schedule desiltation operations for primary village percolation tanks prior to the northeast monsoon.');
  } else {
    recommendations.push('Construct secondary spillways on check dams to manage peak runoff during high-intensity rainfall events.');
  }

  recommendations.push('Install automated telemetry water level sensors at key check dam nodes for real-time hydrological tracking.');
  recommendations.push('Deploy community ridge-to-valley soil bunding teams in high slope gradient zones to curb topsoil runoff.');

  const predictedVeg = vegDiff >= 0 ? Number((stats.vegetationCoverPct + 3.4).toFixed(1)) : Number((stats.vegetationCoverPct + 1.2).toFixed(1));

  res.json({
    watershedId: id,
    watershedName: watershed.name,
    period: 'Q3 2025 - Q3 2026',
    vegetationChange: vegChangeText,
    vegIsPositive: vegDiff >= 0,
    waterBodyChange: waterChangeText,
    waterIsPositive: waterDiff >= 0,
    newCheckDams: stats.structureCount >= 10 ? 4 : 2,
    soilErosion: vegDiff >= 0 ? 'Reduced by 18.5%' : 'Increased by 8.2%',
    soilIsPositive: vegDiff >= 0,
    healthScore: stats.healthScore,
    narrativeReport,
    historical,
    prediction: {
      nextYear: '2027 Q3 (Forecast)',
      predictedVegetation: predictedVeg
    },
    recommendations
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
