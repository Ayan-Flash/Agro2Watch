import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from './AuthContext';
import { LogIn, Shield, Leaf, Smartphone } from 'lucide-react';

interface LoginFormData {
  phone: string;
  password?: string;
}

interface LoginFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
  onOTPVerification: (phone: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterClick, onOTPVerification }) => {
  const { login, sendOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<LoginFormData>();
  const phone = watch('phone');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    try {
      if (loginMethod === 'otp') {
        // Send OTP for phone login
        const otpSent = await sendOTP(data.phone, 'login');
        if (otpSent) {
          onOTPVerification(data.phone);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      } else {
        // Password login
        const success = await login(data.phone, data.password);
        if (success) {
          onSuccess();
        } else {
          setError('Invalid phone number or password');
        }
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'farmer' | 'admin') => {
    reset();
    if (role === 'admin') {
      reset({ phone: '+919876543210', password: 'admin123' });
    } else {
      reset({ phone: '+919876543211', password: 'farmer123' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Kerala Agri System
          </CardTitle>
          <p className="text-gray-600">കേരള കാർഷിക സംവിധാനം</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="farmer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="farmer" className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Farmer
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="farmer" className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="farmer-phone">Phone Number / ഫോൺ നമ്പർ</Label>
                  <Input
                    id="farmer-phone"
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^(\+91|91)?[6-9]\d{9}$/,
                        message: 'Please enter a valid Indian phone number'
                      }
                    })}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {loginMethod === 'password' && (
                  <div>
                    <Label htmlFor="farmer-password">Password / പാസ്‌വേഡ്</Label>
                    <Input
                      id="farmer-password"
                      type="password"
                      {...register('password', { required: loginMethod === 'password' ? 'Password is required' : false })}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={loginMethod === 'otp' ? 'default' : 'outline'}
                    onClick={() => setLoginMethod('otp')}
                    className="flex-1"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    OTP Login
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === 'password' ? 'default' : 'outline'}
                    onClick={() => setLoginMethod('password')}
                    className="flex-1"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Password
                  </Button>
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {loginMethod === 'otp' ? (
                    <>
                      <Smartphone className="w-4 h-4 mr-2" />
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      {isLoading ? 'Signing in...' : 'Sign In / സൈൻ ഇൻ'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin('farmer')}
                >
                  Demo Farmer Login
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={onRegisterClick}
                    className="text-sm"
                  >
                    New farmer? Register here / പുതിയ കൃഷിക്കാരൻ? ഇവിടെ രജിസ്റ്റർ ചെയ്യുക
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="admin-phone">Admin Phone Number</Label>
                  <Input
                    id="admin-phone"
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^(\+91|91)?[6-9]\d{9}$/,
                        message: 'Please enter a valid Indian phone number'
                      }
                    })}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    placeholder="Enter admin password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Shield className="w-4 h-4 mr-2" />
                  {isLoading ? 'Signing in...' : 'Admin Sign In'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin('admin')}
                >
                  Demo Admin Login
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};