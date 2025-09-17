import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Droplets,
  Zap,
  FileImage,
  TestTube
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTranslation } from '@/lib/translations';

interface SoilAnalysisResult {
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  recommendations: string[];
  healthScore: number;
}

export const SoilDetection: React.FC = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setAnalysisResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis result
      const mockResult: SoilAnalysisResult = {
        ph: 6.8,
        moisture: 45,
        nitrogen: 78,
        phosphorus: 65,
        potassium: 82,
        organicMatter: 3.2,
        healthScore: 85,
        recommendations: [
          'Soil pH is optimal for most crops (6.5-7.0)',
          'Moisture level is good for plant growth',
          'Consider adding organic compost to improve soil structure',
          'Phosphorus levels could be increased for better root development',
          'Regular soil testing recommended every 6 months'
        ]
      };

      setAnalysisResult(mockResult);
    } catch (err) {
      setError('Failed to analyze soil. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getNutrientColor = (value: number) => {
    if (value >= 80) return 'text-green-600 bg-green-50';
    if (value >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-8 animate-in slide-in-from-top duration-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
          {t.soilHealthAnalysis}
        </h1>
        <p className="text-gray-600">
          Upload an image of your soil to analyze its health and nutrient content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="animate-in slide-in-from-left duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {t.uploadImage}
            </CardTitle>
            <CardDescription>
              Take a clear photo of your soil sample for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Selected soil sample"
                    className="mx-auto max-h-64 rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600">{selectedImage?.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Upload soil image</p>
                    <p className="text-sm text-gray-600">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FileImage className="h-4 w-4 mr-2" />
                Select Image
              </label>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Analyze Soil
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="animate-in slide-in-from-right duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              Soil health assessment and nutrient analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Overall Health Score */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Soil Health Score</h3>
                  <div className={`text-4xl font-bold ${getHealthScoreColor(analysisResult.healthScore)}`}>
                    {analysisResult.healthScore}/100
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {analysisResult.healthScore >= 80 ? 'Excellent' : 
                     analysisResult.healthScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>

                {/* Nutrient Levels */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Nutrient Analysis</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${getNutrientColor(analysisResult.nitrogen)}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Nitrogen (N)</span>
                        <span className="font-bold">{analysisResult.nitrogen}%</span>
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${getNutrientColor(analysisResult.phosphorus)}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Phosphorus (P)</span>
                        <span className="font-bold">{analysisResult.phosphorus}%</span>
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${getNutrientColor(analysisResult.potassium)}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Potassium (K)</span>
                        <span className="font-bold">{analysisResult.potassium}%</span>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Organic Matter</span>
                        <span className="font-bold">{analysisResult.organicMatter}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Soil Properties */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Soil Properties</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-800">pH Level</span>
                      <Badge variant="secondary">{analysisResult.ph}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm font-medium text-cyan-800">Moisture</span>
                      </div>
                      <Badge variant="secondary">{analysisResult.moisture}%</Badge>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-800">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Note:</strong> This analysis is based on visual assessment. For precise nutrient levels, 
                    consider professional soil testing from an agricultural laboratory.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Activity className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Analysis Yet</p>
                <p className="text-sm">Upload a soil image and click analyze to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-6 animate-in slide-in-from-bottom duration-500">
        <CardHeader>
          <CardTitle>Soil Sampling Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Camera className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Clear Sample</h3>
              <p className="text-sm text-gray-600">Take photos of fresh, clean soil samples</p>
            </div>
            <div className="text-center p-4">
              <FileImage className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Good Lighting</h3>
              <p className="text-sm text-gray-600">Use natural daylight for accurate color assessment</p>
            </div>
            <div className="text-center p-4">
              <Activity className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Multiple Samples</h3>
              <p className="text-sm text-gray-600">Test soil from different areas of your field</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilDetection;