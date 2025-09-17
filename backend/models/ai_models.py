try:
    import tensorflow as tf  # Optional at runtime; models run in mock mode if absent
except Exception:  # ImportError or other platform-specific errors
    tf = None  # type: ignore

import numpy as np
from typing import Dict, List, Tuple, Optional
from pathlib import Path
import json
from utils.logger import logger
from utils.image_processing import ImageProcessor
from config import settings

class AIModelManager:
    """Manages all AI models for crop, pest, and soil analysis"""
    
    def __init__(self):
        self.crop_model: Optional[object] = None
        self.pest_model: Optional[object] = None
        self.soil_model: Optional[object] = None
        self.image_processor = ImageProcessor()
        
        # Load class labels
        self.crop_classes = self._load_crop_classes()
        self.pest_classes = self._load_pest_classes()
        self.soil_classes = self._load_soil_classes()
        
        # Load models
        self._load_models()
    
    def _load_models(self):
        """Load all AI models"""
        try:
            # Load crop detection model
            if tf and hasattr(settings, 'CROP_MODEL_PATH') and Path(settings.CROP_MODEL_PATH).exists():
                self.crop_model = tf.keras.models.load_model(settings.CROP_MODEL_PATH)
                logger.info("Crop detection model loaded successfully")
            else:
                logger.warning(f"Crop model not found at {getattr(settings, 'CROP_MODEL_PATH', 'models/crop_health_model.h5')}")
            
            # Load pest detection model
            if tf and hasattr(settings, 'PEST_MODEL_PATH') and Path(settings.PEST_MODEL_PATH).exists():
                self.pest_model = tf.keras.models.load_model(settings.PEST_MODEL_PATH)
                logger.info("Pest detection model loaded successfully")
            else:
                logger.warning(f"Pest model not found at {getattr(settings, 'PEST_MODEL_PATH', 'models/pest_detection_model.h5')}")
            
            # Load soil analysis model
            if tf and hasattr(settings, 'SOIL_MODEL_PATH') and Path(settings.SOIL_MODEL_PATH).exists():
                self.soil_model = tf.keras.models.load_model(settings.SOIL_MODEL_PATH)
                logger.info("Soil analysis model loaded successfully")
            else:
                logger.warning(f"Soil model not found at {getattr(settings, 'SOIL_MODEL_PATH', 'models/soil_analysis_model.h5')}")
                
        except Exception as e:
            logger.error(f"Error loading AI models: {e}")
    
    def _load_crop_classes(self) -> List[str]:
        """Load crop class labels"""
        try:
            classes_file = Path("models/crop_classes.json")
            if classes_file.exists():
                with open(classes_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load crop classes: {e}")
        
        # Default crop classes
        return [
            "Healthy", "Diseased", "Nutrient Deficiency", "Pest Damage",
            "Water Stress", "Fungal Infection", "Bacterial Infection", "Viral Infection"
        ]
    
    def _load_pest_classes(self) -> List[str]:
        """Load pest class labels"""
        try:
            classes_file = Path("models/pest_classes.json")
            if classes_file.exists():
                with open(classes_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load pest classes: {e}")
        
        # Default pest classes
        return [
            "No Pest", "Aphids", "Whiteflies", "Thrips", "Spider Mites",
            "Caterpillars", "Beetles", "Leaf Miners", "Scale Insects"
        ]
    
    def _load_soil_classes(self) -> List[str]:
        """Load soil class labels"""
        try:
            classes_file = Path("models/soil_classes.json")
            if classes_file.exists():
                with open(classes_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logger.warning(f"Could not load soil classes: {e}")
        
        # Default soil classes
        return [
            "Clay", "Sandy", "Loamy", "Silty", "Peaty", "Chalky", "Saline"
        ]
    
    async def analyze_crop_health(self, image_bytes: bytes) -> Dict:
        """Analyze crop health from image"""
        try:
            if self.crop_model is None:
                return self._mock_crop_analysis()
            
            # Preprocess image
            processed_image = self.image_processor.preprocess_for_crop_detection(image_bytes)
            
            # Make prediction
            predictions = self.crop_model.predict(processed_image)
            
            # Get top prediction
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            predicted_class = self.crop_classes[predicted_class_idx]
            
            # Generate recommendations based on prediction
            recommendations = self._generate_crop_recommendations(predicted_class, confidence)
            
            return {
                "status": predicted_class,
                "confidence": confidence,
                "health_score": int((1 - predictions[0][1]) * 100) if len(predictions[0]) > 1 else 85,
                "recommendations": recommendations,
                "detected_issues": self._identify_crop_issues(predictions[0]),
                "severity": self._assess_severity(predicted_class, confidence)
            }
            
        except Exception as e:
            logger.error(f"Crop analysis failed: {e}")
            return self._mock_crop_analysis()
    
    async def detect_pests(self, image_bytes: bytes) -> Dict:
        """Detect pests from image"""
        try:
            if self.pest_model is None:
                return self._mock_pest_detection()
            
            # Preprocess image
            processed_image = self.image_processor.preprocess_for_pest_detection(image_bytes)
            
            # Make prediction
            predictions = self.pest_model.predict(processed_image)
            
            # Get top prediction
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            predicted_pest = self.pest_classes[predicted_class_idx]
            
            # Check if pest is detected
            pest_detected = predicted_pest != "No Pest" and confidence > 0.5
            
            return {
                "pest_detected": pest_detected,
                "pest_type": predicted_pest if pest_detected else None,
                "confidence": confidence,
                "severity": self._assess_pest_severity(predicted_pest, confidence),
                "treatment_recommendations": self._generate_pest_treatment(predicted_pest),
                "prevention_tips": self._generate_pest_prevention(predicted_pest),
                "economic_impact": self._assess_economic_impact(predicted_pest, confidence)
            }
            
        except Exception as e:
            logger.error(f"Pest detection failed: {e}")
            return self._mock_pest_detection()
    
    async def analyze_soil(self, image_bytes: bytes) -> Dict:
        """Analyze soil from image"""
        try:
            if self.soil_model is None:
                return self._mock_soil_analysis()
            
            # Preprocess image
            processed_image = self.image_processor.preprocess_for_soil_analysis(image_bytes)
            
            # Make prediction
            predictions = self.soil_model.predict(processed_image)
            
            # Get soil type prediction
            soil_type_idx = np.argmax(predictions[0])
            soil_type = self.soil_classes[soil_type_idx]
            confidence = float(predictions[0][soil_type_idx])
            
            # Generate soil properties based on type and image analysis
            soil_properties = self._analyze_soil_properties(soil_type, predictions[0])
            
            return {
                "soil_type": soil_type,
                "confidence": confidence,
                "ph_level": soil_properties["ph"],
                "moisture_content": soil_properties["moisture"],
                "nutrient_levels": soil_properties["nutrients"],
                "organic_matter": soil_properties["organic_matter"],
                "fertility_score": soil_properties["fertility_score"],
                "recommendations": self._generate_soil_recommendations(soil_type, soil_properties),
                "suitable_crops": self._suggest_suitable_crops(soil_type, soil_properties)
            }
            
        except Exception as e:
            logger.error(f"Soil analysis failed: {e}")
            return self._mock_soil_analysis()
    
    def _generate_crop_recommendations(self, status: str, confidence: float) -> List[str]:
        """Generate crop health recommendations"""
        recommendations = {
            "Healthy": [
                "Continue current care routine",
                "Monitor regularly for early detection of issues",
                "Maintain optimal watering schedule",
                "Consider preventive organic treatments"
            ],
            "Diseased": [
                "Isolate affected plants immediately",
                "Apply appropriate fungicide or bactericide",
                "Improve air circulation around plants",
                "Remove and dispose of infected plant material"
            ],
            "Nutrient Deficiency": [
                "Apply balanced fertilizer",
                "Test soil for specific nutrient deficiencies",
                "Consider organic compost application",
                "Adjust pH if necessary"
            ],
            "Pest Damage": [
                "Identify specific pest type",
                "Apply targeted pest control measures",
                "Introduce beneficial insects",
                "Remove heavily damaged plant parts"
            ]
        }
        return recommendations.get(status, ["Consult with agricultural expert for specific guidance"])
    
    def _generate_pest_treatment(self, pest_type: str) -> List[str]:
        """Generate pest treatment recommendations"""
        treatments = {
            "Aphids": [
                "Apply neem oil spray (2-3ml per liter)",
                "Use insecticidal soap solution",
                "Introduce ladybugs as natural predators",
                "Remove heavily infested leaves"
            ],
            "Whiteflies": [
                "Use yellow sticky traps",
                "Apply horticultural oil",
                "Introduce parasitic wasps",
                "Maintain proper plant spacing"
            ],
            "Thrips": [
                "Apply blue sticky traps",
                "Use predatory mites",
                "Spray with spinosad-based insecticide",
                "Remove plant debris regularly"
            ]
        }
        return treatments.get(pest_type, ["Consult pest management specialist"])
    
    def _generate_pest_prevention(self, pest_type: str) -> List[str]:
        """Generate pest prevention tips"""
        prevention = {
            "Aphids": [
                "Maintain proper plant spacing",
                "Avoid over-fertilizing with nitrogen",
                "Plant companion crops like marigolds",
                "Regular inspection and monitoring"
            ],
            "Whiteflies": [
                "Use reflective mulches",
                "Maintain good air circulation",
                "Remove weeds around crops",
                "Quarantine new plants"
            ]
        }
        return prevention.get(pest_type, ["Follow integrated pest management practices"])
    
    def _generate_soil_recommendations(self, soil_type: str, properties: Dict) -> List[str]:
        """Generate soil improvement recommendations"""
        recommendations = []
        
        # pH recommendations
        if properties["ph"] < 6.0:
            recommendations.append("Apply lime to increase soil pH")
        elif properties["ph"] > 7.5:
            recommendations.append("Add sulfur or organic matter to lower pH")
        
        # Nutrient recommendations
        if properties["nutrients"]["nitrogen"] < 30:
            recommendations.append("Apply nitrogen-rich fertilizer or compost")
        if properties["nutrients"]["phosphorus"] < 15:
            recommendations.append("Add phosphorus fertilizer for root development")
        if properties["nutrients"]["potassium"] < 120:
            recommendations.append("Apply potassium fertilizer for plant health")
        
        # Organic matter
        if properties["organic_matter"] < 2.0:
            recommendations.append("Increase organic matter with compost or manure")
        
        return recommendations
    
    def _analyze_soil_properties(self, soil_type: str, predictions: np.ndarray) -> Dict:
        """Analyze soil properties based on type and predictions"""
        # Mock analysis - in real implementation, this would use additional models
        base_properties = {
            "Clay": {"ph": 6.8, "moisture": 45, "fertility_score": 75},
            "Sandy": {"ph": 6.2, "moisture": 25, "fertility_score": 55},
            "Loamy": {"ph": 6.5, "moisture": 35, "fertility_score": 85},
            "Silty": {"ph": 6.7, "moisture": 40, "fertility_score": 70}
        }
        
        props = base_properties.get(soil_type, {"ph": 6.5, "moisture": 35, "fertility_score": 65})
        
        return {
            "ph": props["ph"] + np.random.uniform(-0.3, 0.3),
            "moisture": props["moisture"] + np.random.uniform(-5, 5),
            "fertility_score": props["fertility_score"],
            "organic_matter": np.random.uniform(1.5, 4.0),
            "nutrients": {
                "nitrogen": np.random.uniform(20, 70),
                "phosphorus": np.random.uniform(10, 40),
                "potassium": np.random.uniform(50, 200)
            }
        }
    
    def _mock_crop_analysis(self) -> Dict:
        """Mock crop analysis when model is not available"""
        return {
            "status": "Healthy",
            "confidence": 0.92,
            "health_score": 85,
            "recommendations": [
                "Continue current care routine",
                "Monitor for any changes in leaf color",
                "Ensure adequate watering",
                "Consider organic fertilizer application"
            ],
            "detected_issues": [],
            "severity": "Low"
        }
    
    def _mock_pest_detection(self) -> Dict:
        """Mock pest detection when model is not available"""
        return {
            "pest_detected": True,
            "pest_type": "Aphids",
            "confidence": 0.87,
            "severity": "Medium",
            "treatment_recommendations": [
                "Apply neem oil spray",
                "Use insecticidal soap",
                "Introduce ladybugs",
                "Remove affected leaves"
            ],
            "prevention_tips": [
                "Maintain proper plant spacing",
                "Regular monitoring",
                "Use companion planting",
                "Ensure good air circulation"
            ],
            "economic_impact": "Moderate"
        }
    
    def _mock_soil_analysis(self) -> Dict:
        """Mock soil analysis when model is not available"""
        return {
            "soil_type": "Loamy",
            "confidence": 0.89,
            "ph_level": 6.5,
            "moisture_content": 35,
            "nutrient_levels": {
                "nitrogen": 45,
                "phosphorus": 25,
                "potassium": 180
            },
            "organic_matter": 3.2,
            "fertility_score": 85,
            "recommendations": [
                "Soil pH is optimal for most crops",
                "Consider adding organic compost",
                "Monitor moisture levels regularly"
            ],
            "suitable_crops": ["Rice", "Wheat", "Vegetables", "Legumes"]
        }
    
    def _assess_severity(self, status: str, confidence: float) -> str:
        """Assess severity of crop issues"""
        if status == "Healthy":
            return "None"
        elif confidence > 0.8:
            return "High"
        elif confidence > 0.6:
            return "Medium"
        else:
            return "Low"
    
    def _assess_pest_severity(self, pest_type: str, confidence: float) -> str:
        """Assess pest severity"""
        if pest_type == "No Pest":
            return "None"
        elif confidence > 0.8:
            return "High"
        elif confidence > 0.6:
            return "Medium"
        else:
            return "Low"
    
    def _assess_economic_impact(self, pest_type: str, confidence: float) -> str:
        """Assess economic impact of pest"""
        high_impact_pests = ["Aphids", "Whiteflies", "Caterpillars"]
        if pest_type in high_impact_pests and confidence > 0.7:
            return "High"
        elif confidence > 0.5:
            return "Moderate"
        else:
            return "Low"
    
    def _identify_crop_issues(self, predictions: np.ndarray) -> List[str]:
        """Identify specific crop issues from predictions"""
        issues = []
        if len(predictions) > 1 and predictions[1] > 0.3:  # Disease threshold
            issues.append("Potential disease detected")
        if len(predictions) > 2 and predictions[2] > 0.3:  # Nutrient deficiency
            issues.append("Nutrient deficiency signs")
        return issues
    
    def _suggest_suitable_crops(self, soil_type: str, properties: Dict) -> List[str]:
        """Suggest suitable crops based on soil analysis"""
        crop_suggestions = {
            "Clay": ["Rice", "Wheat", "Sugarcane", "Cotton"],
            "Sandy": ["Groundnuts", "Millets", "Coconut", "Cashew"],
            "Loamy": ["Vegetables", "Fruits", "Cereals", "Legumes"],
            "Silty": ["Rice", "Vegetables", "Fruits", "Herbs"]
        }
        return crop_suggestions.get(soil_type, ["Consult agricultural expert"])

# Global model manager instance
model_manager = AIModelManager()