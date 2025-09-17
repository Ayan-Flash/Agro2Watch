AI Models Directory
Place your trained .h5 model files in this directory:

Required Models:
crop_health_model.h5

Purpose: Analyze overall crop health
Input: 224x224x3 RGB images
Output: 4 classes [healthy, diseased, pest_damage, nutrient_deficiency]
disease_detection_model.h5

Purpose: Detect specific plant diseases
Input: 224x224x3 RGB images
Output: 6 classes [Healthy, Bacterial Blight, Fungal Infection, Viral Disease, Pest Damage, Nutrient Deficiency]
soil_analysis_model.h5

Purpose: Analyze soil conditions from images
Input: 224x224x3 RGB images
Output: 6 continuous values [ph_factor, nitrogen%, phosphorus%, potassium%, organic_matter%, moisture%]
Model Training Data Suggestions:
Crop Health Dataset:
Healthy crop images (various growth stages)
Disease-affected crop images
Pest-damaged crop images
Nutrient-deficient crop images
Disease Detection Dataset:
Specific disease symptoms on leaves/stems
Multiple crop types affected by diseases
Various disease severity levels
Different environmental conditions
Soil Analysis Dataset:
Soil images with known pH levels
Soil samples with measured nutrient content
Different soil types and textures
Various moisture conditions
Training Framework:
TensorFlow/Keras recommended
Use transfer learning (ResNet50, VGG16, etc.)
Implement data augmentation
Save final models in .h5 format
Model Performance Guidelines:
Minimum 85% accuracy for crop health classification
Minimum 80% accuracy for disease detection
Soil analysis should correlate with lab test results (R² > 0.7)
If models are not available, the server will return realistic mock data for testing purposes.