import os
import io
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global variables for models
crop_model = None
disease_model = None
soil_model = None

# Model paths
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
CROP_MODEL_PATH = os.path.join(MODELS_DIR, 'crop_health_model.h5')
DISEASE_MODEL_PATH = os.path.join(MODELS_DIR, 'disease_detection_model.h5')
SOIL_MODEL_PATH = os.path.join(MODELS_DIR, 'soil_analysis_model.h5')

def load_models():
    """Load all ML models at startup"""
    global crop_model, disease_model, soil_model
    
    try:
        # Create models directory if it doesn't exist
        os.makedirs(MODELS_DIR, exist_ok=True)
        
        # Load crop health model
        if os.path.exists(CROP_MODEL_PATH):
            crop_model = tf.keras.models.load_model(CROP_MODEL_PATH)
            logger.info("Crop health model loaded successfully")
        else:
            logger.warning(f"Crop model not found at {CROP_MODEL_PATH}")
            
        # Load disease detection model
        if os.path.exists(DISEASE_MODEL_PATH):
            disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH)
            logger.info("Disease detection model loaded successfully")
        else:
            logger.warning(f"Disease model not found at {DISEASE_MODEL_PATH}")
            
        # Load soil analysis model
        if os.path.exists(SOIL_MODEL_PATH):
            soil_model = tf.keras.models.load_model(SOIL_MODEL_PATH)
            logger.info("Soil analysis model loaded successfully")
        else:
            logger.warning(f"Soil model not found at {SOIL_MODEL_PATH}")
            
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")

def preprocess_image(image, target_size=(224, 224)):
    """Preprocess image for model prediction"""
    try:
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image
        image = image.resize(target_size)
        
        # Convert to numpy array and normalize
        img_array = np.array(image)
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': {
            'crop_model': crop_model is not None,
            'disease_model': disease_model is not None,
            'soil_model': soil_model is not None
        }
    })

@app.route('/api/crop/analyze', methods=['POST'])
def analyze_crop():
    """Analyze crop health from uploaded image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Load and preprocess image
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        
        # Make prediction if model is available
        if crop_model is not None:
            prediction = crop_model.predict(processed_image)
            confidence = float(np.max(prediction))
            
            # Define class labels (adjust based on your model)
            health_classes = ['healthy', 'diseased', 'pest_damage', 'nutrient_deficiency']
            predicted_class = health_classes[np.argmax(prediction)]
            
            # Generate recommendations based on prediction
            recommendations = get_crop_recommendations(predicted_class, confidence)
            
            return jsonify({
                'health': predicted_class,
                'confidence': confidence,
                'recommendations': recommendations,
                'severity': get_severity_level(confidence, predicted_class)
            })
        else:
            # Return mock data if model is not available
            return jsonify({
                'health': 'healthy',
                'confidence': 0.85,
                'recommendations': [
                    'Continue current care routine',
                    'Monitor for any changes in leaf color',
                    'Ensure adequate watering and nutrition'
                ],
                'severity': 'low'
            })
            
    except Exception as e:
        logger.error(f"Error in crop analysis: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/disease/detect', methods=['POST'])
def detect_disease():
    """Detect plant diseases from uploaded image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Load and preprocess image
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        
        # Make prediction if model is available
        if disease_model is not None:
            prediction = disease_model.predict(processed_image)
            confidence = float(np.max(prediction))
            
            # Define disease classes (adjust based on your model)
            disease_classes = [
                'Healthy', 'Bacterial Blight', 'Fungal Infection', 
                'Viral Disease', 'Pest Damage', 'Nutrient Deficiency'
            ]
            predicted_disease = disease_classes[np.argmax(prediction)]
            
            # Generate treatment and prevention recommendations
            treatment, prevention = get_disease_treatment(predicted_disease)
            
            return jsonify({
                'disease': predicted_disease,
                'confidence': confidence,
                'treatment': treatment,
                'prevention': prevention
            })
        else:
            # Return mock data if model is not available
            return jsonify({
                'disease': 'No disease detected',
                'confidence': 0.92,
                'treatment': ['No treatment needed'],
                'prevention': [
                    'Maintain proper plant spacing',
                    'Ensure good air circulation',
                    'Water at soil level to avoid wetting leaves'
                ]
            })
            
    except Exception as e:
        logger.error(f"Error in disease detection: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/soil/analyze', methods=['POST'])
def analyze_soil():
    """Analyze soil conditions from uploaded image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Load and preprocess image
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        
        # Make prediction if model is available
        if soil_model is not None:
            prediction = soil_model.predict(processed_image)
            
            # Extract soil parameters (adjust based on your model output)
            ph = float(6.0 + prediction[0][0] * 2.0)  # pH range 6-8
            nitrogen = float(prediction[0][1] * 100)   # N percentage
            phosphorus = float(prediction[0][2] * 50)  # P percentage
            potassium = float(prediction[0][3] * 200)  # K percentage
            organic_matter = float(prediction[0][4] * 10)  # OM percentage
            moisture = float(prediction[0][5] * 100)   # Moisture percentage
            
            # Determine soil type based on analysis
            soil_type = determine_soil_type(ph, organic_matter)
            
            # Generate recommendations
            recommendations = get_soil_recommendations(ph, nitrogen, phosphorus, potassium, organic_matter, moisture)
            
            return jsonify({
                'ph': round(ph, 1),
                'nitrogen': round(nitrogen, 1),
                'phosphorus': round(phosphorus, 1),
                'potassium': round(potassium, 1),
                'organicMatter': round(organic_matter, 1),
                'moisture': round(moisture, 1),
                'soilType': soil_type,
                'recommendations': recommendations
            })
        else:
            # Return mock data if model is not available
            return jsonify({
                'ph': 6.5,
                'nitrogen': 45.2,
                'phosphorus': 25.8,
                'potassium': 180.5,
                'organicMatter': 3.2,
                'moisture': 35.0,
                'soilType': 'Loamy',
                'recommendations': [
                    'Soil pH is optimal for most crops',
                    'Consider adding organic compost to improve soil structure',
                    'Monitor moisture levels regularly during dry seasons'
                ]
            })
            
    except Exception as e:
        logger.error(f"Error in soil analysis: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def get_crop_recommendations(health_status, confidence):
    """Generate crop care recommendations based on health status"""
    recommendations = {
        'healthy': [
            'Continue current care routine',
            'Monitor regularly for early signs of stress',
            'Maintain optimal watering schedule',
            'Apply balanced fertilizer as needed'
        ],
        'diseased': [
            'Isolate affected plants immediately',
            'Apply appropriate fungicide or bactericide',
            'Improve air circulation around plants',
            'Remove and destroy infected plant material'
        ],
        'pest_damage': [
            'Identify the specific pest causing damage',
            'Apply targeted pest control measures',
            'Use integrated pest management techniques',
            'Monitor regularly for pest population changes'
        ],
        'nutrient_deficiency': [
            'Conduct soil test to identify specific deficiencies',
            'Apply appropriate fertilizer based on soil test results',
            'Ensure proper pH levels for nutrient uptake',
            'Consider foliar feeding for quick nutrient delivery'
        ]
    }
    
    return recommendations.get(health_status, ['Consult with agricultural expert'])

def get_disease_treatment(disease):
    """Get treatment and prevention for specific diseases"""
    treatments = {
        'Bacterial Blight': (
            ['Apply copper-based bactericide', 'Remove infected plant parts', 'Improve drainage'],
            ['Use disease-resistant varieties', 'Avoid overhead watering', 'Rotate crops']
        ),
        'Fungal Infection': (
            ['Apply appropriate fungicide', 'Improve air circulation', 'Remove infected leaves'],
            ['Ensure proper spacing', 'Water at soil level', 'Use preventive fungicide sprays']
        ),
        'Viral Disease': (
            ['Remove infected plants', 'Control insect vectors', 'Use virus-free planting material'],
            ['Use certified disease-free seeds', 'Control aphids and other vectors', 'Quarantine new plants']
        ),
        'Pest Damage': (
            ['Apply targeted insecticide', 'Use biological control agents', 'Remove damaged plant parts'],
            ['Regular monitoring', 'Use pheromone traps', 'Encourage beneficial insects']
        ),
        'Nutrient Deficiency': (
            ['Apply balanced fertilizer', 'Correct soil pH', 'Use foliar feeding'],
            ['Regular soil testing', 'Maintain proper pH', 'Use organic matter']
        )
    }
    
    return treatments.get(disease, (['No specific treatment needed'], ['Continue good practices']))

def get_severity_level(confidence, health_status):
    """Determine severity level based on confidence and health status"""
    if health_status == 'healthy':
        return 'low'
    elif confidence > 0.8:
        return 'high'
    elif confidence > 0.6:
        return 'medium'
    else:
        return 'low'

def determine_soil_type(ph, organic_matter):
    """Determine soil type based on pH and organic matter"""
    if ph < 6.0:
        return 'Acidic'
    elif ph > 7.5:
        return 'Alkaline'
    elif organic_matter > 4.0:
        return 'Rich Loamy'
    else:
        return 'Loamy'

def get_soil_recommendations(ph, nitrogen, phosphorus, potassium, organic_matter, moisture):
    """Generate soil improvement recommendations"""
    recommendations = []
    
    # pH recommendations
    if ph < 6.0:
        recommendations.append('Add lime to increase soil pH')
    elif ph > 7.5:
        recommendations.append('Add sulfur or organic matter to decrease soil pH')
    else:
        recommendations.append('Soil pH is optimal for most crops')
    
    # Nutrient recommendations
    if nitrogen < 30:
        recommendations.append('Apply nitrogen-rich fertilizer or compost')
    if phosphorus < 20:
        recommendations.append('Add phosphorus fertilizer or bone meal')
    if potassium < 150:
        recommendations.append('Apply potassium fertilizer or wood ash')
    
    # Organic matter recommendations
    if organic_matter < 2.0:
        recommendations.append('Increase organic matter by adding compost or manure')
    
    # Moisture recommendations
    if moisture < 25:
        recommendations.append('Increase irrigation frequency')
    elif moisture > 60:
        recommendations.append('Improve drainage to prevent waterlogging')
    
    return recommendations

if __name__ == '__main__':
    # Load models at startup
    load_models()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=3001, debug=True)