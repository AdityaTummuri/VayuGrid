/**
 * VayuGrid Statutory Classifications & Standards (CPCB NAQI Aligned)
 */

export const CPCB_AQI_TIERS = {
  GOOD: {
    label: 'Good',
    range: '0 - 50',
    color: '#16A34A',
    bg: 'rgba(22, 163, 74, 0.15)',
    border: '#22C55E',
    healthAdvisory: 'Minimal impact. Air quality is considered satisfactory.',
  },
  SATISFACTORY: {
    label: 'Satisfactory',
    range: '51 - 100',
    color: '#65A30D',
    bg: 'rgba(101, 163, 13, 0.15)',
    border: '#84CC16',
    healthAdvisory: 'Minor breathing discomfort to sensitive individuals.',
  },
  MODERATE: {
    label: 'Moderate',
    range: '101 - 200',
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.15)',
    border: '#F59E0B',
    healthAdvisory: 'Breathing discomfort to people with asthma and heart conditions.',
  },
  POOR: {
    label: 'Poor',
    range: '201 - 300',
    color: '#EA580C',
    bg: 'rgba(234, 88, 12, 0.15)',
    border: '#F97316',
    healthAdvisory: 'Breathing discomfort to most people on prolonged outdoor exposure.',
  },
  VERY_POOR: {
    label: 'Very Poor',
    range: '301 - 400',
    color: '#DC2626',
    bg: 'rgba(220, 38, 38, 0.15)',
    border: '#EF4444',
    healthAdvisory: 'Respiratory illness on prolonged exposure. Pronounced effect on vulnerable groups.',
  },
  SEVERE: {
    label: 'Severe',
    range: '401 - 500',
    color: '#7F1D1D',
    bg: 'rgba(127, 29, 29, 0.25)',
    border: '#991B1B',
    healthAdvisory: 'Affects healthy people and severely impacts those with existing diseases.',
  },
};

export const SEVERITY_CONFIG = {
  CRITICAL: {
    label: 'CRITICAL',
    minScore: 0.8,
    color: '#DC2626',
    bg: 'rgba(220, 38, 38, 0.12)',
    border: '#EF4444',
    actionPriority: 'T-Minus 15m Intercept',
  },
  SEVERE: {
    label: 'SEVERE',
    minScore: 0.5,
    color: '#EA580C',
    bg: 'rgba(234, 88, 12, 0.12)',
    border: '#F97316',
    actionPriority: 'T-Minus 30m Dispatch',
  },
  MODERATE: {
    label: 'MODERATE',
    minScore: 0.3,
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.12)',
    border: '#F59E0B',
    actionPriority: 'Routine Municipal Patrol',
  },
  LOW: {
    label: 'ADVISORY',
    minScore: 0.0,
    color: '#16A34A',
    bg: 'rgba(22, 163, 74, 0.12)',
    border: '#22C55E',
    actionPriority: 'Continuous Telemetry Log',
  },
};

export function getSeverityConfig(score) {
  if (score >= 0.8) return SEVERITY_CONFIG.CRITICAL;
  if (score >= 0.5) return SEVERITY_CONFIG.SEVERE;
  if (score >= 0.3) return SEVERITY_CONFIG.MODERATE;
  return SEVERITY_CONFIG.LOW;
}

export function getAqiTier(aqi) {
  if (aqi <= 50) return CPCB_AQI_TIERS.GOOD;
  if (aqi <= 100) return CPCB_AQI_TIERS.SATISFACTORY;
  if (aqi <= 200) return CPCB_AQI_TIERS.MODERATE;
  if (aqi <= 300) return CPCB_AQI_TIERS.POOR;
  if (aqi <= 400) return CPCB_AQI_TIERS.VERY_POOR;
  return CPCB_AQI_TIERS.SEVERE;
}

export const CLASSIFICATION_META = {
  OPEN_MUNICIPAL_WASTE_BURNING: {
    code: 'SRC-01',
    label: 'Open Municipal Solid Waste Burning',
    shortLabel: 'Waste Fire',
    category: 'Civic Solid Waste',
    color: '#EA580C',
    statutoryRef: 'Solid Waste Management Rules 2016 (Rule 15(g))',
    actionRequired: 'Deploy Rapid Smog Gun & Municipal Sanitation Squad',
  },
  CONSTRUCTION_DEMOLITION_DUST: {
    code: 'SRC-02',
    label: 'Unmitigated C&D Fugitive Dust Plume',
    shortLabel: 'C&D Dust',
    category: 'Urban Infrastructure',
    color: '#CA8A04',
    statutoryRef: 'C&D Waste Management Rules 2016 (Rule 13)',
    actionRequired: 'Deploy Automated Dust-Suppressant Mist Cannons',
  },
  INDUSTRIAL_STACK_EMISSION: {
    code: 'SRC-03',
    label: 'Point-Source Industrial Flare / Bypass',
    shortLabel: 'Industrial Stack',
    category: 'Industrial Point Source',
    color: '#DC2626',
    statutoryRef: 'Air (Prevention & Control) Act 1981 (Section 31A)',
    actionRequired: 'Automated Show-Cause Notice & Online CEMS Audit',
  },
  BIOMASS_STUBBLE_BURNING: {
    code: 'SRC-04',
    label: 'Agricultural Biomass Pyrolysis Plume',
    shortLabel: 'Stubble Burning',
    category: 'Regional Biomass',
    color: '#B45309',
    statutoryRef: 'Commission for Air Quality Management (CAQM) Order 42',
    actionRequired: 'Sub-Divisional Flying Squad Intercept',
  },
  HIGH_DENSITY_VEHICULAR_IDLING: {
    code: 'SRC-05',
    label: 'Heavy Transit Corridor Idling Stagnation',
    shortLabel: 'Vehicular Idling',
    category: 'Mobile Vehicular',
    color: '#2563EB',
    statutoryRef: 'Motor Vehicles Act 1988 (Section 190(2))',
    actionRequired: 'Traffic Police ITS Route Divergence Advisory',
  },
  UNPAVED_ROAD_SUSPENSION: {
    code: 'SRC-06',
    label: 'Unpaved Arterial Road Resuspension',
    shortLabel: 'Road Dust',
    category: 'Roadways Infrastructure',
    color: '#64748B',
    statutoryRef: 'CPCB Dust Control Guidelines 2021',
    actionRequired: 'Dispatch Mechanical Road Sweepers with Water Sprinklers',
  },
};

export const LANGUAGE_META = [
  { code: 'hi', label: 'Hindi',     nativeName: 'हिंदी',    bcp47: 'hi-IN', flag: '🇮🇳' },
  { code: 'en', label: 'English',   nativeName: 'English',  bcp47: 'en-IN', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada',   nativeName: 'ಕನ್ನಡ',   bcp47: 'kn-IN', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi',   nativeName: 'ਪੰਜਾਬੀ',   bcp47: 'pa-IN', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',   nativeName: 'मराठी',    bcp47: 'mr-IN', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',    nativeName: 'తెలుగు',   bcp47: 'te-IN', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',     nativeName: 'தமிழ்',   bcp47: 'ta-IN', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം',  bcp47: 'ml-IN', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati',  nativeName: 'ગુજરાતી',  bcp47: 'gu-IN', flag: '🇮🇳' },
];
