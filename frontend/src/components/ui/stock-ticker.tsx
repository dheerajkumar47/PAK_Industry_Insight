import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockTickerProps {
  stocks: any[];
}

export function StockTicker({ stocks }: StockTickerProps) {
  // Duplicate stocks to create seamless loop
  const tickerItems = [...stocks, ...stocks];

  return (
    <div className="w-full bg-[#0F172A] border-b border-gray-800 overflow-hidden py-2">
      <div className="flex animate-scroll whitespace-nowrap">
        {tickerItems.map((stock, idx) => (
          <div key={`${stock.ticker}-${idx}`} className="flex items-center gap-2 mx-6">
            <span className="font-bold text-white text-sm">{stock.ticker}</span>
            <div className={`flex items-center gap-1 text-xs ${stock.change >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
              {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{stock.price ? stock.price.toFixed(2) : '0.00'}</span>
              <span className="opacity-80">({stock.change_percent ? stock.change_percent.toFixed(2) : '0.00'}%)</span>
            </div>
          </div>
        ))}
      </div>
      {/* Add global style for animation if not present in tailwind config */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
