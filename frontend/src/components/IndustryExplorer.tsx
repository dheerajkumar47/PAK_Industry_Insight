import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { Filter, TrendingUp, TrendingDown, Grid, List, Building2, MapPin, ArrowLeft, Server, Layers, Leaf, Zap, DollarSign, ArrowUpRight, ArrowRight, Search } from 'lucide-react';
import { companyService, industryService } from '../services/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface IndustryExplorerProps {
  onNavigate: (page: string) => void;
  onViewCompany?: (id: string) => void;
  onLogout?: () => void;
}

export function IndustryExplorer({ onNavigate, onViewCompany, onLogout }: IndustryExplorerProps) {
  const [activeItem, setActiveItem] = React.useState('industry-explorer');
  const [viewMode, setViewMode] = useState<'sectors' | 'companies'>('sectors');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Hardcoded sectors for the "Sector View"
  const sectors = [
    { id: 'Technology', name: 'Technology', count: 156, growth: '+24%', icon: Server },
    { id: 'Textiles', name: 'Textiles', count: 89, growth: '+12%', icon: Layers },
    { id: 'Agriculture', name: 'Agriculture', count: 245, growth: '+8%', icon: Leaf },
    { id: 'Energy', name: 'Energy', count: 42, growth: '+5%', icon: Zap },
    { id: 'Finance', name: 'Finance', count: 67, growth: '+15%', icon: DollarSign },
    { id: 'Construction', name: 'Construction', count: 120, growth: '-2%', icon: Building2 },
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
  };

  const handleBackToSectors = () => {
    setSelectedSector(null);
    setViewMode('sectors');
    setCompanies([]);
  };

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
          <div className="max-w-[1600px] mx-auto">
            
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white mb-2">
                    {viewMode === 'sectors' ? 'Industry Sectors' : `${selectedSector} Companies`}
                </h1>
                <p className="text-sm sm:text-base text-[#64748B] dark:text-gray-400">
                    {viewMode === 'sectors' 
                        ? 'Explore Pakistan\'s key economic sectors' 
                        : `Browse top companies in the ${selectedSector} sector`}
                </p>
              </div>
              
              {viewMode === 'companies' && (
                  <button 
                    onClick={handleBackToSectors}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0F172A] dark:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Sectors
                  </button>
              )}
            </div>

            {viewMode === 'sectors' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectors.map((sector) => {
                        const Icon = sector.icon;
                        return (
                            <Card 
                                key={sector.id}
                                className="group cursor-pointer hover:border-[#10B981] dark:hover:border-[#10B981] transition-all duration-300 hover:shadow-lg bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700"
                                onClick={() => handleSectorClick(sector.id)}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center group-hover:bg-[#10B981] transition-colors duration-300">
                                            <Icon className="w-6 h-6 text-[#10B981] group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm font-medium ${sector.growth.startsWith('+') ? 'text-[#10B981]' : 'text-red-500'}`}>
                                            {sector.growth}
                                            {sector.growth.startsWith('+') ? <ArrowUpRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 rotate-45" />}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">{sector.name}</h3>
                                    <p className="text-[#64748B] dark:text-gray-400">{sector.count} Companies Listed</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {viewMode === 'companies' && (
              <div className="space-y-6">
                <Card className="p-4 bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Search within this sector..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-[#10B981]"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white transition-colors">
                            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span>Filter</span>
                        </button>
                    </div>
                </Card>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
                    </div>
                ) : companies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <Card 
                                key={company.id}
                                className="group cursor-pointer hover:border-[#10B981] dark:hover:border-[#10B981] hover:shadow-md transition-all bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700"
                                onClick={() => onViewCompany?.(company.id)}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gray-900 dark:bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                            {company.name.charAt(0)}
                                        </div>
                                        <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-xs font-medium rounded-full">
                                            {company.industry}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-1 group-hover:text-[#10B981] transition-colors">{company.name}</h3>
                                    <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4 line-clamp-2">{company.description || "Leading company in the sector."}</p>
                                    
                                    <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-sm">
                                        <div className="text-[#64748B] dark:text-gray-400">
                                            REVENUE
                                            <div className="font-semibold text-[#0F172A] dark:text-white">{company.revenue || "N/A"}</div>
                                        </div>
                                        <div className="text-right text-[#64748B] dark:text-gray-400">
                                            EMPLOYEES
                                            <div className="font-semibold text-[#0F172A] dark:text-white">{company.employees || "N/A"}</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No companies found in this sector.</p>
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
