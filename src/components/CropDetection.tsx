import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Leaf, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTranslation } from '@/lib/translations';
import { analyzeCropImage, detectPlantDisease, type CropAnalysisResult, type DiseaseDetectionResult } from '../lib/backendApi';

export const CropDetection: React.FC = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CropAnalysisResult | null>(null);
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseDetectionResult | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setDiseaseInfo(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      // Analyze crop health
      const cropResult = await analyzeCropImage(selectedImage);
      setResult(cropResult);

      // If disease is detected, get detailed disease information
      if (cropResult.health === 'diseased') {
        const diseaseResult = await detectPlantDisease(selectedImage);
        setDiseaseInfo(diseaseResult);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getHealthStatusIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'diseased':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pest_damage':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'nutrient_deficiency':
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthStatusColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'diseased':
        return 'text-red-600 bg-red-50';
      case 'pest_damage':
        return 'text-orange-600 bg-orange-50';
      case 'nutrient_deficiency':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.cropHealthAnalysis}</h1>
        <p className="text-gray-600 mt-2">Upload crop images for AI-powered health analysis and disease detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              {t.uploadImage}
            </CardTitle>
            <CardDescription>
              Upload a clear image of your crop for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Select Image
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Selected crop"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="flex-1"
                    >
                      {analyzing ? 'Analyzing...' : t.analyzeHealth}
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-reupload"
                    />
                    <label htmlFor="image-reupload">
                      <Button variant="outline" className="cursor-pointer">
                        Change Image
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 mr-2" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              AI-powered crop health assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-8 text-gray-500">
                Upload an image to see analysis results
              </div>
            ) : (
              <div className="space-y-6">
                {/* Health Status */}
                <div className={`p-4 rounded-lg ${getHealthStatusColor(result.health)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {getHealthStatusIcon(result.health)}
                    <h3 className="font-semibold capitalize">{result.health.replace('_', ' ')}</h3>
                  </div>
                  <p className="text-sm">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </p>
                  {result.disease && (
                    <p className="text-sm mt-1">
                      Disease: {result.disease}
                    </p>
                  )}
                  {result.severity && (
                    <p className="text-sm mt-1">
                      Severity: <span className="capitalize">{result.severity}</span>
                    </p>
                  )}
                </div>

                {/* Disease Information */}
                {diseaseInfo && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-red-600 mb-2">Disease Details</h4>
                    <p className="text-sm mb-3"><strong>Disease:</strong> {diseaseInfo.disease}</p>
                    <p className="text-sm mb-3"><strong>Confidence:</strong> {Math.round(diseaseInfo.confidence * 100)}%</p>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-1">Treatment:</h5>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {diseaseInfo.treatment.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-1">Prevention:</h5>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {diseaseInfo.prevention.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-2">{t.recommendations}</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropDetection;