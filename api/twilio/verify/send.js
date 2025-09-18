// Vercel serverless function for sending OTP via Twilio Verify
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
    const { to, serviceSid } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Missing required field: to' });
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

    // Send verification
    const verification = await client.verify.v2.services(verifyServiceSid).verifications.create({
      to: to,
      channel: 'sms'
    });

    return res.status(200).json({
      success: true,
      sid: verification.sid,
      status: verification.status,
      to: verification.to
    });

  } catch (error) {
    console.error('Twilio Verify send error:', error);
    return res.status(500).json({ 
      error: 'Failed to send verification', 
      details: error.message 
    });
  }
}
