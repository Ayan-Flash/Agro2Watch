export interface MockAnalysisResult {
  success: boolean;
  analysis_type: string;
  crop_type?: string;
  filename: string;
  results: {
    health_status: string;
    disease_detected?: string;
    confidence: number;
    severity?: string;
    model_accuracy: number;
    recommendations: string[];
    all_predictions?: Record<string, number>;
    pest_detected?: boolean;
    num_detections?: number;
    detections?: Array<{
      pest_type: string;
      confidence: number;
      bounding_box: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    overall_health?: string;
    nutrient_analysis?: {
      nitrogen: { value: number; status: string; unit: string };
      phosphorus: { value: number; status: string; unit: string };
      potassium: { value: number; status: string; unit: string };
    };
  };
  timestamp: string;
}

// Mock data for different types of analysis
export const cropHealthMockData: MockAnalysisResult[] = [
  {
    success: true,
    analysis_type: "crop_health",
    crop_type: "wheat",
    filename: "wheat_healthy.jpg",
    results: {
      health_status: "healthy",
      disease_detected: null,
      confidence: 0.95,
      severity: "low",
      model_accuracy: 0.92,
      recommendations: [
        "Crop appears healthy and well-maintained",
        "Continue current care routine",
        "Monitor for early signs of stress",
        "Maintain optimal watering schedule",
        "Apply balanced fertilizer as needed"
      ],
      all_predictions: {
        healthy: 0.95,
        diseased: 0.03,
        pest_damage: 0.02
      },
      pest_detected: false,
      num_detections: 0,
      detections: [],
      overall_health: "excellent",
      nutrient_analysis: {
        nitrogen: { value: 75, status: "good", unit: "ppm" },
        phosphorus: { value: 60, status: "fair", unit: "ppm" },
        potassium: { value: 80, status: "good", unit: "ppm" }
      }
    },
    timestamp: new Date().toISOString()
  },
  {
    success: true,
    analysis_type: "crop_health",
    crop_type: "rice",
    filename: "rice_diseased.jpg",
    results: {
      health_status: "diseased",
      disease_detected: "Bacterial Leaf Blight",
      confidence: 0.88,
      severity: "moderate",
      model_accuracy: 0.89,
      recommendations: [
        "URGENT: Bacterial leaf blight detected",
        "Apply copper-based fungicide immediately",
        "Remove and destroy infected plant parts",
        "Improve field drainage to reduce humidity",
        "Avoid overhead irrigation",
        "Consider resistant varieties for next season"
      ],
      all_predictions: {
        healthy: 0.12,
        diseased: 0.88,
        pest_damage: 0.00
      },
      pest_detected: false,
      num_detections: 0,
      detections: [],
      overall_health: "poor",
      nutrient_analysis: {
        nitrogen: { value: 45, status: "poor", unit: "ppm" },
        phosphorus: { value: 35, status: "poor", unit: "ppm" },
        potassium: { value: 50, status: "fair", unit: "ppm" }
      }
    },
    timestamp: new Date().toISOString()
  },
  {
    success: true,
    analysis_type: "crop_health",
    crop_type: "tomato",
    filename: "tomato_pest_damage.jpg",
    results: {
      health_status: "pest_damage",
      disease_detected: null,
      confidence: 0.91,
      severity: "high",
      model_accuracy: 0.90,
      recommendations: [
        "Pest damage detected on tomato plants",
        "Apply neem oil spray every 7 days",
        "Use yellow sticky traps for monitoring",
        "Remove heavily infested leaves",
        "Consider biological control methods",
        "Maintain proper plant spacing"
      ],
      all_predictions: {
        healthy: 0.09,
        diseased: 0.00,
        pest_damage: 0.91
      },
      pest_detected: true,
      num_detections: 3,
      detections: [
        {
          pest_type: "Aphids",
          confidence: 0.85,
          bounding_box: { x: 120, y: 80, width: 60, height: 40 }
        },
        {
          pest_type: "Whitefly",
          confidence: 0.78,
          bounding_box: { x: 200, y: 150, width: 45, height: 30 }
        },
        {
          pest_type: "Spider Mites",
          confidence: 0.82,
          bounding_box: { x: 300, y: 200, width: 55, height: 35 }
        }
      ],
      overall_health: "fair",
      nutrient_analysis: {
        nitrogen: { value: 65, status: "fair", unit: "ppm" },
        phosphorus: { value: 55, status: "fair", unit: "ppm" },
        potassium: { value: 70, status: "good", unit: "ppm" }
      }
    },
    timestamp: new Date().toISOString()
  }
];

export const pestDetectionMockData: MockAnalysisResult[] = [
  {
    success: true,
    analysis_type: "pest_detection",
    crop_type: "cotton",
    filename: "cotton_pests.jpg",
    results: {
      health_status: "pest_infested",
      disease_detected: null,
      confidence: 0.93,
      severity: "high",
      model_accuracy: 0.91,
      recommendations: [
        "Multiple pest species detected on cotton plants",
        "Apply integrated pest management (IPM) approach",
        "Use selective pesticides to preserve beneficial insects",
        "Monitor pest population levels regularly",
        "Consider biological control agents",
        "Implement crop rotation next season"
      ],
      all_predictions: {
        healthy: 0.07,
        diseased: 0.00,
        pest_damage: 0.93
      },
      pest_detected: true,
      num_detections: 5,
      detections: [
        {
          pest_type: "Bollworm",
          confidence: 0.92,
          bounding_box: { x: 100, y: 120, width: 80, height: 60 }
        },
        {
          pest_type: "Aphids",
          confidence: 0.88,
          bounding_box: { x: 250, y: 80, width: 70, height: 50 }
        },
        {
          pest_type: "Whitefly",
          confidence: 0.85,
          bounding_box: { x: 180, y: 200, width: 60, height: 45 }
        },
        {
          pest_type: "Thrips",
          confidence: 0.79,
          bounding_box: { x: 320, y: 150, width: 40, height: 30 }
        },
        {
          pest_type: "Spider Mites",
          confidence: 0.81,
          bounding_box: { x: 400, y: 180, width: 55, height: 40 }
        }
      ],
      overall_health: "poor"
    },
    timestamp: new Date().toISOString()
  },
  {
    success: true,
    analysis_type: "pest_detection",
    crop_type: "maize",
    filename: "maize_healthy.jpg",
    results: {
      health_status: "healthy",
      disease_detected: null,
      confidence: 0.96,
      severity: "low",
      model_accuracy: 0.94,
      recommendations: [
        "No significant pest damage detected",
        "Continue current pest monitoring routine",
        "Maintain proper field hygiene",
        "Use pheromone traps for early detection",
        "Apply preventive measures if needed"
      ],
      all_predictions: {
        healthy: 0.96,
        diseased: 0.02,
        pest_damage: 0.02
      },
      pest_detected: false,
      num_detections: 0,
      detections: [],
      overall_health: "excellent"
    },
    timestamp: new Date().toISOString()
  }
];

export const soilHealthMockData: MockAnalysisResult[] = [
  {
    success: true,
    analysis_type: "soil_health",
    crop_type: "general",
    filename: "soil_sample_1.jpg",
    results: {
      health_status: "good",
      disease_detected: null,
      confidence: 0.89,
      severity: "low",
      model_accuracy: 0.87,
      recommendations: [
        "Soil appears to be in good condition",
        "pH level is within optimal range (6.5-7.0)",
        "Organic matter content is adequate",
        "Consider adding compost for better structure",
        "Test soil nutrients every 6 months",
        "Maintain proper drainage"
      ],
      all_predictions: {
        healthy: 0.89,
        diseased: 0.05,
        pest_damage: 0.06
      },
      pest_detected: false,
      num_detections: 0,
      detections: [],
      overall_health: "good",
      nutrient_analysis: {
        nitrogen: { value: 70, status: "good", unit: "ppm" },
        phosphorus: { value: 65, status: "fair", unit: "ppm" },
        potassium: { value: 75, status: "good", unit: "ppm" }
      }
    },
    timestamp: new Date().toISOString()
  },
  {
    success: true,
    analysis_type: "soil_health",
    crop_type: "general",
    filename: "soil_sample_2.jpg",
    results: {
      health_status: "poor",
      disease_detected: null,
      confidence: 0.91,
      severity: "high",
      model_accuracy: 0.88,
      recommendations: [
        "URGENT: Soil health is poor and needs immediate attention",
        "Apply lime to correct acidic pH (current: 5.2)",
        "Add organic matter to improve structure",
        "Implement crop rotation to restore nutrients",
        "Consider cover crops to prevent erosion",
        "Test soil again after 3 months of treatment"
      ],
      all_predictions: {
        healthy: 0.09,
        diseased: 0.00,
        pest_damage: 0.91
      },
      pest_detected: false,
      num_detections: 0,
      detections: [],
      overall_health: "poor",
      nutrient_analysis: {
        nitrogen: { value: 30, status: "poor", unit: "ppm" },
        phosphorus: { value: 25, status: "poor", unit: "ppm" },
        potassium: { value: 35, status: "poor", unit: "ppm" }
      }
    },
    timestamp: new Date().toISOString()
  }
];

// Function to get random mock data based on analysis type
export const getMockAnalysisResult = (analysisType: string): MockAnalysisResult => {
  let mockData: MockAnalysisResult[];
  
  switch (analysisType) {
    case 'crop-health':
      mockData = cropHealthMockData;
      break;
    case 'pest-detection':
      mockData = pestDetectionMockData;
      break;
    case 'soil-health':
      mockData = soilHealthMockData;
      break;
    default:
      mockData = cropHealthMockData;
  }
  
  // Return a random result from the appropriate mock data
  const randomIndex = Math.floor(Math.random() * mockData.length);
  const result = { ...mockData[randomIndex] };
  
  // Update filename and timestamp to be current
  result.filename = `analysis_${Date.now()}.jpg`;
  result.timestamp = new Date().toISOString();
  
  return result;
};

// Function to get specific mock data by crop type
export const getMockAnalysisByCrop = (cropType: string, analysisType: string): MockAnalysisResult | null => {
  let mockData: MockAnalysisResult[];
  
  switch (analysisType) {
    case 'crop-health':
      mockData = cropHealthMockData;
      break;
    case 'pest-detection':
      mockData = pestDetectionMockData;
      break;
    case 'soil-health':
      mockData = soilHealthMockData;
      break;
    default:
      return null;
  }
  
  const result = mockData.find(data => data.crop_type === cropType);
  if (result) {
    return {
      ...result,
      filename: `analysis_${Date.now()}.jpg`,
      timestamp: new Date().toISOString()
    };
  }
  
  return null;
};
