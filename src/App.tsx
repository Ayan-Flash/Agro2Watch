import React, { useEffect, useState } from 'react';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './components/LanguageContext';
import { useAuth } from './components/AuthContext';
import Login from './components/login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CropDetection from './components/CropDetection';
import PestDetection from './components/PestDetection';
import SoilDetection from './components/SoilDetection';
import FarmerRegistration from './components/FarmerRegistration';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import {AdminDashboard} from './components/AdminDashboard';
import GovernmentSchemes from './components/GovermentSchemes';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (user) {
      setShowLanding(false);
    } else {
      setShowLanding(true);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    return <Login />;
  }

  // Admin Dashboard
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'crop-detection':
        return <CropDetection />;
      case 'pest-detection':
        return <PestDetection />;
      case 'soil-detection':
        return <SoilDetection />;
      case 'farmer-registration':
        return <FarmerRegistration />;
      case 'government-schemes':
        return <GovernmentSchemes />;
      case 'profile':
        return <Profile onLogout={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;