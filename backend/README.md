AgroWatch MATLAB API Backend
A FastAPI-based backend service that integrates MATLAB models for precision farming AI analysis.

🚀 Features
MATLAB Model Integration: Support for .mat files using scipy.io
Multi-Model Support: Crop health, soil analysis, and pest detection
RESTful API: Clean, documented API endpoints
Image Processing: Advanced image preprocessing for AI models
Comprehensive Analysis: Detailed results with recommendations
Error Handling: Robust error handling and logging
Development Ready: Mock models for development and testing
📋 Requirements
Python 3.8+
FastAPI
scipy (for MATLAB file support)
OpenCV
Pillow
NumPy
🛠️ Installation
Install Dependencies:

cd backend
pip install -r requirements.txt
Prepare MATLAB Models: Place your .mat model files in the models/ directory:

crop_health_model.mat
soil_analysis_model.mat
pest_detection_model.mat
Start Server:

python start_server.py
📡 API Endpoints
Base URL: http://localhost:8000/api/v1
Crop Health Analysis
POST /crop/analyze
Upload crop image for health analysis
Returns: prediction, confidence, recommendations
Soil Type Analysis
POST /soil/analyze
Upload soil image for type classification
Returns: soil type, properties, suitability
Pest Detection
POST /pest/analyze
Upload crop image for pest detection
Returns: pest identification, treatment plan
Model Information
GET /models - List all available models
GET /crop/model-info - Crop model details
GET /soil/model-info - Soil model details
GET /pest/model-info - Pest model details
🔧 MATLAB Model Format
The API expects MATLAB .mat files with the following structure:

Neural Network Models
model.network.layers = [
    struct('weights', W1, 'bias', b1, 'activation', 'relu'),
    struct('weights', W2, 'bias', b2, 'activation', 'relu'),
    struct('weights', W3, 'bias', b3, 'activation', 'softmax')
];
model.classes = {'class1', 'class2', 'class3'};
model.input_shape = [224, 224, 3];
Classifier Models
model.classifier.support_vectors = support_vectors;
model.classifier.coefficients = coefficients;
model.classifier.intercept = intercept;
model.classes = {'class1', 'class2', 'class3'};
Simple Linear Models
model.weights = weight_matrix;
model.bias = bias_vector;
model.classes = {'class1', 'class2', 'class3'};
🧪 Testing
Start the server:

python start_server.py
Run tests:

python test_api.py
Interactive API docs: Visit http://localhost:8000/docs

📁 Project Structure
backend/
├── api/
│   └── v1/
│       ├── endpoints/
│       │   ├── crop_detection.py
│       │   ├── soil_detection.py
│       │   └── pest_detection.py
│       └── api.py
├── models/
│   ├── model_loader.py
│   ├── model_metadata.json
│   └── *.mat (MATLAB model files)
├── config/
│   └── settings.py
├── utils/
│   └── image_utils.py
├── main.py
├── start_server.py
├── test_api.py
├── requirements.txt
└── README.md
⚙️ Configuration
Edit config/settings.py to customize:

Model file paths
Image processing parameters
API security settings
CORS configuration
Confidence thresholds
🔍 Model Metadata
The models/model_metadata.json file contains:

Model accuracy metrics
Training information
Performance statistics
Class definitions
Input requirements
🚨 Error Handling
The API includes comprehensive error handling for:

Invalid image formats
Missing model files
MATLAB loading errors
Processing failures
Network issues
📊 Response Format
All analysis endpoints return standardized responses:

{
  "status": "success",
  "prediction": "class_name",
  "confidence": 0.95,
  "threshold_met": true,
  "class_probabilities": {
    "class1": 0.95,
    "class2": 0.03,
    "class3": 0.02
  },
  "analysis": {
    "detailed_results": "..."
  },
  "recommendations": [
    "Action 1",
    "Action 2"
  ],
  "model_info": {
    "name": "model_name",
    "version": "1.0.0"
  }
}
🔧 Development
For development with mock models:

The system automatically creates mock models if .mat files are missing
Mock models provide realistic predictions for testing
Use test_api.py to verify functionality
Check logs for detailed debugging information
🌐 Production Deployment
For production deployment:

Replace mock models with trained MATLAB models
Update settings.py with production configuration
Set up proper logging and monitoring
Configure reverse proxy (nginx)
Use production WSGI server (gunicorn)
📝 Logging
The API uses structured logging with loguru:

Request/response logging
Model loading status
Error tracking
Performance metrics
🔒 Security
Security features include:

File type validation
File size limits
CORS configuration
Input sanitization
Error message sanitization
🤝 Contributing
Follow Python PEP 8 style guidelines
Add comprehensive error handling
Update tests for new features
Document API changes
Test with actual MATLAB models
📄 License
This project is part of the AgroWatch precision farming platform.