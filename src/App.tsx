import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { HomePage } from '@/pages/HomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNavigate = (page: 'home' | 'dashboard') => {
    if (page === 'dashboard' && !user) {
      setShowAuthModal(true);
      return;
    }
    setCurrentPage(page);
  };

  const handleGetStarted = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setCurrentPage('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onAuthClick={() => setShowAuthModal(true)}
      />
      
      {currentPage === 'home' ? (
        <HomePage onGetStarted={handleGetStarted} />
      ) : user ? (
        <DashboardPage />
      ) : (
        <HomePage onGetStarted={handleGetStarted} />
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
