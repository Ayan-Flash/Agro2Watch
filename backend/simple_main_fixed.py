#!/usr/bin/env python3
"""
Fixed AgroWatch Backend for Testing
Properly handles JWT authentication
"""

import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from datetime import datetime, timedelta
import jwt
from typing import Optional, Dict, Any
import re

# Simple configuration
SECRET_KEY = "test-secret-key-for-development"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("🚀 Starting AgroWatch API server...")
    yield
    logger.info("Shutting down AgroWatch API server...")

# Create FastAPI application
app = FastAPI(
    title="AgroWatch API",
    version="1.0.0",
    description="AI-Powered Precision Farming Platform for India",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class SendOTPRequest(BaseModel):
    phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str
    session_info: str = None

class RegisterUserRequest(BaseModel):
    phone_number: str
    name: str
    email: str = ""
    address: str = ""
    farm_size: str = ""
    crop_types: list = []
    aadhaar_verified: bool = False

class UpdateProfileRequest(BaseModel):
    name: str = None
    email: str = None
    address: str = None
    farm_size: str = None
    crop_types: list = None

# Helper functions
def normalize_phone_number(phone: str) -> str:
    """Normalize phone number to international format"""
    phone = re.sub(r'[^\d+]', '', phone)
    
    if phone.startswith('+91'):
        return phone
    elif phone.startswith('91') and len(phone) == 12:
        return f"+{phone}"
    elif phone.startswith('0') and len(phone) == 11:
        return f"+91{phone[1:]}"
    elif len(phone) == 10:
        return f"+91{phone}"
    else:
        return phone

def generate_access_token(user_data: Dict[str, Any]) -> str:
    """Generate JWT access token"""
    to_encode = {
        "sub": user_data["phone"],
        "name": user_data.get("name", ""),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.utcnow()
    }
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Dict[str, Any]:
    """Verify JWT access token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone_number = payload.get("sub")
        
        if phone_number is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current authenticated user with proper header handling"""
    if not authorization:
        raise HTTPException(
            status_code=401, 
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, 
            detail="Invalid authorization header format. Expected: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = authorization.replace("Bearer ", "")
    return verify_token(token)

# Mock user storage (in production, use database)
mock_users = {}

# Root endpoints
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to AgroWatch API",
        "description": "AI-Powered Precision Farming Platform for India",
        "version": "1.0.0",
        "docs": "/api/v1/docs",
        "status": "operational",
        "features": [
            "Crop Health Detection",
            "Pest Identification", 
            "Soil Analysis",
            "Weather Integration",
            "Phone Authentication",
            "Multi-language Support"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "models": "mock_mode",
        "timestamp": datetime.now().isoformat()
    }

# Authentication endpoints
@app.post("/api/v1/auth/send-otp")
async def send_otp(request: SendOTPRequest):
    """Send OTP to phone number"""
    try:
        normalized_phone = normalize_phone_number(request.phone_number)
        
        if not re.match(r'^\+91[6-9]\d{9}$', normalized_phone):
            raise HTTPException(status_code=400, detail="Invalid Indian phone number")
        
        logger.info(f"🔥 MOCK: Sending OTP to {normalized_phone}")
        
        return {
            "success": True,
            "message": "OTP sent successfully (MOCK)",
            "session_info": "mock_session_123456"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/v1/auth/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    """Verify OTP and return access token"""
    try:
        normalized_phone = normalize_phone_number(request.phone_number)
        
        if not re.match(r'^\+91[6-9]\d{9}$', normalized_phone):
            raise HTTPException(status_code=400, detail="Invalid Indian phone number")
        
        if not re.match(r'^\d{6}$', request.otp):
            raise HTTPException(status_code=400, detail="OTP must be 6 digits")
        
        # Accept any 6-digit OTP for development
        if len(request.otp) == 6 and request.otp.isdigit():
            user_profile = mock_users.get(normalized_phone, {
                "phone": normalized_phone,
                "name": "Test User",
                "email": "",
                "address": "",
                "farm_size": "5 acres",
                "crop_types": ["Rice", "Wheat"],
                "aadhaar_verified": False,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
                "is_active": True
            })
            
            mock_users[normalized_phone] = user_profile
            access_token = generate_access_token(user_profile)
            
            logger.info(f"🔥 MOCK: OTP verified for {normalized_phone}")
            return {
                "success": True,
                "access_token": access_token,
                "token_type": "bearer",
                "user": user_profile
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid OTP")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying OTP: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/v1/auth/register")
async def register_user(request: RegisterUserRequest):
    """Register new user with profile data"""
    try:
        normalized_phone = normalize_phone_number(request.phone_number)
        
        if not re.match(r'^\+91[6-9]\d{9}$', normalized_phone):
            raise HTTPException(status_code=400, detail="Invalid Indian phone number")
        
        user_profile = {
            "phone": normalized_phone,
            "name": request.name,
            "email": request.email,
            "address": request.address,
            "farm_size": request.farm_size,
            "crop_types": request.crop_types,
            "aadhaar_verified": request.aadhaar_verified,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "is_active": True
        }
        
        mock_users[normalized_phone] = user_profile
        access_token = generate_access_token(user_profile)
        
        logger.info(f"🔥 MOCK: User registered {normalized_phone}")
        return {
            "success": True,
            "message": "User registered successfully (MOCK)",
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_profile
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/v1/auth/validate-token")
async def validate_token(current_user: dict = Depends(get_current_user)):
    """Validate access token"""
    return {
        "success": True,
        "valid": True,
        "user_phone": current_user.get("sub"),
        "user_name": current_user.get("name"),
        "expires_at": current_user.get("exp")
    }

# User management endpoints
@app.get("/api/v1/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get user profile"""
    try:
        phone_number = current_user.get("sub")
        profile = mock_users.get(phone_number)
        
        if profile:
            return {
                "success": True,
                "data": profile
            }
        else:
            raise HTTPException(status_code=404, detail="User profile not found")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/api/v1/user/profile")
async def update_user_profile(
    request: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    try:
        phone_number = current_user.get("sub")
        
        if phone_number not in mock_users:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update profile
        profile = mock_users[phone_number]
        if request.name is not None:
            profile["name"] = request.name
        if request.email is not None:
            profile["email"] = request.email
        if request.address is not None:
            profile["address"] = request.address
        if request.farm_size is not None:
            profile["farm_size"] = request.farm_size
        if request.crop_types is not None:
            profile["crop_types"] = request.crop_types
        
        profile["updated_at"] = datetime.utcnow().isoformat()
        mock_users[phone_number] = profile
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": profile
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# AI Detection endpoints (mock)
@app.post("/api/v1/detection/crop-health")
async def detect_crop_health(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Detect crop health from uploaded image"""
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Mock crop health analysis
        result = {
            "status": "Healthy",
            "confidence": 0.92,
            "health_score": 92,
            "recommendations": [
                "Continue current care routine",
                "Monitor for any changes in leaf color",
                "Ensure adequate watering",
                "Consider organic fertilizer application"
            ],
            "user_phone": current_user.get("sub"),
            "analysis_type": "crop_health",
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in crop health detection: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/v1/detection/pest-detection")
async def detect_pest(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Detect pests from uploaded image"""
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Mock pest detection
        result = {
            "pest_detected": True,
            "pest_type": "Aphids",
            "confidence": 0.87,
            "severity": "medium",
            "treatment": [
                "Apply neem oil spray (2-3ml per liter of water)",
                "Use insecticidal soap solution",
                "Introduce beneficial insects like ladybugs",
                "Remove heavily infested leaves"
            ],
            "prevention": [
                "Maintain proper plant spacing for good air circulation",
                "Regular inspection of plants",
                "Avoid over-fertilizing with nitrogen",
                "Use reflective mulches to deter aphids"
            ],
            "user_phone": current_user.get("sub"),
            "analysis_type": "pest_detection",
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in pest detection: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/v1/detection/soil-analysis")
async def analyze_soil(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Analyze soil from uploaded image"""
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Mock soil analysis
        result = {
            "soil_type": "Alluvial",
            "confidence": 0.89,
            "ph": 6.5,
            "nitrogen": 45,
            "phosphorus": 25,
            "potassium": 180,
            "organic_matter": 3.2,
            "moisture": 35,
            "recommendations": [
                "Soil pH is optimal for most crops",
                "Consider adding organic compost to improve nitrogen levels",
                "Phosphorus levels are adequate",
                "Potassium levels are good for crop growth"
            ],
            "user_phone": current_user.get("sub"),
            "analysis_type": "soil_analysis",
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in soil analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Weather endpoints (mock)
@app.get("/api/v1/weather/current")
async def get_current_weather(lat: Optional[float] = None, lon: Optional[float] = None, city: Optional[str] = None):
    """Get current weather data"""
    try:
        location = city if city else "Delhi"
        
        weather_data = {
            "location": location,
            "country": "IN",
            "temperature": 28,
            "feels_like": 32,
            "humidity": 65,
            "pressure": 1013,
            "wind_speed": 5.2,
            "wind_direction": 180,
            "visibility": 10,
            "uv_index": 6,
            "description": "Partly cloudy",
            "icon": "02d",
            "sunrise": 1642647000,
            "sunset": 1642688400,
            "timestamp": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": weather_data
        }
        
    except Exception as e:
        logger.error(f"Error in get_current_weather: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch weather data")

@app.get("/api/v1/weather/forecast")
async def get_weather_forecast(lat: Optional[float] = None, lon: Optional[float] = None, days: int = 5):
    """Get weather forecast"""
    try:
        forecasts = []
        for i in range(days):
            forecasts.append({
                "datetime": f"2024-01-{20+i} 12:00:00",
                "temperature": 28 + i,
                "humidity": 65 - i,
                "description": "Partly cloudy",
                "icon": "02d",
                "wind_speed": 5.2
            })
        
        forecast_data = {
            "location": "Delhi",
            "forecasts": forecasts
        }
        
        return {
            "success": True,
            "data": forecast_data
        }
        
    except Exception as e:
        logger.error(f"Error in get_weather_forecast: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch forecast data")

@app.get("/api/v1/weather/alerts")
async def get_weather_alerts(lat: Optional[float] = None, lon: Optional[float] = None):
    """Get weather alerts for farming"""
    try:
        alerts = [
            {
                "type": "high_temperature",
                "severity": "warning",
                "message": "High temperature alert! Ensure adequate irrigation and shade for crops.",
                "recommendation": "Increase watering frequency and provide shade nets if possible."
            }
        ]
        
        return {
            "success": True,
            "data": {
                "location": "Delhi",
                "alerts": alerts,
                "weather_conditions": {
                    "temperature": 28,
                    "humidity": 65,
                    "wind_speed": 5.2,
                    "description": "Partly cloudy"
                },
                "timestamp": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        logger.error(f"Error in get_weather_alerts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch weather alerts")

if __name__ == "__main__":
    uvicorn.run(
        "simple_main_fixed:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )