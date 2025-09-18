from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any, List
from loguru import logger

from models.model_loader import model_loader
from utils.image_utils import image_processor
from config.settings import settings

router = APIRouter()

@router.post("/analyze", response_model=Dict[str, Any])
async def detect_pests(
    file: UploadFile = File(..., description="Crop image for pest detection")
) -> Dict[str, Any]:
    """
    Detect and identify pests using MATLAB-based AI model
    
    Args:
        file: Uploaded image file for pest detection
        
    Returns:
        Dictionary containing pest detection results and treatment recommendations
    """
    try:
        logger.info(f"Starting pest detection for file: {file.filename}")
        
        # Validate and load image
        image = await image_processor.validate_and_load_image(file)
        
        # Preprocess image for MATLAB model
        processed_image = model_loader.preprocess_image(image, "pest_detection")
        
        # Make prediction using MATLAB model
        prediction_result = model_loader.predict(processed_image, "pest_detection")
        
        # Extract image features for additional analysis
        image_features = image_processor.extract_image_features(processed_image[0])
        
        # Analyze pest detection results
        pest_analysis = _analyze_pest_detection(
            prediction_result["prediction"],
            prediction_result["class_probabilities"],
            image_features
        )
        
        # Generate treatment recommendations
        treatment_plan = _generate_treatment_plan(
            prediction_result["prediction"],
            prediction_result["confidence"],
            pest_analysis
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
            "pest_analysis": pest_analysis,
            "treatment_plan": treatment_plan,
            "model_info": {
                "name": "pest_detection",
                "version": prediction_result["model_version"],
                "confidence_threshold": settings.CONFIDENCE_THRESHOLD
            },
            "image_features": image_features
        }
        
        logger.info(f"Pest detection completed: {prediction_result['prediction']} ({prediction_result['confidence']:.3f})")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in pest detection: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during analysis")

def _analyze_pest_detection(pest_type: str, probabilities: Dict[str, float], features: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze pest detection results and provide detailed information"""
    
    # Pest information database
    pest_info = {
        "aphids": {
            "scientific_name": "Aphidoidea",
            "description": "Small, soft-bodied insects that feed on plant sap",
            "damage_type": "sucking",
            "affected_parts": ["leaves", "stems", "buds"],
            "severity": "moderate_to_high",
            "reproduction_rate": "very_high",
            "seasonal_activity": "spring_summer",
            "signs": ["curled_leaves", "sticky_honeydew", "yellowing"]
        },
        "caterpillars": {
            "scientific_name": "Lepidoptera larvae",
            "description": "Larval stage of moths and butterflies",
            "damage_type": "chewing",
            "affected_parts": ["leaves", "fruits", "stems"],
            "severity": "high",
            "reproduction_rate": "moderate",
            "seasonal_activity": "spring_summer_fall",
            "signs": ["holes_in_leaves", "frass", "defoliation"]
        },
        "beetles": {
            "scientific_name": "Coleoptera",
            "description": "Hard-shelled insects with chewing mouthparts",
            "damage_type": "chewing",
            "affected_parts": ["leaves", "roots", "fruits"],
            "severity": "moderate_to_high",
            "reproduction_rate": "moderate",
            "seasonal_activity": "varies_by_species",
            "signs": ["holes_in_leaves", "root_damage", "wilting"]
        },
        "no_pest": {
            "scientific_name": "N/A",
            "description": "No significant pest detected",
            "damage_type": "none",
            "affected_parts": [],
            "severity": "none",
            "reproduction_rate": "N/A",
            "seasonal_activity": "N/A",
            "signs": []
        }
    }
    
    base_info = pest_info.get(pest_type, pest_info["no_pest"])
    
    # Estimate infestation level based on confidence and image features
    confidence = max(probabilities.values())
    infestation_level = _estimate_infestation_level(confidence, features)
    
    # Risk assessment
    risk_level = _assess_pest_risk(pest_type, confidence, infestation_level)
    
    analysis = {
        **base_info,
        "infestation_level": infestation_level,
        "risk_level": risk_level,
        "detection_confidence": confidence,
        "image_quality_score": _calculate_detection_quality_score(features)
    }
    
    return analysis

def _estimate_infestation_level(confidence: float, features: Dict[str, Any]) -> str:
    """Estimate pest infestation level based on detection confidence and image features"""
    
    # Use confidence as primary indicator
    if confidence >= 0.9:
        return "severe"
    elif confidence >= 0.7:
        return "moderate"
    elif confidence >= 0.5:
        return "light"
    else:
        return "minimal_or_none"

def _assess_pest_risk(pest_type: str, confidence: float, infestation_level: str) -> str:
    """Assess overall risk level for detected pest"""
    
    # Risk matrix based on pest type and infestation level
    risk_matrix = {
        "aphids": {
            "severe": "critical",
            "moderate": "high",
            "light": "moderate",
            "minimal_or_none": "low"
        },
        "caterpillars": {
            "severe": "critical",
            "moderate": "high", 
            "light": "high",  # Caterpillars can cause rapid damage
            "minimal_or_none": "moderate"
        },
        "beetles": {
            "severe": "critical",
            "moderate": "high",
            "light": "moderate",
            "minimal_or_none": "low"
        },
        "no_pest": {
            "severe": "low",
            "moderate": "low",
            "light": "low",
            "minimal_or_none": "low"
        }
    }
    
    return risk_matrix.get(pest_type, {}).get(infestation_level, "moderate")

def _calculate_detection_quality_score(features: Dict[str, Any]) -> float:
    """Calculate quality score for pest detection reliability"""
    
    sharpness = features.get("sharpness", 0)
    contrast = features.get("contrast", 0)
    brightness = features.get("mean_brightness", 128)
    
    # Normalize scores
    sharpness_score = min(sharpness / 100, 1.0)  # Normalize to 0-1
    contrast_score = min(contrast / 0.5, 1.0)    # Normalize to 0-1
    brightness_score = 1.0 - abs(brightness - 128) / 128  # Optimal around 128
    
    # Weighted average
    quality_score = (sharpness_score * 0.4 + contrast_score * 0.3 + brightness_score * 0.3)
    
    return round(quality_score, 3)

def _generate_treatment_plan(pest_type: str, confidence: float, analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Generate comprehensive treatment plan for detected pest"""
    
    if pest_type == "no_pest":
        return {
            "immediate_actions": ["Continue regular monitoring"],
            "preventive_measures": _get_preventive_measures(),
            "monitoring_schedule": "Weekly visual inspection",
            "treatment_methods": [],
            "estimated_cost": "minimal",
            "treatment_duration": "N/A"
        }
    
    # Get pest-specific treatments
    treatments = _get_pest_treatments(pest_type, analysis["infestation_level"])
    
    # Immediate actions based on risk level
    immediate_actions = _get_immediate_actions(pest_type, analysis["risk_level"])
    
    # Monitoring recommendations
    monitoring = _get_monitoring_recommendations(pest_type, analysis["infestation_level"])
    
    treatment_plan = {
        "immediate_actions": immediate_actions,
        "treatment_methods": treatments,
        "preventive_measures": _get_preventive_measures(pest_type),
        "monitoring_schedule": monitoring["schedule"],
        "monitoring_methods": monitoring["methods"],
        "estimated_cost": treatments.get("cost_estimate", "moderate"),
        "treatment_duration": treatments.get("duration", "1-2 weeks"),
        "follow_up_required": confidence > 0.7,
        "professional_consultation": analysis["risk_level"] in ["critical", "high"]
    }
    
    return treatment_plan

def _get_immediate_actions(pest_type: str, risk_level: str) -> List[str]:
    """Get immediate actions based on pest type and risk level"""
    
    actions = []
    
    if risk_level == "critical":
        actions.extend([
            "Isolate affected plants immediately",
            "Begin emergency treatment within 24 hours",
            "Contact agricultural extension service"
        ])
    elif risk_level == "high":
        actions.extend([
            "Start treatment within 2-3 days",
            "Increase monitoring frequency",
            "Prepare treatment materials"
        ])
    
    # Pest-specific immediate actions
    pest_actions = {
        "aphids": ["Remove heavily infested leaves", "Spray with water to dislodge aphids"],
        "caterpillars": ["Hand-pick visible caterpillars", "Check for egg masses"],
        "beetles": ["Remove adult beetles by hand", "Check soil for larvae"]
    }
    
    actions.extend(pest_actions.get(pest_type, []))
    
    return actions

def _get_pest_treatments(pest_type: str, infestation_level: str) -> Dict[str, Any]:
    """Get treatment methods for specific pest and infestation level"""
    
    treatments = {
        "aphids": {
            "biological": ["Release ladybugs", "Apply neem oil", "Use insecticidal soap"],
            "chemical": ["Imidacloprid", "Pyrethrin-based insecticides"],
            "cultural": ["Reflective mulch", "Companion planting with marigolds"],
            "cost_estimate": "low_to_moderate",
            "duration": "1-2 weeks"
        },
        "caterpillars": {
            "biological": ["Bacillus thuringiensis (Bt)", "Parasitic wasps", "Hand picking"],
            "chemical": ["Spinosad", "Chlorantraniliprole"],
            "cultural": ["Row covers", "Pheromone traps", "Crop rotation"],
            "cost_estimate": "moderate",
            "duration": "2-3 weeks"
        },
        "beetles": {
            "biological": ["Beneficial nematodes", "Diatomaceous earth"],
            "chemical": ["Carbaryl", "Bifenthrin"],
            "cultural": ["Trap crops", "Soil cultivation", "Crop rotation"],
            "cost_estimate": "moderate_to_high",
            "duration": "2-4 weeks"
        }
    }
    
    return treatments.get(pest_type, {})

def _get_preventive_measures(pest_type: str = None) -> List[str]:
    """Get preventive measures for pest management"""
    
    general_measures = [
        "Maintain proper plant spacing for air circulation",
        "Remove plant debris and weeds regularly",
        "Practice crop rotation",
        "Encourage beneficial insects with diverse plantings",
        "Monitor plants regularly for early detection"
    ]
    
    if pest_type:
        specific_measures = {
            "aphids": ["Use reflective mulch", "Plant companion crops like catnip"],
            "caterpillars": ["Install pheromone traps", "Use row covers during egg-laying season"],
            "beetles": ["Till soil to disrupt life cycle", "Use beneficial nematodes in soil"]
        }
        general_measures.extend(specific_measures.get(pest_type, []))
    
    return general_measures

def _get_monitoring_recommendations(pest_type: str, infestation_level: str) -> Dict[str, Any]:
    """Get monitoring recommendations based on pest and infestation level"""
    
    if infestation_level in ["severe", "moderate"]:
        schedule = "Daily for first week, then every 2-3 days"
    else:
        schedule = "Weekly visual inspection"
    
    methods = [
        "Visual inspection of leaves and stems",
        "Check undersides of leaves",
        "Look for pest damage signs",
        "Monitor beneficial insect populations"
    ]
    
    # Add pest-specific monitoring
    pest_monitoring = {
        "aphids": ["Check for honeydew presence", "Monitor ant activity"],
        "caterpillars": ["Look for frass (droppings)", "Check for egg masses"],
        "beetles": ["Inspect soil around plants", "Use yellow sticky traps"]
    }
    
    methods.extend(pest_monitoring.get(pest_type, []))
    
    return {
        "schedule": schedule,
        "methods": methods
    }

@router.get("/model-info")
async def get_pest_model_info() -> Dict[str, Any]:
    """Get information about the pest detection model"""
    return model_loader.get_model_info("pest_detection")

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint for pest detection service"""
    return {"status": "healthy", "service": "pest_detection"}