import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import OTPVerification from './OTPVerification';

interface AuthenticationFlowProps {
  onSuccess: () => void;
}

type AuthStep = 'login' | 'register' | 'otp-verification';

export const AuthenticationFlow: React.FC<AuthenticationFlowProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [phone, setPhone] = useState('');
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'registration'>('login');

  const handleLoginSuccess = () => {
    onSuccess();
  };

  const handleRegisterClick = () => {
    setCurrentStep('register');
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
  };

  const handleOTPVerification = (phoneNumber: string, purpose: 'login' | 'registration' = 'login') => {
    setPhone(phoneNumber);
    setOtpPurpose(purpose);
    setCurrentStep('otp-verification');
  };

  const handleOTPSuccess = () => {
    onSuccess();
  };

  const handleOTPBack = () => {
    if (otpPurpose === 'login') {
      setCurrentStep('login');
    } else {
      setCurrentStep('register');
    }
  };

  const handleRegistrationSuccess = () => {
    onSuccess();
  };

  const handleRegistrationOTP = (phoneNumber: string) => {
    handleOTPVerification(phoneNumber, 'registration');
  };

  switch (currentStep) {
    case 'login':
      return (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
          onOTPVerification={(phone) => handleOTPVerification(phone, 'login')}
        />
      );

    case 'register':
      return (
        <RegistrationForm
          onSuccess={handleRegistrationSuccess}
          onBack={handleBackToLogin}
          onOTPVerification={handleRegistrationOTP}
        />
      );

    case 'otp-verification':
      return (
        <OTPVerification
          phone={phone}
          purpose={otpPurpose}
          onSuccess={handleOTPSuccess}
          onBack={handleOTPBack}
        />
      );

    default:
      return (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
          onOTPVerification={(phone) => handleOTPVerification(phone, 'login')}
        />
      );
  }
};

export default AuthenticationFlow;
