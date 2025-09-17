🔑 AgroWatch API Keys Setup Guide
This guide explains how to configure API keys for the AgroWatch backend to enable full functionality.

📋 Overview
The AgroWatch backend can run in two modes:

🔧 MOCK MODE (Default): Works without API keys, uses mock data
🚀 PRODUCTION MODE: Requires real API keys for full functionality
🛠️ Required API Keys
1. Firebase (for Real OTP Authentication)
Purpose: Send real SMS OTP to users for authentication

How to get:

Go to Firebase Console
Create a new project or select existing one
Go to Project Settings → Service Accounts
Click “Generate new private key”
Download the JSON file
Configuration:

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=key-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
2. OpenWeatherMap (for Real Weather Data)
Purpose: Get real-time weather data and forecasts

How to get:

Go to OpenWeatherMap
Sign up for a free account
Go to API Keys section
Copy your API key
Configuration:

OPENWEATHER_API_KEY=your-api-key-here
📁 Setup Instructions
Step 1: Create Environment File
cd /workspace/shadcn-ui/backend
cp .env.example .env
Step 2: Edit the .env file
Open the .env file and add your API keys:

# Set to false for production mode
MOCK_MODE=false

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# OpenWeatherMap API
OPENWEATHER_API_KEY=your-openweathermap-api-key

# JWT Configuration (change in production)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
Step 3: Install Dependencies
pip install -r requirements.txt
Step 4: Run the Server
python main.py
🔍 Testing Configuration
Check API Status
Visit: http://localhost:8000/health

You should see:

{
  "status": "healthy",
  "mode": "production",  // or "mock"
  "firebase_configured": true,  // or false
  "weather_configured": true,   // or false
  "timestamp": "2024-01-20T10:30:00"
}
Test Without API Keys (Development)
If you want to test without setting up API keys:

Keep MOCK_MODE=true in .env
All endpoints will work with mock data
OTP: Any 6-digit number will work
Weather: Returns sample data for Delhi
🚨 Security Notes
Production Security
Never commit .env file to git
Change JWT_SECRET_KEY to a strong random string
Use environment variables in production deployment
Rotate API keys regularly
Firebase Security
Enable Firebase Authentication in your project
Set up proper security rules
Monitor usage in Firebase Console
OpenWeatherMap Security
Monitor API usage to avoid exceeding limits
Free tier: 1,000 calls/day, 60 calls/minute
Consider upgrading for production use
🔧 Environment Variables Reference
Variable	Required	Description	Example
MOCK_MODE	No	Enable mock mode	true or false
FIREBASE_PROJECT_ID	Production	Firebase project ID	my-agrowatch-app
FIREBASE_PRIVATE_KEY	Production	Firebase private key	-----BEGIN PRIVATE KEY-----...
FIREBASE_CLIENT_EMAIL	Production	Firebase service email	firebase-adminsdk-...@....iam.gserviceaccount.com
OPENWEATHER_API_KEY	Production	OpenWeatherMap API key	abc123def456ghi789
JWT_SECRET_KEY	Yes	JWT signing secret	your-secret-key
HOST	No	Server host	0.0.0.0
PORT	No	Server port	8000
🐛 Troubleshooting
Common Issues
1. Firebase Authentication Error

Error: Firebase configuration is incomplete
Solution: Check all Firebase environment variables are set correctly

2. Weather API Error

Error: Weather API error
Solution: Verify OpenWeatherMap API key is valid and not expired

3. JWT Token Error

Error: Invalid token
Solution: Make sure JWT_SECRET_KEY is consistent between restarts

Getting Help
Check server logs for detailed error messages
Verify API keys are correctly formatted
Test in mock mode first to isolate issues
Check API provider documentation for rate limits
📊 API Endpoints Status
Endpoint	Mock Mode	Production Mode
Authentication	✅ Any 6-digit OTP	🔑 Real Firebase OTP
Weather Data	✅ Sample data	🔑 Real OpenWeatherMap
AI Detection	✅ Mock analysis	✅ Mock analysis*
User Management	✅ In-memory storage	✅ In-memory storage*
*Note: AI models and database integration require additional setup not covered in this guide.

🎯 Next Steps
Development: Use mock mode for initial testing
Staging: Set up Firebase and OpenWeatherMap for testing
Production: Add database, real AI models, and monitoring
Scaling: Consider Redis for sessions, PostgreSQL for data