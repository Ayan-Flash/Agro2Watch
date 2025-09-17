"""
AgroWatch Backend Configuration
Handles environment variables and API keys
"""

import os
from typing import Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # JWT Configuration
    jwt_secret_key: str = "dev-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30
    
    # Firebase Configuration
    firebase_project_id: Optional[str] = None
    firebase_private_key_id: Optional[str] = None
    firebase_private_key: Optional[str] = None
    firebase_client_email: Optional[str] = None
    firebase_client_id: Optional[str] = None
    firebase_auth_uri: str = "https://accounts.google.com/o/oauth2/auth"
    firebase_token_uri: str = "https://oauth2.googleapis.com/token"
    
    # OpenWeatherMap Configuration
    openweather_api_key: Optional[str] = None
    openweather_base_url: str = "https://api.openweathermap.org/data/2.5"
    
    # Development Mode
    mock_mode: bool = True
    
    # Firebase credentials path
    firebase_credentials_path: str = "firebase-credentials.json"
    
    # Model paths
    crop_model_path: str = "models/crop_health_model.h5"
    pest_model_path: str = "models/pest_detection_model.h5"
    soil_model_path: str = "models/soil_analysis_model.h5"
    
    # File size limits
    max_file_size: int = 5 * 1024 * 1024  # 5MB
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        
    def has_firebase_config(self) -> bool:
        """Check if Firebase configuration is complete"""
        required_fields = [
            self.firebase_project_id,
            self.firebase_private_key,
            self.firebase_client_email
        ]
        return all(field is not None for field in required_fields)
    
    def has_weather_config(self) -> bool:
        """Check if OpenWeatherMap configuration is available"""
        return self.openweather_api_key is not None
    
    def get_firebase_credentials(self) -> dict:
        """Get Firebase credentials dictionary"""
        if not self.has_firebase_config():
            raise ValueError("Firebase configuration is incomplete")
            
        return {
            "type": "service_account",
            "project_id": self.firebase_project_id,
            "private_key_id": self.firebase_private_key_id,
            "private_key": self.firebase_private_key.replace('\\n', '\n'),
            "client_email": self.firebase_client_email,
            "client_id": self.firebase_client_id,
            "auth_uri": self.firebase_auth_uri,
            "token_uri": self.firebase_token_uri
        }

# Global settings instance
settings = Settings()

# Backwards-compatible uppercase aliases expected by some modules
Settings.OPENWEATHER_API_KEY = property(lambda self: self.openweather_api_key)
Settings.OPENWEATHER_BASE_URL = property(lambda self: self.openweather_base_url)
Settings.FIREBASE_CREDENTIALS_PATH = property(lambda self: self.firebase_credentials_path)
Settings.FIREBASE_PROJECT_ID = property(lambda self: self.firebase_project_id)
Settings.CROP_MODEL_PATH = property(lambda self: self.crop_model_path)
Settings.PEST_MODEL_PATH = property(lambda self: self.pest_model_path)
Settings.SOIL_MODEL_PATH = property(lambda self: self.soil_model_path)
Settings.MAX_FILE_SIZE = property(lambda self: self.max_file_size)