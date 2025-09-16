export interface EnvironmentalData {
  airTemperature: number;
  humidity: number;
  soilMoisture: number;
  leafWetness: number;
  lastUpdated: string;
}

export interface FieldZone {
  id: string;
  name: string;
  ndvi: number;
  area: number;
  health: 'healthy' | 'stressed' | 'critical';
}

export interface AlertItem {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  zone: string;
  message: string;
  timestamp: string;
}

export interface TrendPoint {
  date: string;
  ndvi: number;
  soilMoisture: number;
}

// Determine API base:
// - Use VITE_API_BASE if provided
// - In dev, default to local Firebase Functions emulator
// - Otherwise, relative path (assuming hosting rewrites /api to the function)
const DEFAULT_DEV_BASE = 'http://localhost:5001/agrowatch-3e97f/us-central1';
const RAW_BASE = (import.meta as any).env?.VITE_API_BASE || ((import.meta as any).env?.DEV ? DEFAULT_DEV_BASE : '');
const API_BASE = RAW_BASE.endsWith('/api') ? RAW_BASE : `${RAW_BASE}/api`;

export async function fetchEnvironmental(lat = 10.0, lon = 76.3): Promise<EnvironmentalData> {
  const res = await fetch(`${API_BASE}/environmental?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch environmental data');
  return res.json();
}

export async function fetchFieldZones(): Promise<FieldZone[]> {
  const res = await fetch(`${API_BASE}/crop/health`);
  if (!res.ok) throw new Error('Failed to fetch field zones');
  return res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function fetchTrends(): Promise<TrendPoint[]> {
  const res = await fetch(`${API_BASE}/trends`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

export async function sendMobileOtp(mobile: string): Promise<{ success: boolean; last4?: string }>{
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile })
  });
  if (!res.ok) throw new Error('Failed to send OTP');
  return res.json();
}


