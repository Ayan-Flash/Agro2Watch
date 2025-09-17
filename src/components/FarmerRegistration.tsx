import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Phone, 
  MapPin, 
  Leaf, 
  CreditCard, 
  QrCode, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  Camera,
  FileText
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useTranslation } from '@/lib/translations';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface AadhaarData {
  name: string;
  address: string;
  phone: string;
  aadhaarNumber: string;
}

export const FarmerRegistration: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    aadhaarNumber: user?.aadhar || '',
    address: '',
    farmSize: String(user?.farmSize || ''),
    farmUnit: 'acres',
    cropTypes: user?.cropType ? [user.cropType] : []
  });
  
  const [isAadhaarVerifying, setIsAadhaarVerifying] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const cropOptions: ('corn' | 'vegetables' | 'both')[] = [
    'corn', 'vegetables', 'both'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleCropToggle = (crop: 'corn' | 'vegetables' | 'both') => {
    setFormData(prev => ({
      ...prev,
      cropTypes: prev.cropTypes.includes(crop)
        ? prev.cropTypes.filter(c => c !== crop)
        : [...prev.cropTypes, crop]
    }));
  };

  const handleAadhaarVerification = async () => {
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsAadhaarVerifying(true);
    setError('');

    try {
      // Simulate Aadhaar verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock Aadhaar data fetch
      const mockAadhaarData: AadhaarData = {
        name: 'Rajesh Kumar Sharma',
        address: '123, Village Rampur, District Meerut, Uttar Pradesh - 250001',
        phone: '+91 9876543210',
        aadhaarNumber: formData.aadhaarNumber
      };

      // Auto-fill form with Aadhaar data
      setFormData(prev => ({
        ...prev,
        name: mockAadhaarData.name,
        address: mockAadhaarData.address,
        phone: mockAadhaarData.phone
      }));

      setAadhaarVerified(true);
      setSuccess('Aadhaar verified successfully! Form auto-filled with your details.');
    } catch (err) {
      setError('Aadhaar verification failed. Please try again.');
    } finally {
      setIsAadhaarVerifying(false);
    }
  };

  const handleQRScan = async () => {
    setShowQRScanner(true);
    
    try {
      // Simulate QR code scanning
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock QR scan result
      const qrData: AadhaarData = {
        name: 'Priya Devi',
        address: '456, Gram Panchayat Khatoli, Tehsil Baghpat, Uttar Pradesh - 250609',
        phone: '+91 8765432109',
        aadhaarNumber: '123456789012'
      };

      setFormData(prev => ({
        ...prev,
        name: qrData.name,
        address: qrData.address,
        phone: qrData.phone,
        aadhaarNumber: qrData.aadhaarNumber
      }));

      setAadhaarVerified(true);
      setSuccess('QR code scanned successfully! Form auto-filled with your Aadhaar details.');
      setShowQRScanner(false);
    } catch (err) {
      setError('QR scan failed. Please try manual entry.');
      setShowQRScanner(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.aadhaarNumber) {
      setError('Please fill in all required fields');
      return;
    }

    if (!aadhaarVerified) {
      setError('Please verify your Aadhaar number first');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Registration updated successfully!');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-8 animate-in slide-in-from-top duration-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <User className="h-8 w-8 text-green-600" />
          {t.farmerRegistration}
        </h1>
        <p className="text-gray-600">
          Complete your profile with Aadhaar verification for better services
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="animate-in slide-in-from-bottom duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Farmer Profile
            </CardTitle>
            <CardDescription>
              Use Aadhaar verification to auto-fill your details securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aadhaar Section */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t.aadhaarVerification}
                  </h3>
                  {aadhaarVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhaar">{t.aadhaarNumber}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="aadhaar"
                        type="text"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={formData.aadhaarNumber}
                        onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                        maxLength={12}
                        className="flex-1"
                        disabled={aadhaarVerified}
                      />
                      <Button
                        type="button"
                        onClick={handleAadhaarVerification}
                        disabled={isAadhaarVerifying || aadhaarVerified}
                        variant="outline"
                      >
                        {isAadhaarVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Shield className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleQRScan}
                      disabled={showQRScanner || aadhaarVerified}
                      variant="outline"
                      className="flex-1"
                    >
                      {showQRScanner ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-4 w-4 mr-2" />
                          {t.scanQR}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAadhaarVerification}
                      disabled={isAadhaarVerifying || aadhaarVerified}
                      variant="outline"
                      className="flex-1"
                    >
                      {isAadhaarVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          {t.fetchFromAadhaar}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-blue-700">
                    <Shield className="h-3 w-3" />
                    Your Aadhaar data is processed securely and not stored permanently
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t.name} *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">{t.phone} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">{t.address}</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address with village, district, state"
                  />
                </div>
              </div>

              {/* Farm Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  Farm Information
                </h3>
                
                <div>
                  <Label htmlFor="farmSize">{t.farmSize}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="farmSize"
                      type="number"
                      placeholder="Enter size"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      className="flex-1"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-24">
                          {formData.farmUnit === 'acres' ? t.acres : t.hectares}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleInputChange('farmUnit', 'acres')}>
                          {t.acres}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleInputChange('farmUnit', 'hectares')}>
                          {t.hectares}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div>
                  <Label>{t.cropTypes}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {cropOptions.map((crop) => (
                      <Button
                        key={crop}
                        type="button"
                        variant={formData.cropTypes.includes(crop) ? "default" : "outline"}
                        onClick={() => handleCropToggle(crop)}
                        className="justify-start text-sm h-8"
                      >
                        {crop}
                      </Button>
                    ))}
                  </div>
                  {formData.cropTypes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formData.cropTypes.map((crop) => (
                        <Badge key={crop} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              {error && (
                <Alert className="border-red-200 bg-red-50 animate-in slide-in-from-top duration-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 animate-in slide-in-from-top duration-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !aadhaarVerified}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerRegistration;