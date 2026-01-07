import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react';
import { marketService } from '../services/api';
import { StockHeatmap } from './StockHeatmap';

interface MarketTrendsProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function MarketTrends({ onNavigate, onLogout }: MarketTrendsProps) {
  const [activeItem] = React.useState('market-trends');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  useEffect(() => {
    loadMarketData();
  }, []);

  // Compute unique sectors from stocks
  const uniqueSectors = React.useMemo(() => {
    if (!marketData?.stocks) return [];
    const sectors = marketData.stocks.map((s: any) => s.industry);
    return Array.from(new Set(sectors)).sort() as string[];
  }, [marketData]);

  // Filter stocks
  const filteredStocks = React.useMemo(() => {
    if (!marketData?.stocks) return [];
    return marketData.stocks.filter((stock: any) => {
      const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            stock.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.industry === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [marketData, searchQuery, selectedSector]);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const data = await marketService.getLiveData();
      console.log("Raw data from API:", data);
      console.log("Stocks array:", data?.stocks);
      console.log("Stocks length:", data?.stocks?.length);
      setMarketData(data);
    } catch (error) {
      console.error("Failed to load market data:", error);
    } finally {
      setLoading(false);
    }
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
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl text-[#0F172A] dark:text-white mb-2">Market Trends</h1>
              <p className="text-sm sm:text-base text-[#1E293B] dark:text-gray-400">Live market data for Pakistan Stock Exchange</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
              </div>
            ) : (
              <>
                {/* Currency Widget */}
                {marketData?.currency && marketData.currency.rate && (
                  <Card className="mb-8 bg-gradient-to-br from-[#10B981] to-[#059669] text-white border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-6 h-6" />
                          <h2 className="text-xl font-bold">{marketData.currency.pair || 'USD/PKR'}</h2>
                        </div>
                        <div className="text-3xl font-bold mb-1">PKR {marketData.currency.rate.toFixed(2)}</div>
                        <div className={`flex items-center gap-1 text-sm ${(marketData.currency.change || 0) >= 0 ? 'text-green-100' : 'text-red-100'}`}>
                          {(marketData.currency.change || 0) >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span>{(marketData.currency.change || 0).toFixed(2)} ({(marketData.currency.change_percent || 0).toFixed(2)}%)</span>
                        </div>
                      </div>
                      <div className="text-right opacity-80">
                        <div className="text-sm">Exchange Rate</div>
                        <div className="text-xs">Live from Yahoo Finance</div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Sector Performance */}
                {marketData?.sectors && marketData.sectors.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#0F172A] dark:text-white mb-4">Sector Performance</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {marketData.sectors.map((sector: any, index: number) => (
                        <Card key={index} className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-[#10B981]" />
                              <h3 className="font-semibold text-[#0F172A] dark:text-white">{sector.sector}</h3>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{sector.company_count} companies</span>
                          </div>
                          <div className={`flex items-center gap-2 ${sector.avg_change >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                            {sector.avg_change >= 0 ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : (
                              <TrendingDown className="w-5 h-5" />
                            )}
                            <span className="text-2xl font-bold">{sector.avg_change.toFixed(2)}%</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Market Heatmap - NEW */}
                <div className="mb-8">
                   <h2 className="text-xl font-bold text-[#0F172A] dark:text-white mb-4">Market Heatmap (PSX)</h2>
                   <StockHeatmap />
                </div>

                {/* Top Stocks */}
                {marketData?.stocks && marketData.stocks.length > 0 && (
                  <div>
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">Live Stock Prices</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{filteredStocks.length} stocks found</span>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                         <div className="relative flex-1 sm:w-64">
                            <input
                              type="text"
                              placeholder="Search company or ticker..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] dark:text-white"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                         </div>

                         <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] dark:text-white"
                         >
                            <option value="All">All Sectors</option>
                            {uniqueSectors.map((sector: string) => (
                              <option key={sector} value={sector}>{sector}</option>
                            ))}
                         </select>
                      </div>
                    </div>

                    <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-slate-700">
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Company</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Ticker</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Sector</th>
                              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Price (PKR)</th>
                              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Change</th>
                              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Change %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStocks.map((stock: any, index: number) => (
                              <tr key={index} className="border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="font-medium text-[#0F172A] dark:text-white">{stock.name}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{stock.ticker}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-sm px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                                    {stock.industry}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="font-semibold text-[#0F172A] dark:text-white">{stock.price.toFixed(2)}</span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className={stock.change >= 0 ? 'text-[#10B981]' : 'text-red-500'}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className={`flex items-center justify-end gap-1 font-semibold ${stock.change_percent >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                                    {stock.change_percent >= 0 ? (
                                      <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                      <ArrowDownRight className="w-4 h-4" />
                                    )}
                                    <span>{Math.abs(stock.change_percent).toFixed(2)}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                )}

                {(!marketData || marketData.total_stocks === 0) && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No market data available. Please check your database.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
