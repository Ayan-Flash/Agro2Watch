// Vercel serverless function for sending SMS via Twilio
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
    const { to, message, otpCode } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, message' });
    }

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Get messaging service SID or from number
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    let messageResponse;

    if (messagingServiceSid) {
      messageResponse = await client.messages.create({
        body: message,
        messagingServiceSid: messagingServiceSid,
        to: to
      });
    } else if (fromNumber) {
      messageResponse = await client.messages.create({
        body: message,
        from: fromNumber,
        to: to
      });
    } else {
      return res.status(500).json({ error: 'No messaging service or from number configured' });
    }

    return res.status(200).json({
      success: true,
      messageId: messageResponse.sid,
      sid: messageResponse.sid,
      status: messageResponse.status
    });

  } catch (error) {
    console.error('Twilio SMS error:', error);
    return res.status(500).json({ 
      error: 'Failed to send SMS', 
      details: error.message 
    });
  }
}
