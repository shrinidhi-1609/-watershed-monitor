export const watersheds = [
  {
    id: "Coimbatore_01",
    name: "Coimbatore 01 (Ukkadam Lake Basin - ISRO Bhuvan AOI)",
    center: [10.9863, 76.9649],
    boundary: [
      [10.996365, 76.967222], // North
      [10.9841, 76.9787],     // East
      [10.9782, 76.9685],     // South
      [10.9868, 76.9452]      // West
    ]
  },
  {
    id: "Coimbatore_02",
    name: "Coimbatore 02 (Bhavani Sub-basin - Mettupalayam)",
    center: [11.28, 76.94],
    boundary: [
      [11.34, 76.88],
      [11.35, 76.99],
      [11.26, 77.02],
      [11.21, 76.95],
      [11.23, 76.87]
    ]
  }
];

export const images = [
  // Watershed Coimbatore_01 (10 images placed strictly within Ukkadam Lake boundary)
  {
    id: "img_101",
    watershedId: "Coimbatore_01",
    lat: 10.9910,
    lng: 76.9630,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Urban afforestation belt monitored along Ukkadam North feeder canal.",
    date: "2023-06-14",
    uploadedBy: "Field Officer R. Kumar",
    verificationStatus: "Verified Ground Truth"
  },
  {
    id: "img_102",
    watershedId: "Coimbatore_01",
    lat: 10.9845,
    lng: 76.9680,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Ukkadam Lake main water body area (73.0 ha) verified post-monsoon.",
    date: "2023-11-20",
    uploadedBy: "Hydrology Analyst D. Ramesh",
    verificationStatus: "ISRO Bhuvan L23 Class Verified"
  },
  {
    id: "img_103",
    watershedId: "Coimbatore_01",
    lat: 10.9815,
    lng: 76.9550,
    imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop",
    category: "check_dam",
    description: "Inlet sluice gate structure controlling Noyyal river overflow into lake.",
    date: "2024-03-10",
    uploadedBy: "PWD Engineer V. Natarajan",
    verificationStatus: "Structure Inspected"
  },
  {
    id: "img_104",
    watershedId: "Coimbatore_01",
    lat: 10.9860,
    lng: 76.9480,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop",
    category: "soil_erosion",
    description: "Silt accumulation patch at West bund channel requiring desiltation.",
    date: "2024-08-05",
    uploadedBy: "Soil Conservation Officer S. Mohan",
    verificationStatus: "Desiltation Flagged"
  },
  {
    id: "img_105",
    watershedId: "Coimbatore_01",
    lat: 10.9940,
    lng: 76.9670,
    imageUrl: "https://images.unsplash.com/photo-1511497584788-876761c139ab?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Miyawaki urban forest plot near Sungam bypass sector.",
    date: "2025-01-28",
    uploadedBy: "NGO Volunteer M. Arumugam",
    verificationStatus: "Tree Canopy Healthy"
  },
  {
    id: "img_106",
    watershedId: "Coimbatore_01",
    lat: 10.9830,
    lng: 76.9720,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Valankulam connection channel showing steady water flow.",
    date: "2025-07-15",
    uploadedBy: "Water Board Lead N. Balan",
    verificationStatus: "Verified Open Channel"
  },
  {
    id: "img_107",
    watershedId: "Coimbatore_01",
    lat: 10.9890,
    lng: 76.9580,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop",
    category: "check_dam",
    description: "Masonry bund wall protecting southern embankment.",
    date: "2025-10-18",
    uploadedBy: "Field Officer R. Kumar",
    verificationStatus: "Verified Structure"
  },
  {
    id: "img_108",
    watershedId: "Coimbatore_01",
    lat: 10.9795,
    lng: 76.9610,
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop",
    category: "soil_erosion",
    description: "Unpaved slope section reinforced with stone pitching.",
    date: "2026-02-22",
    uploadedBy: "PWD Engineer V. Natarajan",
    verificationStatus: "Reinforced"
  },
  {
    id: "img_109",
    watershedId: "Coimbatore_01",
    lat: 10.9875,
    lng: 76.9740,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Lake shoreline reed plantation helping natural bio-filtration.",
    date: "2026-05-10",
    uploadedBy: "Agri Extension Officer G. Lakshmi",
    verificationStatus: "Bio-filter Active"
  },
  {
    id: "img_110",
    watershedId: "Coimbatore_01",
    lat: 10.9855,
    lng: 76.9660,
    imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Perimter wetland sanctuary zone (l23 classification).",
    date: "2026-08-01",
    uploadedBy: "Remote Sensing Specialist T. Deepa",
    verificationStatus: "Bhuvan L23 Match"
  },

  // Watershed Coimbatore_02 (8 images)
  {
    id: "img_201",
    watershedId: "Coimbatore_02",
    lat: 11.290,
    lng: 76.935,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Dry deciduous scrubland earmarked for social forestry plantation.",
    date: "2023-04-11",
    uploadedBy: "Forest Officer A. Sundaram",
    verificationStatus: "Base Baseline Survey"
  },
  {
    id: "img_202",
    watershedId: "Coimbatore_02",
    lat: 11.315,
    lng: 76.960,
    imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Silted farm pond requiring desiltation before upcoming monsoon.",
    date: "2023-09-02",
    uploadedBy: "Panchayat Exec Officer M. Kanthimathi",
    verificationStatus: "Desiltation Scheduled"
  },
  {
    id: "img_203",
    watershedId: "Coimbatore_02",
    lat: 11.265,
    lng: 76.920,
    imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop",
    category: "check_dam",
    description: "Gabion structure retaining gravel along upper watershed stream.",
    date: "2024-02-19",
    uploadedBy: "Civil Engineer P. Manikandan",
    verificationStatus: "Structure Completed"
  },
  {
    id: "img_204",
    watershedId: "Coimbatore_02",
    lat: 11.240,
    lng: 76.975,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop",
    category: "soil_erosion",
    description: "Severe rill erosion observed on degraded fallow farmland.",
    date: "2024-07-10",
    uploadedBy: "Soil Conservation Officer S. Mohan",
    verificationStatus: "Action Plan Created"
  },
  {
    id: "img_205",
    watershedId: "Coimbatore_02",
    lat: 11.330,
    lng: 76.910,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Agroforestry block showing modest greenness index improvement.",
    date: "2025-03-25",
    uploadedBy: "Farmer Collective Lead R. Palanisamy",
    verificationStatus: "Growth Monitored"
  },
  {
    id: "img_206",
    watershedId: "Coimbatore_02",
    lat: 11.280,
    lng: 76.980,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Bhavani tributary overflow point monitored for seasonal discharge.",
    date: "2025-09-19",
    uploadedBy: "Hydrology Analyst D. Ramesh",
    verificationStatus: "Gauge Station Active"
  },
  {
    id: "img_207",
    watershedId: "Coimbatore_02",
    lat: 11.300,
    lng: 76.950,
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop",
    category: "check_dam",
    description: "Earthen gully plug showing minor seepage requiring reinforcement.",
    date: "2026-01-30",
    uploadedBy: "PWD Engineer V. Natarajan",
    verificationStatus: "Reinforcement Approved"
  },
  {
    id: "img_208",
    watershedId: "Coimbatore_02",
    lat: 11.235,
    lng: 76.900,
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop",
    category: "soil_erosion",
    description: "Barren hillock slope with topsoil loss; candidate for vetiver grass planting.",
    date: "2026-06-05",
    uploadedBy: "Forest Officer A. Sundaram",
    verificationStatus: "Vetiver Planting In-Progress"
  }
];

export const watershedStatsData = {
  Coimbatore_01: {
    bhuvanSourced: true,
    totalAreaSqKm: 3.72,
    vegetationCoverPct: 5.9,       // l06 = 0.22 sq km / 3.72
    prevVegetationPct: 5.0,        // 2023 estimated baseline (15% lower relative)
    waterBodyAreaHectares: 73.0,   // l23 = 0.73 sq km = 73.0 ha
    prevWaterBodyArea: 65.7,       // 2023 estimated baseline (10% lower)
    agriLandPct: 36.0,             // (l04 + l05) = (0.47 + 0.87) = 1.34 / 3.72
    builtUpPct: 38.4,              // (l01 + l02) = (1.41 + 0.02) = 1.43 / 3.72
    prevBuiltUpPct: 35.3,          // 2023 estimated baseline (8% lower)
    structureCount: 12,
    prevStructureCount: 9,
    healthScore: 72,
    prevHealthScore: 62,
    historical: [
      { quarter: "2023 Q2", year: 2023, vegetationCoverPct: 5.0, waterBodyAreaHectares: 65.7, builtUpPct: 35.3, structureCount: 6, healthScore: 62, isBaseline: true },
      { quarter: "2024 Q2", year: 2024, vegetationCoverPct: 5.3, waterBodyAreaHectares: 68.0, builtUpPct: 36.5, structureCount: 8, healthScore: 65, isBaseline: true },
      { quarter: "2025 Q2", year: 2025, vegetationCoverPct: 5.6, waterBodyAreaHectares: 70.5, builtUpPct: 37.6, structureCount: 10, healthScore: 69, isBaseline: true },
      { quarter: "2026 Q3 (Current)", year: 2026, vegetationCoverPct: 5.9, waterBodyAreaHectares: 73.0, builtUpPct: 38.4, structureCount: 12, healthScore: 72, isBaseline: false }
    ]
  },
  Coimbatore_02: {
    bhuvanSourced: false,
    totalAreaSqKm: 14.5,
    vegetationCoverPct: 31.2,
    prevVegetationPct: 33.5,
    waterBodyAreaHectares: 11.8,
    prevWaterBodyArea: 13.0,
    agriLandPct: 42.0,
    builtUpPct: 15.0,
    prevBuiltUpPct: 14.0,
    structureCount: 8,
    prevStructureCount: 7,
    healthScore: 62,
    prevHealthScore: 66,
    historical: [
      { quarter: "2023 Q2", year: 2023, vegetationCoverPct: 38.0, waterBodyAreaHectares: 16.0, builtUpPct: 13.0, structureCount: 3, healthScore: 70, isBaseline: true },
      { quarter: "2024 Q2", year: 2024, vegetationCoverPct: 35.0, waterBodyAreaHectares: 14.1, builtUpPct: 14.0, structureCount: 6, healthScore: 66, isBaseline: true },
      { quarter: "2025 Q2", year: 2025, vegetationCoverPct: 32.5, waterBodyAreaHectares: 12.4, builtUpPct: 14.5, structureCount: 7, healthScore: 63, isBaseline: true },
      { quarter: "2026 Q3 (Current)", year: 2026, vegetationCoverPct: 31.2, waterBodyAreaHectares: 11.8, builtUpPct: 15.0, structureCount: 8, healthScore: 62, isBaseline: false }
    ]
  }
};

export const activityLogs = [
  { id: 1, type: "satellite", title: "ISRO Bhuvan LULC Sync", desc: "Real AOI response synced: Built-up 38.4%, Water 73ha, Agri 36.0%", time: "1 hour ago", author: "ISRO Bhuvan LULC API" },
  { id: 2, type: "upload", title: "Field Photo Uploaded", desc: "Ukkadam Lake main water body (l23) verified", time: "3 hours ago", author: "Officer D. Ramesh" },
  { id: 3, type: "alert", title: "Urban Runoff Monitored", desc: "Built-up area 1.43 sq km boundary verified", time: "5 hours ago", author: "AI Automated Engine" },
  { id: 4, type: "structure", title: "Sluice Gate Inspected", desc: "Inlet channel flow control structure checked", time: "1 day ago", author: "PWD Team" }
];
