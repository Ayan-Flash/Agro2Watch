import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { authService } from '@/lib/auth';
import { kycService } from '@/lib/kyc';
import { IdCard, Leaf, Shield } from 'lucide-react';

interface FarmerRegistrationProps { onSuccess: () => void; }

export const FarmerRegistration: React.FC<FarmerRegistrationProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'vid' | 'otp'>('vid');
  const [vid, setVid] = useState('');
  const [otp, setOtp] = useState('');
  const [txnId, setTxnId] = useState('');
  const [error, setError] = useState('');

  const handleInitAadhaar = async () => {
    setError('');
    if (!/^\d{12}$/.test(vid)) {
      setError('Enter a valid 12-digit VID');
      return;
    }
    setIsLoading(true);
    try {
      const result = await kycService.initAadhaarVerification(vid);
      if (result.success) {
        setTxnId(result.txnId);
        setStep('otp');
      } else {
        setError(result.message || 'Failed to initiate verification');
      }
    } catch (e) {
      setError('Aadhaar verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP');
      return;
    }
    setIsLoading(true);
    try {
      const result = await kycService.verifyAadhaarOTP(txnId, otp);
      if (result.success && result.profile) {
        const user = await authService.registerFromAadhaar(vid, result.profile);
        login(user);
        onSuccess();
      } else {
        setError(result.message || 'OTP verification failed');
      }
    } catch (e) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === 'vid' ? 'Continue with Aadhaar' : 'Enter OTP'}
          </CardTitle>
          <p className="text-gray-600">
            {step === 'vid' ? 'ആധാറിലൂടെ തുടരുക' : 'OTP നൽകുക'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {step === 'vid' ? (
              <>
                <div>
                  <Label htmlFor="vid">VID / Aadhaar Number</Label>
                  <Input
                    id="vid"
                    inputMode="numeric"
                    pattern="\d{12}"
                    maxLength={12}
                    value={vid}
                    onChange={(e) => setVid(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="1234 5678 9012"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your 12-digit VID or Aadhaar number
                  </p>
                </div>
                <Button
                  onClick={handleInitAadhaar}
                  className="w-full"
                  disabled={isLoading}
                >
                  <IdCard className="w-4 h-4 mr-2" />
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit OTP sent to your registered mobile
                  </p>
                </div>
                <Button
                  onClick={handleVerifyOTP}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep('vid')}
                  className="w-full"
                >
                  Back to VID Entry
                </Button>
              </>
            )}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};