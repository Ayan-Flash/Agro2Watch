import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from './AuthContext';
import { authService } from '@/lib/auth';
import { LogIn, Shield, Leaf, UserPlus, Globe } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from './LanguageContext';
import { sendMobileOtp } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, type ConfirmationResult } from 'firebase/auth';

interface MobileLoginData { mobile: string; otp: string; }
interface MobileSignupData { mobile: string; password: string; }

interface LoginFormProps { onSuccess: () => void; onRegisterClick: () => void; }

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterClick }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  // Initialize invisible reCAPTCHA once
  if (typeof window !== 'undefined' && auth && !captchaReady) {
    try {
      // Avoid re-init if exists
      // @ts-ignore
      if (!window.__recaptchaVerifier) {
        // @ts-ignore
        window.__recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
      }
      setCaptchaReady(true);
    } catch {}
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MobileLoginData>();
  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors }, reset: resetSignup } = useForm<MobileSignupData>();
  const [showSignup, setShowSignup] = useState(false);

  const onSubmit = async (data: MobileLoginData) => {
    setIsLoading(true);
    setError('');
    try {
      const user = await authService.loginWithMobile(data.mobile, data.otp);
      if (user) {
        login(user);
        onSuccess();
      } else {
        setError('Invalid mobile or OTP');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo logins removed; only admin credentials allowed

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('welcomeMessage')}
            </CardTitle>
            <LanguageToggle />
          </div>
          <p className="text-gray-600">{t('subtitle')}</p>
        </CardHeader>
        <CardContent>
          <div id="recaptcha-container" style={{ display: 'none' }}></div>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Sign in
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="mobile">Mobile number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register('mobile', { required: 'Mobile is required', minLength: { value: 10, message: 'Enter valid number' } })}
                    placeholder="9000012345"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-600 mt-1">{errors.mobile.message as string}</p>
                  )}
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading || resendIn > 0}
                    onClick={async () => {
                      const mobile = (document.getElementById('mobile') as HTMLInputElement)?.value || '';
                      if (!/^\d{10}$/.test(mobile)) {
                        setError('Enter valid mobile number');
                        return;
                      }
                      setIsLoading(true);
                      setError('');
                      try {
                        // Prefer Firebase Phone Auth if available
                        try {
                          // @ts-ignore
                          const verifier = window.__recaptchaVerifier as RecaptchaVerifier;
                          const full = `+91${mobile}`; // default country code; adjust as needed
                          const conf = await signInWithPhoneNumber(auth, full, verifier);
                          setConfirmation(conf);
                        } catch (e) {
                          // fallback to our mock API
                          await sendMobileOtp(mobile);
                        }
                        setOtpSent(true);
                        setResendIn(30);
                        const timer = setInterval(() => {
                          setResendIn((s) => {
                            if (s <= 1) { clearInterval(timer); return 0; }
                            return s - 1;
                          });
                        }, 1000);
                      } catch (e) {
                        // Fallback in dev: mark OTP as sent for demo flow (use 123456)
                        setOtpSent(true);
                        setResendIn(30);
                        const timer = setInterval(() => {
                          setResendIn((s) => {
                            if (s <= 1) { clearInterval(timer); return 0; }
                            return s - 1;
                          });
                        }, 1000);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {resendIn > 0 ? `Resend OTP in ${resendIn}s` : 'Send OTP'}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: '6-digit OTP' }, maxLength: { value: 6, message: '6-digit OTP' } })}
                    placeholder="123456"
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-600 mt-1">{errors.otp.message as string}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}
                  onClick={async (e) => {
                    // If Firebase confirmation present, use it to verify OTP and sign-in
                    if (!confirmation) return; // fall back to form submit handler
                    e.preventDefault();
                    const otpInput = (document.getElementById('otp') as HTMLInputElement)?.value || '';
                    if (!/^\d{6}$/.test(otpInput)) { setError('Enter valid OTP'); return; }
                    setIsLoading(true);
                    setError('');
                    try {
                      const cred = await confirmation.confirm(otpInput);
                      const fUser = cred.user;
                      // Map to our app user
                      const mapped = { id: fUser.uid, name: fUser.displayName || 'User', email: fUser.email || `${fUser.uid}@agro.watch`, role: 'farmer', phone: fUser.phoneNumber || undefined } as any;
                      login(mapped);
                      onSuccess();
                    } catch (err) {
                      setError('Invalid OTP');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                {otpSent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-800">
                    OTP sent successfully. Enter the 6-digit code. For demo, use 123456.
                  </div>
                )}

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={onRegisterClick}
                    className="text-sm"
                  >
                    New farmer? Register here
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form
                onSubmit={handleSignupSubmit(async (data) => {
                  setIsLoading(true);
                  setError('');
                  try {
                    const user = await authService.registerWithMobilePassword(data.mobile, data.password);
                    if (user) {
                      login(user);
                      onSuccess();
                    }
                  } catch (e) {
                    setError('Registration failed.');
                  } finally {
                    setIsLoading(false);
                  }
                })}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="signup-mobile">Mobile number</Label>
                  <Input
                    id="signup-mobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...registerSignup('mobile', { required: 'Mobile is required', minLength: { value: 10, message: 'Enter valid number' } })}
                    placeholder="9000012345"
                  />
                  {signupErrors.mobile && (
                    <p className="text-sm text-red-600 mt-1">{signupErrors.mobile.message as string}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="signup-password">Set password (one-time)</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    {...registerSignup('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    placeholder="Create a password"
                  />
                  {signupErrors.password && (
                    <p className="text-sm text-red-600 mt-1">{signupErrors.password.message as string}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isLoading ? 'Processing...' : 'Sign up with phone'}
                </Button>
              </form>
              <div className="pt-2">
                <Button type="button" variant="outline" className="w-full gap-2"
                  onClick={async () => {
                    try {
                      const provider = new GoogleAuthProvider();
                      const res = await signInWithPopup(auth, provider);
                      const g = res.user;
                      const mapped = { id: g.uid, name: g.displayName || 'User', email: g.email || `${g.uid}@agro.watch`, role: 'farmer', phone: g.phoneNumber || undefined } as any;
                      login(mapped);
                      onSuccess();
                    } catch (e) {
                      setError('Google sign-in failed');
                    }
                  }}
                >
                  <Globe className="w-4 h-4" /> Sign in with Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};