import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { authService } from '@/lib/auth';
import { IdCard, Leaf } from 'lucide-react';

interface FarmerRegistrationProps { onSuccess: () => void; }

export const FarmerRegistration: React.FC<FarmerRegistrationProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [aadhaar, setAadhaar] = useState('');
  const [error, setError] = useState('');

  const handleContinueWithAadhaar = async () => {
    setError('');
    if (!/^\d{12}$/.test(aadhaar)) {
      setError('Enter a valid 12-digit Aadhaar number');
      return;
    }
    setIsLoading(true);
    try {
      const user = await authService.registerFromAadhaar(aadhaar);
      login(user);
      onSuccess();
    } catch (e) {
      setError('Aadhaar verification failed.');
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
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Continue with Aadhaar
          </CardTitle>
          <p className="text-gray-600">ആധാറിലൂടെ തുടരുക</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number / ആധാർ നമ്പർ</Label>
              <Input
                id="aadhaar"
                inputMode="numeric"
                pattern="\d{12}"
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="1234 5678 9012"
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>

            <Button
              onClick={handleContinueWithAadhaar}
              className="w-full"
              disabled={isLoading}
            >
              <IdCard className="w-4 h-4 mr-2" />
              {isLoading ? 'Verifying…' : 'Continue with Aadhaar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};