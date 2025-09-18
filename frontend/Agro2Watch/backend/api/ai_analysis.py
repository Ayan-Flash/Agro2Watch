from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import Dict, Any
from models.ai_models import model_manager
from utils.logger import logger
from utils.image_processing import ImageProcessor
from api.auth import get_current_user
from config import settings
import aiofiles
import os
from datetime import datetime

router = APIRouter(prefix="/ai", tags=["ai-analysis"])

@router.post("/crop/analyze")
async def analyze_crop_health(
    image: UploadFile = File(...),
    current_user: Dict = Depends(get_current_user)
):
    """Analyze crop health from uploaded image"""
    try:
        # Validate file type
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Check file size
        contents = await image.read()
        if len(contents) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Validate image
        if not ImageProcessor.validate_image(contents):
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Enhance image quality
        enhanced_image = ImageProcessor.enhance_image_quality(contents)
        
        # Analyze crop health
        result = await model_manager.analyze_crop_health(enhanced_image)
        
        # Log analysis
        logger.info(f"Crop analysis completed for user {current_user['uid']}")
        
        return {
            "success": True,
            "analysis": result,
            "timestamp": datetime.now().isoformat(),
            "user_id": current_user["uid"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Crop analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@router.post("/pest/detect")
async def detect_pests(
    image: UploadFile = File(...),
    current_user: Dict = Depends(get_current_user)
):
    """Detect pests from uploaded image"""
    try:
        # Validate file type
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Check file size
        contents = await image.read()
        if len(contents) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Validate image
        if not ImageProcessor.validate_image(contents):
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Enhance image quality
        enhanced_image = ImageProcessor.enhance_image_quality(contents)
        
        # Detect pests
        result = await model_manager.detect_pests(enhanced_image)
        
        # Log analysis
        logger.info(f"Pest detection completed for user {current_user['uid']}")
        
        return {
            "success": True,
            "detection": result,
            "timestamp": datetime.now().isoformat(),
            "user_id": current_user["uid"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Pest detection error: {e}")
        raise HTTPException(status_code=500, detail="Pest detection failed")

@router.post("/soil/analyze")
async def analyze_soil(
    image: UploadFile = File(...),
    current_user: Dict = Depends(get_current_user)
):
    """Analyze soil from uploaded image"""
    try:
        # Validate file type
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Check file size
        contents = await image.read()
        if len(contents) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Validate image
        if not ImageProcessor.validate_image(contents):
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Enhance image quality
        enhanced_image = ImageProcessor.enhance_image_quality(contents)
        
        # Analyze soil
        result = await model_manager.analyze_soil(enhanced_image)
        
        # Log analysis
        logger.info(f"Soil analysis completed for user {current_user['uid']}")
        
        return {
            "success": True,
            "analysis": result,
            "timestamp": datetime.now().isoformat(),
            "user_id": current_user["uid"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Soil analysis error: {e}")
        raise HTTPException(status_code=500, detail="Soil analysis failed")

@router.get("/models/status")
async def get_models_status():
    """Get status of AI models"""
    try:
        status = {
            "crop_model": model_manager.crop_model is not None,
            "pest_model": model_manager.pest_model is not None,
            "soil_model": model_manager.soil_model is not None,
            "crop_classes": len(model_manager.crop_classes),
            "pest_classes": len(model_manager.pest_classes),
            "soil_classes": len(model_manager.soil_classes)
        }
        
        return {
            "success": True,
            "models": status,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Models status error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get models status")

@router.post("/batch/analyze")
async def batch_analyze_images(
    crop_images: list[UploadFile] = File(None),
    pest_images: list[UploadFile] = File(None),
    soil_images: list[UploadFile] = File(None),
    current_user: Dict = Depends(get_current_user)
):
    """Batch analyze multiple images"""
    try:
        results = {
            "crop_analyses": [],
            "pest_detections": [],
            "soil_analyses": [],
            "errors": []
        }
        
        # Process crop images
        if crop_images:
            for i, image in enumerate(crop_images):
                try:
                    if image.content_type.startswith('image/'):
                        contents = await image.read()
                        if len(contents) <= settings.MAX_FILE_SIZE:
                            enhanced_image = ImageProcessor.enhance_image_quality(contents)
                            result = await model_manager.analyze_crop_health(enhanced_image)
                            results["crop_analyses"].append({
                                "image_index": i,
                                "filename": image.filename,
                                "result": result
                            })
                except Exception as e:
                    results["errors"].append(f"Crop image {i}: {str(e)}")
        
        # Process pest images
        if pest_images:
            for i, image in enumerate(pest_images):
                try:
                    if image.content_type.startswith('image/'):
                        contents = await image.read()
                        if len(contents) <= settings.MAX_FILE_SIZE:
                            enhanced_image = ImageProcessor.enhance_image_quality(contents)
                            result = await model_manager.detect_pests(enhanced_image)
                            results["pest_detections"].append({
                                "image_index": i,
                                "filename": image.filename,
                                "result": result
                            })
                except Exception as e:
                    results["errors"].append(f"Pest image {i}: {str(e)}")
        
        # Process soil images
        if soil_images:
            for i, image in enumerate(soil_images):
                try:
                    if image.content_type.startswith('image/'):
                        contents = await image.read()
                        if len(contents) <= settings.MAX_FILE_SIZE:
                            enhanced_image = ImageProcessor.enhance_image_quality(contents)
                            result = await model_manager.analyze_soil(enhanced_image)
                            results["soil_analyses"].append({
                                "image_index": i,
                                "filename": image.filename,
                                "result": result
                            })
                except Exception as e:
                    results["errors"].append(f"Soil image {i}: {str(e)}")
        
        logger.info(f"Batch analysis completed for user {current_user['uid']}")
        
        return {
            "success": True,
            "results": results,
            "timestamp": datetime.now().isoformat(),
            "user_id": current_user["uid"]
        }
        
    except Exception as e:
        logger.error(f"Batch analysis error: {e}")
        raise HTTPException(status_code=500, detail="Batch analysis failed")

@router.get("/recommendations/{analysis_type}")
async def get_recommendations(
    analysis_type: str,
    current_user: Dict = Depends(get_current_user)
):
    """Get general recommendations for crop, pest, or soil management"""
    try:
        recommendations = {
            "crop": {
                "general": [
                    "Regular monitoring of crop health",
                    "Proper irrigation management",
                    "Balanced fertilization",
                    "Pest and disease prevention",
                    "Soil health maintenance"
                ],
                "seasonal": [
                    "Adjust practices based on weather conditions",
                    "Use season-appropriate varieties",
                    "Plan crop rotation",
                    "Prepare for monsoon/drought conditions"
                ]
            },
            "pest": {
                "prevention": [
                    "Implement Integrated Pest Management (IPM)",
                    "Use resistant crop varieties",
                    "Maintain field hygiene",
                    "Encourage beneficial insects",
                    "Regular field inspection"
                ],
                "organic": [
                    "Use neem-based products",
                    "Apply botanical pesticides",
                    "Introduce biological control agents",
                    "Use pheromone traps",
                    "Practice companion planting"
                ]
            },
            "soil": {
                "improvement": [
                    "Add organic matter regularly",
                    "Maintain proper pH levels",
                    "Ensure balanced nutrition",
                    "Improve soil structure",
                    "Prevent erosion"
                ],
                "testing": [
                    "Test soil pH annually",
                    "Check nutrient levels",
                    "Monitor organic matter content",
                    "Assess soil texture",
                    "Test for heavy metals if needed"
                ]
            }
        }
        
        if analysis_type not in recommendations:
            raise HTTPException(status_code=400, detail="Invalid analysis type")
        
        return {
            "success": True,
            "recommendations": recommendations[analysis_type],
            "type": analysis_type,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations")