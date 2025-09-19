import React, { useEffect, useState } from 'react';
import { AuthProvider } from './components/AuthContext';
import { LanguageProvider } from './components/LanguageContext';
import { useAuth } from './components/AuthContext';
import { Login } from './components/login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CropDetection from './components/CropDetection';
import PestDetection from './components/PestDetection';
import SoilDetection from './components/SoilDetection';
import { EnvironmentalPanel } from './components/EnvironmentalPanel';
import FarmerRegistration from './components/FarmerRegistration';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import {AdminDashboard} from './components/AdminDashboard';
import GovernmentSchemes from './components/GovermentSchemes';
import Footer from './components/Footer';
import AIChatbot from './components/chatbot/AIChatbot';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setShowLanding(false);
    } else {
      setShowLanding(true);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AgroWatch</h2>
            <p className="text-gray-600">Loading your farming dashboard...</p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
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

  const handleNavigationChange = (view: string) => {
    if (view === 'chatbot') {
      setIsChatbotOpen(true);
    } else {
      setCurrentView(view);
      setIsChatbotOpen(false);
    }
  };
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={handleNavigationChange} />;
      case 'crop-detection':
        return <CropDetection onNavigate={handleNavigationChange} />;
      case 'pest-detection':
        return <PestDetection />;
      case 'soil-detection':
        return <SoilDetection />;
      case 'environmental':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-4xl mx-auto">
                <EnvironmentalPanel />
              </div>
            </div>
          </div>
        );
      case 'farmer-registration':
        return <FarmerRegistration />;
      case 'government-schemes':
        return <GovernmentSchemes onViewChange={handleNavigationChange} />;
      case 'profile':
        return <Profile onLogout={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onViewChange={handleNavigationChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex flex-col">
      <Navbar currentSection={currentView} onNavigate={handleNavigationChange} onLogout={() => setCurrentView('dashboard')} />
      <main className="flex-1 transition-all duration-300 ease-in-out">
        <div className="animate-fadeIn">
          {renderCurrentView()}
        </div>
      </main>
      <Footer onNavigate={handleNavigationChange} />
      
      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
      />
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