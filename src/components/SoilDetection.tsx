import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Mountain, Beaker, Droplets, Thermometer } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface SoilAnalysis {
  soilType: string;
  ph: number;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  fertility: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export const SoilDetection = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SoilAnalysis | null>(null);

  const mockSoilAnalysis = (): SoilAnalysis => {
    const soilTypes = ['Laterite Soil', 'Alluvial Soil', 'Red Soil', 'Black Soil', 'Coastal Soil'];
    const recommendations = [
      'Add organic compost to improve soil structure',
      'Apply lime to adjust pH levels',
      'Increase nitrogen fertilizer application',
      'Improve drainage to prevent waterlogging',
      'Add phosphorus-rich fertilizers',
      'Use potassium supplements for better crop yield',
      'Implement crop rotation practices'
    ];

    return {
      soilType: soilTypes[Math.floor(Math.random() * soilTypes.length)],
      ph: Math.round((Math.random() * 4 + 4) * 10) / 10, // 4.0 - 8.0
      moisture: Math.floor(Math.random() * 40) + 30, // 30-70%
      nitrogen: Math.floor(Math.random() * 50) + 20, // 20-70 ppm
      phosphorus: Math.floor(Math.random() * 30) + 10, // 10-40 ppm
      potassium: Math.floor(Math.random() * 100) + 50, // 50-150 ppm
      organicMatter: Math.round((Math.random() * 3 + 1) * 10) / 10, // 1.0-4.0%
      fertility: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 2)
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

  const analyzeSoil = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const result = mockSoilAnalysis();
    setResults(result);
    setIsAnalyzing(false);
  };

  const getFertilityColor = (fertility: string) => {
    switch (fertility) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getParameterStatus = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return 'optimal';
    if (value < min) return 'low';
    return 'high';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600';
      case 'low': return 'text-red-600';
      case 'high': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Mountain className="w-6 h-6 text-brown-600" />
        <h2 className="text-2xl font-bold">Soil Analysis & Testing</h2>
        <Badge variant="outline">Spectral Analysis</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Soil Sample Image
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
                  alt="Selected soil sample"
                  className="max-w-full max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-4">
                  <Mountain className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Click to upload soil image</p>
                    <p className="text-sm text-gray-500">മണ്ണിന്റെ ചിത്രം അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യുക</p>
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
                onClick={analyzeSoil}
                disabled={!selectedImage || isAnalyzing}
                className="flex-1"
              >
                <Beaker className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing Soil...' : 'Analyze Soil'}
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
                  <span>Processing soil sample...</span>
                  <span>Spectral analysis in progress</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5" />
              Soil Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <p className="font-semibold">Soil Type</p>
                    <p className="text-lg">{results.soilType}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${getFertilityColor(results.fertility)}`}>
                    <p className="font-semibold">Fertility Level</p>
                    <p className="text-lg capitalize">{results.fertility}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Chemical Properties:</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>pH Level:</span>
                      <span className={getStatusColor(getParameterStatus(results.ph, 6.0, 7.5))}>
                        {results.ph}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moisture:</span>
                      <span className={getStatusColor(getParameterStatus(results.moisture, 40, 60))}>
                        {results.moisture}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nitrogen (N):</span>
                      <span className={getStatusColor(getParameterStatus(results.nitrogen, 30, 50))}>
                        {results.nitrogen} ppm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phosphorus (P):</span>
                      <span className={getStatusColor(getParameterStatus(results.phosphorus, 15, 25))}>
                        {results.phosphorus} ppm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potassium (K):</span>
                      <span className={getStatusColor(getParameterStatus(results.potassium, 80, 120))}>
                        {results.potassium} ppm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Organic Matter:</span>
                      <span className={getStatusColor(getParameterStatus(results.organicMatter, 2.0, 3.5))}>
                        {results.organicMatter}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Beaker className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Mountain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Upload a soil sample image to see analysis results</p>
                <p className="text-sm">വിശകലന ഫലങ്ങൾ കാണാൻ മണ്ണിന്റെ സാമ്പിൾ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Soil Testing Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Beaker className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">NPK Analysis</h3>
            <p className="text-sm text-gray-600">Nitrogen, Phosphorus, Potassium</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">pH Testing</h3>
            <p className="text-sm text-gray-600">Soil acidity levels</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Thermometer className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold">Moisture Content</h3>
            <p className="text-sm text-gray-600">Water retention analysis</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Mountain className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Organic Matter</h3>
            <p className="text-sm text-gray-600">Soil fertility assessment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};