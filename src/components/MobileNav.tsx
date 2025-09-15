import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { LanguageToggle } from './LanguageToggle';

export const MobileNav = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: Home, label: t('dashboard'), active: true },
    { icon: Activity, label: t('cropHealth') },
    { icon: AlertTriangle, label: t('alerts') },
    { icon: TrendingUp, label: t('trends') }
  ];

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{t('welcomeMessage')}</h2>
              <p className="text-sm text-gray-600">{t('subtitle')}</p>
            </div>
            
            <nav className="flex-1 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={index}
                    variant={item.active ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
            
            <div className="pt-4 border-t">
              <LanguageToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};