import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Camera, Scan, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface DetectionResult {
  cropType: string;
  confidence: number;
  healthStatus: 'healthy' | 'diseased' | 'stressed';
  diseases: string[];
  recommendations: string[];
}

export const CropDetection = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DetectionResult | null>(null);

  const mockAnalysis = (): DetectionResult => {
    const cropTypes = ['Rice', 'Coconut', 'Pepper', 'Cardamom', 'Banana'];
    const diseases = ['Leaf Blight', 'Fungal Infection', 'Nutrient Deficiency', 'Pest Damage'];
    const recommendations = [
      'Apply organic fertilizer',
      'Increase irrigation frequency',
      'Use bio-pesticide spray',
      'Improve drainage system'
    ];

    return {
      cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
      confidence: Math.floor(Math.random() * 30) + 70,
      healthStatus: Math.random() > 0.5 ? 'healthy' : Math.random() > 0.5 ? 'diseased' : 'stressed',
      diseases: diseases.slice(0, Math.floor(Math.random() * 3) + 1),
      recommendations: recommendations.slice(0, Math.floor(Math.random() * 2) + 2)
    };
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const result = mockAnalysis();
    setResults(result);
    setIsAnalyzing(false);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'diseased': return 'text-red-600 bg-red-50';
      case 'stressed': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'diseased': return AlertTriangle;
      case 'stressed': return AlertTriangle;
      default: return Scan;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Scan className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold">Crop Detection & Analysis</h2>
        <Badge variant="outline">AI-Powered</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload Crop Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected crop"
                  className="max-w-full max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Click to upload crop image</p>
                    <p className="text-sm text-gray-500">വിള ചിത്രം അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക</p>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex gap-2">
              <Button
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className="flex-1"
              >
                <Scan className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Crop'}
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing image...</span>
                  <span>AI Analysis in progress</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <div>
                    <p className="font-semibold">Detected Crop</p>
                    <p className="text-lg">{results.cropType}</p>
                  </div>
                  <Badge variant="secondary">{results.confidence}% confidence</Badge>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg ${getHealthColor(results.healthStatus)}`}>
                  {(() => {
                    const Icon = getHealthIcon(results.healthStatus);
                    return <Icon className="w-5 h-5" />;
                  })()}
                  <div>
                    <p className="font-semibold">Health Status</p>
                    <p className="capitalize">{results.healthStatus}</p>
                  </div>
                </div>

                {results.diseases.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Detected Issues:</h4>
                    <div className="space-y-1">
                      {results.diseases.map((disease, index) => (
                        <Badge key={index} variant="destructive" className="mr-2">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Scan className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Upload and analyze an image to see results</p>
                <p className="text-sm">ഫലങ്ങൾ കാണാൻ ഒരു ചിത്രം അപ്‌ലോഡ് ചെയ്ത് വിശകലനം ചെയ്യുക</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Real-time Detection</h3>
            <p className="text-sm text-gray-600">Use camera for live analysis</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Disease Database</h3>
            <p className="text-sm text-gray-600">Comprehensive disease library</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Early Warning</h3>
            <p className="text-sm text-gray-600">Prevent crop diseases</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};