export const mockFieldZones = [
  { id: 'z1', name: 'Zone A', ndvi: 0.78, area: 0.5, health: 'healthy' },
  { id: 'z2', name: 'Zone B', ndvi: 0.62, area: 0.7, health: 'stressed' },
  { id: 'z3', name: 'Zone C', ndvi: 0.45, area: 0.4, health: 'critical' },
];

export const mockEnvironmentalData = {
  soilMoisture: 56,
  airTemperature: 28,
  humidity: 72,
  leafWetness: 35,
  lastUpdated: 'Just now',
};

export const mockTrendData = Array.from({ length: 7 }).map((_, i) => ({
  date: `Day ${i + 1}`,
  ndvi: Math.random(),
  soilMoisture: Math.round(40 + Math.random() * 20),
}));

export const mockAlerts = [
  {
    id: 'a1',
    type: 'pestRisk',
    severity: 'high',
    zone: 'Zone A',
    message: 'High probability of pest infestation detected.',
    timestamp: '2 min ago',
  },
  {
    id: 'a2',
    type: 'irrigationNeeded',
    severity: 'medium',
    zone: 'Zone B',
    message: 'Soil moisture below optimal range.',
    timestamp: '10 min ago',
  },
  {
    id: 'a3',
    type: 'weatherAlert',
    severity: 'low',
    zone: 'Zone C',
    message: 'Light rainfall expected in next 24 hours.',
    timestamp: '30 min ago',
  },
];


