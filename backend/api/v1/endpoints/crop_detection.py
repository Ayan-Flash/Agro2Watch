from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import Dict, Any
import asyncio
from loguru import logger

from models.model_loader import model_loader
from utils.image_utils import image_processor
from config.settings import settings

router = APIRouter()

@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_crop_health(
    file: UploadFile = File(..., description="Crop image for health analysis")
) -> Dict[str, Any]:
    """
    Analyze crop health using MATLAB-based AI model
    
    Args:
        file: Uploaded image file of the crop
        
    Returns:
        Dictionary containing analysis results, predictions, and recommendations
    """
    try:
        logger.info(f"Starting crop health analysis for file: {file.filename}")
        
        # Validate and load image
        image = await image_processor.validate_and_load_image(file)
        
        # Preprocess image for MATLAB model
        processed_image = model_loader.preprocess_image(image, "crop_health")
        
        # Make prediction using MATLAB model
        prediction_result = model_loader.predict(processed_image, "crop_health")
        
        # Extract image features for additional analysis
        image_features = image_processor.extract_image_features(processed_image[0])
        
        # Generate recommendations based on prediction
        recommendations = _generate_crop_recommendations(
            prediction_result["prediction"],
            prediction_result["confidence"],
            image_features
        )
        
        # Compile response
        response = {
            "status": "success",
            "prediction": prediction_result["prediction"],
            "confidence": round(prediction_result["confidence"], 3),
            "threshold_met": prediction_result["threshold_met"],
            "class_probabilities": {
                k: round(v, 3) for k, v in prediction_result["class_probabilities"].items()
            },
            "analysis": {
                "health_status": _determine_health_status(prediction_result["prediction"]),
                "severity": _calculate_severity(prediction_result),
                "image_quality": _assess_image_quality(image_features)
            },
            "recommendations": recommendations,
            "model_info": {
                "name": "crop_health",
                "version": prediction_result["model_version"],
                "confidence_threshold": settings.CONFIDENCE_THRESHOLD
            },
            "image_features": image_features
        }
        
        logger.info(f"Crop health analysis completed: {prediction_result['prediction']} ({prediction_result['confidence']:.3f})")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in crop health analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during analysis")

def _determine_health_status(prediction: str) -> str:
    """Determine overall health status from prediction"""
    status_mapping = {
        "healthy": "excellent",
        "nutrient_deficiency": "moderate",
        "diseased": "poor",
        "pest_damage": "critical"
    }
    return status_mapping.get(prediction, "unknown")

def _calculate_severity(prediction_result: Dict[str, Any]) -> str:
    """Calculate severity level based on confidence and prediction"""
    confidence = prediction_result["confidence"]
    prediction = prediction_result["prediction"]
    
    if prediction == "healthy":
        return "none"
    elif confidence >= 0.8:
        return "high"
    elif confidence >= 0.6:
        return "moderate"
    else:
        return "low"

def _assess_image_quality(features: Dict[str, Any]) -> str:
    """Assess image quality for analysis reliability"""
    sharpness = features.get("sharpness", 0)
    contrast = features.get("contrast", 0)
    
    if sharpness > 100 and contrast > 0.3:
        return "excellent"
    elif sharpness > 50 and contrast > 0.2:
        return "good"
    elif sharpness > 20 and contrast > 0.1:
        return "fair"
    else:
        return "poor"

def _generate_crop_recommendations(prediction: str, confidence: float, features: Dict[str, Any]) -> list:
    """Generate actionable recommendations based on analysis results"""
    recommendations = []
    
    if prediction == "healthy":
        recommendations.extend([
            "Continue current crop management practices",
            "Monitor regularly for early detection of issues",
            "Maintain optimal irrigation and nutrition schedule"
        ])
    
    elif prediction == "diseased":
        recommendations.extend([
            "Identify specific disease through detailed examination",
            "Apply appropriate fungicide or bactericide treatment",
            "Improve air circulation and reduce humidity",
            "Remove and destroy infected plant material",
            "Consider resistant crop varieties for future planting"
        ])
    
    elif prediction == "nutrient_deficiency":
        recommendations.extend([
            "Conduct soil nutrient analysis",
            "Apply balanced fertilizer based on soil test results",
            "Check soil pH levels and adjust if necessary",
            "Consider foliar feeding for quick nutrient uptake",
            "Improve soil organic matter content"
        ])
    
    elif prediction == "pest_damage":
        recommendations.extend([
            "Identify specific pest species causing damage",
            "Apply targeted pest control measures",
            "Use integrated pest management (IPM) strategies",
            "Monitor pest population levels regularly",
            "Consider biological control agents"
        ])
    
    # Add confidence-based recommendations
    if confidence < settings.CONFIDENCE_THRESHOLD:
        recommendations.append("Consider taking additional photos from different angles for better analysis")
    
    # Add image quality recommendations
    image_quality = _assess_image_quality(features)
    if image_quality in ["fair", "poor"]:
        recommendations.extend([
            "Retake photo with better lighting conditions",
            "Ensure image is sharp and well-focused",
            "Take photo during optimal lighting (avoid shadows)"
        ])
    
    return recommendations

@router.get("/model-info")
async def get_crop_model_info() -> Dict[str, Any]:
    """Get information about the crop health detection model"""
    return model_loader.get_model_info("crop_health")

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint for crop detection service"""
    return {"status": "healthy", "service": "crop_detection"}