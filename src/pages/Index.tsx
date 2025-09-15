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

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    if (showRegistration) {
      return (
        <FarmerRegistration 
          onSuccess={() => setShowRegistration(false)}
        />
      );
    }
    return (
      <LoginForm
        onSuccess={() => {}}
        onRegisterClick={() => setShowRegistration(true)}
      />
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