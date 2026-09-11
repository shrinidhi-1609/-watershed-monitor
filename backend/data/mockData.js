export const watersheds = [
  {
    id: "Coimbatore_01",
    name: "Coimbatore 01 (Noyyal Upper Basin - Siruvani)",
    center: [10.99, 76.75],
    boundary: [
      [11.04, 76.70],
      [11.05, 76.80],
      [10.98, 76.83],
      [10.93, 76.78],
      [10.94, 76.69]
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
  // Watershed Coimbatore_01 (10 images across 2023 - 2026)
  {
    id: "img_101",
    watershedId: "Coimbatore_01",
    lat: 10.995,
    lng: 76.745,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Afforestation plot under Ridge-to-Valley treatment near Siruvani foothills.",
    date: "2023-06-14",
    uploadedBy: "Field Officer R. Kumar",
    verificationStatus: "Verified by ISRO Bhuvan Satellite Pass"
  },
  {
    id: "img_102",
    watershedId: "Coimbatore_01",
    lat: 11.010,
    lng: 76.760,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Percolation pond filled to 85% capacity following monsoon showers.",
    date: "2023-11-20",
    uploadedBy: "Community Surveyor S. Priya",
    verificationStatus: "Verified Ground Truth"
  },
  {
    id: "img_103",
    watershedId: "Coimbatore_01",
    lat: 10.975,
    lng: 76.730,
    imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop",
    category: "check_dam",
    description: "Newly constructed masonry check dam slowing downstream runoff velocity.",
    date: "2024-03-10",
    uploadedBy: "PWD Engineer V. Natarajan",
    verificationStatus: "Verified Structure"
  },
  {
    id: "img_104",
    watershedId: "Coimbatore_01",
    lat: 10.960,
    lng: 76.775,
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop",
    category: "soil_erosion",
    description: "Active gully erosion patch requiring immediate contour bunding.",
    date: "2024-08-05",
    uploadedBy: "Forest Ranger K. Selvam",
    verificationStatus: "High Risk Flagged"
  },
  {
    id: "img_105",
    watershedId: "Coimbatore_01",
    lat: 11.025,
    lng: 76.720,
    imageUrl: "https://images.unsplash.com/photo-1511497584788-876761c139ab?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Dense canopy cover expansion monitored along stream corridors.",
    date: "2025-01-28",
    uploadedBy: "NGO Volunteer M. Arumugam",
    verificationStatus: "NDVI Verified (+12%)"
  },
  {
    id: "img_106",
    watershedId: "Coimbatore_01",
    lat: 10.985,
    lng: 76.790,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Rejuvenated secondary stream channel showing continuous perennial flow.",
    date: "2025-07-15",
    uploadedBy: "Hydrology Analyst D. Ramesh",
    verificationStatus: "Flow Rate Sensor Active"
  },
  {
    id: "img_107",
    watershedId: "Coimbatore_01",
    lat: 11.030,
    lng: 76.755,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop",
    category: "check_dam",
    description: "Loose boulder check dam retaining topsoil along steep gradient slope.",
    date: "2025-10-18",
    uploadedBy: "Field Officer R. Kumar",
    verificationStatus: "Verified Structure"
  },
  {
    id: "img_108",
    watershedId: "Coimbatore_01",
    lat: 10.945,
    lng: 76.740,
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop",
    category: "soil_erosion",
    description: "Sheet erosion risk area identified via high-resolution elevation raster.",
    date: "2026-02-22",
    uploadedBy: "Remote Sensing Specialist T. Deepa",
    verificationStatus: "Remediated via Vetiver Grass"
  },
  {
    id: "img_109",
    watershedId: "Coimbatore_01",
    lat: 11.005,
    lng: 76.715,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
    category: "vegetation",
    description: "Horticulture pasture plantation flourishing post-treatment.",
    date: "2026-05-10",
    uploadedBy: "Agri Extension Officer G. Lakshmi",
    verificationStatus: "Verified Healthy"
  },
  {
    id: "img_110",
    watershedId: "Coimbatore_01",
    lat: 10.970,
    lng: 76.765,
    imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop",
    category: "water_body",
    description: "Expanded farm pond storing 22,000 cubic meters of rainwater.",
    date: "2026-08-01",
    uploadedBy: "Water User Association Lead N. Balan",
    verificationStatus: "Capacity Maximum"
  },

  // Watershed Coimbatore_02 (9 images across 2023 - 2026)
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
    vegetationCoverPct: 42.5,
    prevVegetationPct: 38.2,
    waterBodyAreaHectares: 18.4,
    prevWaterBodyArea: 16.1,
    structureCount: 14,
    prevStructureCount: 10,
    healthScore: 78,
    prevHealthScore: 68,
    historical: [
      { quarter: "2023 Q2", year: 2023, vegetationCoverPct: 28.5, waterBodyAreaHectares: 9.2, structureCount: 4, healthScore: 54 },
      { quarter: "2023 Q4", year: 2023, vegetationCoverPct: 31.0, waterBodyAreaHectares: 10.8, structureCount: 6, healthScore: 58 },
      { quarter: "2024 Q2", year: 2024, vegetationCoverPct: 34.2, waterBodyAreaHectares: 12.5, structureCount: 8, healthScore: 63 },
      { quarter: "2024 Q4", year: 2024, vegetationCoverPct: 36.8, waterBodyAreaHectares: 14.0, structureCount: 10, healthScore: 68 },
      { quarter: "2025 Q2", year: 2025, vegetationCoverPct: 39.2, waterBodyAreaHectares: 15.8, structureCount: 12, healthScore: 72 },
      { quarter: "2025 Q4", year: 2025, vegetationCoverPct: 41.0, waterBodyAreaHectares: 17.2, structureCount: 13, healthScore: 75 },
      { quarter: "2026 Q2", year: 2026, vegetationCoverPct: 42.5, waterBodyAreaHectares: 18.4, structureCount: 14, healthScore: 78 }
    ]
  },
  Coimbatore_02: {
    vegetationCoverPct: 31.2,
    prevVegetationPct: 33.5,
    waterBodyAreaHectares: 11.8,
    prevWaterBodyArea: 13.0,
    structureCount: 8,
    prevStructureCount: 7,
    healthScore: 62,
    prevHealthScore: 66,
    historical: [
      { quarter: "2023 Q2", year: 2023, vegetationCoverPct: 38.0, waterBodyAreaHectares: 16.0, structureCount: 3, healthScore: 70 },
      { quarter: "2023 Q4", year: 2023, vegetationCoverPct: 36.5, waterBodyAreaHectares: 15.2, structureCount: 5, healthScore: 68 },
      { quarter: "2024 Q2", year: 2024, vegetationCoverPct: 35.0, waterBodyAreaHectares: 14.1, structureCount: 6, healthScore: 66 },
      { quarter: "2024 Q4", year: 2024, vegetationCoverPct: 33.5, waterBodyAreaHectares: 13.0, structureCount: 7, healthScore: 64 },
      { quarter: "2025 Q2", year: 2025, vegetationCoverPct: 32.5, waterBodyAreaHectares: 12.4, structureCount: 7, healthScore: 63 },
      { quarter: "2025 Q4", year: 2025, vegetationCoverPct: 31.8, waterBodyAreaHectares: 12.0, structureCount: 8, healthScore: 62 },
      { quarter: "2026 Q2", year: 2026, vegetationCoverPct: 31.2, waterBodyAreaHectares: 11.8, structureCount: 8, healthScore: 62 }
    ]
  }
};

export const activityLogs = [
  { id: 1, type: "upload", title: "Field Photo Uploaded", desc: "Check Dam masonry structure verified", time: "2 hours ago", author: "Officer R. Kumar" },
  { id: 2, type: "satellite", title: "Sentinel-2 NDVI Sync", desc: "Biomass index updated (+1.4% change detected)", time: "5 hours ago", author: "ISRO Bhuvan API" },
  { id: 3, type: "alert", title: "Soil Erosion Risk Flagged", desc: "High slope gradient sector 4 highlighted", time: "1 day ago", author: "AI Automated Engine" },
  { id: 4, type: "structure", title: "Structure Completed", desc: "Percolation Pond #4 desilting confirmed", time: "2 days ago", author: "PWD Field Team" }
];
