const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
const cors = require('cors');

admin.initializeApp();

// Mock Aadhaar eKYC provider integration
// In production, replace with actual KUA/ASP provider API calls

exports.aadhaarInit = functions.https.onCall(async (data, context) => {
  const { vid, consent } = data;
  
  if (!consent) {
    throw new functions.https.HttpsError('failed-precondition', 'User consent required');
  }
  
  if (!/^\d{12}$/.test(vid)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid VID format');
  }
  
  try {
    // Mock: In production, call KUA/ASP provider's OTP init API
    // const response = await fetch(PROVIDER_URL + '/ekyc/otp-init', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ vid })
    // });
    
    // Mock response
    const txnId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      txnId,
      message: 'OTP sent to registered mobile number'
    };
  } catch (error) {
    console.error('Aadhaar init error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to initiate Aadhaar verification');
  }
});

exports.aadhaarVerify = functions.https.onCall(async (data, context) => {
  const { txnId, otp } = data;
  
  if (!/^\d{6}$/.test(otp)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid OTP format');
  }
  
  try {
    // Mock: In production, call KUA/ASP provider's OTP verify API
    // const response = await fetch(PROVIDER_URL + '/ekyc/otp-verify', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ txnId, otp })
    // });
    
    // Mock successful verification
    if (otp === '123456') { // Demo OTP
      return {
        success: true,
        profile: {
          name: 'John Doe',
          maskedMobile: '******1234',
          address: {
            district: 'Ernakulam',
            state: 'Kerala'
          }
        },
        message: 'Aadhaar verification successful'
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }
  } catch (error) {
    console.error('Aadhaar verify error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to verify Aadhaar OTP');
  }
});

// REST API using Express
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Weather/environmental endpoint (uses Open-Meteo)
app.get('/api/environmental', async (req, res) => {
  const lat = req.query.lat || '10.0';
  const lon = req.query.lon || '76.3';
  const now = new Date().toISOString();

  // Prefer RapidAPI Open Weather if key is configured
  const rapidKey = process.env.RAPIDAPI_KEY;
  if (rapidKey) {
    try {
      const options = {
        method: 'GET',
        url: 'https://open-weather13.p.rapidapi.com/fivedaysforcast',
        params: { latitude: String(lat), longitude: String(lon), lang: 'EN', units: 'metric' },
        headers: {
          'x-rapidapi-host': 'open-weather13.p.rapidapi.com',
          'x-rapidapi-key': rapidKey
        }
      };
      const response = await axios.request(options);
      const data = response.data;
      // This API generally returns { list: [ { main: { temp, humidity }, dt_txt, ... }, ... ] }
      const first = Array.isArray(data?.list) && data.list.length ? data.list[0] : null;
      const airTemperature = first?.main?.temp ?? 0;
      const humidity = first?.main?.humidity ?? 0;
      const windSpeed = first?.wind?.speed ?? 0; // m/s
      const rainChance = typeof first?.pop === 'number' ? Math.round(first.pop * 100) : 0; // %
      const soilMoisture = 0; // Open Weather doesn't provide; keep 0 or derive
      const leafWetness = Math.min(100, Math.max(0, Math.round((humidity - 30) * 1.5)));
      return res.json({ airTemperature, humidity, soilMoisture, leafWetness, windSpeed, rainChance, lastUpdated: now });
    } catch (e) {
      console.error('RapidAPI weather failed, falling back:', e?.response?.data || e.message);
      // fall through to Open-Meteo
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,soil_moisture_0_to_7cm,wind_speed_10m,precipitation_probability&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    const r = await fetch(url);
    const j = await r.json();
    const airTemperature = j?.current?.temperature_2m ?? 0;
    const humidity = j?.current?.relative_humidity_2m ?? 0;
    const soilMoisture = j?.hourly?.soil_moisture_0_to_7cm?.[0] ? Math.round(j.hourly.soil_moisture_0_to_7cm[0] * 100) : 0;
    const windSpeed = j?.current?.wind_speed_10m ?? 0; // km/h if using open-meteo units
    const rainChance = Array.isArray(j?.hourly?.precipitation_probability) && j.hourly.precipitation_probability.length
      ? j.hourly.precipitation_probability[0]
      : 0;
    const leafWetness = Math.min(100, Math.max(0, Math.round((humidity - 30) * 1.5)));
    res.json({ airTemperature, humidity, soilMoisture, leafWetness, windSpeed, rainChance, lastUpdated: now });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch environmental data' });
  }
});

// Placeholder detection endpoints (to be implemented with ML models or services)
app.get('/api/crop/health', async (_req, res) => {
  // Return empty array or minimal structure until integrated
  res.json([]);
});

app.post('/api/crop/disease-detect', async (_req, res) => {
  res.json({ status: 'ok', diseases: [] });
});

app.post('/api/soil/detect', async (_req, res) => {
  res.json({ status: 'ok', metrics: {} });
});

// Auth - send OTP to mobile (mock)
app.post('/api/auth/send-otp', async (req, res) => {
  const { mobile } = req.body || {};
  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: 'Invalid mobile' });
  }
  // In production, integrate with SMS provider. Here we mock and always use 123456
  res.json({ success: true, message: 'OTP sent', last4: mobile.slice(-4) });
});

app.get('/api/alerts', async (_req, res) => {
  res.json([]);
});

app.get('/api/trends', async (_req, res) => {
  res.json([]);
});

exports.api = functions.https.onRequest(app);
