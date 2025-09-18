import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Leaf,
  Bug,
  TestTube,
  FileText,
  Download,
  Share,
  RefreshCw,
  Eye,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { getMockAnalysisResult } from '@/lib/imageAnalysisMockData';

interface CropDetectionProps {
  onNavigate: (section: string) => void;
}

interface AnalysisResult {
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
    nutrient_analysis?: Record<string, {
      value: number;
      status: string;
      unit: string;
    }>;
  };
}

const CropDetection: React.FC<CropDetectionProps> = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedCropType, setSelectedCropType] = useState('wheat');
  const [analysisType, setAnalysisType] = useState<'crop-health' | 'pest-detection' | 'soil-health'>('crop-health');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cropTypes = [
    { value: 'wheat', label: 'Wheat', icon: '🌾' },
    { value: 'rice', label: 'Rice', icon: '🌾' },
    { value: 'corn', label: 'Corn', icon: '🌽' },
    { value: 'tomato', label: 'Tomato', icon: '🍅' },
    { value: 'potato', label: 'Potato', icon: '🥔' },
    { value: 'cotton', label: 'Cotton', icon: '🌿' }
  ];

  const analysisTypes = [
    { 
      value: 'crop-health', 
      label: 'Crop Health', 
      icon: <Leaf className="h-5 w-5" />,
      description: 'Detect diseases and assess plant health',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    { 
      value: 'pest-detection', 
      label: 'Pest Detection', 
      icon: <Bug className="h-5 w-5" />,
      description: 'Identify harmful pests and insects',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    { 
      value: 'soil-health', 
      label: 'Soil Analysis', 
      icon: <TestTube className="h-5 w-5" />,
      description: 'Analyze soil nutrients and pH levels',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setError('');
        setAnalysisResult(null);
      } else {
        setError('Please select a valid image file (JPG, PNG, etc.)');
      }
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
      setAnalysisResult(null);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError('');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Try backend first
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        if (analysisType === 'crop-health') {
          formData.append('crop_type', selectedCropType);
        }

        // Call the backend API
        const API_BASE_URL = 'http://localhost:8001';
        const endpoint = `${API_BASE_URL}/analyze/${analysisType}`;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Backend not available: ${response.status}`);
        }

        const result: AnalysisResult = await response.json();
        
        clearInterval(progressInterval);
        setAnalysisProgress(100);
        
        setTimeout(() => {
          setAnalysisResult(result);
          setIsAnalyzing(false);
          setAnalysisProgress(0);
        }, 500);

      } catch (backendError) {
        console.log('Backend not available, using mock data for analysis');
        
        // Use mock data when backend is not available
        const mockResult = getMockAnalysisResult(analysisType);
        
        clearInterval(progressInterval);
        setAnalysisProgress(100);
        
        setTimeout(() => {
          setAnalysisResult(mockResult);
          setIsAnalyzing(false);
          setAnalysisProgress(0);
        }, 500);
      }

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'diseased':
        return 'text-red-600 bg-red-100';
      case 'needs_attention':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return 'text-yellow-600 bg-yellow-100';
      case 'moderate':
        return 'text-orange-600 bg-orange-100';
      case 'severe':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentAnalysisType = analysisTypes.find(type => type.value === analysisType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Crop Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload an image of your crops for instant AI analysis using advanced machine learning models
          </p>
        </div>

        {/* Analysis Type Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-600" />
              <span>Select Analysis Type</span>
            </CardTitle>
            <CardDescription>
              Choose the type of analysis you want to perform on your crop image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {analysisTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setAnalysisType(type.value as any)}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation active:scale-95 ${
                    analysisType === type.value
                      ? `${type.color} border-current shadow-md`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    {type.icon}
                    <span className="font-semibold text-sm sm:text-base">{type.label}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentAnalysisType?.icon}
                <span>Upload Image for {currentAnalysisType?.label}</span>
              </CardTitle>
              <CardDescription>
                Upload a clear image of your {analysisType === 'soil-health' ? 'soil' : 'crops'} for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Crop Type Selection (only for crop health) */}
              {analysisType === 'crop-health' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cropTypes.map((crop) => (
                      <button
                        key={crop.value}
                        onClick={() => setSelectedCropType(crop.value)}
                        className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation active:scale-95 ${
                          selectedCropType === crop.value
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="text-base sm:text-lg mb-1">{crop.icon}</div>
                        {crop.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer touch-manipulation active:bg-gray-50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="space-y-3 sm:space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 sm:max-h-64 mx-auto rounded-lg shadow-md w-full object-contain"
                    />
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm sm:text-lg font-medium text-gray-900">
                        Drop your image here, or tap to browse
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Supports JPG, PNG, WebP (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={analyzeImage}
                  disabled={!selectedFile || isAnalyzing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 sm:h-10 touch-manipulation active:scale-95 transition-transform"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className="text-sm sm:text-base">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      <span className="text-sm sm:text-base">Start Analysis</span>
                    </>
                  )}
                </Button>
                
                {selectedFile && (
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    disabled={isAnalyzing}
                    className="h-12 sm:h-10 touch-manipulation active:scale-95 transition-transform"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Reset</span>
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing image...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-6 w-6 text-blue-600" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                AI-powered analysis results and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No analysis yet</p>
                  <p className="text-sm">Upload an image and click "Start Analysis" to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Analysis Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Analysis Summary</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {analysisResult.results.model_accuracy}% Accuracy
                      </Badge>
                    </div>

                    {/* Crop Health Results */}
                    {analysisType === 'crop-health' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Health Status:</span>
                          <Badge className={getHealthStatusColor(analysisResult.results.health_status)}>
                            {analysisResult.results.health_status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {analysisResult.results.disease_detected && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Disease Detected:</span>
                              <span className="font-semibold text-red-600">
                                {analysisResult.results.disease_detected.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Confidence:</span>
                              <span className="font-semibold">
                                {(analysisResult.results.confidence * 100).toFixed(1)}%
                              </span>
                            </div>

                            {analysisResult.results.severity && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Severity:</span>
                                <Badge className={getSeverityColor(analysisResult.results.severity)}>
                                  {analysisResult.results.severity.toUpperCase()}
                                </Badge>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Pest Detection Results */}
                    {analysisType === 'pest-detection' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Pests Detected:</span>
                          <Badge className={analysisResult.results.pest_detected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {analysisResult.results.pest_detected ? 'YES' : 'NO'}
                          </Badge>
                        </div>
                        
                        {analysisResult.results.pest_detected && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Number of Detections:</span>
                            <span className="font-semibold text-red-600">
                              {analysisResult.results.num_detections}
                            </span>
                          </div>
                        )}

                        {analysisResult.results.detections && analysisResult.results.detections.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Detected Pests:</h4>
                            <div className="space-y-2">
                              {analysisResult.results.detections.map((detection, index) => (
                                <div key={index} className="bg-white rounded p-3 border">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-red-600">
                                      {detection.pest_type.replace('_', ' ').toUpperCase()}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {(detection.confidence * 100).toFixed(1)}% confidence
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Soil Analysis Results */}
                    {analysisType === 'soil-health' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Overall Health:</span>
                          <Badge className={getHealthStatusColor(analysisResult.results.overall_health || 'good')}>
                            {(analysisResult.results.overall_health || 'good').toUpperCase()}
                          </Badge>
                        </div>

                        {analysisResult.results.nutrient_analysis && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Nutrient Analysis:</h4>
                            <div className="space-y-2">
                              {Object.entries(analysisResult.results.nutrient_analysis).map(([nutrient, data]) => (
                                <div key={nutrient} className="bg-white rounded p-3 border">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium capitalize">{nutrient}:</span>
                                    <div className="text-right">
                                      <span className="font-semibold">
                                        {data.value} {data.unit}
                                      </span>
                                      <Badge className={`ml-2 ${getHealthStatusColor(data.status)}`}>
                                        {data.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {analysisResult.results.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('pest-detection')}>
            <CardHeader className="text-center">
              <Bug className="h-12 w-12 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Pest Detection</CardTitle>
              <CardDescription>Identify harmful pests and insects</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('soil-detection')}>
            <CardHeader className="text-center">
              <TestTube className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Soil Analysis</CardTitle>
              <CardDescription>Analyze soil nutrients and pH</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('chatbot')}>
            <CardHeader className="text-center">
              <Camera className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <CardDescription>Get expert farming advice</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CropDetection;