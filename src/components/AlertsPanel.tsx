import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { AlertTriangle, Bug, Droplets, Cloud } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { mockAlerts } from '@/lib/mockData';
import { TranslationKey } from '../lib/translations';

export const AlertsPanel = () => {
  const { t } = useLanguage();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'pestRisk': return Bug;
      case 'diseaseRisk': return AlertTriangle;
      case 'irrigationNeeded': return Droplets;
      case 'weatherAlert': return Cloud;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          {t('alerts')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          
          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityBg(alert.severity)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <Icon className="w-4 h-4 mt-0.5 text-gray-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {t(alert.severity as TranslationKey)}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.zone}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="text-xs">
                  {t('viewDetails')}
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  {t('takeAction')}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};