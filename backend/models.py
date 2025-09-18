#!/usr/bin/env python3
"""
Pydantic models for AgroWatch API
Defines data structures and validation schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Authentication models
class UserCreate(BaseModel):
    """User registration model"""
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response model (without password)"""
    user_id: str
    email: str
    full_name: str
    phone_number: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime

class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int

# Crop analysis models
class CropHealthStatus(str, Enum):
    HEALTHY = "healthy"
    STRESSED = "stressed"
    DISEASED = "diseased"
    CRITICAL = "critical"

class CropHealth(BaseModel):
    """Crop health analysis result"""
    status: CropHealthStatus
    confidence: float
    issues: List[str] = []
    recommendations: List[str] = []

class PestDetection(BaseModel):
    """Pest detection result"""
    pests_detected: List[str]
    severity: str
    confidence: float
    treatment_recommendations: List[str] = []

class SoilCondition(BaseModel):
    """Soil condition analysis"""
    moisture_level: str
    ph_estimate: float
    nutrient_status: str
    deficiencies: List[str] = []
    recommendations: List[str] = []

class CropAnalysisResult(BaseModel):
    """Complete crop analysis result"""
    analysis_id: Optional[str] = None
    crop_health: CropHealth
    pest_detection: PestDetection
    soil_condition: SoilCondition
    overall_recommendations: List[str]
    confidence_score: float
    analysis_timestamp: datetime
    image_url: Optional[str] = None

class CropAnalysisRequest(BaseModel):
    """Request for crop analysis"""
    user_id: str
    crop_type: Optional[str] = None
    location: Optional[Dict[str, float]] = None  # {"lat": 0.0, "lon": 0.0}
    notes: Optional[str] = None

# Soil analysis models
class SoilType(str, Enum):
    CLAY = "clay"
    SANDY = "sandy"
    LOAMY = "loamy"
    SILTY = "silty"
    PEATY = "peaty"
    CHALKY = "chalky"

class SoilAnalysisResult(BaseModel):
    """Soil analysis result"""
    analysis_id: Optional[str] = None
    soil_type: SoilType
    moisture_level: str
    ph_estimate: float
    organic_matter: str
    nutrient_deficiencies: List[str]
    recommendations: List[str]
    confidence: float
    analysis_timestamp: datetime
    image_url: Optional[str] = None

# Weather models
class WeatherData(BaseModel):
    """Current weather data"""
    temperature: float
    humidity: float
    pressure: float
    weather: str
    wind_speed: float
    location: str
    timestamp: datetime

class WeatherForecast(BaseModel):
    """Weather forecast item"""
    datetime: str
    temperature: float
    humidity: float
    weather: str
    wind_speed: float

class WeatherForecastResponse(BaseModel):
    """Weather forecast response"""
    forecast: List[WeatherForecast]
    location: Optional[str] = None

# Alert models
class AlertType(str, Enum):
    WEATHER = "weather"
    PEST = "pest"
    DISEASE = "disease"
    SOIL = "soil"
    IRRIGATION = "irrigation"
    GENERAL = "general"

class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertCreate(BaseModel):
    """Create alert request"""
    user_id: str
    alert_type: AlertType
    severity: AlertSeverity
    message: str
    phone_number: Optional[str] = None
    email: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class AlertResponse(BaseModel):
    """Alert response"""
    alert_id: str
    user_id: str
    alert_type: AlertType
    severity: AlertSeverity
    message: str
    status: str
    created_at: datetime
    sent_at: Optional[datetime] = None

# Analytics models
class CropHealthTrend(BaseModel):
    """Crop health trend data point"""
    date: str
    health_score: float
    analysis_count: int

class DashboardAnalytics(BaseModel):
    """Dashboard analytics data"""
    total_analyses: int
    healthy_crops_percentage: float
    pest_detections: int
    recent_alerts: List[AlertResponse]
    weather_impact: Dict[str, Any]
    crop_health_trend: List[CropHealthTrend]

# File upload models
class FileUploadResponse(BaseModel):
    """File upload response"""
    success: bool
    file_url: str
    file_id: Optional[str] = None
    message: Optional[str] = None

# Status check models
class StatusCheck(BaseModel):
    """System status check"""
    status: str
    timestamp: datetime
    services: Dict[str, str]
    version: str = "1.0.0"

class StatusCheckCreate(BaseModel):
    """Create status check"""
    service_name: str
    status: str
    metadata: Optional[Dict[str, Any]] = None

# Model status models
class ModelInfo(BaseModel):
    """ML Model information"""
    status: str
    version: str
    accuracy: float
    last_updated: str

class ModelStatus(BaseModel):
    """All models status"""
    crop_health_model: ModelInfo
    pest_detection_model: ModelInfo
    soil_analysis_model: ModelInfo

# Error models
class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime

# Success models
class SuccessResponse(BaseModel):
    """Standard success response"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime

# Configuration models
class APIConfig(BaseModel):
    """API configuration"""
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: List[str] = ["image/jpeg", "image/png", "image/jpg"]
    weather_api_enabled: bool = True
    twilio_enabled: bool = True
    firebase_enabled: bool = True

# Validation helpers
class LocationCoordinates(BaseModel):
    """GPS coordinates"""
    latitude: float
    longitude: float
    
    class Config:
        schema_extra = {
            "example": {
                "latitude": 40.7128,
                "longitude": -74.0060
            }
        }

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Enums for better type safety
class UserRole(str, Enum):
    FARMER = "farmer"
    ADMIN = "admin"
    AGRICULTURAL_OFFICER = "agricultural_officer"

class CropType(str, Enum):
    CORN = "corn"
    VEGETABLES = "vegetables"
    BOTH = "both"
    RICE = "rice"
    WHEAT = "wheat"
    SUGARCANE = "sugarcane"
    COTTON = "cotton"
    OTHER = "other"

class CropStatus(str, Enum):
    PLANTED = "planted"
    GROWING = "growing"
    MATURE = "mature"
    HARVESTED = "harvested"
    DISEASED = "diseased"

class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class WeatherCondition(str, Enum):
    SUNNY = "sunny"
    CLOUDY = "cloudy"
    RAINY = "rainy"
    DRIZZLE = "drizzle"
    THUNDERSTORM = "thunderstorm"
    FOGGY = "foggy"

# Base Models
class BaseDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# User Related Models
class User(BaseDocument):
    phone: str
    email: Optional[str] = None
    name: str
    aadhar: Optional[str] = None
    role: UserRole = UserRole.FARMER
    is_verified: bool = False
    firebase_uid: Optional[str] = None
    last_login: Optional[datetime] = None
    is_active: bool = True

class UserCreate(BaseModel):
    phone: str
    name: str
    email: Optional[str] = None
    aadhar: Optional[str] = None
    role: UserRole = UserRole.FARMER

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    aadhar: Optional[str] = None

# Farmer Profile Models
class Location(BaseModel):
    latitude: float
    longitude: float
    address: str
    district: str
    state: str
    pincode: str

class FarmerProfile(BaseDocument):
    user_id: str
    farm_size: float  # in acres
    location: Location
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    experience_years: Optional[int] = None
    is_profile_complete: bool = False

class FarmerProfileCreate(BaseModel):
    user_id: str
    farm_size: float
    location: Location
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    experience_years: Optional[int] = None

# Crop Management Models
class Crop(BaseDocument):
    farmer_id: str
    crop_type: CropType
    variety: Optional[str] = None
    planted_date: datetime
    expected_harvest_date: Optional[datetime] = None
    actual_harvest_date: Optional[datetime] = None
    area_planted: float  # in acres
    status: CropStatus = CropStatus.PLANTED
    notes: Optional[str] = None

class CropCreate(BaseModel):
    farmer_id: str
    crop_type: CropType
    variety: Optional[str] = None
    planted_date: datetime
    expected_harvest_date: Optional[datetime] = None
    area_planted: float
    notes: Optional[str] = None

class CropUpdate(BaseModel):
    variety: Optional[str] = None
    expected_harvest_date: Optional[datetime] = None
    actual_harvest_date: Optional[datetime] = None
    status: Optional[CropStatus] = None
    notes: Optional[str] = None

# Detection Models
class DetectionResult(BaseModel):
    confidence: float
    detected_class: str
    bounding_box: Optional[Dict[str, float]] = None
    additional_info: Optional[Dict[str, Any]] = None

class CropDetection(BaseDocument):
    farmer_id: str
    crop_id: Optional[str] = None
    image_base64: str  # Base64 encoded image
    detection_results: List[DetectionResult]
    location: Optional[Location] = None
    weather_conditions: Optional[WeatherCondition] = None

class PestDetection(BaseDocument):
    farmer_id: str
    crop_id: Optional[str] = None
    image_base64: str
    detection_results: List[DetectionResult]
    severity_level: AlertSeverity
    treatment_suggestions: Optional[List[str]] = None
    location: Optional[Location] = None

class SoilAnalysis(BaseDocument):
    farmer_id: str
    location: Location
    image_base64: Optional[str] = None
    ph_level: Optional[float] = None
    nitrogen_content: Optional[float] = None
    phosphorus_content: Optional[float] = None
    potassium_content: Optional[float] = None
    organic_matter: Optional[float] = None
    moisture_content: Optional[float] = None
    recommendations: Optional[List[str]] = None

# Weather and Environmental Data
class WeatherData(BaseDocument):
    location: Location
    temperature: float  # in Celsius
    humidity: float  # percentage
    rainfall: float  # in mm
    wind_speed: float  # in km/h
    condition: WeatherCondition
    uv_index: Optional[float] = None
    visibility: Optional[float] = None  # in km

# Alert System Models
class Alert(BaseDocument):
    farmer_id: str
    crop_id: Optional[str] = None
    title: str
    message: str
    severity: AlertSeverity
    alert_type: str  # pest, weather, disease, irrigation, etc.
    is_read: bool = False
    is_resolved: bool = False
    action_taken: Optional[str] = None
    due_date: Optional[datetime] = None

class AlertCreate(BaseModel):
    farmer_id: str
    crop_id: Optional[str] = None
    title: str
    message: str
    severity: AlertSeverity
    alert_type: str
    due_date: Optional[datetime] = None

# Government Schemes Models
class GovernmentScheme(BaseDocument):
    title: str
    description: str
    eligibility_criteria: List[str]
    benefits: List[str]
    application_process: str
    deadline: Optional[datetime] = None
    contact_info: Optional[str] = None
    is_active: bool = True

class SchemeApplication(BaseDocument):
    farmer_id: str
    scheme_id: str
    application_status: str = "pending"  # pending, approved, rejected
    application_date: datetime = Field(default_factory=datetime.utcnow)
    documents_submitted: Optional[List[str]] = None
    remarks: Optional[str] = None

# Communication Models
class Notification(BaseDocument):
    user_id: str
    title: str
    message: str
    notification_type: str  # sms, whatsapp, email, push
    is_sent: bool = False
    sent_at: Optional[datetime] = None
    error_message: Optional[str] = None

class ChatMessage(BaseDocument):
    user_id: str
    message: str
    response: Optional[str] = None
    session_id: str
    is_resolved: bool = False

# Analytics Models
class FarmAnalytics(BaseDocument):
    farmer_id: str
    total_crops: int
    total_area: float
    healthy_crops: int
    diseased_crops: int
    pest_detections_count: int
    soil_health_score: Optional[float] = None
    productivity_score: Optional[float] = None
    month: int
    year: int

# Authentication Models
class OTPVerification(BaseDocument):
    phone: str
    otp_code: str
    purpose: str  # registration, login, password_reset
    is_verified: bool = False
    expires_at: datetime
    attempts: int = 0
    max_attempts: int = 3

class OTPRequest(BaseModel):
    phone: str
    purpose: str = "login"

class OTPVerify(BaseModel):
    phone: str
    otp_code: str
    purpose: str = "login"

# Response Models
class UserResponse(BaseModel):
    id: str
    phone: str
    email: Optional[str]
    name: str
    role: UserRole
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]

class FarmerProfileResponse(BaseModel):
    id: str
    user_id: str
    farm_size: float
    location: Location
    soil_type: Optional[str]
    irrigation_type: Optional[str]
    experience_years: Optional[int]
    is_profile_complete: bool
    created_at: datetime

class CropResponse(BaseModel):
    id: str
    farmer_id: str
    crop_type: CropType
    variety: Optional[str]
    planted_date: datetime
    expected_harvest_date: Optional[datetime]
    actual_harvest_date: Optional[datetime]
    area_planted: float
    status: CropStatus
    notes: Optional[str]
    created_at: datetime

# Status Check Model (existing)
class StatusCheck(BaseDocument):
    client_name: str

class StatusCheckCreate(BaseModel):
    client_name: str