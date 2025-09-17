export const mockEnvironmentalData = {
  soilMoisture: 65,
  airTemperature: 28.5,
  humidity: 78,
  leafWetness: 45,
  lastUpdated: new Date().toLocaleString()
};

export const mockFieldZones = [
  { id: 1, name: "Zone A", health: "healthy", area: 2.5, ndvi: 0.8 },
  { id: 2, name: "Zone B", health: "stressed", area: 1.8, ndvi: 0.6 },
  { id: 3, name: "Zone C", health: "healthy", area: 3.2, ndvi: 0.85 },
  { id: 4, name: "Zone D", health: "critical", area: 1.2, ndvi: 0.4 }
];

export const mockAlerts = [
  {
    id: 1,
    type: "pestRisk",
    severity: "high",
    message: "High pest activity detected in Zone B",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(),
    zone: "Zone B"
  },
  {
    id: 2,
    type: "diseaseRisk",
    severity: "medium",
    message: "Potential fungal infection risk due to high humidity",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleString(),
    zone: "Zone D"
  },
  {
    id: 3,
    type: "irrigationNeeded",
    severity: "low",
    message: "Soil moisture dropping in Zone A",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString(),
    zone: "Zone A"
  }
];

export const mockTrendData = [
  { date: "Mon", ndvi: 0.75, soilMoisture: 70, temperature: 27 },
  { date: "Tue", ndvi: 0.78, soilMoisture: 68, temperature: 28 },
  { date: "Wed", ndvi: 0.72, soilMoisture: 65, temperature: 29 },
  { date: "Thu", ndvi: 0.76, soilMoisture: 67, temperature: 28.5 },
  { date: "Fri", ndvi: 0.79, soilMoisture: 69, temperature: 27.5 },
  { date: "Sat", ndvi: 0.81, soilMoisture: 71, temperature: 26 },
  { date: "Sun", ndvi: 0.83, soilMoisture: 73, temperature: 25.5 }
];