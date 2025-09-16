import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { fetchTrends } from '@/lib/api';

export const TrendsChart = () => {
  const { t } = useLanguage();
  const { data: trendData = [], isLoading } = useQuery({ queryKey: ['trends'], queryFn: fetchTrends });

  // Simple chart visualization using CSS
  const maxNdvi = Math.max(1, ...trendData.map(d => d.ndvi));
  const maxMoisture = Math.max(1, ...trendData.map(d => d.soilMoisture));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          {t('weeklyTrend')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* NDVI Trend */}
          <div>
            <h4 className="text-sm font-medium mb-2">{t('vegetationIndex')} (NDVI)</h4>
            <div className="flex items-end gap-2 h-20">
              {(isLoading ? [] : trendData).map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${(data.ndvi / maxNdvi) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{data.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Moisture Trend */}
          <div>
            <h4 className="text-sm font-medium mb-2">{t('soilMoisture')} (%)</h4>
            <div className="flex items-end gap-2 h-20">
              {(isLoading ? [] : trendData).map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(data.soilMoisture / maxMoisture) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{data.soilMoisture}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{t('prediction')}</span>
          </div>
          <p className="text-sm text-gray-600">
            Vegetation index showing positive trend. Optimal soil moisture levels maintained.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};