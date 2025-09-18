import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from './AuthContext';
import { ArrowLeft, Shield, Clock } from 'lucide-react';

interface OTPVerificationProps {
  phone: string;
  purpose: 'login' | 'registration';
  onSuccess: () => void;
  onBack: () => void;
  onResend?: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  phone,
  purpose,
  onSuccess,
  onBack,
  onResend
}) => {
  const { verifyOTP, sendOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await verifyOTP(phone, otp, purpose);
      if (success) {
        onSuccess();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError('');

    try {
      const success = await sendOTP(phone, purpose);
      if (success) {
        setResendCooldown(60); // 60 second cooldown
        setOtp('');
        if (onResend) onResend();
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatPhone = (phone: string) => {
    // Format phone number for display (e.g., +91 98765 43210)
    if (phone.startsWith('+91')) {
      return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`;
    }
    return phone;
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
            Verify OTP
          </CardTitle>
          <p className="text-gray-600">
            Enter the 6-digit code sent to
          </p>
          <p className="text-gray-800 font-medium">
            {formatPhone(phone)}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                  setError('');
                }}
                placeholder="Enter 6-digit OTP"
                className="text-center text-lg tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
              />
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || otp.length !== 6}
            >
              <Shield className="w-4 h-4 mr-2" />
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isResending}
                className="text-sm"
              >
                {isResending ? (
                  'Sending...'
                ) : resendCooldown > 0 ? (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Resend in {resendCooldown}s
                  </>
                ) : (
                  'Resend OTP'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;
