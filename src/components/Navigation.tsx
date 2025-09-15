import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { translations } from '@/lib/translations';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  language,
  onLanguageChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[language as 'en' | 'ml' | 'hi'];

  const menuItems = [
    { id: 'dashboard', label: t.dashboard },
    { id: 'crop-detection', label: t.cropDetection },
    { id: 'soil-detection', label: t.soilDetection },
    { id: 'farmer-registration', label: t.farmerRegistration },
    { id: 'admin-dashboard', label: t.adminDashboard },
  ];

  const languageOptions = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  ];
  const currentLanguage = languageOptions.find(lang => lang.code === language);

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Kerala AgriMonitor</h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className="text-white hover:bg-green-700"
              >
                {item.label}
              </Button>
            ))}
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-green-700 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {currentLanguage?.nativeName || 'English'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`flex justify-between ${
                      language === lang.code ? 'bg-green-50' : ''
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-sm text-gray-500">{lang.nativeName}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-green-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left justify-start text-white hover:bg-green-700"
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-2 border-t border-green-500">
                <div className="text-sm text-green-200 mb-2 px-3">{t.language}</div>
                {languageOptions.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left justify-start text-white hover:bg-green-700 ${
                      language === lang.code ? 'bg-green-700' : ''
                    }`}
                  >
                    <div className="flex justify-between w-full">
                      <span>{lang.name}</span>
                      <span className="text-sm text-green-200">{lang.nativeName}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;