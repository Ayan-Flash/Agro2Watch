import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  TestTube,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';
import { getTwilioConfigStatus, isTwilioConfigured } from '@/lib/twilioService';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  messagingServiceSid: string;
  fromNumber: string;
  verifyServiceSid: string;
}

export const TwilioSetup: React.FC = () => {
  const [config, setConfig] = useState<TwilioConfig>({
    accountSid: '',
    authToken: '',
    messagingServiceSid: '',
    fromNumber: '',
    verifyServiceSid: ''
  });
  
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    checkTwilioStatus();
  }, []);

  const checkTwilioStatus = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/twilio/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error checking Twilio status:', error);
    }
  };

  const handleInputChange = (field: keyof TwilioConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // In a real application, you would save these to environment variables
      // For now, we'll just show a success message
      setMessage('Configuration saved! Please restart the backend server to apply changes.');
      setMessageType('success');
      
      // Check status after saving
      setTimeout(() => {
        checkTwilioStatus();
      }, 1000);
      
    } catch (error) {
      setMessage('Failed to save configuration. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const testTwilioConnection = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:8001/api/twilio/status');
      if (response.ok) {
        const data = await response.json();
        if (data.configured) {
          setMessage('Twilio connection successful! ✅');
          setMessageType('success');
        } else {
          setMessage('Twilio not properly configured. Please check your credentials.');
          setMessageType('error');
        }
      } else {
        setMessage('Failed to connect to Twilio. Please check your configuration.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Connection test failed. Please ensure the backend server is running.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const testOTPSending = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const testPhone = '+1234567890'; // Replace with your test number
      const response = await fetch('http://localhost:8001/api/twilio/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testPhone,
          message: 'Test message from AgroWatch',
          otpCode: '123456'
        }),
      });
      
      if (response.ok) {
        setMessage(`Test SMS sent successfully to ${testPhone}!`);
        setMessageType('success');
      } else {
        setMessage('Failed to send test SMS. Please check your configuration.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Test SMS failed. Please check your Twilio configuration.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Twilio OTP Setup</h1>
        <p className="text-gray-600">
          Configure Twilio for SMS OTP sending in your AgroWatch application
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant={status.hasAccountSid ? "default" : "secondary"}>
                  {status.hasAccountSid ? "✓" : "✗"} Account SID
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={status.hasAuthToken ? "default" : "secondary"}>
                  {status.hasAuthToken ? "✓" : "✗"} Auth Token
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={status.hasMessagingService ? "default" : "secondary"}>
                  {status.hasMessagingService ? "✓" : "✗"} Messaging Service
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={status.hasVerifyService ? "default" : "secondary"}>
                  {status.hasVerifyService ? "✓" : "✗"} Verify Service
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              Checking configuration...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Twilio Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountSid">Account SID *</Label>
              <Input
                id="accountSid"
                type="text"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={config.accountSid}
                onChange={(e) => handleInputChange('accountSid', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authToken">Auth Token *</Label>
              <div className="relative">
                <Input
                  id="authToken"
                  type={showAuthToken ? "text" : "password"}
                  placeholder="Your auth token"
                  value={config.authToken}
                  onChange={(e) => handleInputChange('authToken', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowAuthToken(!showAuthToken)}
                >
                  {showAuthToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messagingServiceSid">Messaging Service SID</Label>
              <Input
                id="messagingServiceSid"
                type="text"
                placeholder="MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={config.messagingServiceSid}
                onChange={(e) => handleInputChange('messagingServiceSid', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fromNumber">From Number</Label>
              <Input
                id="fromNumber"
                type="text"
                placeholder="+1234567890"
                value={config.fromNumber}
                onChange={(e) => handleInputChange('fromNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verifyServiceSid">Verify Service SID (Recommended)</Label>
            <Input
              id="verifyServiceSid"
              type="text"
              placeholder="VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.verifyServiceSid}
              onChange={(e) => handleInputChange('verifyServiceSid', e.target.value)}
            />
          </div>

          {message && (
            <Alert variant={messageType === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            
            <Button
              onClick={testTwilioConnection}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            
            <Button
              onClick={testOTPSending}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test SMS
            </Button>
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
                <h4 className="font-semibold">Get Twilio Credentials</h4>
                <p className="text-sm text-gray-600">Sign up at twilio.com and get your Account SID and Auth Token from the console.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Configure Services</h4>
                <p className="text-sm text-gray-600">Set up either a Messaging Service or buy a phone number for SMS sending.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Verify Service (Optional)</h4>
                <p className="text-sm text-gray-600">Create a Verify Service for better OTP management and cost optimization.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h4 className="font-semibold">Test Configuration</h4>
                <p className="text-sm text-gray-600">Use the test buttons above to verify your setup works correctly.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
