import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bug, 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Shield,
  Zap,
  FileImage
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTranslation } from '@/lib/translations';

interface PestAnalysisResult {
  pest: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  treatment: string[];
  prevention: string[];
  description: string;
}

export const PestDetection: React.FC = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PestAnalysisResult | null>(null);
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
      const mockResult: PestAnalysisResult = {
        pest: 'Aphids',
        confidence: 0.87,
        severity: 'medium',
        treatment: [
          'Apply neem oil spray (2-3ml per liter of water)',
          'Use insecticidal soap solution',
          'Introduce beneficial insects like ladybugs',
          'Remove heavily infested leaves'
        ],
        prevention: [
          'Maintain proper plant spacing for good air circulation',
          'Regular inspection of plants',
          'Avoid over-fertilizing with nitrogen',
          'Use reflective mulches to deter aphids',
          'Plant companion crops like marigolds'
        ],
        description: 'Small, soft-bodied insects that feed on plant sap. They can cause yellowing, wilting, and stunted growth.'
      };

      setAnalysisResult(mockResult);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-8 animate-in slide-in-from-top duration-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Bug className="h-8 w-8 text-orange-600" />
          {t.pestDetectionAnalysis}
        </h1>
        <p className="text-gray-600">
          Upload an image of your crop to detect pests and get treatment recommendations
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
              Take a clear photo of the affected plant or upload from gallery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Selected crop"
                    className="mx-auto max-h-64 rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600">{selectedImage?.name}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Upload crop image</p>
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
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 cursor-pointer transition-colors"
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
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bug className="h-4 w-4 mr-2" />
                  {t.pestIdentification}
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
              Pest identification and treatment recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Pest Identification */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-orange-900">Pest Detected</h3>
                    <Badge className={`${getSeverityColor(analysisResult.severity)} flex items-center gap-1`}>
                      {getSeverityIcon(analysisResult.severity)}
                      {analysisResult.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-orange-800 mb-2">{analysisResult.pest}</p>
                  <p className="text-sm text-orange-700 mb-2">{analysisResult.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Confidence:</span>
                    <div className="flex-1 bg-orange-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${analysisResult.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{Math.round(analysisResult.confidence * 100)}%</span>
                  </div>
                </div>

                {/* Treatment Plan */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    {t.treatmentPlan}
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.treatment.map((treatment, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention Tips */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    {t.preventionTips}
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.prevention.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-800">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Important:</strong> Always consult with local agricultural experts before applying treatments. 
                    Consider organic and environmentally friendly options first.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Bug className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Analysis Yet</p>
                <p className="text-sm">Upload an image and click analyze to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="mt-6 animate-in slide-in-from-bottom duration-500">
        <CardHeader>
          <CardTitle>Photography Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Camera className="mx-auto h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-medium mb-1">Clear Focus</h3>
              <p className="text-sm text-gray-600">Ensure the affected area is in sharp focus</p>
            </div>
            <div className="text-center p-4">
              <FileImage className="mx-auto h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-medium mb-1">Good Lighting</h3>
              <p className="text-sm text-gray-600">Take photos in natural daylight for best results</p>
            </div>
            <div className="text-center p-4">
              <Bug className="mx-auto h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-medium mb-1">Close-up View</h3>
              <p className="text-sm text-gray-600">Capture close-up images of the pest or damage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PestDetection;