import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Leaf, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Menu, 
  X,
  Globe,
  ChevronDown,
  Home,
  Bug,
  Beaker,
  Building2,
  Bot,
  BarChart3,
  MapPin,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { languageOptions } from '@/lib/translations';

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection, onNavigate, onLogout }) => {
  const { language, setLanguage } = useLanguage();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'crop-detection', label: 'Crop Health', icon: Leaf },
    { id: 'pest-detection', label: 'Pest Detection', icon: Bug },
    { id: 'soil-detection', label: 'Soil Analysis', icon: Beaker },
    { id: 'government-schemes', label: 'Gov Schemes', icon: Building2 },
    { id: 'chatbot', label: 'AI Assistant', icon: Bot }
  ];

  const getCurrentLanguage = () => {
    return languageOptions.find(lang => lang.code === language) || languageOptions[0];
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (section: string) => {
    onNavigate(section);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to document
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNotificationsClick = () => {
    // Handle notifications click - could open a notifications panel
    console.log('Notifications clicked');
    // You can implement a notifications dropdown or modal here
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">AgroWatch</span>
                  <Badge variant="secondary" className="hidden sm:inline-flex bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm text-xs px-2 py-0.5">
                    <Zap className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 -mt-0.5">Precision Agriculture Platform</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentSection === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  currentSection === item.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-md'
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xl:inline whitespace-nowrap">{item.label}</span>
                {currentSection === item.id && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Button>
            ))}
          </div>

          {/* Right Side - Language, Notifications, Theme Toggle, Profile */}
          <div className="flex items-center space-x-1">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100/80 transition-all duration-200 rounded-lg px-2 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{getCurrentLanguage().flag}</span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 shadow-xl border-0 bg-white/95 backdrop-blur-md">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-200 ${
                      language === lang.code 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <div className="ml-auto w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNotificationsClick}
              className="relative hover:bg-gray-100/80 transition-all duration-200 rounded-lg px-2 py-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-orange-600" />
              </div>
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="hover:bg-gray-100/80 transition-all duration-200 rounded-lg px-2 py-2"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-600" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600" />
                )}
              </div>
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100/80 transition-all duration-200 rounded-lg px-2 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-3 w-3 hidden sm:inline text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-xl border-0 bg-white/95 backdrop-blur-md">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                  <p className="text-xs text-gray-500">Manage your account</p>
                </div>
                <DropdownMenuItem onClick={() => handleNavigation('profile')} className="flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 my-1 hover:bg-gray-50 transition-all duration-200">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigation('settings')} className="flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 my-1 hover:bg-gray-50 transition-all duration-200">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <div className="border-t border-gray-100 my-2"></div>
                <DropdownMenuItem onClick={() => { logout(); onLogout && onLogout(); }} className="flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 my-1 text-red-600 hover:bg-red-50 transition-all duration-200">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-gray-100/80 transition-all duration-200 rounded-lg px-2 py-2"
              onClick={toggleMobileMenu}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4 text-gray-600" />
                ) : (
                  <Menu className="h-4 w-4 text-gray-600" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 py-6 bg-white/95 backdrop-blur-md animate-fadeInDown">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentSection === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center justify-center space-x-2 w-full h-16 sm:h-18 touch-manipulation rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    currentSection === item.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 active:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    currentSection === item.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm font-medium truncate">{item.label}</div>
                    {currentSection === item.id && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 animate-pulse"></div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Mobile Profile Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="flex flex-col space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotificationsClick}
                  className="w-full justify-start h-12 touch-manipulation rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium">Notifications</span>
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start h-12 touch-manipulation rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    {isDarkMode ? (
                      <Sun className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Moon className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('profile')}
                  className="w-full justify-start h-12 touch-manipulation rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { logout(); onLogout && onLogout(); }}
                  className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 touch-manipulation rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="font-medium">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;