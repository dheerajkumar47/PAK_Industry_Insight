import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { Filter, TrendingUp, TrendingDown, Grid, List, Building2, MapPin, ArrowLeft, Server, Layers, Leaf, Zap, DollarSign, ArrowUpRight, ArrowRight, Search } from 'lucide-react';
import { companyService, industryService, marketService } from '../services/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface IndustryExplorerProps {
  onNavigate: (page: string) => void;
  onViewCompany?: (id: string) => void;
  onLogout?: () => void;
  initialViewMode?: 'sectors' | 'companies';
}

export function IndustryExplorer({ onNavigate, onViewCompany, onLogout, initialViewMode = 'sectors' }: IndustryExplorerProps) {
  // Set active item based on the mode we entered in
  const [activeItem, setActiveItem] = React.useState(initialViewMode === 'companies' ? 'companies' : 'industry-explorer');
  const [viewMode, setViewMode] = useState<'sectors' | 'companies'>(initialViewMode);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [sectorPerformance, setSectorPerformance] = useState<Record<string, number>>({});

  useEffect(() => {
     const fetchMarketData = async () => {
         try {
             const data = await marketService.getLiveData();
             if (data?.sector_performance) {
                 setSectorPerformance(data.sector_performance);
             }
         } catch (e) {
             console.error("Failed to load sector performance", e);
         }
     };
     fetchMarketData();
  }, []);

  // Hardcoded sectors for the "Sector View"
  // Updated to match expanded PSX sectors from database (79 companies, 18 sectors)
  const sectors = [
    { id: 'Energy', name: 'Energy', count: 15, growth: '+5%', icon: Zap },
    { id: 'Banking & Financial Services', name: 'Banking & Financial Services', count: 12, growth: '+15%', icon: DollarSign },
    { id: 'Cement', name: 'Cement', count: 12, growth: '+12%', icon: Layers },
    { id: 'Textile & Apparel', name: 'Textile & Apparel', count: 5, growth: '+8%', icon: Leaf },
    { id: 'Chemicals & Fertilizers', name: 'Chemicals & Fertilizers', count: 11, growth: '+10%', icon: Building2 },
    { id: 'Automotive', name: 'Automotive', count: 7, growth: '-2%', icon: Building2 },
    { id: 'Food & Agriculture', name: 'Food & Agriculture', count: 5, growth: '+6%', icon: Leaf },
    { id: 'Pharmaceuticals', name: 'Pharmaceuticals', count: 6, growth: '+18%', icon: Building2 },
    { id: 'Insurance', name: 'Insurance', count: 4, growth: '+12%', icon: DollarSign },
    { id: 'Steel & Materials', name: 'Steel & Materials', count: 5, growth: '+4%', icon: Layers },
    { id: 'Telecom', name: 'Telecom', count: 2, growth: '+3%', icon: Server },
    { id: 'Technology', name: 'Technology', count: 9, growth: '+24%', icon: Server },
    { id: 'Paper & Board', name: 'Paper & Board', count: 4, growth: '+5%', icon: Layers },
    { id: 'Cable & Electrical Goods', name: 'Cable & Electrical Goods', count: 2, growth: '+7%', icon: Building2 },
    { id: 'Sugar', name: 'Sugar', count: 5, growth: '+3%', icon: Leaf },
    { id: 'Engineering', name: 'Engineering', count: 1, growth: '+8%', icon: Building2 },
    { id: 'Vanaspati & Allied', name: 'Vanaspati & Allied', count: 1, growth: '+4%', icon: Leaf },
    { id: 'Refinery', name: 'Refinery', count: 4, growth: '+6%', icon: Layers },
    { id: 'Tobacco', name: 'Tobacco', count: 2, growth: '+2%', icon: Building2 },
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const allCompanies = await companyService.getAll(selectedSector || undefined);
        setCompanies(allCompanies);
      } catch (error) {
        console.error("Failed to fetch companies", error);
      } finally {
        setLoading(false);
      }
    };

    if (viewMode === 'companies') {
      fetchCompanies();
    }
  }, [viewMode, selectedSector]);

  const handleSectorClick = (sectorId: string) => {
    setSelectedSector(sectorId);
    setViewMode('companies');
    // Keep sidebar on industry explorer as we are just drilling down
  };

  const handleBackToSectors = () => {
    setSelectedSector(null);
    setViewMode('sectors');
    setCompanies([]);
  };

  const getHeaderTitle = () => {
    if (viewMode === 'sectors') return 'Industry Sectors';
    if (selectedSector) return `${selectedSector} Companies`;
    return 'All Companies';
  };

  const getHeaderSubtitle = () => {
    if (viewMode === 'sectors') return 'Explore Pakistan\'s key economic sectors';
    if (selectedSector) return `Browse top companies in the ${selectedSector} sector`;
    return 'Browse all registered companies in the database';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('revenue-desc');
  const [showHighRevenue, setShowHighRevenue] = useState(false);

  // Filter and Sort Logic
  const filteredCompanies = React.useMemo(() => {
    let result = [...companies];

    // 1. Search Filter
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. High Revenue Filter (> 1B PKR)
    if (showHighRevenue) {
      result = result.filter(c => typeof c.revenue === 'number' && c.revenue > 1000000000);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'revenue-desc':
          return (b.revenue || 0) - (a.revenue || 0);
        case 'employees-desc':
          // Helper to parse "4,500+" or similar strings if needed, assuming API returns straight numbers or clean strings
          const empA = parseInt(String(a.employees_count || a.employees || '0').replace(/[^0-9]/g, '')) || 0;
          const empB = parseInt(String(b.employees_count || b.employees || '0').replace(/[^0-9]/g, '')) || 0;
          return empB - empA;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [companies, searchQuery, showHighRevenue, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 pb-20 lg:pb-0 transition-colors duration-200 font-sans">
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

        <main className="flex-1 p-4 lg:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                  {getHeaderTitle()}
                </h1>
                <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1">
                  {getHeaderSubtitle()}
                </p>
              </div>

              {viewMode === 'companies' && initialViewMode !== 'companies' && (
                <button
                  onClick={handleBackToSectors}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#0F172A] dark:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sectors
                </button>
              )}
            </div>

            {viewMode === 'sectors' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {sectors.map((sector) => {
                  const Icon = sector.icon;
                  const liveVal = sectorPerformance[sector.name] || parseFloat(sector.growth) || 0; 
                  const growthStr = `${liveVal > 0 ? '+' : ''}${liveVal.toFixed(2)}%`;
                  const isPositive = liveVal >= 0;

                  return (
                    <Card
                      key={sector.id}
                      className="group cursor-pointer hover:border-[#10B981] dark:hover:border-[#10B981] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden"
                      onClick={() => handleSectorClick(sector.id)}
                    >
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center group-hover:bg-[#10B981] transition-colors duration-300">
                            <Icon className="w-5 h-5 text-[#10B981] group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-[#10B981]' : 'text-red-500'} bg-[#10B981]/5 px-1.5 py-0.5 rounded`}>
                            {growthStr}
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowRight className="w-3 h-3 rotate-45" />}
                          </div>
                        </div>
                        <h3 className="text-sm font-bold text-[#0F172A] dark:text-white mb-1 leading-tight group-hover:text-[#10B981] transition-colors">{sector.name}</h3>
                        <p className="text-xs text-[#64748B] dark:text-gray-500 mt-auto">{sector.count} Companies</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {viewMode === 'companies' && (
              <div className="space-y-4">
                <Card className="p-3 bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 rounded-xl shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search within this sector..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 transition-all"
                      />
                    </div>
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors bg-white dark:bg-slate-800 shrink-0">
                              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span>Filter & Sort</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl rounded-xl mr-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sort By</h4>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'revenue-desc', label: 'Revenue (High to Low)' },
                                            { id: 'employees-desc', label: 'Employees (High to Low)' },
                                            { id: 'name-asc', label: 'Name (A-Z)' },
                                        ].map((option) => (
                                            <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sortBy === option.id ? 'border-[#10B981]' : 'border-gray-300'}`}>
                                                    {sortBy === option.id && <div className="w-2 h-2 rounded-full bg-[#10B981]" />}
                                                </div>
                                                <input 
                                                    type="radio" 
                                                    name="sort" 
                                                    className="hidden" 
                                                    checked={sortBy === option.id}
                                                    onChange={() => setSortBy(option.id)}
                                                />
                                                <span className={`text-sm ${sortBy === option.id ? 'text-[#0F172A] font-medium' : 'text-gray-600'}`}>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filters</h4>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${showHighRevenue ? 'bg-[#10B981] border-[#10B981]' : 'border-gray-300'}`}>
                                            {showHighRevenue && <div className="text-white text-[10px] font-bold">✓</div>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={showHighRevenue} 
                                            onChange={() => setShowHighRevenue(!showHighRevenue)}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">High Revenue (&gt;1B PKR)</span>
                                    </label>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                  </div>
                </Card>

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
                  </div>
                ) : filteredCompanies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCompanies.map((company) => (
                      <Card
                        key={company.id}
                        className="group cursor-pointer hover:border-[#10B981] dark:hover:border-[#10B981] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 rounded-xl"
                        onClick={() => onViewCompany?.(company.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gray-900 dark:bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {company.name.charAt(0)}
                            </div>
                            <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[10px] uppercase font-bold tracking-wider rounded-full">
                              {company.industry}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1 group-hover:text-[#10B981] transition-colors leading-tight line-clamp-1">{company.name}</h3>
                          <p className="text-xs text-[#64748B] dark:text-gray-400 mb-3 line-clamp-2 h-8 leading-relaxed">{company.description || "Leading company in the sector."}</p>

                          <div className="pt-3 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="text-[#64748B] dark:text-gray-500">
                              Rev: <span className="font-semibold text-[#0F172A] dark:text-white ml-1">{company.revenue ? (typeof company.revenue === 'number' ? `${(company.revenue / 1000000000).toFixed(1)}B` : company.revenue) : "-"}</span>
                            </div>
                            <div className="text-[#64748B] dark:text-gray-500">
                              Emp: <span className="font-semibold text-[#0F172A] dark:text-white ml-1">{company.employees_count || company.employees || "-"}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                    <p className="text-gray-500 dark:text-gray-400">No companies found matching your filters.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
