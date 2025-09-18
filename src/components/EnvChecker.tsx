import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Settings } from 'lucide-react';

export const EnvChecker: React.FC = () => {
  const envVars = {
    'VITE_TWILIO_ACCOUNT_SID': import.meta.env.VITE_TWILIO_ACCOUNT_SID,
    'VITE_TWILIO_AUTH_TOKEN': import.meta.env.VITE_TWILIO_AUTH_TOKEN,
    'VITE_TWILIO_MESSAGING_SERVICE_SID': import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID,
    'VITE_TWILIO_FROM_NUMBER': import.meta.env.VITE_TWILIO_FROM_NUMBER,
    'VITE_TWILIO_VERIFY_SERVICE_SID': import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID,
    'VITE_BACKEND_URL': import.meta.env.VITE_BACKEND_URL,
    'VITE_FIREBASE_API_KEY': import.meta.env.VITE_FIREBASE_API_KEY,
    'VITE_FIREBASE_AUTH_DOMAIN': import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    'VITE_FIREBASE_PROJECT_ID': import.meta.env.VITE_FIREBASE_PROJECT_ID,
  };

  const requiredVars = [
    'VITE_TWILIO_ACCOUNT_SID',
    'VITE_TWILIO_AUTH_TOKEN'
  ];

  const optionalVars = [
    'VITE_TWILIO_MESSAGING_SERVICE_SID',
    'VITE_TWILIO_FROM_NUMBER',
    'VITE_TWILIO_VERIFY_SERVICE_SID'
  ];

  const hasRequiredVars = requiredVars.every(varName => !!envVars[varName as keyof typeof envVars]);
  const hasOptionalVars = optionalVars.some(varName => !!envVars[varName as keyof typeof envVars]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Environment Variables Checker</h1>
        <p className="text-gray-600">
          Check if all required environment variables are set
        </p>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant={hasRequiredVars ? "default" : "destructive"}>
              {hasRequiredVars ? "✓" : "✗"} Required Variables
            </Badge>
            <Badge variant={hasOptionalVars ? "default" : "secondary"}>
              {hasOptionalVars ? "✓" : "✗"} Optional Variables
            </Badge>
          </div>

          {!hasRequiredVars && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Missing required environment variables. Please set VITE_TWILIO_ACCOUNT_SID and VITE_TWILIO_AUTH_TOKEN.
              </AlertDescription>
            </Alert>
          )}

          {hasRequiredVars && !hasOptionalVars && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Required variables are set, but no optional variables found. Consider setting VITE_TWILIO_MESSAGING_SERVICE_SID or VITE_TWILIO_FROM_NUMBER for better functionality.
              </AlertDescription>
            </Alert>
          )}

          {hasRequiredVars && hasOptionalVars && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All configuration looks good! Twilio should work properly.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Required Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Required Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredVars.map(varName => {
              const value = envVars[varName as keyof typeof envVars];
              const isSet = !!value;
              return (
                <div key={varName} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-mono text-sm">{varName}</div>
                    <div className="text-xs text-gray-500">
                      {isSet ? 'Set' : 'Not set'}
                    </div>
                  </div>
                  <Badge variant={isSet ? "default" : "destructive"}>
                    {isSet ? "✓" : "✗"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optional Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Optional Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optionalVars.map(varName => {
              const value = envVars[varName as keyof typeof envVars];
              const isSet = !!value;
              return (
                <div key={varName} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-mono text-sm">{varName}</div>
                    <div className="text-xs text-gray-500">
                      {isSet ? 'Set' : 'Not set'}
                    </div>
                  </div>
                  <Badge variant={isSet ? "default" : "secondary"}>
                    {isSet ? "✓" : "✗"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Other Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Other Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(envVars)
              .filter(([key]) => !requiredVars.includes(key) && !optionalVars.includes(key))
              .map(([varName, value]) => {
                const isSet = !!value;
                return (
                  <div key={varName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-mono text-sm">{varName}</div>
                      <div className="text-xs text-gray-500">
                        {isSet ? 'Set' : 'Not set'}
                      </div>
                    </div>
                    <Badge variant={isSet ? "default" : "secondary"}>
                      {isSet ? "✓" : "✗"}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Create .env file</h4>
                <p className="text-sm text-gray-600">Create a .env file in your project root with the required variables.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Add Twilio Credentials</h4>
                <p className="text-sm text-gray-600">Get your Account SID and Auth Token from Twilio Console.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Restart Development Server</h4>
                <p className="text-sm text-gray-600">Restart your development server after adding environment variables.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Example .env file:</h4>
            <pre className="text-sm bg-white p-3 rounded border overflow-auto">
{`# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=your_account_sid_here
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid_here
VITE_TWILIO_FROM_NUMBER=+1234567890
VITE_TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid_here

# Backend URL (for development)
VITE_BACKEND_URL=http://localhost:8001`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
