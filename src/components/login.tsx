import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, Phone, Globe, CreditCard, Shield, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useTranslation, languageOptions } from '@/lib/translations';
import { setupRecaptcha, clearRecaptcha } from '@/lib/firebase';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'aadhaar'>('phone');
  const [isSignup, setIsSignup] = useState(false);
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup, sendOTP, verifyOTP } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        console.log('🔧 Initializing reCAPTCHA for login component');
        await setupRecaptcha('recaptcha-container');
        console.log('✅ reCAPTCHA initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing reCAPTCHA:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeRecaptcha, 100);
    
    return () => {
      clearTimeout(timer);
      // Clean up reCAPTCHA on unmount
      clearRecaptcha();
    };
  }, []);

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || (!isSignup && !password) || (isSignup && (!name || !password))) {
      setError('Please fill in all required fields');
      return;
    }

    if (isSignup && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      if (isSignup) {
        // Send OTP for signup
        console.log('📱 Sending OTP for signup:', phone);
        const otpResult = await sendOTP(phone);
        console.log('📊 OTP result:', otpResult);
        
        if (otpResult.success) {
          setShowOtp(true);
          setError(''); // Clear any previous errors
        } else {
          setError(otpResult.error || 'Failed to send OTP. Please try again.');
        }
      } else {
        // Direct login for existing users
        const success = await login(phone, password);
        if (!success) {
          setError('Invalid phone number or password');
        }
      }
    } catch (err: any) {
      console.error('❌ Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Verifying OTP for:', phone, 'OTP:', otp);
      const verified = await verifyOTP(phone, otp);
      console.log('📊 OTP verification result:', verified);
      
      if (verified) {
        if (isSignup) {
          // Complete signup with provided password, then login
          console.log('📝 Completing signup for:', phone);
          const created = await signup(phone, password, name);
          if (created) {
            console.log('✅ Account created, logging in...');
            await login(phone, password);
          } else {
            setError('Account already exists with this phone number');
          }
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('❌ OTP verification error:', err);
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const LanguageToggle = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {languageOptions.find(lang => lang.code === language)?.name || 'English'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-sm text-muted-foreground ml-2">({lang.name})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-4">
      {/* Language Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      {/* reCAPTCHA container for Firebase phone auth */}
      <div id="recaptcha-container" className="hidden"></div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">AgroWatch</span>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              India
            </Badge>
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-900">
              {isSignup ? 'Sign Up' : 'Login'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              AI-Powered Precision Farming for India
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showOtp ? (
            <>
              {/* Login Method Selection */}
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={loginMethod === 'phone' ? "default" : "outline"}
                  onClick={() => setLoginMethod('phone')}
                  className="flex-1 gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Phone
                </Button>
                <Button
                  type="button"
                  variant={loginMethod === 'aadhaar' ? "default" : "outline"}
                  onClick={() => setLoginMethod('aadhaar')}
                  className="flex-1 gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Aadhaar
                </Button>
              </div>

              <form onSubmit={handlePhoneAuth} className="space-y-4">
                {/* Name field for signup */}
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                {loginMethod === 'phone' ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="aadhaar"
                        type="text"
                        placeholder="1234 5678 9012"
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value)}
                        className="pl-10"
                        maxLength={12}
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* Password fields */}
                {isSignup ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Create Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isSignup ? 'Sending OTP...' : 'Signing In...'}
                    </>
                  ) : (
                    isSignup ? 'Send OTP' : 'Sign In'
                  )}
                </Button>
              </form>

              {/* Toggle between login and signup */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                    setPhone('');
                    setPassword('');
                    setName('');
                    setConfirmPassword('');
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {isSignup 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up with phone number"
                  }
                </button>
              </div>
            </>
          ) : (
            /* OTP Verification */
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                  OTP sent to {phone}
                </Badge>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleOtpVerification}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
              
              <div className="flex justify-between text-sm">
                <button
                  onClick={() => setShowOtp(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  onClick={() => handlePhoneAuth({ preventDefault: () => {} } as React.FormEvent)}
                  className="text-green-600 hover:text-green-700"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <Shield className="h-3 w-3" />
            <span>Your data is secure and encrypted</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;