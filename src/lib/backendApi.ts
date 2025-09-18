export type CropAnalysisResult = {
  health: 'healthy' | 'diseased' | 'pest_damage' | 'nutrient_deficiency' | 'unknown';
  confidence: number;
  disease?: string;
  severity?: 'low' | 'medium' | 'high';
  recommendations: string[];
};

export type DiseaseDetectionResult = {
  disease: string;
  confidence: number;
  treatment: string[];
  prevention: string[];
};

// Aadhaar linking API (env-driven)
const AADHAAR_API_URL = import.meta.env.VITE_AADHAAR_API_URL || '';
const AADHAAR_API_KEY = import.meta.env.VITE_AADHAAR_API_KEY || '';
const AADHAAR_API_SECRET = import.meta.env.VITE_AADHAAR_API_SECRET || '';

export type AadhaarProfile = {
  name?: string;
  dob?: string;
  gender?: string;
  address?: string;
  aadhar: string;
};

export async function fetchAadhaarByNumber(aadhaarNumber: string, otp?: string): Promise<AadhaarProfile> {
  if (!AADHAAR_API_URL || !AADHAAR_API_KEY) {
    // Mock fallback when env not configured
    await new Promise((r) => setTimeout(r, 800));
    return { aadhar: aadhaarNumber, name: 'Aadhaar User', dob: '1990-01-01', gender: 'M', address: 'India' };
  }
  const resp = await fetch(`${AADHAAR_API_URL}/aadhaar/lookup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AADHAAR_API_KEY,
      ...(AADHAAR_API_SECRET ? { 'x-api-secret': AADHAAR_API_SECRET } : {}),
    },
    body: JSON.stringify({ aadhaarNumber, otp }),
  });
  if (!resp.ok) throw new Error('Aadhaar lookup failed');
  return resp.json();
}

export async function fetchAadhaarByQr(qrData: string): Promise<AadhaarProfile> {
  if (!AADHAAR_API_URL || !AADHAAR_API_KEY) {
    await new Promise((r) => setTimeout(r, 800));
    return { aadhar: 'XXXX-XXXX-XXXX', name: 'QR Aadhaar', dob: '1992-02-02', gender: 'F', address: 'India' };
  }
  const resp = await fetch(`${AADHAAR_API_URL}/aadhaar/qr-parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AADHAAR_API_KEY,
      ...(AADHAAR_API_SECRET ? { 'x-api-secret': AADHAAR_API_SECRET } : {}),
    },
    body: JSON.stringify({ qr: qrData }),
  });
  if (!resp.ok) throw new Error('Aadhaar QR parse failed');
  return resp.json();
}

export async function analyzeCropImage(_file: File): Promise<CropAnalysisResult> {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    health: 'healthy',
    confidence: 0.92,
    recommendations: [
      'Maintain irrigation schedule',
      'Apply balanced fertilizer as per soil test',
    ],
  };
}

export async function detectPlantDisease(_file: File): Promise<DiseaseDetectionResult> {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    disease: 'Leaf Blight',
    confidence: 0.81,
    treatment: [
      'Use recommended fungicide',
      'Remove infected leaves',
    ],
    prevention: [
      'Ensure proper spacing and airflow',
      'Avoid overhead irrigation late in the day',
    ],
  };
}

 