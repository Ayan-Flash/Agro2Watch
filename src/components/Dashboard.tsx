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
  MapPin,
  RefreshCw,
  Clock,
  Zap
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useTranslation } from '@/lib/translations';
import { getCurrentLocationWeather, fetchWeatherByCity } from '@/lib/weatherApi';
import { EnvironmentalPanel } from './EnvironmentalPanel';

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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Fetch real weather data using user's current location (geolocation)
  const fetchWeatherData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      let data;
      if (selectedLocation) {
        console.log(`Fetching weather for selected location: ${selectedLocation}`);
        data = await fetchWeatherByCity(selectedLocation);
      } else if (user?.location) {
        console.log(`Fetching weather for user location: ${user.location}`);
        data = await fetchWeatherByCity(user.location);
      } else {
        console.log('Fetching weather for current GPS location');
        data = await getCurrentLocationWeather();
      }
      console.log('Weather data received:', data);
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
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {

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

    // Set up periodic weather data refresh (every 5 minutes)
    const weatherInterval = setInterval(() => fetchWeatherData(false), 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(weatherInterval);
    };
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {t.welcomeMessage}
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back, <span className="font-semibold text-green-700">{user?.name || user?.phone}</span>! Here's your farm overview for today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sun className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weather</p>
                  <p className="text-lg font-semibold text-gray-900">{weatherData?.temperature || '--'}°C</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-lg font-semibold text-gray-900">{weatherData?.humidity || '--'}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Wind className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className="text-lg font-semibold text-gray-900">{weatherData?.windSpeed || '--'} m/s</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="text-lg font-semibold text-gray-900 truncate">{weatherData?.location || 'Loading...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Cards */}
        <div className="mb-8 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Detailed Weather Analysis</h2>
              <p className="text-gray-600">Real-time weather data for optimal farming decisions</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  if (e.target.value) {
                    fetchWeatherData();
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 backdrop-blur-sm"
              >
                <option value="">Use GPS Location</option>
                <option value="delhi">New Delhi</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
                <option value="kolkata">Kolkata</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="pune">Pune</option>
                <option value="jaipur">Jaipur</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchWeatherData(true)}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Updating...' : 'Refresh'}
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{t.temperature}</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Thermometer className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {weatherData?.temperature || '--'}°C
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {weatherData?.description || 'Loading...'}
                </p>
                {weatherData && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated: {new Date().toLocaleTimeString()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{t.humidity}</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {weatherData?.humidity || '--'}%
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Relative humidity
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{width: `${weatherData?.humidity || 0}%`}}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Wind Speed</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Wind className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {weatherData?.windSpeed || '--'} m/s
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Current wind speed
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Wind className="h-3 w-3 mr-1" />
                  {weatherData?.windSpeed && weatherData.windSpeed > 5 ? 'Strong wind' : 'Light wind'}
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Location</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-gray-900 mb-2">
                  {weatherData?.location || 'Loading...'}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Current location
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  GPS Coordinates
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Crop Health Overview */}
      <div className="grid gap-6 md:grid-cols-2 mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t.cropHealthOverview}</h3>
                <p className="text-sm text-gray-600">Monitor your crop health status across different zones</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cropData?.totalArea ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Farm Area</span>
                  <span className="text-lg font-bold text-green-600">{cropData.totalArea} acres</span>
                </div>
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start Monitoring</h4>
                  <p className="text-gray-600 mb-4">No crop monitoring data available yet. Start analyzing your crops for better insights.</p>
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105" 
                    onClick={() => onViewChange?.('farmer-registration')}
                  >
                    Start Crop Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-10 w-10 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile</h4>
                <p className="text-gray-600 mb-4">Complete your profile to see crop health data and get personalized recommendations.</p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105" 
                  onClick={() => window.location.hash = '#farmer-registration'}
                >
                  Complete Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t.recentAlerts}</h3>
                <p className="text-sm text-gray-600">Latest notifications and recommendations</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">All Good! 🎉</h4>
              <p className="text-gray-600 mb-2">No alerts at the moment.</p>
              <p className="text-sm text-gray-500">
                Your crops are looking good! Continue monitoring for best results.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Status: Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Data Panel */}
      <div className="mb-8">
        <EnvironmentalPanel />
      </div>

      {/* Quick Actions */}
      <Card className="group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg animate-fadeInUp" style={{animationDelay: '0.3s'}}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">
                Get started with crop monitoring and analysis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Button 
              className="h-20 sm:h-24 flex-col gap-3 touch-manipulation active:scale-95 transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => onViewChange?.('crop-detection')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm sm:text-base">Analyze Crops</div>
                <div className="text-xs opacity-90">AI-powered detection</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 sm:h-24 flex-col gap-3 touch-manipulation active:scale-95 transition-all duration-200 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => onViewChange?.('soil-detection')}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm sm:text-base text-gray-900">Test Soil</div>
                <div className="text-xs text-gray-600">Comprehensive analysis</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 sm:h-24 flex-col gap-3 touch-manipulation active:scale-95 transition-all duration-200 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
              onClick={() => onViewChange?.('farmer-registration')}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm sm:text-base text-gray-900">Update Profile</div>
                <div className="text-xs text-gray-600">Personalize experience</div>
              </div>
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