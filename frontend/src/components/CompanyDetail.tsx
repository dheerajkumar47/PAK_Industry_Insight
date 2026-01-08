import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { DataWidget } from './DataWidget';
import { Building2, Users, TrendingUp, Calendar, MapPin, Globe, Sparkles, ExternalLink, Youtube, Newspaper, ArrowLeft, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { companyService, watchlistService, aiService } from '../services/api';
import { authService } from '../services/auth';

interface CompanyDetailProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
  onViewCompany?: (id: string) => void;
  companyId?: string | null;
  backTo?: string;
}

export function CompanyDetail({ onNavigate, onLogout, onViewCompany, companyId, backTo }: CompanyDetailProps) {
  const [activeItem] = React.useState('companies');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // Mock data for fallback
  const mockCompany = {
    id: '1',
    name: 'Systems Limited',
    industry: 'Technology',
    description: 'Systems Limited is a global technology powerhouse that holds the distinction of being Pakistan\'s first software house. The company provides IT services and BPO solutions to clients globally.',
    location: 'Lahore, Pakistan',
    employees: '5000+',
    revenue: '$120M+',
    founded: '1977',
    website: 'www.systemsltd.com',
    stockSymbol: 'SYS',
    stockPrice: '450.25',
    marketCap: '$1.2B',
    ceo: 'Asif Peer',
    net_profit: '$15M',
    export_markets: ['USA', 'Europe', 'Middle East'],
    certifications: ['ISO 27001', 'CMMI Level 5']
  };

  const [swot, setSwot] = useState<any>(null);
  const [swotLoading, setSwotLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [companyData, user] = await Promise.all([
           companyService.getById(companyId),
           authService.getCurrentUser().catch(() => null)
        ]);
        setCompany(companyData || mockCompany);
        
        if (user && user.watchlist && user.watchlist.includes(companyId)) {
            setIsWatched(true);
        }
      } catch (error) {
        console.error("Failed to fetch company:", error);
        setCompany(mockCompany);
      } finally {
        setLoading(false);
      }
    };

    const fetchAiData = async () => {
        if (!companyId) return;
        setSwotLoading(true);
        try {
            const data = await aiService.getCompanyInsight(companyId);
            setSwot(data);
        } catch (e) {
            console.error("SWOT fetch failed", e);
        } finally {
            setSwotLoading(false);
        }
    };

    fetchCompanyData();
    fetchAiData();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-900">
        <Navbar
          showSearch={true}
          showProfile={true}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onLogout={onLogout}
          onProfileClick={() => onNavigate('profile')}
          onSettingsClick={() => onNavigate('settings')}
          onViewCompany={onViewCompany}
        />
        <div className="flex w-full">
          <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
          <main className="flex-1 p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
            <h2 className="text-xl text-gray-600 dark:text-gray-400">Please select a company from the Industry Explorer.</h2>
            <button
              onClick={() => onNavigate('industry-explorer')}
              className="mt-4 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669]"
            >
              Go to Explorer
            </button>
          </main>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] dark:bg-slate-900">
        <p className="text-red-500 mb-4">Company not found.</p>
        <button onClick={() => onNavigate('industry-explorer')} className="text-[#10B981] hover:underline">Back to Explorer</button>
      </div>
    );
  }

  const newsItems = [
    {
      title: `${company.name} Reports Record Growth`,
      summary: 'The company announced significant expansion in key markets.',
      source: 'Business Recorder',
      type: 'news',
      date: '2 days ago',
      sentiment: 'positive'
    },
    {
      title: 'New partnership announced with global firm',
      summary: 'Strategic alliance expected to boost service capabilities.',
      source: 'Dawn Business',
      type: 'news',
      date: '5 days ago',
      sentiment: 'positive'
    }
  ];

  const sources = [
    { type: 'website', label: 'Official Website', url: company.website },
    { type: 'news', label: 'Business Recorder', url: 'brecorder.com' },
    { type: 'news', label: 'Dawn Business', url: 'dawn.com' },
    { type: 'youtube', label: 'Tech Talks Pakistan', url: 'youtube.com' }
  ].filter(source => source.url); // Filter out null/undefined URLs

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-900 pb-20 lg:pb-0 transition-colors duration-200">
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
          onNavigate={onNavigate}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto">
            <button
              onClick={() => onNavigate(backTo || 'companies')}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#10B981] dark:hover:text-[#10B981] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {backTo === 'industry-explorer' ? 'Back to Industry Explorer' : 'Back to Companies'}
            </button>

            {/* Company Header Card */}
            <Card className="mb-8 bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
              <div className="flex flex-col md:flex-row gap-6 md:items-start">
                <div className="w-24 h-24 bg-gray-900 dark:bg-slate-900 rounded-xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {company.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white mb-2">{company.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                          <Building2 className="w-4 h-4" />
                          {company.industry}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {company.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-[#10B981] hover:underline">{company.website}</a>
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        if (watchlistLoading) return;
                        setWatchlistLoading(true);
                        try {
                            if (isWatched) {
                                await watchlistService.remove(company.id);
                                setIsWatched(false);
                            } else {
                                await watchlistService.add(company.id);
                                setIsWatched(true);
                            }
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setWatchlistLoading(false);
                        }
                      }}
                      className={`px-6 py-2 rounded-lg transition-colors shadow-sm font-medium flex items-center gap-2 ${isWatched ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-[#10B981] text-white hover:bg-[#059669]'}`}
                    >
                      {watchlistLoading ? '...' : isWatched ? 'Following' : 'Follow Company'}
                    </button>
                  </div>
                  <p className="text-[#64748B] dark:text-gray-300 leading-relaxed max-w-3xl">{company.description}</p>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Revenue</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                  {company.revenue ? (typeof company.revenue === 'number' ? `PKR ${(company.revenue / 1000000000).toFixed(1)}B` : company.revenue) : "N/A"}
                  <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">+12%</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Employees</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">{company.employees_count || company.employees || "N/A"}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">
                  {company.market_cap ? `PKR ${(company.market_cap / 1000000000).toFixed(1)}B` : company.marketCap || "N/A"}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Founded</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">{company.founded_year || company.founded || "N/A"}</div>
              </div>
            </div>

            {/* Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Financials & News */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#10B981]" />
                    <h2 className="text-xl text-[#0F172A] dark:text-white">AI Strategic Insight (SWOT)</h2>
                  </div>
                  {swotLoading ? (
                      <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                          <Loader2 className="w-8 h-8 animate-spin text-[#10B981] mb-2" />
                          <span className="text-sm">Analyzing market data...</span>
                      </div>
                  ) : swot ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                                <h4 className="font-bold text-green-700 dark:text-green-400 text-sm mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Strengths</h4>
                                <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                                    {swot.strengths?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                                </ul>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                                <h4 className="font-bold text-red-700 dark:text-red-400 text-sm mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Weaknesses</h4>
                                <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                                    {swot.weaknesses?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                                </ul>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-2 flex items-center gap-1"><Globe className="w-3 h-3"/> Opportunities</h4>
                                <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                                    {swot.opportunities?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                                </ul>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
                                <h4 className="font-bold text-orange-700 dark:text-orange-400 text-sm mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Threats</h4>
                                <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                                    {swot.threats?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="text-[10px] text-right text-gray-400 flex items-center justify-end gap-1">
                             <Sparkles className="w-3 h-3"/> Generated by Gemini AI
                        </div>
                      </div>
                  ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                          Unable to generate analysis.
                      </div>
                  )}
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6">Recent News</h3>
                  <div className="space-y-4">
                    {newsItems.map((item, index) => (
                      <a
                        key={index}
                        href={`https://www.google.com/search?q=${encodeURIComponent(item.title + " " + company.name)}&tbm=nws`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex gap-4 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors cursor-pointer group"
                      >
                        <div className="w-24 h-16 bg-gray-200 dark:bg-slate-700 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-slate-600 transition-colors">
                          <Newspaper className="w-8 h-8 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#0F172A] dark:text-white mb-1 group-hover:text-[#10B981] transition-colors">{item.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.date} • {item.source}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right: Key Executives & Similar Companies */}
              <div className="space-y-8">
                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6">Key Metrics & Leadership</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">CEO</span>
                      <span className="text-[#0F172A] dark:text-white font-medium">{company.ceo || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">Symbol</span>
                      <span className="text-[#10B981] font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">{company.ticker || company.stockSymbol || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">Net Profit</span>
                      <span className="text-[#0F172A] dark:text-white">{company.net_profit || "N/A"}</span>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6">Sources</h3>
                  <div className="space-y-3">
                    {sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url.startsWith('http') ? source.url : `https://${source.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-[#F9FAFB] dark:bg-slate-700/50 rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-slate-700 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-[#10B981]" />
                          <div>
                            <div className="text-sm text-[#0F172A] dark:text-white">{source.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{source.url}</div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#10B981]" />
                      </a>
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
