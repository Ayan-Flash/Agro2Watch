import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff,
  RefreshCw,
  HelpCircle,
  Shield,
  Users
} from 'lucide-react';

interface KYCConfig {
  apiKey: string;
  endpoint: string;
  authToken: string;
  isValid: boolean;
}

interface KYCSetupProps {
  configuration: KYCConfig;
  onUpdate: (updates: Partial<KYCConfig>) => void;
}

const KYCSetup: React.FC<KYCSetupProps> = ({ configuration, onUpdate }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('custom');

  const kycProviders = [
    {
      id: 'aadhaarapi',
      name: 'AadhaarAPI.com',
      description: 'Popular Aadhaar verification service',
      website: 'https://aadhaarapi.com',
      endpoint: 'https://api.aadhaarapi.com/v1'
    },
    {
      id: 'signzy',
      name: 'Signzy',
      description: 'Digital onboarding platform',
      website: 'https://signzy.com',
      endpoint: 'https://api.signzy.com/v2'
    },
    {
      id: 'hyperverge',
      name: 'HyperVerge',
      description: 'AI-powered identity verification',
      website: 'https://hyperverge.co',
      endpoint: 'https://api.hyperverge.co/v1'
    },
    {
      id: 'custom',
      name: 'Custom Provider',
      description: 'Use your own KYC service',
      website: '',
      endpoint: ''
    }
  ];

  const validateKYCAPI = async () => {
    setIsValidating(true);
    setValidationMessage('');

    try {
      if (!configuration.apiKey || !configuration.endpoint) {
        throw new Error('API Key and Endpoint are required');
      }

      // Test the KYC API configuration
      const response = await fetch('/api/v1/configuration/validate-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuration),
      });

      const result = await response.json();

      if (result.valid) {
        setValidationMessage('KYC API configuration is valid!');
        onUpdate({ isValid: true });
      } else {
        setValidationMessage(result.error || 'Invalid KYC API configuration');
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

  const handleInputChange = (field: keyof KYCConfig, value: string) => {
    onUpdate({ [field]: value, isValid: false });
    setValidationMessage('');
  };

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = kycProviders.find(p => p.id === providerId);
    if (provider && provider.endpoint) {
      handleInputChange('endpoint', provider.endpoint);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">KYC API for Aadhaar Verification</h4>
            <p className="text-sm text-blue-800 mt-2">
              KYC (Know Your Customer) APIs are used to verify Aadhaar numbers for government scheme eligibility 
              and farmer authentication. Choose from popular providers or use your custom service.
            </p>
            <div className="mt-3">
              <p className="text-sm font-medium text-blue-900">Required for:</p>
              <ul className="text-sm text-blue-800 mt-1 space-y-1 list-disc list-inside ml-4">
                <li>Government scheme eligibility verification</li>
                <li>Farmer identity authentication</li>
                <li>Subsidy claim validation</li>
                <li>Digital KYC compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>KYC Service Provider</span>
          </CardTitle>
          <CardDescription>
            Select your KYC service provider or configure a custom one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kycProviders.map((provider) => (
              <Card 
                key={provider.id}
                className={`cursor-pointer transition-colors ${
                  selectedProvider === provider.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleProviderChange(provider.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{provider.name}</h4>
                    {selectedProvider === provider.id && (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
                  {provider.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={provider.website} target="_blank" rel="noopener noreferrer">
                        Visit Website <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your KYC API credentials
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
                  placeholder="your-kyc-api-key"
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
                Your KYC service API key
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint *</Label>
              <Input
                id="endpoint"
                value={configuration.endpoint}
                onChange={(e) => handleInputChange('endpoint', e.target.value)}
                placeholder="https://api.yourprovider.com/v1"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                KYC service API base URL
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="authToken">Authentication Token</Label>
              <div className="relative">
                <Input
                  id="authToken"
                  type={showAuthToken ? 'text' : 'password'}
                  value={configuration.authToken}
                  onChange={(e) => handleInputChange('authToken', e.target.value)}
                  placeholder="Bearer token or additional auth (optional)"
                  className="font-mono text-sm pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowAuthToken(!showAuthToken)}
                >
                  {showAuthToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Additional authentication token if required by your provider
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={validateKYCAPI}
          disabled={isValidating || !configuration.apiKey || !configuration.endpoint}
          className="flex items-center space-x-2"
        >
          {isValidating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span>{isValidating ? 'Validating...' : 'Test KYC API'}</span>
        </Button>

        {configuration.isValid && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            API Configured
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

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security & Compliance</CardTitle>
          <CardDescription>
            Important security considerations for KYC implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Security Requirements:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside ml-4">
                    <li>Never store Aadhaar numbers in plain text</li>
                    <li>Use HTTPS for all API communications</li>
                    <li>Implement proper error handling</li>
                    <li>Log access attempts for audit trails</li>
                    <li>Follow UIDAI guidelines for Aadhaar usage</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Compliance Checklist:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside ml-4">
                    <li>Obtain user consent before verification</li>
                    <li>Display purpose of Aadhaar collection</li>
                    <li>Implement data retention policies</li>
                    <li>Provide opt-out mechanisms</li>
                    <li>Regular security audits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables Preview */}
      {configuration.apiKey && configuration.endpoint && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables</CardTitle>
            <CardDescription>
              Add these to your .env file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`VITE_KYC_API_KEY=${configuration.apiKey}
VITE_KYC_API_ENDPOINT=${configuration.endpoint}${configuration.authToken ? `
VITE_KYC_AUTH_TOKEN=${configuration.authToken}` : ''}`}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => copyToClipboard(`VITE_KYC_API_KEY=${configuration.apiKey}
VITE_KYC_API_ENDPOINT=${configuration.endpoint}${configuration.authToken ? `
VITE_KYC_AUTH_TOKEN=${configuration.authToken}` : ''}`)}
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
            Example code for Aadhaar verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// KYC Verification Service
const verifyAadhaar = async (aadhaarNumber, otp) => {
  const apiKey = import.meta.env.VITE_KYC_API_KEY;
  const endpoint = import.meta.env.VITE_KYC_API_ENDPOINT;
  const authToken = import.meta.env.VITE_KYC_AUTH_TOKEN;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  };
  
  if (authToken) {
    headers['X-Auth-Token'] = authToken;
  }
  
  const response = await fetch(\`\${endpoint}/verify\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      aadhaar_number: aadhaarNumber,
      otp: otp
    })
  });
  
  return response.json();
};

// Usage with proper error handling
try {
  const result = await verifyAadhaar('1234-5678-9012', '123456');
  if (result.verified) {
    console.log('Aadhaar verified:', result.name);
  }
} catch (error) {
  console.error('Verification failed:', error);
}`}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => copyToClipboard(`// KYC Verification Service
const verifyAadhaar = async (aadhaarNumber, otp) => {
  const apiKey = import.meta.env.VITE_KYC_API_KEY;
  const endpoint = import.meta.env.VITE_KYC_API_ENDPOINT;
  const authToken = import.meta.env.VITE_KYC_AUTH_TOKEN;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  };
  
  if (authToken) {
    headers['X-Auth-Token'] = authToken;
  }
  
  const response = await fetch(\`\${endpoint}/verify\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      aadhaar_number: aadhaarNumber,
      otp: otp
    })
  });
  
  return response.json();
};

// Usage with proper error handling
try {
  const result = await verifyAadhaar('1234-5678-9012', '123456');
  if (result.verified) {
    console.log('Aadhaar verified:', result.name);
  }
} catch (error) {
  console.error('Verification failed:', error);
}`)}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy Code
          </Button>
        </CardContent>
      </Card>

      {/* Testing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testing & Development</CardTitle>
          <CardDescription>
            Information for testing KYC integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Test Aadhaar Numbers</h4>
              <p className="text-sm text-gray-600 mb-2">
                Most KYC providers offer test Aadhaar numbers for development:
              </p>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                Test Number: 1234-5678-9012<br />
                Test OTP: 123456
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Development Mode</h4>
              <p className="text-sm text-gray-600">
                Enable sandbox/test mode in your KYC provider dashboard to avoid charges during development.
                Most providers offer free test transactions.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Production Considerations:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside ml-4">
                    <li>Switch to production API endpoints</li>
                    <li>Update API keys to production keys</li>
                    <li>Implement rate limiting and caching</li>
                    <li>Set up monitoring and alerts</li>
                    <li>Review and test error handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCSetup;