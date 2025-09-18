// Vercel serverless function for verifying OTP via Twilio Verify
const twilio = require('twilio');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, code, serviceSid } = req.body;

    if (!to || !code) {
      return res.status(400).json({ error: 'Missing required fields: to, code' });
    }

    const verifyServiceSid = serviceSid || process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!verifyServiceSid) {
      return res.status(500).json({ error: 'Twilio Verify Service SID not configured' });
    }

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Verify the code
    const verificationCheck = await client.verify.v2.services(verifyServiceSid).verificationChecks.create({
      to: to,
      code: code
    });

    return res.status(200).json({
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status,
      valid: verificationCheck.valid
    });

  } catch (error) {
    console.error('Twilio Verify check error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify code', 
      details: error.message 
    });
  }
}
