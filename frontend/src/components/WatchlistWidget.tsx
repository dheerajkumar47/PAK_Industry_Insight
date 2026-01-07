import React, { useEffect, useState } from 'react';
import { watchlistService } from '../services/api';
import { Loader2, Star, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';


interface WatchedCompany {
  id: string;
  name: string;
  ticker: string;
  stockPrice?: number | string;
  change_percent?: number;
}

interface WatchlistWidgetProps {
    onNavigate: (page: string, id: string) => void;
}

export function WatchlistWidget({ onNavigate }: WatchlistWidgetProps) {
  const [companies, setCompanies] = useState<WatchedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const data = await watchlistService.get();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load watchlist", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#10B981]" />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-full mb-3">
            <Star className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Your Watchlist is Empty</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Star companies to track them here.</p>
        <button 
            onClick={() => onNavigate('industry-explorer', '')}
            className="text-sm font-medium text-[#10B981] hover:underline"
        >
            Browse Companies
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#EAB308] fill-[#EAB308]" />
            <h3 className="font-bold text-gray-800 dark:text-white">My Watchlist</h3>
        </div>
        <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
            {companies.length}
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        {companies.map((company) => (
          <div 
            key={company.id}
            onClick={() => onNavigate('company-detail', company.id)}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors group"
          >
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{company.ticker || "N/A"}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{company.name}</div>
            </div>
            
            <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                    {company.stockPrice ? typeof company.stockPrice === 'number' ? `PKR ${company.stockPrice}` : company.stockPrice : '-'}
                </div>
                {company.change_percent !== undefined && company.change_percent !== null && (
                   <div className={`text-xs flex items-center justify-end gap-1 ${company.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {company.change_percent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(company.change_percent).toFixed(2)}%
                   </div> 
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
