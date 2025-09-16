import { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import { AuthProvider, useAuth } from '@/components/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { FarmerRegistration } from '@/components/FarmerRegistration';
import { Dashboard } from '@/components/Dashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { CropDetection } from '@/components/CropDetection';
import { SoilDetection } from '@/components/SoilDetection';
import { EnvironmentalPanel } from '@/components/EnvironmentalPanel';
import { AlertsPanel } from '@/components/AlertsPanel';
import { TrendsChart } from '@/components/TrendsChart';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { Profile } from '@/components/Profile';

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    if (showRegistration) {
      return (
        <FarmerRegistration 
          onSuccess={() => setShowRegistration(false)}
        />
      );
    }
    if (showLogin) {
      return (
        <LoginForm
          onSuccess={() => setShowLogin(false)}
          onRegisterClick={() => setShowRegistration(true)}
        />
      );
    }
    // Public landing: show dashboard with Get Started CTA
    return (
      <div className="relative">
        <Dashboard />
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <Button onClick={() => setShowLogin(true)} className="gap-2">
                <LogIn className="w-4 h-4" />
                Get started
              </Button>
              <Button variant="outline" onClick={() => setShowRegistration(true)}>
                Register
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Farmer Dashboard with Navigation
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-6">
              <Profile />
            </div>
          </div>
        );
      case 'crop-detection':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-6">
              <CropDetection />
            </div>
          </div>
        );
      case 'soil-detection':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-6">
              <SoilDetection />
            </div>
          </div>
        );
      case 'environmental':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-2xl mx-auto">
                <EnvironmentalPanel />
              </div>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-2xl mx-auto">
                <AlertsPanel />
              </div>
            </div>
          </div>
        );
      case 'trends':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-4xl mx-auto">
                <TrendsChart />
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        language={language}
        onLanguageChange={setLanguage}
      />
      {renderPage()}
    </div>
  );
};

export default function Index() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}