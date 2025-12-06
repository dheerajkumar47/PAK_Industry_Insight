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

type Page = 'landing' | 'login' | 'dashboard' | 'industry-explorer' | 'companies' | 'company-detail' | 'news' | 'market-trends' | 'saved' | 'profile' | 'settings';

export default function App() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    // Check if user is authenticated (using sessionStorage from authService)
    if (authService.isAuthenticated()) {
      setCurrentPage('dashboard');
    } else {
	    // If not authenticated, ensure we start at landing or login
	    if (currentPage !== 'landing' && currentPage !== 'login') {
		    setCurrentPage('landing');
	    }
    }
  }, []);

  const handleNavigation = (page: string) => {
    switch (page) {
      case 'dashboard':
        setCurrentPage('dashboard');
        break;
      case 'industry-explorer':
        setCurrentPage('industry-explorer');
        break;
      case 'companies':
        setCurrentPage('company-detail');
        break;
      case 'news':
        setCurrentPage('news');
        break;
      case 'market-trends':
        setCurrentPage('market-trends');
        break;
      case 'saved':
        setCurrentPage('saved');
        break;
      case 'profile':
        setCurrentPage('profile');
        break;
      case 'settings':
        setCurrentPage('settings');
        break;
      default:
        setCurrentPage('dashboard');
    }
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
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} onLoginClick={handleLoginClick} />
      )}
      {currentPage === 'login' && (
        <LoginSignup onLogin={handleLogin} onBackToHome={handleBackToHome} />
      )}
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
