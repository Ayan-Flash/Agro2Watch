import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, MapPin, Clock } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { CropHealthMap } from './CropHealthMap';
import { EnvironmentalPanel } from './EnvironmentalPanel';
import { AlertsPanel } from './AlertsPanel';
import { TrendsChart } from './TrendsChart';
import { LanguageToggle } from './LanguageToggle';
import { MobileNav } from './MobileNav';

export const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: MapPin,
      label: 'Total Area',
      value: '8.7',
      unit: t('hectares'),
      color: 'text-blue-600'
    },
    {
      icon: Leaf,
      label: t('healthyZones'),
      value: '75',
      unit: '%',
      color: 'text-green-600'
    },
    {
      icon: Users,
      label: 'Active Sensors',
      value: '12',
      unit: 'devices',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      label: 'Last Sync',
      value: '2',
      unit: 'min ago',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MobileNav />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{t('welcomeMessage')}</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">{t('subtitle')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Data
              </Badge>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-lg font-bold">
                        {stat.value} <span className="text-sm font-normal text-gray-500">{stat.unit}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crop Health Map - Takes 2 columns on large screens */}
          <CropHealthMap />
          
          {/* Environmental Panel */}
          <EnvironmentalPanel />
          
          {/* Trends Chart - Takes 2 columns on large screens */}
          <TrendsChart />
          
          {/* Alerts Panel */}
          <AlertsPanel />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>AgroWatch • Powered by AI & Remote Sensing</p>
        </footer>
      </main>
    </div>
  );
};