import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Leaf, Phone, Globe, CreditCard, Shield, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useTranslation, languageOptions } from '@/lib/translations';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'aadhaar'>('phone');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const identifier = loginMethod === 'phone' ? phone : aadhaar;
    
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowOtp(true);
      console.log('OTP sent to:', identifier);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification and login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const identifier = loginMethod === 'phone' ? phone : aadhaar;
      await login(identifier, 'verified');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const LanguageToggle = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 animate-in slide-in-from-top duration-300">
          <Globe className="h-4 w-4" />
          {languageOptions.find(lang => lang.code === language)?.nativeName || 'English'}
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
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <Card className="w-full max-w-md animate-in slide-in-from-bottom duration-500">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 animate-in zoom-in duration-300 delay-200">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">AgroWatch</span>
            <Badge variant="secondary" className="text-xs">India</Badge>
          </div>
          <CardTitle className="text-2xl animate-in slide-in-from-left duration-300 delay-300">
            {t.login}
          </CardTitle>
          <CardDescription className="animate-in slide-in-from-right duration-300 delay-400">
            {t.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-in fade-in duration-300 delay-500">
          {!showOtp ? (
            <form onSubmit={handleSignIn} className="space-y-4">
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

              {loginMethod === 'phone' ? (
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone}</Label>
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
                  <Label htmlFor="aadhaar">{t.aadhaarNumber}</Label>
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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    Secure & encrypted
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-center animate-in slide-in-from-top duration-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t.loading}
                  </>
                ) : (
                  t.signIn
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                  OTP sent to {loginMethod === 'phone' ? phone : `****${aadhaar.slice(-4)}`}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp">{t.enterOtp}</Label>
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
                <div className="text-red-600 text-sm text-center animate-in slide-in-from-top duration-200">
                  {error}
                </div>
              )}

              <Button
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t.loading}
                  </>
                ) : (
                  t.verifyOtp
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowOtp(false)}
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;