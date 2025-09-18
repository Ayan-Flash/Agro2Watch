import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind,
  AlertTriangle,
  TrendingUp,
  Activity,
  MapPin
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useTranslation } from '@/lib/translations';
import { getCurrentLocationWeather, fetchWeatherByCity } from '@/lib/weatherApi';

interface DashboardProps {
  onViewChange?: (view: string) => void;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  location: string;
}

interface CropData {
  healthyZones: number;
  stressedZones: number;
  criticalZones: number;
  totalArea: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = useTranslation(language);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real weather data using user's current location (geolocation)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        let data;
        if (user?.location) {
          data = await fetchWeatherByCity(user.location);
        } else {
          data = await getCurrentLocationWeather();
        }
        setWeatherData({
          temperature: data.temperature,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          description: data.description,
          location: data.location
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fallback data
        setWeatherData({
          temperature: 25,
          humidity: 70,
          windSpeed: 10,
          description: 'Data unavailable',
          location: 'India'
        });
      }
    };

    const fetchCropData = async () => {
      try {
        // Mock crop data - replace with actual API
        const mockCropData: CropData = {
          healthyZones: 0,
          stressedZones: 0,
          criticalZones: 0,
          totalArea: parseFloat(String(user?.farmSize || '0'))
        };
        
        setCropData(mockCropData);
      } catch (error) {
        console.error('Error fetching crop data:', error);
      }
    };

    fetchWeatherData();
    fetchCropData();
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.welcomeMessage}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || user?.phone}! Here's your farm overview for today.
          </p>
        </div>

        {/* Weather Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.temperature}</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherData?.temperature || '--'}°C
              </div>
              <p className="text-xs text-muted-foreground">
                {weatherData?.description || 'Loading...'}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.humidity}</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherData?.humidity || '--'}%
              </div>
              <p className="text-xs text-muted-foreground">
                Relative humidity
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherData?.windSpeed || '--'} km/h
              </div>
              <p className="text-xs text-muted-foreground">
                Current wind speed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {weatherData?.location || 'Kerala'}
              </div>
              <p className="text-xs text-muted-foreground">
                Current location
              </p>
            </CardContent>
          </Card>
      </div>

      {/* Crop Health Overview */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              {t.cropHealthOverview}
            </CardTitle>
            <CardDescription>
              Monitor your crop health status across different zones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cropData?.totalArea ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Farm Area</span>
                  <span className="font-medium">{cropData.totalArea} acres</span>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No crop monitoring data available yet.</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => onViewChange?.('farmer-registration')}
                  >
                    Start Crop Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete your profile to see crop health data.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => window.location.hash = '#farmer-registration'}
                >
                  Complete Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t.recentAlerts}
            </CardTitle>
            <CardDescription>
              Latest notifications and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No alerts at the moment.</p>
              <p className="text-sm mt-2">
                Your crops are looking good! Continue monitoring for best results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with crop monitoring and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              className="h-20 flex-col gap-2"
              onClick={() => onViewChange?.('crop-detection')}
            >
              <Leaf className="h-6 w-6" />
              Analyze Crops
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onViewChange?.('soil-detection')}
            >
              <Activity className="h-6 w-6" />
              Test Soil
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => onViewChange?.('farmer-registration')}
            >
              <TrendingUp className="h-6 w-6" />
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

// Add default export
export default Dashboard;