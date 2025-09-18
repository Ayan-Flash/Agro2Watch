import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  CheckCircle, 
  AlertTriangle, 
  TestTube,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  sendTwilioOTPDirect, 
  sendTwilioOTPVerifyDirect, 
  verifyTwilioOTPDirect,
  isTwilioConfiguredDirect,
  getTwilioConfigStatusDirect,
  generateOTPDirect
} from '@/lib/twilioDirect';

export const TwilioDebug: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const configStatus = getTwilioConfigStatusDirect();
  const isConfigured = isTwilioConfiguredDirect();

  const addTestResult = (test: string, result: any) => {
    setTestResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };

  const testConfiguration = () => {
    addTestResult('Configuration Check', {
      isConfigured,
      configStatus,
      environmentVariables: {
        VITE_TWILIO_ACCOUNT_SID: !!import.meta.env.VITE_TWILIO_ACCOUNT_SID,
        VITE_TWILIO_AUTH_TOKEN: !!import.meta.env.VITE_TWILIO_AUTH_TOKEN,
        VITE_TWILIO_MESSAGING_SERVICE_SID: !!import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID,
        VITE_TWILIO_FROM_NUMBER: !!import.meta.env.VITE_TWILIO_FROM_NUMBER,
        VITE_TWILIO_VERIFY_SERVICE_SID: !!import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID
      }
    });
  };

  const testDirectSMS = async () => {
    if (!phoneNumber) {
      addTestResult('Direct SMS Test', { error: 'Please enter a phone number' });
      return;
    }

    setIsLoading(true);
    try {
      const otp = generateOTPDirect();
      const result = await sendTwilioOTPDirect(phoneNumber, otp);
      addTestResult('Direct SMS Test', { phoneNumber, otp, result });
    } catch (error) {
      addTestResult('Direct SMS Test', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testVerifyService = async () => {
    if (!phoneNumber) {
      addTestResult('Verify Service Test', { error: 'Please enter a phone number' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendTwilioOTPVerifyDirect(phoneNumber);
      addTestResult('Verify Service Test', { phoneNumber, result });
    } catch (error) {
      addTestResult('Verify Service Test', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testOTPVerification = async () => {
    if (!phoneNumber || !otpCode) {
      addTestResult('OTP Verification Test', { error: 'Please enter phone number and OTP code' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyTwilioOTPDirect(phoneNumber, otpCode);
      addTestResult('OTP Verification Test', { phoneNumber, otpCode, result });
    } catch (error) {
      addTestResult('OTP Verification Test', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Twilio Debug Tool</h1>
        <p className="text-gray-600">
          Debug and test Twilio OTP integration
        </p>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <Badge variant={configStatus.hasAccountSid ? "default" : "secondary"}>
                {configStatus.hasAccountSid ? "✓" : "✗"} Account SID
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={configStatus.hasAuthToken ? "default" : "secondary"}>
                {configStatus.hasAuthToken ? "✓" : "✗"} Auth Token
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={configStatus.hasMessagingService ? "default" : "secondary"}>
                {configStatus.hasMessagingService ? "✓" : "✗"} Messaging Service
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={configStatus.hasVerifyService ? "default" : "secondary"}>
                {configStatus.hasVerifyService ? "✓" : "✗"} Verify Service
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={testConfiguration} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Check Configuration
            </Button>
            
            <Button 
              onClick={() => setShowCredentials(!showCredentials)} 
              variant="outline"
              size="sm"
            >
              {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showCredentials ? 'Hide' : 'Show'} Credentials
            </Button>
          </div>

          {showCredentials && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Environment Variables:</h4>
              <div className="space-y-2 text-sm">
                <div>VITE_TWILIO_ACCOUNT_SID: {import.meta.env.VITE_TWILIO_ACCOUNT_SID ? 'Set' : 'Not set'}</div>
                <div>VITE_TWILIO_AUTH_TOKEN: {import.meta.env.VITE_TWILIO_AUTH_TOKEN ? 'Set' : 'Not set'}</div>
                <div>VITE_TWILIO_MESSAGING_SERVICE_SID: {import.meta.env.VITE_TWILIO_MESSAGING_SERVICE_SID ? 'Set' : 'Not set'}</div>
                <div>VITE_TWILIO_FROM_NUMBER: {import.meta.env.VITE_TWILIO_FROM_NUMBER ? 'Set' : 'Not set'}</div>
                <div>VITE_TWILIO_VERIFY_SERVICE_SID: {import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID ? 'Set' : 'Not set'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">OTP Code (for verification test)</label>
              <Input
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={testDirectSMS} 
              disabled={isLoading || !isConfigured}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Test Direct SMS
            </Button>
            
            <Button 
              onClick={testVerifyService} 
              disabled={isLoading || !isConfigured}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Test Verify Service
            </Button>
            
            <Button 
              onClick={testOTPVerification} 
              disabled={isLoading || !isConfigured}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Test OTP Verification
            </Button>
            
            <Button 
              onClick={clearResults} 
              variant="outline"
              className="flex items-center gap-2"
            >
              Clear Results
            </Button>
          </div>

          {!isConfigured && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Twilio is not configured. Please set the required environment variables.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet. Run some tests above.</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{result.test}</h4>
                    <span className="text-sm text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
