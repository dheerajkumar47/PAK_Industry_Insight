import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { Filter, TrendingUp, TrendingDown, Grid, List } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface IndustryExplorerProps {
  onNavigate: (page: string) => void;
  onViewCompany?: () => void;
}

export function IndustryExplorer({ onNavigate, onViewCompany }: IndustryExplorerProps) {
  const [activeItem] = React.useState('industry-explorer');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);

  const industries = [
    {
      name: 'Information Technology',
      description: 'Software development, IT services, and digital solutions',
      growth: '+24.8%',
      trend: 'up',
      region: 'Nationwide',
      companies: 342,
      tags: ['Software', 'Services', 'Export']
    },
    {
      name: 'Textiles & Apparel',
      description: 'Manufacturing and export of textile products',
      growth: '+12.5%',
      trend: 'up',
      region: 'Punjab, Sindh',
      companies: 186,
      tags: ['Manufacturing', 'Export', 'Traditional']
    },
    {
      name: 'Agriculture',
      description: 'Farming, livestock, and agricultural products',
      growth: '+8.3%',
      trend: 'up',
      region: 'Nationwide',
      companies: 521,
      tags: ['Primary', 'Traditional', 'Essential']
    },
    {
      name: 'Pharmaceuticals',
      description: 'Drug manufacturing and healthcare products',
      growth: '+15.7%',
      trend: 'up',
      region: 'Karachi, Lahore',
      companies: 89,
      tags: ['Healthcare', 'Manufacturing', 'Growing']
    },
    {
      name: 'Construction & Real Estate',
      description: 'Building construction and property development',
      growth: '-2.1%',
      trend: 'down',
      region: 'Major Cities',
      companies: 234,
      tags: ['Infrastructure', 'Development']
    },
    {
      name: 'Automotive',
      description: 'Vehicle manufacturing and auto parts',
      growth: '+6.4%',
      trend: 'up',
      region: 'Karachi, Lahore',
      companies: 67,
      tags: ['Manufacturing', 'Assembly']
    },
    {
      name: 'Food & Beverages',
      description: 'Food processing and beverage production',
      growth: '+9.2%',
      trend: 'up',
      region: 'Nationwide',
      companies: 178,
      tags: ['FMCG', 'Manufacturing', 'Consumer']
    },
    {
      name: 'Financial Services',
      description: 'Banking, insurance, and financial technology',
      growth: '+11.3%',
      trend: 'up',
      region: 'Major Cities',
      companies: 124,
      tags: ['Finance', 'Services', 'Growing']
    },
    {
      name: 'Telecommunications',
      description: 'Telecom services and infrastructure',
      growth: '+7.8%',
      trend: 'up',
      region: 'Nationwide',
      companies: 45,
      tags: ['Technology', 'Infrastructure']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 lg:pb-0">
      <Navbar 
        showSearch={true} 
        showProfile={true}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
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
                <h1 className="text-2xl sm:text-3xl text-[#0F172A] mb-2">Industry Explorer</h1>
                <p className="text-sm sm:text-base text-[#1E293B]">Explore Pakistan's diverse industrial sectors</p>
              </div>
              
              <div className="flex items-center gap-2 relative">
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                  <PopoverTrigger asChild>
                    <button
                      className={`px-4 py-2 ${showFilters ? 'bg-gray-100' : 'bg-white'} text-[#0F172A] border border-[#E5E7EB] rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors`}
                    >
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">Filters</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="p-4 max-h-[80vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[#0F172A]">Filters</h3>
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="text-xs text-gray-500 hover:text-[#10B981]"
                        >
                          Close
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</label>
                          <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]">
                            <option>All Sectors</option>
                            <option>Manufacturing</option>
                            <option>Services</option>
                            <option>Technology</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Growth Rate</label>
                          <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]">
                            <option>Any Growth</option>
                            <option>High (&gt;15%)</option>
                            <option>Medium (5-15%)</option>
                            <option>Low (&lt;5%)</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</label>
                          <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]">
                            <option>All Regions</option>
                            <option>Punjab</option>
                            <option>Sindh</option>
                            <option>KPK</option>
                            <option>Balochistan</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</label>
                          <div className="space-y-2">
                            {['Manufacturing', 'Export', 'Technology', 'Services'].map((tag) => (
                              <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                  <input type="checkbox" className="peer h-4 w-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]" />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-[#0F172A] transition-colors">{tag}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="w-full py-2 bg-[#10B981] text-white font-medium rounded-lg hover:bg-[#059669] transition-colors shadow-sm hover:shadow"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#10B981] text-white' : 'bg-white text-[#0F172A] border border-[#E5E7EB]'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#10B981] text-white' : 'bg-white text-[#0F172A] border border-[#E5E7EB]'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Filters Sidebar - Desktop */}
              {/* Filters Sidebar - Removed as it's now a popover */}
              
              {/* Industry Grid/List */}
              <div className="flex-1 w-full">
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4'}>
                  {industries.map((industry, index) => (
                    <Card key={index} hover>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg text-[#0F172A]">{industry.name}</h3>
                          <div className={`flex items-center gap-1 ${industry.trend === 'up' ? 'text-[#10B981]' : 'text-red-500'}`}>
                            {industry.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-sm">{industry.growth}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">{industry.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{industry.companies} companies</span>
                          <span>•</span>
                          <span>{industry.region}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {industry.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-[#E5E7EB] text-xs rounded-full text-[#0F172A]">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <button 
                          onClick={onViewCompany}
                          className="w-full py-2 bg-[#F9FAFB] text-[#0F172A] rounded-lg hover:bg-[#10B981] hover:text-white transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
