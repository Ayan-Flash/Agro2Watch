import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  ExternalLink,
  Copy,
  Rocket,
  Settings,
  Shield,
  Cloud
} from 'lucide-react';

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

interface SetupCompleteProps {
  configuration: APIConfiguration;
  onExport: () => void;
  onValidateAll: () => void;
}

const SetupComplete: React.FC<SetupCompleteProps> = ({ 
  configuration, 
  onExport, 
  onValidateAll 
}) => {
  const getConfigurationStatus = () => {
    const services = [
      { name: 'Firebase', isValid: configuration.firebase.isValid, required: true },
      { name: 'Weather API', isValid: configuration.weather.isValid, required: true },
      { name: 'KYC API', isValid: configuration.kyc.isValid, required: false }
    ];

    const validServices = services.filter(s => s.isValid).length;
    const requiredServices = services.filter(s => s.required).length;
    const validRequiredServices = services.filter(s => s.required && s.isValid).length;

    return {
      services,
      validServices,
      totalServices: services.length,
      requiredServices,
      validRequiredServices,
      isComplete: validRequiredServices === requiredServices,
      completionPercentage: (validServices / services.length) * 100
    };
  };

  const status = getConfigurationStatus();

  const copyFullConfiguration = () => {
    const fullConfig = `# AgroWatch Complete Configuration
# Generated on ${new Date().toISOString()}

# ================================
# FIREBASE CONFIGURATION
# ================================
VITE_FIREBASE_PROJECT_ID=${configuration.firebase.projectId}
VITE_FIREBASE_API_KEY=${configuration.firebase.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${configuration.firebase.authDomain}
VITE_FIREBASE_STORAGE_BUCKET=${configuration.firebase.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${configuration.firebase.messagingSenderId}
VITE_FIREBASE_APP_ID=${configuration.firebase.appId}

# ================================
# WEATHER API CONFIGURATION
# ================================
VITE_WEATHER_API_KEY=${configuration.weather.apiKey}
VITE_WEATHER_API_ENDPOINT=${configuration.weather.endpoint}

# ================================
# KYC API CONFIGURATION
# ================================
VITE_KYC_API_KEY=${configuration.kyc.apiKey}
VITE_KYC_API_ENDPOINT=${configuration.kyc.endpoint}
${configuration.kyc.authToken ? `VITE_KYC_AUTH_TOKEN=${configuration.kyc.authToken}` : '# VITE_KYC_AUTH_TOKEN='}

# ================================
# ADDITIONAL SETTINGS
# ================================
NODE_ENV=production
VITE_API_BASE_URL=http://localhost:8000
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# ================================
# SECURITY SETTINGS
# ================================
# Add these for production deployment
# VITE_SECURE_COOKIES=true
# VITE_CSRF_PROTECTION=true
# VITE_RATE_LIMITING=true`;

    navigator.clipboard.writeText(fullConfig);
  };

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card className={`border-2 ${status.isComplete ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {status.isComplete ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
            <span>
              {status.isComplete ? 'Setup Complete!' : 'Setup In Progress'}
            </span>
            <Badge variant="outline" className={status.isComplete ? 'border-green-600 text-green-600' : 'border-yellow-600 text-yellow-600'}>
              {Math.round(status.completionPercentage)}% Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            {status.isComplete 
              ? 'All required services are configured and ready to use.'
              : `${status.validRequiredServices} of ${status.requiredServices} required services configured.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {status.services.map((service, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                <div className={`w-3 h-3 rounded-full ${
                  service.isValid ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    {service.required ? 'Required' : 'Optional'}
                  </p>
                </div>
                {service.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                🔥
              </div>
              <span>Firebase</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Project ID:</span>
                <span className="font-mono text-xs">{configuration.firebase.projectId || 'Not set'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={configuration.firebase.isValid ? 'default' : 'destructive'} className="text-xs">
                  {configuration.firebase.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Cloud className="h-4 w-4 text-blue-600" />
              </div>
              <span>Weather API</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Provider:</span>
                <span className="text-xs">OpenWeatherMap</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={configuration.weather.isValid ? 'default' : 'destructive'} className="text-xs">
                  {configuration.weather.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <span>KYC API</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Required:</span>
                <span className="text-xs">Optional</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant={configuration.kyc.isValid ? 'default' : 'secondary'} className="text-xs">
                  {configuration.kyc.isValid ? 'Valid' : 'Not configured'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={onValidateAll} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Validate All Services
        </Button>
        
        <Button onClick={copyFullConfiguration} variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Copy Configuration
        </Button>
        
        <Button onClick={onExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export .env File
        </Button>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>Next Steps</span>
          </CardTitle>
          <CardDescription>
            Complete these steps to deploy AgroWatch in production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">1. Environment Setup</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Copy configuration to your .env file</li>
                  <li>• Set NODE_ENV=production for production</li>
                  <li>• Configure your web server (Nginx/Apache)</li>
                  <li>• Set up SSL certificates (HTTPS)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">2. Security Hardening</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Enable CORS for your domain only</li>
                  <li>• Set up rate limiting</li>
                  <li>• Configure CSP headers</li>
                  <li>• Enable secure cookies</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">3. Monitoring & Analytics</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Set up error tracking (Sentry)</li>
                  <li>• Configure analytics (Google Analytics)</li>
                  <li>• Monitor API usage and limits</li>
                  <li>• Set up uptime monitoring</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">4. Performance Optimization</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Enable CDN for static assets</li>
                  <li>• Configure caching strategies</li>
                  <li>• Optimize images and assets</li>
                  <li>• Set up database indexing</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Deployment Checklist</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                    <li>All API keys are valid and working</li>
                    <li>Environment variables are properly set</li>
                    <li>Firebase services are configured</li>
                    <li>SSL certificate is installed</li>
                    <li>Domain is properly configured</li>
                    <li>Backup and recovery procedures are in place</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentation & Support</CardTitle>
          <CardDescription>
            Helpful resources for deployment and troubleshooting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Official Documentation</h4>
              <div className="space-y-1">
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://firebase.google.com/docs" target="_blank" rel="noopener noreferrer">
                    Firebase Documentation <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">
                    OpenWeatherMap API Docs <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://vitejs.dev/guide/env-and-mode.html" target="_blank" rel="noopener noreferrer">
                    Vite Environment Variables <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Deployment Guides</h4>
              <div className="space-y-1">
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">
                    Deploy on Vercel <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://docs.netlify.com/" target="_blank" rel="noopener noreferrer">
                    Deploy on Netlify <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href="https://docs.aws.amazon.com/amplify/" target="_blank" rel="noopener noreferrer">
                    Deploy on AWS Amplify <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Configuration Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Complete Configuration File</CardTitle>
          <CardDescription>
            Your complete .env configuration ready for production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto max-h-64">
{`# AgroWatch Production Configuration
# Generated on ${new Date().toISOString()}

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
${configuration.kyc.authToken ? `VITE_KYC_AUTH_TOKEN=${configuration.kyc.authToken}` : '# VITE_KYC_AUTH_TOKEN='}

# Production Settings
NODE_ENV=production
VITE_API_BASE_URL=https://your-api-domain.com
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupComplete;