# Twilio OTP Integration Setup Guide

This guide will help you set up Twilio OTP sending system for the AgroWatch application.

## Prerequisites

1. Twilio Account (sign up at [twilio.com](https://www.twilio.com))
2. Python backend with Twilio package installed
3. Environment variables configured

## Step 1: Twilio Account Setup

1. **Create Twilio Account**
   - Go to [console.twilio.com](https://console.twilio.com)
   - Sign up for a free account
   - Verify your phone number

2. **Get Your Credentials**
   - Go to Console Dashboard
   - Copy your Account SID and Auth Token
   - Note: Keep these secure!

## Step 2: Configure Twilio Services

### Option A: Using Twilio Verify (Recommended)

1. **Create Verify Service**
   - Go to Verify > Services in Twilio Console
   - Click "Create new Service"
   - Name it "AgroWatch OTP"
   - Copy the Service SID

2. **Configure Service**
   - Set verification code length to 6 digits
   - Set expiry time to 10 minutes
   - Enable SMS channel

### Option B: Using Direct SMS

1. **Get Phone Number**
   - Go to Phone Numbers > Manage > Buy a number
   - Buy a phone number with SMS capability
   - Copy the phone number

2. **Or Use Messaging Service**
   - Go to Messaging > Services
   - Create a new Messaging Service
   - Add your phone number to the service
   - Copy the Messaging Service SID

## Step 3: Backend Configuration

### Install Twilio Package

```bash
cd backend
pip install twilio
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid_here
TWILIO_FROM_NUMBER=+1234567890
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here
```

## Step 4: Frontend Configuration

Create a `.env` file in the root directory:

```env
# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=your_account_sid_here
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid_here
VITE_TWILIO_FROM_NUMBER=+1234567890
VITE_TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here

# Backend URL
VITE_BACKEND_URL=http://localhost:8001
```

## Step 5: Testing the Integration

### Test Twilio Configuration

1. **Start the backend server:**
   ```bash
   cd backend
   python working_server.py
   ```

2. **Check Twilio status:**
   ```bash
   curl http://localhost:8001/api/twilio/status
   ```

3. **Test OTP sending:**
   ```bash
   curl -X POST http://localhost:8001/api/twilio/send-sms \
     -H "Content-Type: application/json" \
     -d '{"to": "+1234567890", "message": "Test message", "otpCode": "123456"}'
   ```

### Test Frontend Integration

1. **Start the frontend:**
   ```bash
   npm run dev
   ```

2. **Test OTP flow:**
   - Go to login page
   - Enter a valid phone number
   - Click "Send OTP"
   - Check your phone for SMS
   - Enter the OTP code
   - Verify login works

## Step 6: Production Considerations

### Security

1. **Never expose credentials in frontend**
   - Use backend proxy for all Twilio calls
   - Store sensitive data in environment variables only

2. **Rate Limiting**
   - Implement rate limiting for OTP requests
   - Add cooldown periods between requests

3. **Phone Number Validation**
   - Validate phone numbers before sending
   - Implement country code restrictions if needed

### Cost Optimization

1. **Use Twilio Verify for production**
   - More cost-effective than direct SMS
   - Built-in rate limiting and fraud protection

2. **Monitor Usage**
   - Set up billing alerts in Twilio Console
   - Monitor SMS delivery rates

3. **Fallback Strategy**
   - Keep Firebase as fallback option
   - Implement graceful degradation

## Troubleshooting

### Common Issues

1. **"Twilio credentials not configured"**
   - Check environment variables are set correctly
   - Restart the backend server

2. **"Failed to send SMS"**
   - Verify phone number format (+country_code_number)
   - Check Twilio account balance
   - Verify phone number is verified (for trial accounts)

3. **"Invalid phone number"**
   - Ensure phone number includes country code
   - Check phone number format validation

### Debug Mode

Enable debug logging in the backend:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Twilio Console

- Check SMS logs in Twilio Console
- Monitor delivery status
- Check error messages and codes

## API Endpoints

The integration provides these endpoints:

- `POST /api/twilio/send-sms` - Send direct SMS
- `POST /api/twilio/verify/send` - Send OTP via Verify service
- `POST /api/twilio/verify/check` - Verify OTP code
- `GET /api/twilio/status` - Check configuration status

## Support

- Twilio Documentation: [twilio.com/docs](https://www.twilio.com/docs)
- Twilio Support: [support.twilio.com](https://support.twilio.com)
- AgroWatch Issues: Create an issue in the repository
