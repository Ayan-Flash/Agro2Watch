/**
 * MATLAB API Integration for AgroWatch
 * Handles communication with the MATLAB-based backend
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface AnalysisResult {
  status: string;
  prediction: string;
  confidence: number;
  threshold_met: boolean;
  class_probabilities: Record<string, number>;
  analysis?: any;
  recommendations: string[];
  model_info: {
    name: string;
    version: string;
  };
  image_features?: any;
}

export interface ModelInfo {
  name: string;
  file: string;
  classes: string[];
  input_shape: number[];
  preprocessing: string;
  loaded: boolean;
  metadata: any;
}

class MATLABApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Analyze crop health using MATLAB model
   */
  async analyzeCropHealth(imageFile: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch(`${this.baseURL}/crop/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Crop analysis failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Crop health analysis error:', error);
      throw error;
    }
  }

  /**
   * Analyze soil type using MATLAB model
   */
  async analyzeSoilType(imageFile: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch(`${this.baseURL}/soil/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Soil analysis failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Soil analysis error:', error);
      throw error;
    }
  }

  /**
   * Detect pests using MATLAB model
   */
  async detectPests(imageFile: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch(`${this.baseURL}/pest/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pest detection failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Pest detection error:', error);
      throw error;
    }
  }

  /**
   * Get information about available models
   */
  async getModelsInfo(): Promise<Record<string, ModelInfo>> {
    try {
      const response = await fetch(`${this.baseURL}/models`);
      
      if (!response.ok) {
        throw new Error(`Failed to get models info: ${response.status}`);
      }

      const models = await response.json();
      return models;
    } catch (error) {
      console.error('Get models info error:', error);
      throw error;
    }
  }

  /**
   * Get specific model information
   */
  async getModelInfo(modelType: 'crop' | 'soil' | 'pest'): Promise<ModelInfo> {
    try {
      const response = await fetch(`${this.baseURL}/${modelType}/model-info`);
      
      if (!response.ok) {
        throw new Error(`Failed to get ${modelType} model info: ${response.status}`);
      }

      const modelInfo = await response.json();
      return modelInfo;
    } catch (error) {
      console.error(`Get ${modelType} model info error:`, error);
      throw error;
    }
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await fetch(`${this.baseURL.replace('/api/v1', '')}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const health = await response.json();
      return health;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Test connection to MATLAB backend
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.checkHealth();
      return true;
    } catch (error) {
      console.warn('MATLAB backend connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const matlabApi = new MATLABApiClient();

// Helper functions for frontend integration
export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(1)}%`;
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

export const formatProbabilities = (probabilities: Record<string, number>): Array<{name: string, value: number, percentage: string}> => {
  return Object.entries(probabilities)
    .map(([name, value]) => ({
      name: name.replace('_', ' ').toUpperCase(),
      value,
      percentage: formatConfidence(value)
    }))
    .sort((a, b) => b.value - a.value);
};

// Mock data for development when backend is not available
export const mockAnalysisResult: AnalysisResult = {
  status: 'success',
  prediction: 'healthy',
  confidence: 0.92,
  threshold_met: true,
  class_probabilities: {
    'healthy': 0.92,
    'diseased': 0.05,
    'nutrient_deficiency': 0.02,
    'pest_damage': 0.01
  },
  analysis: {
    health_status: 'excellent',
    severity: 'none',
    image_quality: 'good'
  },
  recommendations: [
    'Continue current crop management practices',
    'Monitor regularly for early detection of issues',
    'Maintain optimal irrigation and nutrition schedule'
  ],
  model_info: {
    name: 'crop_health',
    version: '1.0.0'
  }
};

export default matlabApi;