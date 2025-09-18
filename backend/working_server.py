#!/usr/bin/env python3
"""
Working AgroWatch Backend Server
Fixed version that handles all API endpoints including weather
"""

import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
from datetime import datetime, timedelta
import jwt
from typing import Optional, Dict, Any
import re
import httpx

# Import Twilio API
try:
    from twilio_api import router as twilio_router
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    logger.warning("Twilio API not available - install twilio package")

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
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",  # Alternative localhost
        "http://localhost:3000",  # Alternative dev server
        "http://127.0.0.1:3000",  # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ],
)

# Include Twilio API router if available
if TWILIO_AVAILABLE:
    app.include_router(twilio_router)
    logger.info("✅ Twilio API router included")
else:
    logger.warning("⚠️ Twilio API router not available")

# Pydantic models
class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str

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

class CropHealthAnalysisRequest(BaseModel):
    image_url: str

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
    return {
        "message": "AgroWatch API Server",
        "version": "1.0.0",
        "status": "healthy",
        "endpoints": {
            "health": "/health",
            "weather": "/weather/current",
            "docs": "/api/v1/docs"
        }
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/health")
async def api_health():
    """API health check endpoint"""
    return {
        "status": "ok",
        "service": "AgroWatch API"
    }

@app.get("/api/test-cors")
async def test_cors():
    """Test CORS configuration"""
    return {
        "message": "CORS is working correctly!",
        "timestamp": datetime.now().isoformat(),
        "cors_enabled": True
    }

# Weather API endpoints
@app.get("/weather/current")
async def get_current_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """Get current weather by coordinates"""
    try:
        # Try to get real weather data from OpenWeatherMap
        OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'your_openweathermap_api_key')
        
        if OPENWEATHER_API_KEY != 'your_openweathermap_api_key':
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": OPENWEATHER_API_KEY,
                        "units": "metric"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    weather_data = {
                        "temperature": round(data["main"]["temp"]),
                        "humidity": data["main"]["humidity"],
                        "pressure": data["main"]["pressure"],
                        "wind_speed": round(data.get("wind", {}).get("speed", 0) * 3.6, 1),  # Convert m/s to km/h
                        "wind_direction": data.get("wind", {}).get("deg", 0),
                        "description": data["weather"][0]["description"].title(),
                        "icon": data["weather"][0]["icon"],
                        "location": data["name"],
                        "country": data["sys"]["country"],
                        "visibility": data.get("visibility", 10000) / 1000,  # Convert to km
                        "uv_index": None,
                        "timestamp": datetime.now().isoformat(),
                        "coordinates": {"lat": lat, "lon": lon},
                        "fallback": False
                    }
                    return {"success": True, "data": weather_data}
        
        # Fallback to location-specific mock data if API key is not set or request fails
        # Create location-based variations
        lat_factor = abs(lat) % 10
        lon_factor = abs(lon) % 10
        time_factor = int(datetime.now().strftime("%H"))
        
        # Temperature varies by latitude and time
        base_temp = 20 + (lat_factor * 2)  # Colder at higher latitudes
        temp_variation = (time_factor - 12) * 2  # Warmer during day
        temperature = round(base_temp + temp_variation + (int(datetime.now().strftime("%H")) % 5 - 2))
        
        # Humidity varies by longitude and time
        base_humidity = 60 + (lon_factor * 3)  # More humid in some regions
        humidity = base_humidity + (int(datetime.now().strftime("%M")) % 15 - 7)
        
        # Pressure varies by altitude (simulated by lat/lon)
        base_pressure = 1013 + (lat_factor * 2) - (lon_factor * 1)
        pressure = base_pressure + (int(datetime.now().strftime("%d")) % 10 - 5)
        
        # Wind varies by location
        wind_speed = 3 + (lat_factor + lon_factor) % 8
        wind_direction = (lat_factor * 36 + lon_factor * 18) % 360
        
        # Weather description varies by location and time
        weather_conditions = ["Clear", "Partly Cloudy", "Cloudy", "Sunny", "Overcast"]
        description = weather_conditions[(lat_factor + lon_factor + time_factor) % len(weather_conditions)]
        
        # Location name based on coordinates
        location_names = {
            (28.6, 77.2): "New Delhi",
            (19.0, 72.8): "Mumbai", 
            (12.9, 77.6): "Bangalore",
            (22.5, 88.3): "Kolkata",
            (13.0, 80.2): "Chennai",
            (18.5, 73.8): "Pune",
            (26.9, 75.8): "Jaipur",
            (17.3, 78.4): "Hyderabad"
        }
        
        # Find closest known location or use coordinates
        location_name = f"Location {lat:.2f}, {lon:.2f}"
        min_distance = float('inf')
        for (known_lat, known_lon), name in location_names.items():
            distance = ((lat - known_lat) ** 2 + (lon - known_lon) ** 2) ** 0.5
            if distance < min_distance and distance < 0.5:  # Within ~50km
                location_name = name
                min_distance = distance
        
        weather_data = {
            "temperature": temperature,
            "humidity": humidity,
            "pressure": pressure,
            "wind_speed": round(wind_speed, 1),
            "wind_direction": wind_direction,
            "description": description,
            "icon": "02d",
            "location": location_name,
            "country": "IN",
            "visibility": 10 + (lat_factor % 5),
            "uv_index": None,
            "timestamp": datetime.now().isoformat(),
            "coordinates": {"lat": lat, "lon": lon},
            "fallback": True
        }
        
        return {"success": True, "data": weather_data}
    except Exception as e:
        logger.error(f"Weather endpoint error: {e}")
        # Return location-specific fallback data even on error
        lat_factor = abs(lat) % 10
        lon_factor = abs(lon) % 10
        
        weather_data = {
            "temperature": 25 + (lat_factor * 2),
            "humidity": 60 + (lon_factor * 3),
            "pressure": 1010 + (lat_factor * 2),
            "wind_speed": 4 + (lat_factor % 5),
            "wind_direction": (lat_factor * 40) % 360,
            "description": "Partly Cloudy",
            "icon": "02d",
            "location": f"Location {lat:.2f}, {lon:.2f}",
            "country": "IN",
            "visibility": 10,
            "uv_index": None,
            "timestamp": datetime.now().isoformat(),
            "coordinates": {"lat": lat, "lon": lon},
            "fallback": True
        }
        return {"success": True, "data": weather_data}

@app.get("/weather/{city_name}")
async def get_weather_by_city_name(city_name: str):
    """Get current weather by city name"""
    try:
        # Try to get real weather data from OpenWeatherMap
        OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'your_openweathermap_api_key')
        
        if OPENWEATHER_API_KEY != 'your_openweathermap_api_key':
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={
                        "q": city_name,
                        "appid": OPENWEATHER_API_KEY,
                        "units": "metric"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    weather_data = {
                        "temperature": round(data["main"]["temp"]),
                        "humidity": data["main"]["humidity"],
                        "pressure": data["main"]["pressure"],
                        "wind_speed": round(data.get("wind", {}).get("speed", 0) * 3.6, 1),  # Convert m/s to km/h
                        "wind_direction": data.get("wind", {}).get("deg", 0),
                        "description": data["weather"][0]["description"].title(),
                        "icon": data["weather"][0]["icon"],
                        "location": data["name"],
                        "country": data["sys"]["country"],
                        "visibility": data.get("visibility", 10000) / 1000,  # Convert to km
                        "uv_index": None,
                        "timestamp": datetime.now().isoformat(),
                        "coordinates": {"lat": data["coord"]["lat"], "lon": data["coord"]["lon"]},
                        "fallback": False
                    }
                    return {"success": True, "data": weather_data}
        
        # Fallback to mock data with location-specific variations
        city_coords = {
            "delhi": (28.6139, 77.2090),
            "mumbai": (19.0760, 72.8777),
            "bangalore": (12.9716, 77.5946),
            "chennai": (13.0827, 80.2707),
            "kolkata": (22.5726, 88.3639),
            "hyderabad": (17.3850, 78.4867),
            "pune": (18.5204, 73.8567)
        }
        
        coords = city_coords.get(city_name.lower(), (28.6139, 77.2090))
        
        # Add location-specific variations based on city and time
        city_variations = {
            "delhi": {"base_temp": 28, "base_humidity": 60, "base_pressure": 1013, "description": "Partly Cloudy"},
            "mumbai": {"base_temp": 32, "base_humidity": 75, "base_pressure": 1015, "description": "Humid"},
            "bangalore": {"base_temp": 26, "base_humidity": 70, "base_pressure": 1012, "description": "Pleasant"},
            "chennai": {"base_temp": 33, "base_humidity": 80, "base_pressure": 1014, "description": "Hot and Humid"},
            "kolkata": {"base_temp": 31, "base_humidity": 78, "base_pressure": 1013, "description": "Tropical"},
            "hyderabad": {"base_temp": 30, "base_humidity": 65, "base_pressure": 1012, "description": "Dry"},
            "pune": {"base_temp": 27, "base_humidity": 68, "base_pressure": 1011, "description": "Moderate"}
        }
        
        city_data = city_variations.get(city_name.lower(), city_variations["delhi"])
        time_factor = int(datetime.now().strftime("%H"))
        minute_factor = int(datetime.now().strftime("%M"))
        
        weather_data = {
            "temperature": city_data["base_temp"] + (time_factor % 8 - 4) + (minute_factor % 3 - 1),
            "humidity": city_data["base_humidity"] + (minute_factor % 15 - 7),
            "pressure": city_data["base_pressure"] + (int(datetime.now().strftime("%d")) % 10 - 5),
            "wind_speed": 4 + (time_factor % 6) + (minute_factor % 3),
            "wind_direction": (time_factor * 15 + minute_factor * 2) % 360,
            "description": city_data["description"],
            "icon": "02d",
            "location": city_name.title(),
            "country": "IN",
            "visibility": 8 + (time_factor % 5),
            "uv_index": None,
            "timestamp": datetime.now().isoformat(),
            "coordinates": {"lat": coords[0], "lon": coords[1]},
            "fallback": True
        }
        
        return {"success": True, "data": weather_data}
    except Exception as e:
        logger.error(f"Weather by city endpoint error: {e}")
        # Return location-specific fallback data even on error
        coords = city_coords.get(city_name.lower(), (28.6139, 77.2090))
        city_data = city_variations.get(city_name.lower(), city_variations["delhi"])
        
        weather_data = {
            "temperature": city_data["base_temp"],
            "humidity": city_data["base_humidity"],
            "pressure": city_data["base_pressure"],
            "wind_speed": 5.0,
            "wind_direction": 180,
            "description": city_data["description"],
            "icon": "02d",
            "location": city_name.title(),
            "country": "IN",
            "visibility": 10,
            "uv_index": None,
            "timestamp": datetime.now().isoformat(),
            "coordinates": {"lat": coords[0], "lon": coords[1]},
            "fallback": True
        }
        return {"success": True, "data": weather_data}

# Authentication endpoints
@app.post("/api/auth/send-otp")
async def send_otp(request: SendOTPRequest):
    """Send OTP to phone number (mock implementation)"""
    try:
        phone = normalize_phone_number(request.phone)
        
        # Mock OTP sending
        otp = "123456"  # In production, generate random OTP
        
        logger.info(f"Mock OTP sent to {phone}: {otp}")
        
        return {
            "message": "OTP sent"
        }
    except Exception as e:
        logger.error(f"Send OTP error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    """Verify OTP and return access token"""
    try:
        phone = normalize_phone_number(request.phone)
        
        # Mock OTP verification
        if request.otp == "1234":
            user_data = {
                "phone": phone,
                "name": "Test User",
                "verified": True
            }
            
            access_token = generate_access_token(user_data)
            
            # Store user in mock storage
            mock_users[phone] = user_data
            
            return {
                "message": "OTP verified successfully"
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid OTP")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Verify OTP error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Legacy auth endpoints (keeping for backward compatibility)
@app.post("/auth/send-otp")
async def send_otp_legacy(request: SendOTPRequest):
    """Send OTP to phone number (legacy endpoint)"""
    return await send_otp(request)

@app.post("/auth/verify-otp")
async def verify_otp_legacy(request: VerifyOTPRequest):
    """Verify OTP (legacy endpoint)"""
    return await verify_otp(request)

# User management endpoints
@app.get("/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    try:
        phone = current_user["sub"]
        user_data = mock_users.get(phone, {})
        
        return {
            "success": True,
            "data": user_data
        }
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/user/register")
async def register_user(request: RegisterUserRequest, current_user: dict = Depends(get_current_user)):
    """Register/update user profile"""
    try:
        phone = current_user["sub"]
        
        user_data = {
            "phone": phone,
            "name": request.name,
            "email": request.email,
            "address": request.address,
            "farm_size": request.farm_size,
            "crop_types": request.crop_types,
            "aadhaar_verified": request.aadhaar_verified,
            "registered_at": datetime.now().isoformat()
        }
        
        mock_users[phone] = user_data
        
        return {
            "success": True,
            "message": "User registered successfully",
            "data": user_data
        }
    except Exception as e:
        logger.error(f"Register user error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Analysis endpoints (mock implementations)
@app.post("/analyze/crop-health")
async def analyze_crop_health(file: UploadFile = File(None), request: CropHealthAnalysisRequest = None):
    """Analyze crop health from image file upload or URL"""
    try:
        # Handle file upload (FormData)
        if file is not None:
            # Mock analysis result for file upload
            result = {
                "success": True,
                "analysis_type": "crop_health",
                "crop_type": "wheat",  # Default crop type
                "filename": file.filename,
                "results": {
                    "health_status": "healthy",
                    "disease_detected": None,
                    "confidence": 0.95,
                    "severity": "low",
                    "model_accuracy": 0.92,
                    "recommendations": [
                        "Continue current care routine",
                        "Monitor regularly for early signs of stress",
                        "Maintain optimal watering schedule",
                        "Apply balanced fertilizer as needed"
                    ],
                    "all_predictions": {
                        "healthy": 0.95,
                        "diseased": 0.03,
                        "pest_damage": 0.02
                    },
                    "pest_detected": False,
                    "num_detections": 0,
                    "detections": [],
                    "overall_health": "excellent",
                    "nutrient_analysis": {
                        "nitrogen": {"value": 75, "unit": "ppm"},
                        "phosphorus": {"value": 60, "unit": "ppm"},
                        "potassium": {"value": 80, "unit": "ppm"}
                    }
                }
            }
        # Handle URL request (JSON)
        elif request is not None:
        result = {
            "image_url": request.image_url,
            "prediction": "Healthy 🌿",
                "confidence": 0.95,
                "health": "healthy",
                "disease": None,
                "severity": "low",
                "recommendations": [
                    "Continue current care routine",
                    "Monitor regularly for early signs of stress",
                    "Maintain optimal watering schedule",
                    "Apply balanced fertilizer as needed"
                ],
                "analysis_type": "crop_health",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail="Either file or image_url must be provided")
        
        return result
    except Exception as e:
        logger.error(f"Crop health analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/crop")
async def analyze_crop(file: UploadFile = File(...)):
    """Analyze crop health from image file upload"""
    try:
        # Mock analysis result
        result = {
            "health": "healthy",
            "confidence": 0.92,
            "disease": None,
            "severity": None,
            "recommendations": [
                "Maintain irrigation schedule",
                "Apply balanced fertilizer as per soil test",
                "Monitor for pest activity"
            ],
            "analysis_type": "crop_health",
            "timestamp": datetime.now().isoformat()
        }
        
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Crop analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/pest-detection")
async def analyze_pest_detection(file: UploadFile = File(...)):
    """Analyze pest detection from image"""
    try:
        # Mock analysis result matching frontend expectations
        result = {
            "success": True,
            "analysis_type": "pest_detection",
            "crop_type": "wheat",
            "filename": file.filename,
            "results": {
                "health_status": "pest_detected",
                "disease_detected": "Aphids",
                "confidence": 0.87,
                "severity": "medium",
                "model_accuracy": 0.89,
                "recommendations": [
                    "Apply neem oil spray (2-3ml per liter of water)",
                    "Use insecticidal soap solution",
                    "Introduce beneficial insects like ladybugs",
                    "Remove heavily infested leaves"
                ],
                "all_predictions": {
                    "healthy": 0.10,
                    "aphids": 0.87,
                    "whiteflies": 0.02,
                    "spider_mites": 0.01
                },
                "pest_detected": True,
                "num_detections": 1,
                "detections": [
                    {
                        "pest_type": "Aphids",
                        "confidence": 0.87,
                        "bounding_box": {
                            "x": 100,
                            "y": 150,
                            "width": 200,
                            "height": 180
                        }
                    }
                ],
                "overall_health": "needs_attention",
                "nutrient_analysis": {
                    "nitrogen": {"value": 70, "unit": "ppm"},
                    "phosphorus": {"value": 55, "unit": "ppm"},
                    "potassium": {"value": 75, "unit": "ppm"}
                }
            }
        }
        
        return result
    except Exception as e:
        logger.error(f"Pest analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/pest")
async def analyze_pest(file: UploadFile = File(...)):
    """Analyze pest detection from image (legacy endpoint)"""
    try:
        # Mock analysis result
        result = {
            "disease": "Leaf Blight",
            "confidence": 0.81,
            "treatment": [
                "Use recommended fungicide",
                "Remove infected leaves",
                "Improve air circulation"
            ],
            "prevention": [
                "Ensure proper spacing and airflow",
                "Avoid overhead irrigation late in the day",
                "Regular monitoring"
            ],
            "analysis_type": "pest_detection",
            "timestamp": datetime.now().isoformat()
        }
        
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Pest analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/soil-health")
async def analyze_soil_health(file: UploadFile = File(...)):
    """Analyze soil health from image"""
    try:
        # Mock analysis result matching frontend expectations
        result = {
            "success": True,
            "analysis_type": "soil_health",
            "crop_type": "wheat",
            "filename": file.filename,
            "results": {
                "health_status": "good",
                "disease_detected": None,
                "confidence": 0.88,
                "severity": "low",
                "model_accuracy": 0.91,
                "recommendations": [
                    "Soil pH is optimal for most crops (6.5-7.0)",
                    "Moisture level is good for plant growth",
                    "Consider adding organic compost to improve soil structure",
                    "Phosphorus levels could be increased for better root development",
                    "Regular soil testing recommended every 6 months"
                ],
                "all_predictions": {
                    "excellent": 0.25,
                    "good": 0.63,
                    "fair": 0.10,
                    "poor": 0.02
                },
                "pest_detected": False,
                "num_detections": 0,
                "detections": [],
                "overall_health": "good",
                "nutrient_analysis": {
                    "ph": {"value": 6.8, "unit": "pH"},
                    "moisture": {"value": 45, "unit": "%"},
                    "nitrogen": {"value": 78, "unit": "ppm"},
                    "phosphorus": {"value": 65, "unit": "ppm"},
                    "potassium": {"value": 82, "unit": "ppm"},
                    "organic_matter": {"value": 3.2, "unit": "%"}
                }
            }
        }
        
        return result
    except Exception as e:
        logger.error(f"Soil health analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/soil")
async def analyze_soil(file: UploadFile = File(...)):
    """Analyze soil composition from image (legacy endpoint)"""
    try:
        # Mock analysis result
        result = {
            "ph_level": 6.5,
            "nutrients": {
                "nitrogen": "medium",
                "phosphorus": "high",
                "potassium": "low"
            },
            "organic_matter": "good",
            "recommendations": [
                "Add potassium-rich fertilizer",
                "Maintain current nitrogen levels",
                "Consider organic matter addition"
            ],
            "analysis_type": "soil_analysis",
            "timestamp": datetime.now().isoformat()
        }
        
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Soil analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting AgroWatch API Server...")
    print("📡 Server will be available at: http://localhost:8001")
    print("📚 API Documentation: http://localhost:8001/api/v1/docs")
    print("🔍 Health Check: http://localhost:8001/health")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8001,
        log_level="info"
    )
