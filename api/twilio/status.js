// Vercel serverless function for checking Twilio configuration status
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    const status = {
      configured: !!(accountSid && authToken),
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasMessagingService: !!messagingServiceSid,
      hasFromNumber: !!fromNumber,
      hasVerifyService: !!verifyServiceSid,
      services: {
        sms: !!(messagingServiceSid || fromNumber),
        verify: !!verifyServiceSid
      }
    };

    return res.status(200).json(status);

  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({ 
      error: 'Failed to check status', 
      details: error.message 
    });
  }
}
