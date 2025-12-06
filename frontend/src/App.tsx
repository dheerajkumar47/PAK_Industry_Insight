import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { IndustryExplorer } from './components/IndustryExplorer';
import { CompanyDetail } from './components/CompanyDetail';
import { NewsInsights } from './components/NewsInsights';
import { LoginSignup } from './components/LoginSignup';
import { MarketTrends } from './components/MarketTrends';
import { SavedReports } from './components/SavedReports';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { authService } from './services/auth';

import { About, Contact, Terms } from './components/StaticPages';

type Page = 'landing' | 'login' | 'dashboard' | 'industry-explorer' | 'companies' | 'company-detail' | 'news' | 'market-trends' | 'saved' | 'profile' | 'settings' | 'about' | 'contact' | 'terms';

function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [opacity, setOpacity] = useState(1);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fallback timeout in case video doesn't play or end
    const timer = setTimeout(() => {
      handleFinish();
    }, 4000); 

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    setOpacity(0);
    setTimeout(onFinish, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-white dark:bg-slate-900 transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="flex flex-col items-center">
        <video 
          ref={videoRef}
          src="/intro.mp4" 
          autoPlay 
          muted 
          playsInline
          className="w-64 h-64 object-contain"
          onEnded={handleFinish}
          onError={(e) => console.error("Splash video failed to load:", e)}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    // Check if user is authenticated (using localStorage from authService)
    if (authService.isAuthenticated()) {
      if (currentPage === 'landing' || currentPage === 'login') {
         setCurrentPage('dashboard');
      }
    } else {
	    // If not authenticated, ensure we start at landing, login, or public pages
        const publicPages = ['landing', 'login', 'about', 'contact', 'terms'];
	    if (!publicPages.includes(currentPage)) {
		    setCurrentPage('landing');
	    }
    }
  }, [currentPage]); // Add currentPage dependency to re-check when it changes? actually no, just run once or when auth state changes. 
  // Better logic: run once on mount. If logged in -> go dashboard. If not -> stay on landing. 
  // Navigation handling will enforce other rules. 
  
  // Revised useEffect for initial load:
  useEffect(() => {
      const isPublic = ['landing', 'login', 'about', 'contact', 'terms'].includes(currentPage);
      if (authService.isAuthenticated()) {
          if (currentPage === 'landing' || currentPage === 'login') {
             setCurrentPage('dashboard');
          }
      } else if (!isPublic) {
          setCurrentPage('landing');
      }
  }, []);

  const handleNavigation = (page: string) => {
    // Cast string to Page type safely if needed, or just use string in switch
    const target = page as Page; 
    setCurrentPage(target);
  };

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
    if (authService.isAuthenticated()) {
        setCurrentPage('dashboard'); 
    }
  };

  const handleViewCompany = (id?: string) => {
    if (id) setSelectedCompanyId(id);
    setCurrentPage('company-detail');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentPage('landing');
  };

  return (
    <div className="bg-[#F9FAFB] dark:bg-slate-900 min-h-screen transition-colors duration-200">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      
      {currentPage === 'landing' && (
        <LandingPage 
            onGetStarted={handleGetStarted} 
            onLoginClick={handleLoginClick} 
            onNavigate={handleNavigation}
        />
      )}
      {currentPage === 'login' && (
        <LoginSignup onLogin={handleLogin} onBackToHome={handleBackToHome} />
      )}
      
      {/* Public Static Pages */}
      {currentPage === 'about' && <About onBack={handleBackToHome} />}
      {currentPage === 'contact' && <Contact onBack={handleBackToHome} />}
      {currentPage === 'terms' && <Terms onBack={handleBackToHome} />}

      {/* Protected Routes */}
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={handleNavigation} onViewCompany={handleViewCompany} onLogout={handleLogout} />
      )}
      {currentPage === 'industry-explorer' && (
        <IndustryExplorer onNavigate={handleNavigation} onViewCompany={handleViewCompany} onLogout={handleLogout} />
      )}
      {currentPage === 'company-detail' && (
        <CompanyDetail 
          companyId={selectedCompanyId} 
          onNavigate={handleNavigation} 
          onViewCompany={handleViewCompany}
          onLogout={handleLogout} 
        />
      )}
      {currentPage === 'news' && (
        <NewsInsights onNavigate={handleNavigation} onLogout={handleLogout} />
      )}
      {currentPage === 'market-trends' && (
        <MarketTrends onNavigate={handleNavigation} onLogout={handleLogout} />
      )}
      {currentPage === 'saved' && (
        <SavedReports onNavigate={handleNavigation} onLogout={handleLogout} />
      )}
      {currentPage === 'profile' && (
        <Profile onNavigate={handleNavigation} onLogout={handleLogout} />
      )}
      {currentPage === 'settings' && (
        <Settings onNavigate={handleNavigation} onLogout={handleLogout} />
      )}
    </div>
  );
}
