import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Users, DollarSign, Sparkles, ArrowUpRight, Building2 } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onViewCompany?: (id: string) => void;
  onLogout?: () => void;
}

export function Dashboard({ onNavigate, onViewCompany, onLogout }: DashboardProps) {
  const [activeItem, setActiveItem] = React.useState('dashboard');

  const industries = [
    { name: 'Textiles & Apparel', growth: '+12.5%', trend: 'up', value: '$15.2B' },
    { name: 'Information Technology', growth: '+24.8%', trend: 'up', value: '$4.8B' },
    { name: 'Agriculture', growth: '+8.3%', trend: 'up', value: '$42.1B' },
    { name: 'Pharmaceuticals', growth: '+15.7%', trend: 'up', value: '$3.6B' },
    { name: 'Construction', growth: '-2.1%', trend: 'down', value: '$18.5B' }
  ];

  const trendingCompanies = [
    { name: 'Systems Limited', industry: 'IT Services', growth: '+32%', employees: '4,500+' },
    { name: 'Lucky Cement', industry: 'Construction', growth: '+18%', employees: '3,200+' },
    { name: 'Engro Corporation', industry: 'Conglomerate', growth: '+15%', employees: '5,800+' }
  ];

  const newsItems = [
    { title: 'Pakistan\'s IT Exports Reach Record High', category: 'Technology', time: '2h ago', sentiment: 'positive' },
    { title: 'Textile Sector Shows Strong Recovery', category: 'Textiles', time: '5h ago', sentiment: 'positive' },
    { title: 'New Investment Policy Announced', category: 'Policy', time: '1d ago', sentiment: 'neutral' },
    { title: 'Pharmaceutical Industry Expands', category: 'Healthcare', time: '2d ago', sentiment: 'positive' }
  ];

  const handleNavigation = (item: string) => {
    setActiveItem(item);
    onNavigate(item);
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 lg:pb-0">
      <Navbar 
        showSearch={true} 
        showProfile={true} 
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        onLogout={onLogout}
        onProfileClick={() => onNavigate('profile')}
        onSettingsClick={() => onNavigate('settings')}
        onViewCompany={onViewCompany}
      />
      
      <div className="flex">
        <Sidebar 
          activeItem={activeItem} 
          onNavigate={handleNavigation}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl text-[#0F172A] mb-2">Welcome Back</h1>
              <p className="text-sm sm:text-base text-[#1E293B]">Here's what's happening in Pakistan's industries today</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-gray-500 text-xs sm:text-sm mb-1">Total Industries</div>
                    <div className="text-xl sm:text-2xl text-[#0F172A]">24</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-gray-500 text-xs sm:text-sm mb-1">Active Companies</div>
                    <div className="text-xl sm:text-2xl text-[#0F172A]">1,247</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-gray-500 text-xs sm:text-sm mb-1">Market Cap</div>
                    <div className="text-xl sm:text-2xl text-[#0F172A]">$382B</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-gray-500 text-xs sm:text-sm mb-1">Total Employment</div>
                    <div className="text-xl sm:text-2xl text-[#0F172A]">45M+</div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981]" />
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Industry Highlights */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl text-[#0F172A]">Industry Highlights</h2>
                    <button 
                      onClick={() => handleNavigation('industry-explorer')}
                      className="text-[#10B981] text-sm hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {industries.map((industry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-[#F9FAFB] rounded-lg hover:bg-[#E5E7EB]/50 cursor-pointer transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm sm:text-base text-[#0F172A] mb-1 truncate">{industry.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{industry.value}</div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 ml-2">
                          <div className={`flex items-center gap-1 ${industry.trend === 'up' ? 'text-[#10B981]' : 'text-red-500'}`}>
                            {industry.trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                            <span className="text-xs sm:text-sm">{industry.growth}</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hidden sm:block" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Trending Companies */}
                <Card>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl text-[#0F172A]">Trending Companies</h2>
                    <button 
                      onClick={() => handleNavigation('industry-explorer')}
                      className="text-[#10B981] text-xs sm:text-sm hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingCompanies.map((company, index) => (
                      <div key={index} className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#10B981] cursor-pointer transition-colors">
                        <div className="w-12 h-12 bg-[#0F172A] rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-white">{company.name.charAt(0)}</span>
                        </div>
                        <h3 className="text-[#0F172A] mb-1">{company.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{company.industry}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{company.employees}</span>
                          <span className="text-[#10B981]">{company.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* AI Insights */}
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#10B981]" />
                    <h2 className="text-lg sm:text-xl text-[#0F172A]">AI Insights</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#10B981]/5 rounded-lg border border-[#10B981]/20">
                      <p className="text-sm text-[#0F172A]">
                        The IT sector is experiencing unprecedented growth with a 24.8% increase, driven by increased exports and digital transformation.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-[#0F172A]">
                        Textile industry recovery signals positive trends for Q4 2025, with major export markets showing renewed interest.
                      </p>
                    </div>
                  </div>
                </Card>
                
                {/* Latest News */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl text-[#0F172A]">Latest News</h2>
                    <button 
                      onClick={() => handleNavigation('news')}
                      className="text-[#10B981] text-sm hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {newsItems.map((item, index) => (
                      <div key={index} className="pb-3 border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F9FAFB] p-2 rounded cursor-pointer transition-colors">
                        <div className="text-sm text-[#0F172A] mb-1">{item.title}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-1 bg-[#E5E7EB] rounded text-gray-600">{item.category}</span>
                          <span className="text-gray-500">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
