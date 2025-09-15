import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from './AuthContext';
import { authService } from '@/lib/auth';
import { LogIn, Shield, Leaf } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps { onSuccess: () => void; onRegisterClick: () => void; }

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegisterClick }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    try {
      const user = await authService.login(data.email, data.password);
      if (user) {
        login(user);
        onSuccess();
      } else {
        setError('Invalid email or password');
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
                  <Label htmlFor="farmer-email">Email / ഇമെയിൽ</Label>
                  <Input
                    id="farmer-email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    placeholder="farmer@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="farmer-password">Password / പാസ്‌വേഡ്</Label>
                  <Input
                    id="farmer-password"
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? 'Signing in...' : 'Sign In / സൈൻ ഇൻ'}
                </Button>

                {/* Demo farmer login */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">Demo Farmer Login:</p>
                  <p className="text-xs text-blue-700">Email: farmer@demo.com</p>
                  <p className="text-xs text-blue-700">Password: farmer123</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => {
                      reset({ email: 'farmer@demo.com', password: 'farmer123' });
                      onSubmit({ email: 'farmer@demo.com', password: 'farmer123' });
                    }}
                    disabled={isLoading}
                  >
                    Quick Demo Login
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    reset({ email: 'farmer@demo.com', password: 'farmer123' });
                  }}
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
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    placeholder="admin@kerala-agri.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
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

                {/* Admin demo login removed (use credentials) */}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};