import React from 'react';
import { Search, Layers, Building2, TrendingUp } from 'lucide-react';
import { Navbar } from './Navbar';
import { Card } from './Card';
import { Button } from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onNavigate: (page: string) => void;
}

export function LandingPage({ onGetStarted, onLoginClick, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E5E7EB]/30">
      <Navbar showSearch={false} showProfile={false} onLoginClick={onLoginClick} />
      
      {/* Hero Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 sm:mb-6 px-2">
          Discover Pakistan's Industries at a Glance
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-[#1E293B] mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
          Real-time insights, company data, trends, and market analysis — all in one place.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-16 px-4">
          <div className="relative">
            <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="text"
              placeholder="Search industries, companies..."
              className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 border-2 border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/20 text-base sm:text-lg"
            />
          </div>
        </div>
        
        <Button variant="primary" size="large" onClick={onGetStarted}>
          Get Started
        </Button>
      </section>
      
      {/* Feature Cards */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-xl text-[#0F172A] mb-3">Industry Explorer</h3>
              <p className="text-[#1E293B]">
                Browse and analyze Pakistan's key industries with detailed metrics and growth indicators.
              </p>
            </div>
          </Card>
          
          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-xl text-[#0F172A] mb-3">Company Database</h3>
              <p className="text-[#1E293B]">
                Access comprehensive profiles of companies with real-time data and AI-powered insights.
              </p>
            </div>
          </Card>
          
          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-xl text-[#0F172A] mb-3">Market Trends & News</h3>
              <p className="text-[#1E293B]">
                Stay updated with the latest market trends, news, and analysis from verified sources.
              </p>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-12 sm:mt-20 border-t border-[#E5E7EB]">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[#1E293B] text-sm sm:text-base">
          <button onClick={() => onNavigate('about')} className="hover:text-[#10B981] transition-colors">About</button>
          <span className="text-[#E5E7EB] hidden sm:inline">•</span>
          <button onClick={() => onNavigate('contact')} className="hover:text-[#10B981] transition-colors">Contact</button>
          <span className="text-[#E5E7EB] hidden sm:inline">•</span>
          <button onClick={() => onNavigate('terms')} className="hover:text-[#10B981] transition-colors">Terms</button>
        </div>
        <div className="text-center mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm px-4">
          © 2025 PAK Industry Insight. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
