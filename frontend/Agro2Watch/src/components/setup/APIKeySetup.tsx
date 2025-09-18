import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  ArrowRight, 
  ArrowLeft,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useTranslation } from '@/lib/translations';
import FirebaseSetup from './FirebaseSetup';
import WeatherSetup from './WeatherSetup';
import KYCSetup from './KYCSetup';
import SetupComplete from './SetupComplete';

interface APIConfiguration {
  firebase: {
    projectId: string;
    apiKey: string;
    authDomain: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    isValid: boolean;
  };
  weather: {
    apiKey: string;
    endpoint: string;
    isValid: boolean;
  };
  kyc: {
    apiKey: string;
    endpoint: string;
    authToken: string;
    isValid: boolean;
  };
}

interface APIKeySetupProps {
  onComplete?: (config: APIConfiguration) => void;
  onClose?: () => void;
}

export const APIKeySetup: React.FC<APIKeySetupProps> = ({ onComplete, onClose }) => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [configuration, setConfiguration] = useState<APIConfiguration>({
    firebase: {
      projectId: '',
      apiKey: '',
      authDomain: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      isValid: false
    },
    weather: {
      apiKey: '',
      endpoint: 'https://api.openweathermap.org/data/2.5',
      isValid: false
    },
    kyc: {
      apiKey: '',
      endpoint: '',
      authToken: '',
      isValid: false
    }
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to AgroWatch Setup',
      description: 'Configure your API keys for full functionality',
      component: 'welcome'
    },
    {
      id: 'firebase',
      title: 'Firebase Configuration',
      description: 'Set up authentication and database',
      component: 'firebase'
    },
    {
      id: 'weather',
      title: 'Weather API Setup',
      description: 'Configure weather data service',
      component: 'weather'
    },
    {
      id: 'kyc',
      title: 'KYC API Configuration',
      description: 'Set up Aadhaar verification service',
      component: 'kyc'
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'Review and finalize configuration',
      component: 'complete'
    }
  ];

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('agrowatch_api_config');
    if (savedConfig) {
      try {
        setConfiguration(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error loading saved configuration:', error);
      }
    }
  }, []);

  const updateConfiguration = (service: keyof APIConfiguration, updates: Partial<APIConfiguration[keyof APIConfiguration]>) => {
    setConfiguration(prev => {
      const newConfig = {
        ...prev,
        [service]: {
          ...prev[service],
          ...updates
        }
      };
      
      // Save to localStorage
      localStorage.setItem('agrowatch_api_config', JSON.stringify(newConfig));
      
      return newConfig;
    });
  };

  const validateAllServices = async () => {
    try {
      const response = await fetch('/api/v1/configuration/validate-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuration),
      });

      if (response.ok) {
        const validationResults = await response.json();
        
        // Update validation status for each service
        Object.keys(validationResults).forEach(service => {
          updateConfiguration(service as keyof APIConfiguration, {
            isValid: validationResults[service].valid
          });
        });
      }
    } catch (error) {
      console.error('Error validating services:', error);
    }
  };

  const exportConfiguration = () => {
    const configText = `# AgroWatch API Configuration
# Copy these values to your .env file

# Firebase Configuration
VITE_FIREBASE_PROJECT_ID=${configuration.firebase.projectId}
VITE_FIREBASE_API_KEY=${configuration.firebase.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${configuration.firebase.authDomain}
VITE_FIREBASE_STORAGE_BUCKET=${configuration.firebase.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${configuration.firebase.messagingSenderId}
VITE_FIREBASE_APP_ID=${configuration.firebase.appId}

# Weather API Configuration
VITE_WEATHER_API_KEY=${configuration.weather.apiKey}
VITE_WEATHER_API_ENDPOINT=${configuration.weather.endpoint}

# KYC API Configuration
VITE_KYC_API_KEY=${configuration.kyc.apiKey}
VITE_KYC_API_ENDPOINT=${configuration.kyc.endpoint}
VITE_KYC_AUTH_TOKEN=${configuration.kyc.authToken}
`;

    const blob = new Blob([configText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agrowatch-config.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const newConfig = { ...configuration };

        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            const cleanKey = key.trim().replace('VITE_', '');
            const cleanValue = value.trim();

            switch (cleanKey) {
              case 'FIREBASE_PROJECT_ID':
                newConfig.firebase.projectId = cleanValue;
                break;
              case 'FIREBASE_API_KEY':
                newConfig.firebase.apiKey = cleanValue;
                break;
              case 'FIREBASE_AUTH_DOMAIN':
                newConfig.firebase.authDomain = cleanValue;
                break;
              case 'FIREBASE_STORAGE_BUCKET':
                newConfig.firebase.storageBucket = cleanValue;
                break;
              case 'FIREBASE_MESSAGING_SENDER_ID':
                newConfig.firebase.messagingSenderId = cleanValue;
                break;
              case 'FIREBASE_APP_ID':
                newConfig.firebase.appId = cleanValue;
                break;
              case 'WEATHER_API_KEY':
                newConfig.weather.apiKey = cleanValue;
                break;
              case 'WEATHER_API_ENDPOINT':
                newConfig.weather.endpoint = cleanValue;
                break;
              case 'KYC_API_KEY':
                newConfig.kyc.apiKey = cleanValue;
                break;
              case 'KYC_API_ENDPOINT':
                newConfig.kyc.endpoint = cleanValue;
                break;
              case 'KYC_AUTH_TOKEN':
                newConfig.kyc.authToken = cleanValue;
                break;
            }
          }
        });

        setConfiguration(newConfig);
      };
      reader.readAsText(file);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getOverallProgress = () => {
    const totalSteps = steps.length - 1; // Exclude welcome step
    const completedSteps = [
      configuration.firebase.isValid,
      configuration.weather.isValid,
      configuration.kyc.isValid
    ].filter(Boolean).length;
    
    return (completedSteps / 3) * 100;
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: return true; // Welcome step
      case 1: return configuration.firebase.isValid;
      case 2: return configuration.weather.isValid;
      case 3: return configuration.kyc.isValid;
      default: return true;
    }
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to AgroWatch API Setup
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          To unlock the full potential of AgroWatch, you'll need to configure API keys for various services. 
          This setup wizard will guide you through each step with detailed instructions and validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              🔥
            </div>
            <CardTitle className="text-lg">Firebase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Authentication, database, and file storage for user data and crop images.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              🌤️
            </div>
            <CardTitle className="text-lg">Weather API</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Real-time weather data and forecasts for location-based farming advice.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              🆔
            </div>
            <CardTitle className="text-lg">KYC API</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Aadhaar verification for government scheme eligibility and farmer authentication.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Before You Start</h4>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• Have your Firebase project ready</li>
              <li>• Sign up for OpenWeatherMap API (free tier available)</li>
              <li>• Obtain KYC service credentials from your provider</li>
              <li>• Keep your API keys secure and never share them publicly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (steps[currentStep].component) {
      case 'welcome':
        return renderWelcomeStep();
      case 'firebase':
        return (
          <FirebaseSetup
            configuration={configuration.firebase}
            onUpdate={(updates) => updateConfiguration('firebase', updates)}
          />
        );
      case 'weather':
        return (
          <WeatherSetup
            configuration={configuration.weather}
            onUpdate={(updates) => updateConfiguration('weather', updates)}
          />
        );
      case 'kyc':
        return (
          <KYCSetup
            configuration={configuration.kyc}
            onUpdate={(updates) => updateConfiguration('kyc', updates)}
          />
        );
      case 'complete':
        return (
          <SetupComplete
            configuration={configuration}
            onExport={exportConfiguration}
            onValidateAll={validateAllServices}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">API Configuration</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Progress</span>
              <span>{Math.round(getOverallProgress())}% Complete</span>
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  getStepStatus(index) === 'completed' 
                    ? 'bg-green-600 border-green-600 text-white'
                    : getStepStatus(index) === 'current'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {getStepStatus(index) === 'completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    getStepStatus(index) === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="text-center" style={{ width: '120px' }}>
                <p className="text-xs font-medium text-gray-900">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{steps[currentStep].title}</span>
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Badge variant={canProceedToNext() ? 'default' : 'secondary'}>
                  {canProceedToNext() ? 'Configured' : 'Pending'}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {/* Import/Export Controls */}
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".env,.txt"
                onChange={importConfiguration}
                className="hidden"
                id="import-config"
              />
              <label htmlFor="import-config">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </label>
              
              <Button variant="outline" size="sm" onClick={exportConfiguration}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm" onClick={validateAllServices}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Validate All
              </Button>
            </div>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNext() && currentStep > 0}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => onComplete?.(configuration)}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Setup
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-600"
          >
            {showAdvanced ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>
          
          {showAdvanced && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Advanced Configuration</CardTitle>
                <CardDescription>
                  Additional settings for development and debugging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Environment Variables</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# Development Mode
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:8000

# Debug Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true`}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Configuration Status</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                          configuration.firebase.isValid ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <p className="text-xs">Firebase</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                          configuration.weather.isValid ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <p className="text-xs">Weather</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                          configuration.kyc.isValid ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <p className="text-xs">KYC</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIKeySetup;