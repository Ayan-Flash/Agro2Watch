import os
from pathlib import Path
from typing import Dict, Any
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AgroWatch MATLAB API"
    VERSION: str = "1.0.0"
    
    # MATLAB Model Configuration
    MODELS_DIR: Path = Path(__file__).parent.parent / "models"
    
    # MATLAB Model Files
    CROP_HEALTH_MODEL: str = "crop_health_model.mat"
    SOIL_ANALYSIS_MODEL: str = "soil_analysis_model.mat"
    PEST_DETECTION_MODEL: str = "pest_detection_model.mat"
    
    # Model Metadata
    MODEL_METADATA_FILE: str = "model_metadata.json"
    
    # Image Processing
    MAX_IMAGE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_IMAGE_TYPES: set = {"image/jpeg", "image/png", "image/jpg"}
    IMAGE_RESIZE_DIMENSIONS: tuple = (224, 224)
    
    # MATLAB Integration Settings
    MATLAB_OUTPUT_FORMAT: str = "structured"  # "array" or "structured"
    CONFIDENCE_THRESHOLD: float = 0.5
    
    # API Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Settings
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Logging
    LOG_LEVEL: str = "INFO"

    # Twilio SMS (optional)
    TWILIO_ACCOUNT_SID: str | None = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: str | None = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_FROM_NUMBER: str | None = os.getenv("TWILIO_FROM_NUMBER")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Global settings instance
settings = Settings()

# Model configuration mapping
MODEL_CONFIG: Dict[str, Dict[str, Any]] = {
    "crop_health": {
        "file": settings.CROP_HEALTH_MODEL,
        "input_shape": (224, 224, 3),
        "classes": ["healthy", "diseased", "nutrient_deficiency", "pest_damage"],
        "preprocessing": "normalize_rgb"
    },
    "soil_analysis": {
        "file": settings.SOIL_ANALYSIS_MODEL,
        "input_shape": (224, 224, 3),
        "classes": ["clay", "sandy", "loamy", "silt"],
        "preprocessing": "normalize_rgb"
    },
    "pest_detection": {
        "file": settings.PEST_DETECTION_MODEL,
        "input_shape": (224, 224, 3),
        "classes": ["aphids", "caterpillars", "beetles", "no_pest"],
        "preprocessing": "normalize_rgb"
    }
}