import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { TrendingUp, BarChart2, PieChart, ArrowUpRight } from 'lucide-react';

interface MarketTrendsProps {
  onNavigate: (page: string) => void;
}

export function MarketTrends({ onNavigate }: MarketTrendsProps) {
  const [activeItem] = React.useState('market-trends');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

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
            <div className="mb-8">
              <h1 className="text-3xl text-[#0F172A] mb-2">Market Trends</h1>
              <p className="text-[#1E293B]">Deep dive into market analysis and future projections</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <BarChart2 className="w-5 h-5 text-[#10B981]" />
                  <h2 className="text-xl text-[#0F172A]">Sector Performance</h2>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <span className="text-gray-400">Chart Visualization Placeholder</span>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-[#10B981]" />
                  <h2 className="text-xl text-[#0F172A]">Market Share Distribution</h2>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <span className="text-gray-400">Chart Visualization Placeholder</span>
                </div>
              </Card>
            </div>

            <Card>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
                <h2 className="text-xl text-[#0F172A]">Emerging Trends</h2>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Digital Transformation in Banking', growth: '+45%', impact: 'High' },
                  { title: 'Sustainable Textile Manufacturing', growth: '+28%', impact: 'Medium' },
                  { title: 'E-commerce Expansion in Rural Areas', growth: '+62%', impact: 'High' }
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg hover:bg-[#E5E7EB] transition-colors cursor-pointer">
                    <div>
                      <h3 className="text-[#0F172A] font-medium">{trend.title}</h3>
                      <span className="text-sm text-gray-500">Impact: {trend.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#10B981] font-bold">{trend.growth}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
