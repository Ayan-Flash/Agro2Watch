import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Thermometer, Droplets, Wind, Leaf, Cloud } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { fetchEnvironmental } from '@/lib/api';

export const EnvironmentalPanel = () => {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ['environmental'], queryFn: () => fetchEnvironmental() });

  const sensors = [
    {
      icon: Droplets,
      label: t('soilMoisture'),
      value: data?.soilMoisture ?? 0,
      unit: t('percentage'),
      color: 'bg-blue-500',
      optimal: [40, 80]
    },
    {
      icon: Thermometer,
      label: t('airTemperature'),
      value: data?.airTemperature ?? 0,
      unit: t('celsius'),
      color: 'bg-orange-500',
      optimal: [20, 35]
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: data?.windSpeed ?? 0,
      unit: 'km/h',
      color: 'bg-cyan-500',
      optimal: [0, 30]
    },
    {
      icon: Cloud,
      label: 'Rain Probability',
      value: data?.rainChance ?? 0,
      unit: t('percentage'),
      color: 'bg-indigo-500',
      optimal: [0, 50]
    },
    {
      icon: Leaf,
      label: t('leafWetness'),
      value: data?.leafWetness ?? 0,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          {t('environmental')}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {t('lastUpdated')}: {isLoading ? t('loading') : (data?.lastUpdated || '-')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sensors.map((sensor, index) => {
          const Icon = sensor.icon;
          const isTemp = sensor.label.toLowerCase().includes('temperature');
          const isWind = sensor.label.toLowerCase().includes('wind');
          const progressValue = isTemp
            ? Math.min(100, (sensor.value / 50) * 100)
            : isWind
              ? Math.min(100, (sensor.value / 60) * 100)
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