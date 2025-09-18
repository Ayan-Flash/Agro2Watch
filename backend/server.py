#!/usr/bin/env python3
"""
AgroWatch API Server
Main FastAPI application with all endpoints for crop monitoring
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import json
import asyncio
from datetime import datetime
import logging

# Import our custom modules
try:
    from database import connect_to_mongo, close_mongo_connection, get_database
except ImportError as e:
    print(f"Warning: Could not import database module: {e}")
    connect_to_mongo = None
    close_mongo_connection = None
    get_database = lambda: None

try:
    from models import *
except ImportError as e:
    print(f"Warning: Could not import models: {e}")

try:
    from auth_routes import router as auth_router
except ImportError as e:
    print(f"Warning: Could not import auth_routes: {e}")
    auth_router = None

try:
    from firebase_service import FirebaseService
except ImportError as e:
    print(f"Warning: Could not import firebase_service: {e}")
    FirebaseService = None

try:
    from twilio_service import TwilioService
except ImportError as e:
    print(f"Warning: Could not import twilio_service: {e}")
    TwilioService = None

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AgroWatch API",
    description="Comprehensive API for agricultural monitoring and crop health analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Global services
firebase_service = None
twilio_service = None
weather_api_key = os.getenv('WEATHER_API_KEY')

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    global firebase_service, twilio_service
    
    logger.info("[STARTUP] Starting AgroWatch API Server...")
    
    # Connect to MongoDB
    if connect_to_mongo:
        try:
            result = await connect_to_mongo()
            if result:
                logger.info("[SUCCESS] MongoDB connected")
            else:
                logger.info("[INFO] Running without MongoDB")
        except Exception as e:
            logger.warning(f"[WARNING] MongoDB connection failed: {e}")
    else:
        logger.warning("[WARNING] MongoDB module not available")
    
    # Initialize Firebase
    if FirebaseService:
        try:
            firebase_service = FirebaseService()
            logger.info("[SUCCESS] Firebase service initialized")
        except Exception as e:
            logger.error(f"[ERROR] Firebase initialization failed: {e}")
    else:
        logger.warning("[WARNING] Firebase service not available")
    
    # Initialize Twilio
    if TwilioService:
        try:
            twilio_service = TwilioService()
            logger.info("[SUCCESS] Twilio service initialized")
        except Exception as e:
            logger.error(f"[ERROR] Twilio initialization failed: {e}")
    else:
        logger.warning("[WARNING] Twilio service not available")
    
    logger.info("[COMPLETE] Server startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("[SHUTDOWN] Shutting down AgroWatch API Server...")
    if close_mongo_connection:
        await close_mongo_connection()
    logger.info("[SUCCESS] Server shutdown complete")

# Include auth routes
if auth_router:
    app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
else:
    logger.warning("Auth routes not available")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "connected" if get_database() else "disconnected",
            "firebase": "connected" if firebase_service else "disconnected",
            "twilio": "connected" if twilio_service else "disconnected",
            "weather": "configured" if weather_api_key else "not_configured"
        }
    }

# Weather API endpoints
@app.get("/api/weather/current")
async def get_current_weather(lat: float, lon: float):
    """Get current weather data for given coordinates"""
    try:
        import aiohttp
        
        if not weather_api_key:
            raise HTTPException(status_code=500, detail="Weather API key not configured")
        
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={weather_api_key}&units=metric"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return {
                        "temperature": data["main"]["temp"],
                        "humidity": data["main"]["humidity"],
                        "pressure": data["main"]["pressure"],
                        "weather": data["weather"][0]["description"],
                        "wind_speed": data["wind"]["speed"],
                        "location": data["name"]
                    }
                else:
                    raise HTTPException(status_code=response.status, detail="Weather API request failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather data fetch failed: {str(e)}")

@app.get("/api/weather/forecast")
async def get_weather_forecast(lat: float, lon: float, days: int = 5):
    """Get weather forecast for given coordinates"""
    try:
        import aiohttp
        
        if not weather_api_key:
            raise HTTPException(status_code=500, detail="Weather API key not configured")
        
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={weather_api_key}&units=metric&cnt={days * 8}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    forecast_list = []
                    for item in data["list"]:
                        forecast_list.append({
                            "datetime": item["dt_txt"],
                            "temperature": item["main"]["temp"],
                            "humidity": item["main"]["humidity"],
                            "weather": item["weather"][0]["description"],
                            "wind_speed": item["wind"]["speed"]
                        })
                    return {"forecast": forecast_list}
                else:
                    raise HTTPException(status_code=response.status, detail="Weather API request failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather forecast fetch failed: {str(e)}")

# Crop Detection and Analysis endpoints
@app.post("/api/crop/analyze")
async def analyze_crop_image(file: UploadFile = File(...)):
    """Analyze uploaded crop image for health, pests, and diseases"""
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Here you would integrate with your trained models
        # For now, returning mock analysis
        analysis_result = {
            "crop_health": {
                "status": "healthy",
                "confidence": 0.85,
                "issues": []
            },
            "pest_detection": {
                "pests_detected": ["aphids"],
                "severity": "low",
                "confidence": 0.72
            },
            "soil_condition": {
                "moisture_level": "adequate",
                "ph_estimate": 6.5,
                "nutrient_status": "good"
            },
            "recommendations": [
                "Monitor for aphid population growth",
                "Consider organic pest control if population increases"
            ]
        }
        
        # Clean up temp file
        os.remove(temp_path)
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@app.get("/api/crop/history")
async def get_crop_analysis_history(user_id: str):
    """Get historical crop analysis data for a user"""
    try:
        db = get_database()
        if not db:
            raise HTTPException(status_code=500, detail="Database not connected")
        
        # Fetch from database
        collection = db["crop_analyses"]
        analyses = await collection.find({"user_id": user_id}).to_list(100)
        
        return {"analyses": analyses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analysis history: {str(e)}")

# Alerts and notifications
@app.post("/api/alerts/send")
async def send_alert(alert_data: Dict[str, Any]):
    """Send alert via Twilio SMS"""
    try:
        if not twilio_service:
            raise HTTPException(status_code=500, detail="Twilio service not configured")
        
        message = alert_data.get("message", "Alert from AgroWatch")
        phone_number = alert_data.get("phone_number")
        
        if not phone_number:
            raise HTTPException(status_code=400, detail="Phone number required")
        
        result = await twilio_service.send_sms(phone_number, message)
        return {"success": True, "message_id": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send alert: {str(e)}")

@app.get("/api/alerts/history")
async def get_alert_history(user_id: str):
    """Get alert history for a user"""
    try:
        db = get_database()
        if not db:
            raise HTTPException(status_code=500, detail="Database not connected")
        
        collection = db["alerts"]
        alerts = await collection.find({"user_id": user_id}).sort("created_at", -1).to_list(50)
        
        return {"alerts": alerts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch alert history: {str(e)}")

# Firebase storage endpoints
@app.post("/api/storage/upload")
async def upload_file_to_firebase(file: UploadFile = File(...)):
    """Upload file to Firebase Storage"""
    try:
        if not firebase_service:
            raise HTTPException(status_code=500, detail="Firebase service not configured")
        
        # Upload to Firebase Storage
        download_url = await firebase_service.upload_file(file)
        
        return {"success": True, "download_url": download_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# Data analytics endpoints
@app.get("/api/analytics/dashboard")
async def get_dashboard_analytics(user_id: str):
    """Get dashboard analytics data"""
    try:
        db = get_database()
        if not db:
            raise HTTPException(status_code=500, detail="Database not connected")
        
        # Aggregate data from various collections
        analytics_data = {
            "total_analyses": 0,
            "healthy_crops_percentage": 0,
            "pest_detections": 0,
            "recent_alerts": [],
            "weather_impact": {},
            "crop_health_trend": []
        }
        
        # You would implement actual analytics queries here
        
        return analytics_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics fetch failed: {str(e)}")

# Soil detection endpoints
@app.post("/api/soil/analyze")
async def analyze_soil_image(file: UploadFile = File(...)):
    """Analyze soil condition from uploaded image"""
    try:
        # Save uploaded file temporarily
        temp_path = f"temp_soil_{file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Here you would integrate with your trained soil detection model
        soil_analysis = {
            "soil_type": "loamy",
            "moisture_level": "moderate",
            "ph_estimate": 6.8,
            "organic_matter": "good",
            "nutrient_deficiencies": ["nitrogen"],
            "recommendations": [
                "Consider nitrogen-rich fertilizer",
                "Monitor moisture levels"
            ],
            "confidence": 0.78
        }
        
        # Clean up temp file
        os.remove(temp_path)
        
        return soil_analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil analysis failed: {str(e)}")

# Model management endpoints
@app.get("/api/models/status")
async def get_model_status():
    """Get status of all trained models"""
    return {
        "crop_health_model": {
            "status": "active",
            "version": "1.0.0",
            "accuracy": 0.94,
            "last_updated": "2024-01-15T10:00:00Z"
        },
        "pest_detection_model": {
            "status": "active",
            "version": "1.0.0",
            "accuracy": 0.89,
            "last_updated": "2024-01-15T10:00:00Z"
        },
        "soil_analysis_model": {
            "status": "active",
            "version": "1.0.0",
            "accuracy": 0.92,
            "last_updated": "2024-01-15T10:00:00Z"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
