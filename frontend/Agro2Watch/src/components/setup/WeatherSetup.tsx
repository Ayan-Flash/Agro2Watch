import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff,
  RefreshCw,
  HelpCircle,
  Cloud,
  MapPin
} from 'lucide-react';

interface WeatherConfig {
  apiKey: string;
  endpoint: string;
  isValid: boolean;
}

interface WeatherSetupProps {
  configuration: WeatherConfig;
  onUpdate: (updates: Partial<WeatherConfig>) => void;
}

const WeatherSetup: React.FC<WeatherSetupProps> = ({ configuration, onUpdate }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [testLocation, setTestLocation] = useState('Delhi, IN');
  const [weatherData, setWeatherData] = useState<any>(null);

  const validateWeatherAPI = async () => {
    setIsValidating(true);
    setValidationMessage('');
    setWeatherData(null);

    try {
      if (!configuration.apiKey) {
        throw new Error('API Key is required');
      }

      // Test the API key with a sample request
      const response = await fetch('/api/v1/configuration/validate-weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...configuration,
          testLocation
        }),
      });

      const result = await response.json();

      if (result.valid) {
        setValidationMessage('Weather API is working correctly!');
        setWeatherData(result.data);
        onUpdate({ isValid: true });
      } else {
        setValidationMessage(result.error || 'Invalid Weather API configuration');
        onUpdate({ isValid: false });
      }
    } catch (error) {
      setValidationMessage(error instanceof Error ? error.message : 'Validation failed');
      onUpdate({ isValid: false });
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleInputChange = (field: keyof WeatherConfig, value: string) => {
    onUpdate({ [field]: value, isValid: false });
    setValidationMessage('');
    setWeatherData(null);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">How to Get OpenWeatherMap API Key</h4>
            <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">OpenWeatherMap API</a></li>
              <li>Click "Sign Up" and create a free account</li>
              <li>Verify your email address</li>
              <li>Go to <a href="https://home.openweathermap.org/api_keys" target="_blank" rel="noopener noreferrer" className="underline">API Keys</a> section</li>
              <li>Copy your default API key or generate a new one</li>
              <li>Wait 10-15 minutes for the key to activate</li>
            </ol>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5" />
            <span>Weather API Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your OpenWeatherMap API credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={configuration.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="your-api-key-here"
                  className="font-mono text-sm pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Your OpenWeatherMap API key
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                value={configuration.endpoint}
                onChange={(e) => handleInputChange('endpoint', e.target.value)}
                placeholder="https://api.openweathermap.org/data/2.5"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                OpenWeatherMap API base URL
              </p>
            </div>
          </div>

          {/* Test Location */}
          <div className="space-y-2">
            <Label htmlFor="testLocation">Test Location</Label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  id="testLocation"
                  value={testLocation}
                  onChange={(e) => setTestLocation(e.target.value)}
                  placeholder="City, Country Code (e.g., Delhi, IN)"
                  className="pl-8"
                />
                <MapPin className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Location to test the weather API (format: City, Country Code)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={validateWeatherAPI}
          disabled={isValidating || !configuration.apiKey}
          className="flex items-center space-x-2"
        >
          {isValidating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span>{isValidating ? 'Testing API...' : 'Test Weather API'}</span>
        </Button>

        {configuration.isValid && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            API Working
          </Badge>
        )}
      </div>

      {validationMessage && (
        <div className={`p-3 rounded-lg border ${
          configuration.isValid 
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {configuration.isValid ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{validationMessage}</span>
          </div>
        </div>
      )}

      {/* Weather Data Preview */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Test Result</CardTitle>
            <CardDescription>
              Sample weather data from {testLocation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{Math.round(weatherData.main?.temp || 0)}°C</p>
                <p className="text-sm text-gray-600">Temperature</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{weatherData.main?.humidity || 0}%</p>
                <p className="text-sm text-gray-600">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold capitalize">{weatherData.weather?.[0]?.description || 'N/A'}</p>
                <p className="text-sm text-gray-600">Condition</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{weatherData.wind?.speed || 0} m/s</p>
                <p className="text-sm text-gray-600">Wind Speed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API Usage & Limits</CardTitle>
          <CardDescription>
            Important information about OpenWeatherMap API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-600">Free Plan</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• 1,000 API calls/day</li>
                  <li>• 60 calls/minute</li>
                  <li>• Current weather data</li>
                  <li>• 5-day forecast</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-600">Paid Plans</h4>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  <li>• Up to 2M calls/month</li>
                  <li>• Historical weather data</li>
                  <li>• Weather maps</li>
                  <li>• Advanced forecasts</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important Notes:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• New API keys take 10-15 minutes to activate</li>
                    <li>• Monitor your usage to avoid exceeding limits</li>
                    <li>• Use caching to reduce API calls in production</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables Preview */}
      {configuration.apiKey && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables</CardTitle>
            <CardDescription>
              Add these to your .env file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`VITE_WEATHER_API_KEY=${configuration.apiKey}
VITE_WEATHER_API_ENDPOINT=${configuration.endpoint}`}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => copyToClipboard(`VITE_WEATHER_API_KEY=${configuration.apiKey}
VITE_WEATHER_API_ENDPOINT=${configuration.endpoint}`)}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sample Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sample Implementation</CardTitle>
          <CardDescription>
            Example code for using the Weather API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// Weather API Service
const getWeatherData = async (city, countryCode) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const endpoint = import.meta.env.VITE_WEATHER_API_ENDPOINT;
  
  const response = await fetch(
    \`\${endpoint}/weather?q=\${city},\${countryCode}&appid=\${apiKey}&units=metric\`
  );
  
  return response.json();
};

// Usage
const weather = await getWeatherData('Delhi', 'IN');
console.log(\`Temperature: \${weather.main.temp}°C\`);`}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => copyToClipboard(`// Weather API Service
const getWeatherData = async (city, countryCode) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const endpoint = import.meta.env.VITE_WEATHER_API_ENDPOINT;
  
  const response = await fetch(
    \`\${endpoint}/weather?q=\${city},\${countryCode}&appid=\${apiKey}&units=metric\`
  );
  
  return response.json();
};

// Usage
const weather = await getWeatherData('Delhi', 'IN');
console.log(\`Temperature: \${weather.main.temp}°C\`);`)}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherSetup;