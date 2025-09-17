import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface FirebaseConfig {
  projectId: string;
  apiKey: string;
  authDomain: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isValid: boolean;
}

interface FirebaseSetupProps {
  configuration: FirebaseConfig;
  onUpdate: (updates: Partial<FirebaseConfig>) => void;
}

const FirebaseSetup: React.FC<FirebaseSetupProps> = ({ configuration, onUpdate }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const validateFirebaseConfig = async () => {
    setIsValidating(true);
    setValidationMessage('');

    try {
      // Basic validation first
      if (!configuration.projectId || !configuration.apiKey) {
        throw new Error('Project ID and API Key are required');
      }

      // Test Firebase configuration
      const response = await fetch('/api/v1/configuration/validate-firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuration),
      });

      const result = await response.json();

      if (result.valid) {
        setValidationMessage('Firebase configuration is valid!');
        onUpdate({ isValid: true });
      } else {
        setValidationMessage(result.error || 'Invalid Firebase configuration');
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

  const handleInputChange = (field: keyof FirebaseConfig, value: string) => {
    onUpdate({ [field]: value, isValid: false });
    setValidationMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">How to Get Firebase Configuration</h4>
            <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
              <li>Create a new project or select an existing one</li>
              <li>Click on "Project Settings" (gear icon)</li>
              <li>Scroll down to "Your apps" section</li>
              <li>Click "Add app" and select "Web" (if not already created)</li>
              <li>Copy the configuration values from the code snippet</li>
            </ol>
          </div>
        </div>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="json">JSON Import</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          {/* Configuration Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID *</Label>
              <Input
                id="projectId"
                value={configuration.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                placeholder="your-project-id"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Found in Project Settings → General tab
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={configuration.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="AIzaSyC..."
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
                Web API Key from Firebase config
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="authDomain">Auth Domain</Label>
              <Input
                id="authDomain"
                value={configuration.authDomain}
                onChange={(e) => handleInputChange('authDomain', e.target.value)}
                placeholder="your-project.firebaseapp.com"
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageBucket">Storage Bucket</Label>
              <Input
                id="storageBucket"
                value={configuration.storageBucket}
                onChange={(e) => handleInputChange('storageBucket', e.target.value)}
                placeholder="your-project.appspot.com"
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
              <Input
                id="messagingSenderId"
                value={configuration.messagingSenderId}
                onChange={(e) => handleInputChange('messagingSenderId', e.target.value)}
                placeholder="123456789012"
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appId">App ID</Label>
              <Input
                id="appId"
                value={configuration.appId}
                onChange={(e) => handleInputChange('appId', e.target.value)}
                placeholder="1:123456789012:web:abcdef123456"
                className="font-mono text-sm"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="json" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Import Firebase Configuration</CardTitle>
              <CardDescription>
                Paste your Firebase configuration object here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  className="w-full h-48 p-3 border rounded-md font-mono text-sm"
                  placeholder={`{
  "projectId": "your-project-id",
  "apiKey": "AIzaSyC...",
  "authDomain": "your-project.firebaseapp.com",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:abcdef123456"
}`}
                  onChange={(e) => {
                    try {
                      const config = JSON.parse(e.target.value);
                      onUpdate({
                        projectId: config.projectId || '',
                        apiKey: config.apiKey || '',
                        authDomain: config.authDomain || '',
                        storageBucket: config.storageBucket || '',
                        messagingSenderId: config.messagingSenderId || '',
                        appId: config.appId || '',
                        isValid: false
                      });
                    } catch (error) {
                      // Invalid JSON, ignore
                    }
                  }}
                />
                <p className="text-xs text-gray-500">
                  Copy the entire configuration object from Firebase Console
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={validateFirebaseConfig}
          disabled={isValidating || !configuration.projectId || !configuration.apiKey}
          className="flex items-center space-x-2"
        >
          {isValidating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <span>{isValidating ? 'Validating...' : 'Test Configuration'}</span>
        </Button>

        {configuration.isValid && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Valid Configuration
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

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>Firebase Services Setup</span>
            <Badge variant="outline">Optional</Badge>
          </CardTitle>
          <CardDescription>
            Additional Firebase services you may want to enable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Authentication</h4>
                <p className="text-sm text-gray-600">
                  Enable Email/Password and Google sign-in providers
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://console.firebase.google.com/project/_/authentication/providers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Configure Auth <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Firestore Database</h4>
                <p className="text-sm text-gray-600">
                  Create a Firestore database for storing user data
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://console.firebase.google.com/project/_/firestore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Setup Firestore <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Storage</h4>
                <p className="text-sm text-gray-600">
                  Enable Cloud Storage for crop and soil images
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://console.firebase.google.com/project/_/storage" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Setup Storage <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Security Rules</h4>
                <p className="text-sm text-gray-600">
                  Configure security rules for database and storage
                </p>
                <Button variant="outline" size="sm" onClick={() => {
                  const rules = `// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /crops/{cropId} {
      allow read, write: if request.auth != null;
    }
  }
}

// Storage Security Rules  
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;
                  copyToClipboard(rules);
                }}>
                  Copy Rules <Copy className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables Preview */}
      {configuration.projectId && configuration.apiKey && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables</CardTitle>
            <CardDescription>
              Add these to your .env file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`VITE_FIREBASE_PROJECT_ID=${configuration.projectId}
VITE_FIREBASE_API_KEY=${configuration.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${configuration.authDomain}
VITE_FIREBASE_STORAGE_BUCKET=${configuration.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${configuration.messagingSenderId}
VITE_FIREBASE_APP_ID=${configuration.appId}`}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => copyToClipboard(`VITE_FIREBASE_PROJECT_ID=${configuration.projectId}
VITE_FIREBASE_API_KEY=${configuration.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${configuration.authDomain}
VITE_FIREBASE_STORAGE_BUCKET=${configuration.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${configuration.messagingSenderId}
VITE_FIREBASE_APP_ID=${configuration.appId}`)}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FirebaseSetup;