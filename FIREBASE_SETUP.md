# Firebase Setup Guide for AgroWatch

## Overview
This guide will help you set up Firebase authentication for phone number login in AgroWatch.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name: `agrowatch` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Phone" provider
5. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain (when deployed)

## Step 3: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</> icon)
4. Register your app with nickname: "AgroWatch Web"
5. Copy the configuration object

## Step 4: Environment Variables

Create a `.env` file in the root directory with:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Backend API URL
VITE_BACKEND_URL=http://localhost:8001
```

## Step 5: Test Phone Authentication

1. Start your development server: `npm run dev`
2. Go to the login page
3. Enter a phone number (use your own for testing)
4. Click "Send OTP"
5. Check your phone for the OTP
6. Enter the OTP to complete authentication

## Important Notes

- **Phone Number Format**: Use international format (+91 for India)
- **reCAPTCHA**: Firebase requires reCAPTCHA for phone auth (handled automatically)
- **Testing**: Use your own phone number for testing
- **Production**: Add your production domain to authorized domains

## Troubleshooting

### "reCAPTCHA not loaded"
- Make sure you're using HTTPS in production
- Check that the reCAPTCHA container is present in the DOM

### "Invalid phone number"
- Ensure phone number includes country code (+91 for India)
- Check that the phone number is in international format

### "OTP not received"
- Check your phone's SMS messages
- Verify the phone number is correct
- Check Firebase Console for any error messages

## Security Rules (Optional)

For Firestore database, you can use these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration
3. Ensure all environment variables are set correctly
4. Check Firebase Console for authentication logs
