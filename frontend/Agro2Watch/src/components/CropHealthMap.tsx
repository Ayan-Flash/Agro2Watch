import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from './LanguageContext';
import { mockFieldZones } from '@/lib/mockData';
import { TranslationKey } from '@/lib/translations';

export const CropHealthMap = () => {
  const { t } = useLanguage();

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-500';
      case 'stressed': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthBadgeVariant = (health: string) => {
    switch (health) {
      case 'healthy': return 'default';
      case 'stressed': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {t('fieldOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {mockFieldZones.map((zone) => (
            <div
              key={zone.id}
              className="relative p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{zone.name}</h3>
                <Badge variant={getHealthBadgeVariant(zone.health)}>
                  {t(zone.health as TranslationKey)}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('vegetationIndex')}:</span>
                  <span className="font-medium">{zone.ndvi}</span>
                </div>
                <div className="flex justify-between">
                  <span>Area:</span>
                  <span className="font-medium">{zone.area} {t('hectares')}</span>
                </div>
              </div>
              
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getHealthColor(zone.health)}`}></div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center space-x-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{t('healthy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{t('stressed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{t('critical')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};