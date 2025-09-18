export interface SoilAnalysisTemplate {
  id: string;
  name: string;
  description: string;
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  healthScore: number;
  recommendations: string[];
  soilType: string;
  location: string;
  cropSuitability: string[];
  imageUrl?: string;
}

export const soilAnalysisTemplates: SoilAnalysisTemplate[] = [
  {
    id: 'template_1',
    name: 'Healthy Loamy Soil',
    description: 'Well-balanced soil with good structure and nutrient content',
    ph: 6.8,
    moisture: 45,
    nitrogen: 78,
    phosphorus: 65,
    potassium: 82,
    organicMatter: 3.2,
    healthScore: 85,
    soilType: 'Loamy',
    location: 'Punjab, India',
    cropSuitability: ['Wheat', 'Rice', 'Maize', 'Vegetables'],
    recommendations: [
      'Soil pH is optimal for most crops (6.5-7.0)',
      'Moisture level is good for plant growth',
      'Consider adding organic compost to improve soil structure',
      'Phosphorus levels could be increased for better root development',
      'Regular soil testing recommended every 6 months'
    ]
  },
  {
    id: 'template_2',
    name: 'Acidic Clay Soil',
    description: 'Heavy clay soil with low pH requiring immediate attention',
    ph: 5.2,
    moisture: 65,
    nitrogen: 45,
    phosphorus: 35,
    potassium: 55,
    organicMatter: 1.8,
    healthScore: 45,
    soilType: 'Clay',
    location: 'Kerala, India',
    cropSuitability: ['Rice', 'Coconut', 'Banana'],
    recommendations: [
      'URGENT: Soil pH is too acidic (5.2) - apply lime immediately',
      'Add 2-3 tons of agricultural lime per acre',
      'Improve drainage to reduce waterlogging',
      'Add organic matter to improve soil structure',
      'Consider raised bed farming for better drainage',
      'Test soil again after 3 months of treatment'
    ]
  },
  {
    id: 'template_3',
    name: 'Sandy Soil - High Nutrients',
    description: 'Sandy soil with good nutrient levels but poor water retention',
    ph: 7.1,
    moisture: 25,
    nitrogen: 85,
    phosphorus: 90,
    potassium: 88,
    organicMatter: 2.1,
    healthScore: 70,
    soilType: 'Sandy',
    location: 'Rajasthan, India',
    cropSuitability: ['Millet', 'Groundnut', 'Cotton', 'Sugarcane'],
    recommendations: [
      'Soil pH is slightly alkaline but acceptable',
      'Excellent nutrient levels - reduce fertilizer application',
      'CRITICAL: Very low moisture retention - implement mulching',
      'Add organic matter to improve water holding capacity',
      'Consider drip irrigation for efficient water use',
      'Plant cover crops to prevent erosion'
    ]
  }
];

export const getSoilTemplateById = (id: string): SoilAnalysisTemplate | undefined => {
  return soilAnalysisTemplates.find(template => template.id === id);
};

export const getRandomSoilTemplate = (): SoilAnalysisTemplate => {
  const randomIndex = Math.floor(Math.random() * soilAnalysisTemplates.length);
  return soilAnalysisTemplates[randomIndex];
};

export const getSoilTemplatesBySoilType = (soilType: string): SoilAnalysisTemplate[] => {
  return soilAnalysisTemplates.filter(template => 
    template.soilType.toLowerCase() === soilType.toLowerCase()
  );
};

export const getSoilTemplatesByLocation = (location: string): SoilAnalysisTemplate[] => {
  return soilAnalysisTemplates.filter(template => 
    template.location.toLowerCase().includes(location.toLowerCase())
  );
};
