# 🌾 AgroWatch - Complete Agricultural Monitoring Platform Creation Prompt

**Create a comprehensive agricultural monitoring and AI-powered precision farming platform for Indian farmers with the following specifications:**

## 📋 Project Overview

### System Purpose
Build "AgroWatch" - an intelligent agricultural monitoring system that provides:
- AI-powered crop health detection using MATLAB models
- Real-time soil analysis and pest identification
- Government scheme integration and eligibility checking
- Multi-language support for Indian farmers
- SMS/WhatsApp notifications via Twilio
- Weather data integration
- Mobile-first responsive design

### Target Users
- **Primary**: Indian farmers (wheat, rice, cotton, etc.)
- **Secondary**: Agricultural advisors, government agencies
- **Admin**: Platform administrators and agricultural experts

## 🏗️ System Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- React Query for state management
- Firebase SDK for authentication

**Backend:**
- Python FastAPI framework
- MongoDB with Motor (async driver)
- Firebase Admin SDK
- Twilio SDK for SMS/WhatsApp
- MATLAB model integration via scipy
- JWT authentication
- CORS middleware

**AI/ML Integration:**
- MATLAB .mat file support for AI models
- Crop health classification (95% accuracy)
- Soil type analysis
- Pest detection and identification
- Image preprocessing with OpenCV

**External Services:**
- Firebase Authentication
- Twilio (SMS + WhatsApp)
- OpenWeatherMap API
- Government API integration

## 📁 Project Structure

```
Agrowatch/
├── backend/
│   ├── auth_middleware.py
│   ├── auth_routes.py
│   ├── database.py
│   ├── firebase_service.py
│   ├── models.py
│   ├── requirements.txt
│   ├── run_server.py
│   ├── server.py
│   └── twilio_service.py
├── frontend/
│   └── Agro2Watch/
│       ├── backend/
│       │   ├── api/
│       │   │   └── v1/
│       │   │       ├── endpoints/
│       │   │       │   ├── crop_detection.py
│       │   │       │   ├── soil_detection.py
│       │   │       │   └── pest_detection.py
│       │   │       └── api.py
│       │   ├── auth/
│       │   │   └── firebase_auth.py
│       │   ├── config/
│       │   │   └── settings.py
│       │   ├── models/
│       │   │   ├── ai_models.py
│       │   │   └── model_loader.py
│       │   ├── services/
│       │   │   ├── api_validation.py
│       │   │   └── chatbot_service.py
│       │   └── utils/
│       │       ├── image_processing.py
│       │       └── logger.py
│       ├── src/
│       │   ├── components/
│       │   │   ├── chatbot/
│       │   │   │   ├── AIChatbot.tsx
│       │   │   │   ├── ChatInput.tsx
│       │   │   │   └── ChatMessage.tsx
│       │   │   ├── setup/
│       │   │   │   ├── APIKeySetup.tsx
│       │   │   │   ├── FirebaseSetup.tsx
│       │   │   │   ├── KYCSetup.tsx
│       │   │   │   ├── SetupComplete.tsx
│       │   │   │   └── WeatherSetup.tsx
│       │   │   ├── ui/ (shadcn/ui components)
│       │   │   ├── AdminDashboard.tsx
│       │   │   ├── AlertsPanel.tsx
│       │   │   ├── AuthContext.tsx
│       │   │   ├── AuthenticationFlow.tsx
│       │   │   ├── CropDetection.tsx
│       │   │   ├── CropHealthMap.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── EnvironmentalPanel.tsx
│       │   │   ├── FarmerRegistration.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── GovermentSchemes.tsx
│       │   │   ├── LandingPage.tsx
│       │   │   ├── LanguageContext.tsx
│       │   │   ├── LanguageToggle.tsx
│       │   │   ├── LoginForm.tsx
│       │   │   ├── MobileNav.tsx
│       │   │   ├── Navbar.tsx
│       │   │   ├── Navigation.tsx
│       │   │   ├── OTPVerification.tsx
│       │   │   ├── PestDetection.tsx
│       │   │   ├── Profile.tsx
│       │   │   ├── RegistrationForm.tsx
│       │   │   ├── SoilDetection.tsx
│       │   │   └── TrendsChart.tsx
│       │   ├── hooks/
│       │   │   ├── use-mobile.tsx
│       │   │   └── use-toast.ts
│       │   ├── lib/
│       │   │   ├── api.js
│       │   │   ├── auth.ts
│       │   │   ├── backendApi.ts
│       │   │   ├── firebase.js
│       │   │   ├── matlabApi.ts
│       │   │   ├── mockData.ts
│       │   │   ├── translations.ts
│       │   │   ├── utils.ts
│       │   │   └── weatherApi.ts
│       │   ├── pages/
│       │   │   ├── Index.tsx
│       │   │   └── NotFound.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── functions/ (Firebase Functions)
│       ├── package.json
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── vite.config.ts
└── test_integration.py
```

## 🔧 Core Features Implementation

### 1. Authentication System

**Requirements:**
- Dual authentication: Custom backend + Firebase integration
- Phone number + OTP verification via Twilio SMS
- Role-based access (Farmer, Admin, Government)
- Aadhaar number integration for KYC
- Session management with JWT tokens

**Mock Users for Development:**
```javascript
// Admin User
phone: "9999912345"
otp: "123456"
role: "admin"

// Farmer User  
phone: "9000012345"
otp: "123456"
role: "farmer"
```

### 2. AI-Powered Detection System

**MATLAB Model Integration:**
- Support for .mat files using scipy.io
- Three main models:
  - `crop_health_model.mat` - Crop health classification
  - `soil_analysis_model.mat` - Soil type analysis  
  - `pest_detection_model.mat` - Pest identification

**API Endpoints:**
```
POST /api/v1/crop/analyze - Crop health analysis
POST /api/v1/soil/analyze - Soil type classification
POST /api/v1/pest/analyze - Pest detection
GET /api/v1/models - List available models
```

**Response Format:**
```json
{
  "status": "success",
  "prediction": "healthy_crop",
  "confidence": 0.95,
  "threshold_met": true,
  "class_probabilities": {
    "healthy": 0.95,
    "diseased": 0.03,
    "pest_affected": 0.02
  },
  "recommendations": [
    "Continue current care routine",
    "Monitor for early signs of stress"
  ],
  "model_info": {
    "name": "crop_health_model",
    "version": "1.0.0"
  }
}
```

### 3. Multi-Language Support

**Supported Languages:**
- Hindi (हिंदी)
- English
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)

**Implementation:**
- Create `translations.ts` with language objects
- Use React Context for language state
- Implement `useTranslation` hook
- Language toggle component in navigation

### 4. Government Schemes Integration

**Features:**
- Eligibility checking based on farmer profile
- Application assistance
- Scheme recommendations
- Status tracking

**Mock Schemes:**
```javascript
[
  {
    name: "PM-KISAN",
    description: "Direct income support to farmers",
    eligibility: "Small and marginal farmers",
    benefits: "₹6,000 per year",
    applicationUrl: "https://pmkisan.gov.in"
  },
  {
    name: "Soil Health Card",
    description: "Soil testing and recommendations",
    eligibility: "All farmers",
    benefits: "Free soil analysis",
    applicationUrl: "https://soilhealth.dac.gov.in"
  }
]
```

### 5. Communication System (Twilio Integration)

**SMS Features:**
- OTP verification
- Alert notifications
- Weather updates
- Government scheme notifications

**WhatsApp Features:**
- Rich media messages
- Chatbot integration
- Image sharing for crop analysis

**Implementation Requirements:**
```python
# Environment variables needed
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_MESSAGING_SERVICE_SID=your_service_sid
```

### 6. Weather Integration

**OpenWeatherMap API Integration:**
- Current weather conditions
- 5-day forecasts
- Rainfall predictions
- Temperature and humidity
- Wind speed and direction

**API Endpoint:**
```
GET /api/v1/weather/current?lat={lat}&lon={lon}
GET /api/v1/weather/forecast?lat={lat}&lon={lon}
```

## 📱 Frontend Components Specification

### Core Pages

1. **LandingPage.tsx**
   - Hero section with farmer testimonials
   - Feature highlights (AI detection, multi-language, government schemes)
   - Statistics (50,000+ farmers helped, 95% accuracy)
   - Team member profiles
   - Call-to-action sections

2. **Dashboard.tsx** (Role-based)
   - Farmer Dashboard: Crop monitoring, weather, alerts
   - Admin Dashboard: User management, analytics, system health

3. **CropDetection.tsx**
   - Image upload interface
   - Real-time analysis progress
   - Results display with recommendations
   - History of previous analyses

4. **SoilDetection.tsx**
   - Soil image analysis
   - Soil type classification
   - Nutrient recommendations
   - pH level analysis

5. **PestDetection.tsx**
   - Pest identification
   - Treatment recommendations
   - Severity assessment
   - Prevention tips

### Authentication Flow

1. **AuthenticationFlow.tsx**
   - Login/Registration options
   - Phone number input
   - OTP verification
   - Role selection

2. **OTPVerification.tsx**
   - 6-digit OTP input
   - Resend functionality
   - Timer countdown
   - Auto-submit on completion

3. **FarmerRegistration.tsx**
   - Personal details form
   - Farm information
   - Crop preferences
   - Location selection

### AI Chatbot System

1. **AIChatbot.tsx**
   - Conversational interface
   - Agricultural query handling
   - Multi-language support
   - Voice input/output

2. **ChatMessage.tsx**
   - Message bubble component
   - Support for text, images, links
   - Timestamp display
   - Read receipt indicators

## 🗄️ Database Schema (MongoDB)

### User Collection
```javascript
{
  _id: ObjectId,
  phone: String, // Primary identifier
  role: String, // "farmer", "admin", "government"
  profile: {
    name: String,
    aadhaar: String,
    location: {
      state: String,
      district: String,
      village: String,
      coordinates: [Number, Number]
    },
    language: String,
    verified: Boolean
  },
  farmerProfile: {
    farmSize: Number, // in acres
    crops: [String],
    farmingType: String, // "organic", "conventional"
    experience: Number, // years
    landOwnership: String // "owned", "leased", "shared"
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### Crop Analysis Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  imageUrl: String,
  analysisType: String, // "crop_health", "soil", "pest"
  results: {
    prediction: String,
    confidence: Number,
    classProbabilities: Object,
    recommendations: [String]
  },
  location: {
    coordinates: [Number, Number],
    address: String
  },
  metadata: {
    modelVersion: String,
    processingTime: Number,
    imageFeatures: Object
  },
  createdAt: Date
}
```

### Weather Data Collection
```javascript
{
  _id: ObjectId,
  location: {
    coordinates: [Number, Number],
    name: String
  },
  current: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    conditions: String
  },
  forecast: [{
    date: Date,
    temperature: { min: Number, max: Number },
    rainfall: Number,
    conditions: String
  }],
  alerts: [{
    type: String,
    severity: String,
    message: String,
    validUntil: Date
  }],
  fetchedAt: Date
}
```

### Government Schemes Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  eligibility: {
    farmSize: { min: Number, max: Number },
    crops: [String],
    states: [String],
    income: { max: Number }
  },
  benefits: {
    type: String, // "subsidy", "loan", "insurance"
    amount: Number,
    description: String
  },
  applicationProcess: {
    documents: [String],
    steps: [String],
    onlineUrl: String,
    deadlines: [Date]
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Backend API Specification

### Authentication Endpoints
```
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/profile
PUT /api/auth/profile
```

### AI Analysis Endpoints
```
POST /api/v1/crop/analyze
POST /api/v1/soil/analyze
POST /api/v1/pest/analyze
GET /api/v1/analysis/history/{userId}
GET /api/v1/models
GET /api/v1/models/{modelName}/info
```

### Weather Endpoints
```
GET /api/v1/weather/current
GET /api/v1/weather/forecast
GET /api/v1/weather/alerts
POST /api/v1/weather/subscribe
```

### Government Schemes Endpoints
```
GET /api/v1/schemes
GET /api/v1/schemes/{schemeId}
POST /api/v1/schemes/eligibility
GET /api/v1/schemes/recommendations/{userId}
```

### Communication Endpoints
```
POST /api/v1/notifications/sms
POST /api/v1/notifications/whatsapp
GET /api/v1/notifications/history
POST /api/v1/chatbot/message
```

## 📦 Package Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.56.2",
    "@radix-ui/react-*": "^1.x.x",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.462.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "react-hook-form": "^7.60.0",
    "@hookform/resolvers": "^3.10.0",
    "zod": "^3.25.76",
    "firebase": "^10.x.x",
    "react-dropzone": "^14.2.3",
    "recharts": "^2.12.7",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.11",
    "@types/react-dom": "^19.1.8",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "tailwindcss": "^3.4.11",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "eslint": "^9.9.0"
  }
}
```

### Backend (requirements.txt)
```
fastapi==0.110.1
uvicorn[standard]==0.25.0
python-multipart==0.0.9
motor==3.3.1
pymongo==4.5.0
firebase-admin==6.2.0
twilio==9.0.0
bcrypt==4.0.0
PyJWT==2.10.1
passlib[bcrypt]==1.7.4
requests==2.31.0
aiohttp==3.9.1
python-dotenv==1.0.1
loguru==0.7.2
Pillow==10.1.0
numpy==1.26.0
opencv-python==4.8.1.78
scipy==1.11.0
pydantic[email]==2.6.4
aiofiles==23.2.1
python-dateutil==2.8.2
pandas==2.2.0
pytest==8.0.0
httpx==0.25.2
```

## 🔐 Environment Configuration

### Backend (.env)
```bash
# Database
MONGO_URL=mongodb://localhost:27017/agrowatch
DATABASE_NAME=agrowatch

# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Firebase Configuration
FIREBASE_PROJECT_ID=agrowatch-3e97f
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@agrowatch-3e97f.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_STORAGE_BUCKET=agrowatch-3e97f.appspot.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid

# Weather API
OPENWEATHER_API_KEY=your_openweather_api_key

# Development Mode
MOCK_MODE=true
LOG_LEVEL=DEBUG
HOST=0.0.0.0
PORT=8001
```

### Frontend (.env.local)
```bash
# API Configuration
VITE_API_URL=http://localhost:8001
VITE_API_BASE_URL=http://localhost:8001/api/v1

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCCziqCGhoe3PgvMmRKIBn43gs0Kb7XOdI
VITE_FIREBASE_AUTH_DOMAIN=agrowatch-3e97f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=agrowatch-3e97f
VITE_FIREBASE_STORAGE_BUCKET=agrowatch-3e97f.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1002091625586
VITE_FIREBASE_APP_ID=1:1002091625586:web:8fee6d23e3311edc0d96eb
VITE_FIREBASE_MEASUREMENT_ID=G-LBP7FDSLSF

# External APIs
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_MATLAB_API_URL=http://localhost:8000
```

## 🚀 Development Workflow

### 1. Project Setup
```bash
# Create project structure
mkdir Agrowatch
cd Agrowatch

# Setup backend
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npx create-react-app Agro2Watch --template typescript
cd Agro2Watch
npm install # or pnpm install
```

### 2. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Select:
# - Authentication
# - Firestore
# - Functions
# - Hosting
```

### 3. Database Setup
```bash
# Install MongoDB (or use MongoDB Atlas)
# Local MongoDB
mongod --dbpath ./data/db

# Or use MongoDB Atlas cloud
# Update MONGO_URL in .env with Atlas connection string
```

### 4. Mock Data Setup

Create initial mock data for development:

```javascript
// Mock users
const mockUsers = [
  {
    phone: "9999912345",
    role: "admin",
    profile: {
      name: "राज कुमार",
      location: { state: "उत्तर प्रदेश", district: "आगरा" },
      language: "hindi"
    }
  },
  {
    phone: "9000012345", 
    role: "farmer",
    profile: {
      name: "प्रिया शर्मा",
      location: { state: "महाराष्ट्र", district: "पुणे" },
      language: "hindi"
    },
    farmerProfile: {
      farmSize: 5,
      crops: ["wheat", "rice"],
      farmingType: "organic"
    }
  }
];

// Mock crop analysis results
const mockAnalysisResults = {
  crop_health: {
    prediction: "healthy",
    confidence: 0.95,
    recommendations: [
      "Continue current irrigation schedule",
      "Apply organic fertilizer next week"
    ]
  },
  soil_analysis: {
    prediction: "loamy_soil",
    confidence: 0.87,
    recommendations: [
      "Soil is suitable for wheat cultivation",
      "Consider adding compost for better nutrients"
    ]
  },
  pest_detection: {
    prediction: "no_pest",
    confidence: 0.92,
    recommendations: [
      "No pests detected",
      "Continue regular monitoring"
    ]
  }
};
```

## 🎨 UI/UX Design Specifications

### Design System

**Color Palette:**
```css
:root {
  /* Primary - Agriculture Green */
  --primary-50: #f0fdf4;
  --primary-100: #dcfce7;
  --primary-500: #22c55e;
  --primary-600: #16a34a;
  --primary-700: #15803d;

  /* Secondary - Earth Brown */
  --secondary-100: #fef3c7;
  --secondary-500: #f59e0b;
  --secondary-600: #d97706;

  /* Accent - Sky Blue */
  --accent-100: #dbeafe;
  --accent-500: #3b82f6;
  --accent-600: #2563eb;

  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

**Typography:**
```css
/* Hindi/Devanagari Support */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.font-hindi {
  font-family: 'Noto Sans Devanagari', sans-serif;
}

.font-english {
  font-family: 'Inter', sans-serif;
}
```

**Responsive Breakpoints:**
```css
/* Mobile First Approach */
/* xs: 0px */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### Component Design Patterns

1. **Image Upload Component:**
   - Drag and drop interface
   - Progress indicator
   - Image preview
   - Crop/resize functionality
   - Multiple format support (JPEG, PNG)

2. **Analysis Results Card:**
   - Confidence score visualization
   - Color-coded predictions
   - Expandable recommendations
   - Share functionality
   - Save to history

3. **Language Switcher:**
   - Dropdown with flag icons
   - Persist selection in localStorage
   - Smooth content transition
   - RTL support preparation

4. **Mobile Navigation:**
   - Bottom tab bar
   - Swipe gestures
   - Voice search integration
   - Quick action buttons

## 🧪 Testing Strategy

### Frontend Testing
```typescript
// Component Testing (React Testing Library)
import { render, screen, fireEvent } from '@testing-library/react';
import { CropDetection } from './CropDetection';

test('should upload and analyze crop image', async () => {
  render(<CropDetection />);
  
  const fileInput = screen.getByLabelText(/upload image/i);
  const file = new File(['crop'], 'crop.jpg', { type: 'image/jpeg' });
  
  fireEvent.change(fileInput, { target: { files: [file] } });
  
  expect(await screen.findByText(/analyzing/i)).toBeInTheDocument();
});
```

### Backend Testing
```python
# API Testing (pytest + httpx)
import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_crop_analysis():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        with open("test_crop.jpg", "rb") as f:
            response = await ac.post(
                "/api/v1/crop/analyze",
                files={"file": ("crop.jpg", f, "image/jpeg")}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert "confidence" in data
        assert data["confidence"] > 0.5
```

### Integration Testing
```python
# End-to-End Testing
def test_complete_farmer_workflow():
    # 1. Register farmer
    # 2. Verify OTP
    # 3. Upload crop image
    # 4. Get analysis results
    # 5. Receive SMS notification
    # 6. Check government scheme recommendations
    pass
```

## 📱 Mobile Optimization

### PWA Configuration
```json
// manifest.json
{
  "name": "AgroWatch - Smart Farming",
  "short_name": "AgroWatch",
  "description": "AI-powered agricultural monitoring for Indian farmers",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["agriculture", "productivity", "utilities"],
  "lang": "en-IN"
}
```

### Offline Functionality
```typescript
// Service Worker for offline support
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

## 🔒 Security Implementation

### Authentication Security
```python
# Rate limiting for OTP requests
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/auth/send-otp")
@limiter.limit("3/minute")
async def send_otp(request: Request, phone_data: PhoneNumber):
    # OTP sending logic with rate limiting
    pass
```

### Data Encryption
```python
# Encrypt sensitive farmer data
from cryptography.fernet import Fernet

def encrypt_aadhaar(aadhaar_number: str) -> str:
    key = os.getenv('ENCRYPTION_KEY').encode()
    f = Fernet(key)
    return f.encrypt(aadhaar_number.encode()).decode()
```

### Input Validation
```typescript
// Zod schema for form validation
import { z } from 'zod';

const farmerProfileSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  aadhaar: z.string().regex(/^\d{12}$/),
  farmSize: z.number().positive().max(1000),
  location: z.object({
    state: z.string(),
    district: z.string(),
    village: z.string().optional()
  })
});
```

## 🚀 Deployment Configuration

### Docker Setup
```dockerfile
# Dockerfile for backend
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

```dockerfile
# Dockerfile for frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Production Environment Variables
```bash
# Production .env
ENVIRONMENT=production
DEBUG=false
ALLOWED_HOSTS=agrowatch.com,www.agrowatch.com

# Secure database URLs
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/agrowatch
REDIS_URL=redis://redis-cluster:6379

# Production API keys
FIREBASE_PROJECT_ID=agrowatch-prod
TWILIO_ACCOUNT_SID=prod_account_sid
OPENWEATHER_API_KEY=prod_weather_key

# Security
JWT_SECRET_KEY=super-secure-production-key
ENCRYPTION_KEY=production-encryption-key

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=INFO
```

## 📊 Analytics & Monitoring

### Performance Metrics
```typescript
// Frontend analytics
import { analytics } from './lib/firebase';

// Track user interactions
const trackCropAnalysis = (analysisType: string, confidence: number) => {
  analytics.logEvent('crop_analysis_completed', {
    analysis_type: analysisType,
    confidence_score: confidence,
    user_role: getCurrentUserRole()
  });
};

// Track page views
const trackPageView = (pageName: string) => {
  analytics.logEvent('page_view', {
    page_name: pageName,
    language: getCurrentLanguage(),
    device_type: isMobile() ? 'mobile' : 'desktop'
  });
};
```

### Backend Monitoring
```python
# Application monitoring
from prometheus_client import Counter, Histogram, generate_latest

# Metrics
api_requests_total = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
analysis_duration = Histogram('analysis_duration_seconds', 'Time spent on analysis')
sms_sent_total = Counter('sms_sent_total', 'Total SMS sent', ['status'])

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    api_requests_total.labels(
        method=request.method,
        endpoint=request.url.path
    ).inc()
    
    return response
```

## 🌍 Internationalization (i18n)

### Translation Files Structure
```typescript
// src/lib/translations.ts
export const translations = {
  hindi: {
    navigation: {
      dashboard: "डैशबोर्ड",
      cropDetection: "फसल जांच",
      soilAnalysis: "मिट्टी विश्लेषण",
      pestDetection: "कीट पहचान",
      weather: "मौसम",
      schemes: "सरकारी योजनाएं",
      profile: "प्रोफाइल"
    },
    buttons: {
      upload: "अपलोड करें",
      analyze: "विश्लेषण करें",
      save: "सहेजें",
      share: "साझा करें",
      cancel: "रद्द करें"
    },
    messages: {
      uploadSuccess: "छवि सफलतापूर्वक अपलोड हुई",
      analysisComplete: "विश्लेषण पूरा हुआ",
      error: "कुछ गलत हुआ है"
    }
  },
  english: {
    navigation: {
      dashboard: "Dashboard",
      cropDetection: "Crop Detection",
      soilAnalysis: "Soil Analysis",
      pestDetection: "Pest Detection",
      weather: "Weather",
      schemes: "Government Schemes",
      profile: "Profile"
    }
    // ... English translations
  },
  tamil: {
    // Tamil translations
  }
  // ... other languages
};
```

## 🎯 Performance Optimization

### Frontend Optimization
```typescript
// Code splitting
const CropDetection = lazy(() => import('./components/CropDetection'));
const SoilAnalysis = lazy(() => import('./components/SoilAnalysis'));

// Image optimization
const optimizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        }));
      }, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

### Backend Optimization
```python
# Database indexing
from motor.motor_asyncio import AsyncIOMotorClient

async def create_indexes():
    db = get_database()
    
    # User collection indexes
    await db.users.create_index("phone", unique=True)
    await db.users.create_index("profile.location.coordinates", name="location_2dsphere")
    
    # Analysis collection indexes
    await db.crop_analyses.create_index([("userId", 1), ("createdAt", -1)])
    await db.crop_analyses.create_index("location.coordinates", name="analysis_location_2dsphere")
    
    # Weather collection indexes
    await db.weather_data.create_index([("location.coordinates", "2dsphere"), ("fetchedAt", -1)])

# Caching
from redis import Redis
import json

redis_client = Redis.from_url(os.getenv("REDIS_URL"))

async def get_cached_weather(lat: float, lon: float):
    cache_key = f"weather:{lat}:{lon}"
    cached_data = redis_client.get(cache_key)
    
    if cached_data:
        return json.loads(cached_data)
    
    # Fetch from API and cache
    weather_data = await fetch_weather_from_api(lat, lon)
    redis_client.setex(cache_key, 1800, json.dumps(weather_data))  # 30 min cache
    
    return weather_data
```

## 📋 Launch Checklist

### Pre-Launch Verification

**✅ Technical Readiness**
- [ ] All API endpoints tested and documented
- [ ] MATLAB models loaded and validated
- [ ] Firebase authentication configured
- [ ] Twilio SMS/WhatsApp integration tested
- [ ] Database schemas and indexes created
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CDN configured for static assets
- [ ] Error monitoring (Sentry) setup
- [ ] Performance monitoring configured

**✅ Security Audit**
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Data encryption for sensitive information
- [ ] CORS policies configured
- [ ] API key rotation strategy in place
- [ ] Security headers configured
- [ ] Database access controls verified

**✅ User Experience**
- [ ] Mobile responsiveness tested on multiple devices
- [ ] All 7 languages tested and verified
- [ ] Offline functionality working
- [ ] Page load times under 3 seconds
- [ ] Image upload and analysis flow tested
- [ ] OTP delivery and verification working
- [ ] Government schemes data updated

**✅ Content & Data**
- [ ] Crop disease database populated
- [ ] Soil type classifications complete
- [ ] Pest identification data loaded
- [ ] Government schemes information current
- [ ] Weather API integration tested
- [ ] Farmer testimonials and success stories

**✅ Compliance & Legal**
- [ ] Data privacy policy published
- [ ] Terms of service finalized
- [ ] GDPR compliance verified
- [ ] Indian data localization requirements met
- [ ] Agricultural department approvals obtained

### Launch Phases

**Phase 1: Limited Beta (100 farmers)**
- Select farmers from 3 states
- Monitor system performance
- Gather user feedback
- Fix critical issues

**Phase 2: Regional Launch (1,000 farmers)**
- Expand to 10 states
- Scale infrastructure
- Add regional language support
- Partner with agricultural universities

**Phase 3: National Rollout (10,000+ farmers)**
- All-India availability
- Government partnership announcements
- Media launch campaign
- Continuous feature updates

---

## 🎯 Success Metrics

**User Engagement:**
- Monthly Active Users (MAU)
- Daily crop analyses performed
- User retention rate (30, 60, 90 days)
- Average session duration
- Feature adoption rates

**Technical Performance:**
- API response times < 2 seconds
- Uptime > 99.9%
- Image analysis accuracy > 95%
- SMS delivery rate > 98%
- Mobile app crash rate < 1%

**Business Impact:**
- Farmer productivity improvements
- Early disease detection rates
- Government scheme application increases
- User satisfaction scores
- Word-of-mouth referrals

---

**This comprehensive prompt provides everything needed to recreate the AgroWatch agricultural monitoring platform with all its sophisticated features, integrations, and optimizations for Indian farmers.**