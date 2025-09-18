import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Thermometer, Droplets, Wind, Leaf, Gauge, Cloud, Sun, MapPin } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { mockEnvironmentalData } from '@/lib/mockData';
import { getCurrentLocationWeather, WeatherData } from '@/lib/weatherApi';
import { useState, useEffect } from 'react';

export const EnvironmentalPanel = () => {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getCurrentLocationWeather();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Set up periodic weather data refresh (every 3 minutes)
    const weatherInterval = setInterval(fetchWeatherData, 3 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(weatherInterval);
    };
  }, []);

  const sensors = [
    {
      icon: Droplets,
      label: t('soilMoisture'),
      value: mockEnvironmentalData.soilMoisture,
      unit: t('percentage'),
      color: 'bg-blue-500',
      optimal: [40, 80]
    },
    {
      icon: Thermometer,
      label: t('airTemperature'),
      value: weatherData?.temperature || mockEnvironmentalData.airTemperature,
      unit: t('celsius'),
      color: 'bg-orange-500',
      optimal: [20, 35]
    },
    {
      icon: Wind,
      label: t('humidity'),
      value: weatherData?.humidity || mockEnvironmentalData.humidity,
      unit: t('percentage'),
      color: 'bg-cyan-500',
      optimal: [50, 85]
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: weatherData?.pressure || 1013,
      unit: ' hPa',
      color: 'bg-gray-500',
      optimal: [980, 1030]
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: weatherData?.windSpeed || 5,
      unit: ' m/s',
      color: 'bg-slate-500',
      optimal: [0, 12]
    },
    {
      icon: Leaf,
      label: t('leafWetness'),
      value: mockEnvironmentalData.leafWetness,
      unit: t('percentage'),
      color: 'bg-green-500',
      optimal: [0, 60]
    }
  ];

  const getStatusColor = (value: number, optimal: number[]) => {
    if (value >= optimal[0] && value <= optimal[1]) {
      return 'text-green-600';
    }
    return 'text-yellow-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            {t('environmental')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          {t('environmental')}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {weatherData?.location || 'Loading...'}
          </div>
          <div className="flex items-center gap-1">
            <Cloud className="w-4 h-4" />
            {weatherData?.description || 'Partly cloudy'}
          </div>
          <div>
            {t('lastUpdated')}: {new Date().toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sensors.map((sensor, index) => {
          const Icon = sensor.icon;
          const progressValue = sensor.label.includes('Temperature')
            ? (sensor.value / 50) * 100
            : sensor.label.includes('Pressure')
              ? Math.min(100, Math.max(0, ((sensor.value - 950) / (1050 - 950)) * 100))
              : sensor.label.includes('Wind Speed')
                ? Math.min(100, (sensor.value / 20) * 100)
                : sensor.value;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{sensor.label}</span>
                </div>
                <span className={`text-sm font-bold ${getStatusColor(sensor.value, sensor.optimal)}`}>
                  {sensor.value}{sensor.unit}
                </span>
              </div>
              <Progress 
                value={progressValue} 
                className="h-2"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};