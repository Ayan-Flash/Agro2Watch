export type CropAnalysisResult = {
  health: 'healthy' | 'diseased' | 'pest_damage' | 'nutrient_deficiency' | 'unknown';
  confidence: number;
  disease?: string;
  severity?: 'low' | 'medium' | 'high';
  recommendations: string[];
};

export type DiseaseDetectionResult = {
  disease: string;
  confidence: number;
  treatment: string[];
  prevention: string[];
};

export async function analyzeCropImage(_file: File): Promise<CropAnalysisResult> {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    health: 'healthy',
    confidence: 0.92,
    recommendations: [
      'Maintain irrigation schedule',
      'Apply balanced fertilizer as per soil test',
    ],
  };
}

export async function detectPlantDisease(_file: File): Promise<DiseaseDetectionResult> {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    disease: 'Leaf Blight',
    confidence: 0.81,
    treatment: [
      'Use recommended fungicide',
      'Remove infected leaves',
    ],
    prevention: [
      'Ensure proper spacing and airflow',
      'Avoid overhead irrigation late in the day',
    ],
  };
}

 