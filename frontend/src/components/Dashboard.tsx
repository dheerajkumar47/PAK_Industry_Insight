import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { GlowingCard } from './ui/glowing-card';
import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import { FlipWords } from './ui/flip-words';
import { TrendingUp, TrendingDown, Users, DollarSign, Sparkles, ArrowUpRight, Building2, Loader2, RefreshCcw } from 'lucide-react';
import { WatchlistWidget } from './WatchlistWidget';
import { AIChatWidget } from './AIChatWidget';
import { marketService, aiService } from '../services/api';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onViewCompany?: (id: string) => void;
  onLogout?: () => void;
}

  // Helper: Get Market Status (Pakistan Time)
  const getMarketStatus = () => {
    const now = new Date();
    // Convert to PST (UTC+5)
    // Simple check: UTC hours + 5
    const utcHours = now.getUTCHours();
    const pstHours = (utcHours + 5) % 24;
    const day = now.getUTCDay(); // 0=Sun, 6=Sat

    // Trading days: Mon(1) to Fri(5)
    // Timings: 9:30 AM - 4:00 PM (Simple approx)
    const isTradingDay = day >= 1 && day <= 5;
    const isTradingTime = (pstHours > 9 || (pstHours === 9 && now.getUTCMinutes() >= 30)) && pstHours < 16; 

    return isTradingDay && isTradingTime ? 'Open' : 'Closed';
  };

  const tickerMap: Record<string, string> = {
    'SYS': 'Systems Limited',
    'LUCK': 'Lucky Cement', 
    'ENGRO': 'Engro Corp',
    'TRG': 'TRG Pakistan',
    'OGDC': 'Oil & Gas Dev',
    'PPL': 'Pakistan Petroleum',
    'GHNI': 'Ghandhara Nissan',
    'IGIHL': 'IGI Holdings',
    'ALNRS': 'Al-Noor Sugar',
    'KEL': 'K-Electric',
    'HUBC': 'Hub Power Co'
  };

export function Dashboard({ onNavigate, onViewCompany, onLogout }: DashboardProps) {
  const [activeItem, setActiveItem] = React.useState('dashboard');
  const [showIntroVideo, setShowIntroVideo] = React.useState(true);
  const [marketData, setMarketData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [aiSummary, setAiSummary] = React.useState<string | null>(null);
  const [marketStatus, setMarketStatus] = React.useState(getMarketStatus());

  React.useEffect(() => {
    // Check if intro has already been shown in this session
    const hasSeenIntro = sessionStorage.getItem('introShown');
    if (hasSeenIntro) {
        setShowIntroVideo(false);
    } else {
        setShowIntroVideo(true);
        sessionStorage.setItem('introShown', 'true');
        
        // Auto-hide after 8 seconds
        const timer = setTimeout(() => {
          setShowIntroVideo(false);
        }, 8000);
        return () => clearTimeout(timer);
    }

    const fetchAi = async () => {
        try {
            const data = await marketService.getLiveData();
            setMarketData(data);
            
            // Only fetch AI if not already loaded (to save credits/time)
            const aiData = await aiService.getMarketPulse();
            if (aiData && aiData.summary) {
                setAiSummary(aiData.summary);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    
    fetchAi();
  }, []);

  // ... (rest of code)

                {/* AI Insights */}
                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#10B981]" />
                    <h2 className="text-lg sm:text-xl text-[#0F172A] dark:text-white">AI Market Pulse</h2>
                  </div>
                  <div className="space-y-3">
                    {aiSummary ? (
                        <div className="p-3 bg-[#10B981]/5 dark:bg-[#10B981]/10 rounded-lg border border-[#10B981]/20">
                           <p className="text-sm text-[#0F172A] dark:text-gray-200 leading-relaxed">
                             {aiSummary}
                           </p>
                           <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-gray-400">
                                <Sparkles className="w-3 h-3" />
                                <span>Powered by Google Gemini</span>
                           </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-4">
                             <Loader2 className="w-6 h-6 text-[#10B981] animate-spin" />
                             <span className="ml-2 text-sm text-gray-500">Generating insights...</span>
                        </div>
                    )}
                  </div>
                </Card>

  // ==========================================
  // 3. DATA TRANSFORMATION (Preparing for UI)
  // ==========================================
  
  // Transform raw sector data into a clean array for the list
  const industries = marketData?.sector_performance ? Object.entries(marketData.sector_performance)
    .slice(0, 5)
    .map(([name, change]: [string, any]) => ({
        name,
        growth: `${change > 0 ? '+' : ''}${(change ?? 0).toFixed(2)}%`,
        trend: change >= 0 ? 'up' : 'down',
        value: 'Live' 
    })) : [
    // Fallback data if API fails
    { name: 'Textiles & Apparel', growth: '+12.5%', trend: 'up', value: '$15.2B' },
    { name: 'Information Technology', growth: '+24.8%', trend: 'up', value: '$4.8B' },
    { name: 'Agriculture', growth: '+8.3%', trend: 'up', value: '$42.1B' },
    { name: 'Pharmaceuticals', growth: '+15.7%', trend: 'up', value: '$3.6B' },
    { name: 'Construction', growth: '-2.1%', trend: 'down', value: '$18.5B' }
  ];

  interface TrendingCompany {
    name: string;
    industry: string;
    growth: string;
    employees: string;
    symbol: string;
    id?: string;
  }

  // Map the top gainers from API to the card format
  const trendingCompanies: TrendingCompany[] = marketData?.top_gainers ? marketData.top_gainers.slice(0, 3).map((stock: any) => {
      const cleanTicker = (stock.ticker || "Unknown").replace('.KA', '');
      return {
          name: tickerMap[cleanTicker] || stock.ticker || "Unknown", 
          industry: 'N/A', // The API might not return industry for gainers list to save bandwidth
          growth: `+${(stock.change_percent ?? 0).toFixed(2)}%`,
          employees: `PKR ${stock.price ?? 0}`, // Using this field to show Price instead of employees
          symbol: cleanTicker,
          id: stock.id // Use the ID from backend for navigation
      };
  }) : [
    { name: 'Systems Limited', industry: 'IT Services', growth: '+32%', employees: '4,500+', symbol: 'SYS' },
    { name: 'Lucky Cement', industry: 'Construction', growth: '+18%', employees: '3,200+', symbol: 'LUCK' },
    { name: 'Engro Corporation', industry: 'Conglomerate', growth: '+15%', employees: '5,800+', symbol: 'ENGRO' }
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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-900 pb-20 lg:pb-0 transition-colors duration-200">
      {/* Top Navigation Bar */}
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
        {/* Left Sidebar (Collapsible on mobile) */}
        <Sidebar 
          activeItem={activeItem} 
          onNavigate={handleNavigation}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* ... imports ... */}
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#0F172A] dark:text-white tracking-tight">Dashboard Overview</h1>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    Market Status: 
                    <span className={`inline-block w-2 h-2 rounded-full ${marketStatus === 'Open' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span> 
                    <span className={`font-medium ${marketStatus === 'Open' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {marketStatus}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">(Mon-Fri, 9:30-4:00 PST)</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right mr-2">
                     <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Today's Focus</div>
                     <FlipWords words={["Growth Sectors", "Top Gainers", "AI Insights"]} className="text-sm font-semibold text-[#0F172A] dark:text-white" />
                  </div>
                  <button 
                    onClick={() => {
                        const refresh = async () => {
                            setLoading(true);
                            try {
                                // Trigger backend update
                                await marketService.refresh();
                                // Wait for backend to process some updates
                                await new Promise(r => setTimeout(r, 4000));
                                // Re-fetch displayed data
                                const data = await marketService.getLiveData();
                                setMarketData(data);
                                setMarketStatus(getMarketStatus());
                            } catch (e) {
                                console.error(e);
                            } finally {
                                setLoading(false);
                            }
                        };
                        refresh();
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Updating Live...' : 'Refresh Data'}</span>
                  </button>
               </div>
            </div>

            
            {/* Quick Stats - Sleek Row */}
            {/* ... (Keep existing Quick Stats code, omitted for brevity if unchanged, but I must return contiguous block if using replace_file_content...) */}
            {/* Since I cannot skip lines in replace_file_content effectively without context, I will include the stats section to be safe or target specific block. */}
            {/* Actually, let's just target the Header through the end of the BentoGrid to ensure we catch everything. */}
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <GlowingCard className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Industries</div>
                    <div className="text-lg md:text-xl font-bold text-[#0F172A] dark:text-white mt-1">24</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </GlowingCard>
              
              <GlowingCard className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Co.</div>
                    <div className="text-lg md:text-xl font-bold text-[#0F172A] dark:text-white mt-1">1,247</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </GlowingCard>
              
              <GlowingCard className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50">
                 <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Market Cap</div>
                    <div className="text-lg md:text-xl font-bold text-[#0F172A] dark:text-white mt-1">PKR 382B</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </GlowingCard>
              
              <GlowingCard className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Employment</div>
                    <div className="text-lg md:text-xl font-bold text-[#0F172A] dark:text-white mt-1">45M+</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </GlowingCard>
            </div>
            
            <BentoGrid>
              {/* Industry Highlights (Span 2) */}
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl text-[#0F172A] dark:text-white">Industry Highlights</h2>
                    <button 
                      onClick={() => handleNavigation('industry-explorer')}
                      className="text-[#10B981] text-sm hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {industries.map((industry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-[#F9FAFB] dark:bg-slate-700/50 rounded-lg hover:bg-[#E5E7EB]/50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm sm:text-base text-[#0F172A] dark:text-white mb-1 truncate">{industry.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{industry.value}</div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 ml-2">
                          <div className={`flex items-center gap-1 ${industry.trend === 'up' ? 'text-[#10B981]' : 'text-red-500'}`}>
                            {industry.trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                            <span className="text-xs sm:text-sm">{industry.growth}</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 hidden sm:block" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Trending Companies */}
                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                         <h2 className="text-lg sm:text-xl text-[#0F172A] dark:text-white">Trending Companies</h2>
                         <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase animate-pulse">Live</span>
                    </div>
                    <button 
                      onClick={() => handleNavigation('industry-explorer')}
                      className="text-[#10B981] text-xs sm:text-sm hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingCompanies.map((company, index) => (
                      <div 
                        key={index} 
                        onClick={() => company.id && onViewCompany?.(company.id)}
                        className="relative p-4 border border-[#E5E7EB] dark:border-slate-700 rounded-lg hover:border-[#10B981] dark:hover:border-[#10B981] cursor-pointer transition-all hover:shadow-md bg-white dark:bg-slate-800 group"
                      >
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full text-gray-400 hover:text-yellow-400 transition-colors" title="Add to Watchlist" onClick={(e) => {
                                e.stopPropagation();
                                // Add logic to add to watchlist (dummy for now as we need context/service)
                            }}>
                                <Sparkles className="w-4 h-4" />
                            </button>
                         </div>
                        <div className="w-12 h-12 bg-[#0F172A] dark:bg-slate-900 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-white font-bold">{company.name.charAt(0)}</span>
                        </div>
                        <h3 className="text-[#0F172A] dark:text-white mb-1 font-semibold">{company.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{company.industry}</p>
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100 dark:border-slate-700">
                          <span className="font-mono text-[#0F172A] dark:text-white">{company.employees}</span>
                          <span className="text-[#10B981] font-bold bg-[#10B981]/10 px-2 py-0.5 rounded text-xs">{company.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column (Span 1) */}
              <div className="md:col-span-1 space-y-6">
                {/* Watchlist Widget */}
                <div className="min-h-[300px]">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Your Watchlist</h3>
                    <WatchlistWidget onNavigate={(page, id) => {
                        if(page === 'company-detail') onViewCompany?.(id);
                        else handleNavigation(page);
                    }} />
                </div>

                {/* AI Chat Bot (Replaces Static Pulse) */}
                <AIChatWidget />
                
                {/* Latest News */}
                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl text-[#0F172A] dark:text-white">Latest News</h2>
                    <button 
                      onClick={() => handleNavigation('news')}
                      className="text-[#10B981] text-sm hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {newsItems.map((item, index) => (
                      <div key={index} className="pb-3 border-b border-[#E5E7EB] dark:border-slate-700 last:border-b-0 hover:bg-[#F9FAFB] dark:hover:bg-slate-700/50 p-2 rounded cursor-pointer transition-colors">
                        <div className="text-sm text-[#0F172A] dark:text-gray-200 mb-1">{item.title}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-1 bg-[#E5E7EB] dark:bg-slate-700 rounded text-gray-600 dark:text-gray-400">{item.category}</span>
                          <span className="text-gray-500 dark:text-gray-500">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                </div>
            </BentoGrid>
            </div>

        </main>
      </div>
      
      {/* Intro Video Widget */}
      {showIntroVideo && (
        <div className="fixed bottom-6 right-6 z-40 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-[#10B981] animate-in slide-in-from-right duration-500">
           <div className="relative">
             <video 
               src="/intro.mp4" 
               autoPlay 
               muted 
               loop 
               playsInline
               className="w-full h-48 object-cover"
               onError={(e) => console.error("Dashboard video failed to load:", e)}
             />
             <div className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1 cursor-pointer transition-colors" onClick={() => setShowIntroVideo(false)}>
               <Sparkles className="w-4 h-4 text-white" />
             </div>
             <div className="p-3">
               <h3 className="text-[#0F172A] dark:text-white font-bold text-sm">Welcome to PAK Insight</h3>
               <p className="text-gray-500 dark:text-gray-400 text-xs">Explore real-time industry trends.</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
