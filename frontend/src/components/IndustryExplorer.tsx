import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { Filter, TrendingUp, TrendingDown, Grid, List, Building2, MapPin, ArrowLeft } from 'lucide-react';
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
  const [activeItem] = React.useState('industry-explorer');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  
  // State for Sector View vs Company View
  const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Industries on Mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await industryService.getAll();
        setIndustries(data);
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  // Fetch Companies when an Industry is selected
  useEffect(() => {
    const fetchCompanies = async () => {
      if (!selectedIndustry) return;
      setLoading(true);
      try {
        const data = await companyService.getAll(selectedIndustry.name);
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [selectedIndustry]);

  const handleIndustryClick = (industry: any) => {
    setSelectedIndustry(industry);
  };

  const handleBackToSectors = () => {
    setSelectedIndustry(null);
    setCompanies([]);
  };

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
          onNavigate={onNavigate}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {selectedIndustry && (
                    <button 
                      onClick={handleBackToSectors}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6 text-[#0F172A]" />
                    </button>
                  )}
                  <h1 className="text-2xl sm:text-3xl text-[#0F172A]">
                    {selectedIndustry ? selectedIndustry.name : 'Industry Explorer'}
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-[#1E293B] mt-1">
                  {selectedIndustry 
                    ? `Explore companies in the ${selectedIndustry.name} sector`
                    : "Explore Pakistan's diverse industrial sectors"}
                </p>
              </div>
              
              {/* Filters & View Mode (Only show in Company View for now, or keep generic) */}
              <div className="flex items-center gap-2 relative">
                 {/* ... Keep existing filter buttons ... */}
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-1 w-full">
                {loading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : (
                  <>
                    {/* SECTOR VIEW */}
                    {!selectedIndustry && (
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4'}>
                        {industries.map((industry, index) => (
                          <Card key={index} hover>
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h3 className="text-lg text-[#0F172A] font-semibold">{industry.name}</h3>
                                <div className="flex items-center gap-1 text-[#10B981]">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="text-sm">Growing</span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600">{industry.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {industry.tags?.map((tag: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-[#E5E7EB] text-xs rounded-full text-[#0F172A]">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <button 
                                onClick={() => handleIndustryClick(industry)}
                                className="w-full py-2 bg-[#F9FAFB] text-[#0F172A] rounded-lg hover:bg-[#10B981] hover:text-white transition-colors"
                              >
                                View Companies
                              </button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* COMPANY VIEW (Drill Down) */}
                    {selectedIndustry && (
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4'}>
                        {companies.length === 0 ? (
                          <div className="text-center py-10 text-gray-500">No companies found in this sector yet.</div>
                        ) : (
                          companies.map((company, index) => (
                            <Card key={index} hover>
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <h3 className="text-lg text-[#0F172A] font-semibold">{company.name}</h3>
                                  <div className="flex items-center gap-1 text-[#10B981]">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm">High Growth</span>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                      <Building2 className="w-4 h-4" />
                                      <span>{company.industry}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{company.location}</span>
                                  </div>
                                </div>
                                
                                <button 
                                  onClick={() => onViewCompany?.(company.id)}
                                  className="w-full py-2 bg-[#F9FAFB] text-[#0F172A] rounded-lg hover:bg-[#10B981] hover:text-white transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
