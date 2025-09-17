from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
from loguru import logger

from models.model_loader import model_loader
from utils.image_utils import image_processor
from config.settings import settings

router = APIRouter()

@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_soil_type(
    file: UploadFile = File(..., description="Soil image for type analysis")
) -> Dict[str, Any]:
    """
    Analyze soil type using MATLAB-based AI model
    
    Args:
        file: Uploaded image file of the soil
        
    Returns:
        Dictionary containing soil analysis results and recommendations
    """
    try:
        logger.info(f"Starting soil analysis for file: {file.filename}")
        
        # Validate and load image
        image = await image_processor.validate_and_load_image(file)
        
        # Preprocess image for MATLAB model
        processed_image = model_loader.preprocess_image(image, "soil_analysis")
        
        # Make prediction using MATLAB model
        prediction_result = model_loader.predict(processed_image, "soil_analysis")
        
        # Extract image features for additional analysis
        image_features = image_processor.extract_image_features(processed_image[0])
        
        # Generate soil-specific analysis
        soil_properties = _analyze_soil_properties(
            prediction_result["prediction"],
            prediction_result["class_probabilities"],
            image_features
        )
        
        # Generate recommendations
        recommendations = _generate_soil_recommendations(
            prediction_result["prediction"],
            prediction_result["confidence"],
            soil_properties
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
            "soil_analysis": {
                "primary_type": prediction_result["prediction"],
                "properties": soil_properties,
                "suitability": _assess_crop_suitability(prediction_result["prediction"]),
                "image_quality": _assess_image_quality(image_features)
            },
            "recommendations": recommendations,
            "model_info": {
                "name": "soil_analysis",
                "version": prediction_result["model_version"],
                "confidence_threshold": settings.CONFIDENCE_THRESHOLD
            },
            "image_features": image_features
        }
        
        logger.info(f"Soil analysis completed: {prediction_result['prediction']} ({prediction_result['confidence']:.3f})")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in soil analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during analysis")

def _analyze_soil_properties(soil_type: str, probabilities: Dict[str, float], features: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze soil properties based on type and image features"""
    
    # Base properties for each soil type
    soil_properties = {
        "clay": {
            "drainage": "poor",
            "water_retention": "high",
            "nutrient_retention": "high",
            "workability": "difficult",
            "ph_tendency": "neutral_to_alkaline",
            "organic_matter": "moderate"
        },
        "sandy": {
            "drainage": "excellent",
            "water_retention": "low",
            "nutrient_retention": "low",
            "workability": "easy",
            "ph_tendency": "acidic",
            "organic_matter": "low"
        },
        "loamy": {
            "drainage": "good",
            "water_retention": "moderate",
            "nutrient_retention": "high",
            "workability": "easy",
            "ph_tendency": "neutral",
            "organic_matter": "high"
        },
        "silt": {
            "drainage": "moderate",
            "water_retention": "high",
            "nutrient_retention": "moderate",
            "workability": "moderate",
            "ph_tendency": "neutral",
            "organic_matter": "moderate"
        }
    }
    
    base_props = soil_properties.get(soil_type, soil_properties["loamy"])
    
    # Adjust properties based on image analysis
    brightness = features.get("mean_brightness", 128)
    
    # Estimate organic matter from image darkness
    if brightness < 80:
        base_props["organic_matter"] = "high"
    elif brightness > 150:
        base_props["organic_matter"] = "low"
    
    # Add confidence-based adjustments
    max_prob = max(probabilities.values())
    if max_prob < 0.7:
        base_props["analysis_confidence"] = "mixed_soil_type_detected"
    
    return base_props

def _assess_crop_suitability(soil_type: str) -> Dict[str, Any]:
    """Assess crop suitability for different soil types"""
    
    suitability_map = {
        "clay": {
            "excellent": ["rice", "wheat", "cotton"],
            "good": ["soybeans", "corn", "sugarcane"],
            "fair": ["vegetables", "fruits"],
            "poor": ["root_vegetables", "sandy_crops"],
            "irrigation_needs": "low_to_moderate",
            "fertilizer_efficiency": "high"
        },
        "sandy": {
            "excellent": ["carrots", "radishes", "potatoes"],
            "good": ["tomatoes", "peppers", "herbs"],
            "fair": ["corn", "soybeans"],
            "poor": ["rice", "heavy_feeders"],
            "irrigation_needs": "high",
            "fertilizer_efficiency": "low"
        },
        "loamy": {
            "excellent": ["most_vegetables", "fruits", "grains"],
            "good": ["all_major_crops"],
            "fair": [],
            "poor": [],
            "irrigation_needs": "moderate",
            "fertilizer_efficiency": "high"
        },
        "silt": {
            "excellent": ["vegetables", "small_grains"],
            "good": ["corn", "soybeans", "wheat"],
            "fair": ["root_crops"],
            "poor": ["crops_needing_drainage"],
            "irrigation_needs": "low_to_moderate",
            "fertilizer_efficiency": "moderate"
        }
    }
    
    return suitability_map.get(soil_type, suitability_map["loamy"])

def _assess_image_quality(features: Dict[str, Any]) -> str:
    """Assess soil image quality for analysis reliability"""
    sharpness = features.get("sharpness", 0)
    contrast = features.get("contrast", 0)
    brightness = features.get("mean_brightness", 128)
    
    # Soil images should have good contrast and moderate brightness
    quality_score = 0
    
    if 50 < brightness < 200:  # Good brightness range for soil
        quality_score += 1
    if sharpness > 30:  # Adequate sharpness
        quality_score += 1
    if contrast > 0.15:  # Good contrast
        quality_score += 1
    
    if quality_score == 3:
        return "excellent"
    elif quality_score == 2:
        return "good"
    elif quality_score == 1:
        return "fair"
    else:
        return "poor"

def _generate_soil_recommendations(soil_type: str, confidence: float, properties: Dict[str, Any]) -> list:
    """Generate soil management recommendations"""
    recommendations = []
    
    # Type-specific recommendations
    if soil_type == "clay":
        recommendations.extend([
            "Improve drainage with organic matter addition",
            "Avoid working soil when wet to prevent compaction",
            "Consider raised beds for better drainage",
            "Add compost or aged manure to improve structure",
            "Plant cover crops to improve soil biology"
        ])
    
    elif soil_type == "sandy":
        recommendations.extend([
            "Increase organic matter to improve water retention",
            "Use mulch to reduce water evaporation",
            "Apply fertilizers in smaller, frequent doses",
            "Consider drip irrigation for water efficiency",
            "Plant nitrogen-fixing cover crops"
        ])
    
    elif soil_type == "loamy":
        recommendations.extend([
            "Maintain current soil management practices",
            "Continue regular organic matter additions",
            "Monitor soil pH and nutrient levels",
            "Practice crop rotation for soil health",
            "Protect soil with cover crops during off-season"
        ])
    
    elif soil_type == "silt":
        recommendations.extend([
            "Prevent erosion with proper ground cover",
            "Avoid overwatering to prevent waterlogging",
            "Add organic matter to improve structure",
            "Consider contour farming on slopes",
            "Monitor for compaction issues"
        ])
    
    # Drainage-specific recommendations
    drainage = properties.get("drainage", "moderate")
    if drainage == "poor":
        recommendations.append("Install drainage tiles or create drainage channels")
    elif drainage == "excellent":
        recommendations.append("Implement water conservation practices")
    
    # Confidence-based recommendations
    if confidence < settings.CONFIDENCE_THRESHOLD:
        recommendations.extend([
            "Consider professional soil testing for accurate analysis",
            "Take multiple soil samples from different areas"
        ])
    
    return recommendations

@router.get("/model-info")
async def get_soil_model_info() -> Dict[str, Any]:
    """Get information about the soil analysis model"""
    return model_loader.get_model_info("soil_analysis")

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint for soil detection service"""
    return {"status": "healthy", "service": "soil_detection"}