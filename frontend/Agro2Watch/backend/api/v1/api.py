from fastapi import APIRouter

from api.v1.endpoints import crop_detection, soil_detection, pest_detection

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    crop_detection.router, 
    prefix="/crop", 
    tags=["crop-health"]
)

api_router.include_router(
    soil_detection.router, 
    prefix="/soil", 
    tags=["soil-analysis"]
)

api_router.include_router(
    pest_detection.router, 
    prefix="/pest", 
    tags=["pest-detection"]
)

@api_router.get("/")
async def root():
    """Root endpoint for API v1"""
    return {
        "message": "AgroWatch MATLAB API v1",
        "version": "1.0.0",
        "endpoints": {
            "crop_health": "/api/v1/crop/analyze",
            "soil_analysis": "/api/v1/soil/analyze", 
            "pest_detection": "/api/v1/pest/analyze"
        }
    }

@api_router.get("/models")
async def list_models():
    """List all available MATLAB models"""
    from models.model_loader import model_loader
    return model_loader.list_available_models()