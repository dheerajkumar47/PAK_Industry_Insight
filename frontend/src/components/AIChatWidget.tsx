import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { aiService, companyService } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatWidget() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Market AI Assistant. Ask me about stock trends, company insights, or market updates.",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      let responseText = "I'm analyzing the market data for you...";
      const lowerQuery = userMsg.content.toLowerCase();
      
      // 1. Check for Ticker Symbol (3-5 UPPERCASE letters) or "price of X"
      // Simple extraction: find first word that is 3-5 chars ? 
      // Better: check specific intent keywords
      const stockIntent = lowerQuery.includes('price') || lowerQuery.includes('stock') || lowerQuery.includes('analysis') || /^[a-z]{3,5}$/i.test(lowerQuery);
      
      if (stockIntent) {
        // Attempt to extract ticker. If user typed "SYS", assume SYS.
        // If "price of SYS", extract SYS.
        const words = userMsg.content.split(' ');
        const possibleTicker = words.find(w => /^[A-Za-z]{3,5}$/.test(w) && w.toUpperCase() !== "PRICE" && w.toUpperCase() !== "STOCK");
        
        if (possibleTicker) {
            try {
                // Clean ticker: 'SYS.KA' -> 'SYS'
                const cleanTicker = possibleTicker.replace('.KA', '').toUpperCase();
                
                // search uses 'q' query
                console.log("Searching for:", cleanTicker);
                const results = await companyService.search(cleanTicker);
                
                if (results && results.length > 0) {
                    // Find exact match or take first
                    const company = results.find((c:any) => c.symbol.includes(cleanTicker)) || results[0];
                    
                    // Try to get detailed live data using ID
                     try {
                         // Use ID for lookup, as Symbol lookup is not supported by backend getById
                         const detail = await companyService.getById(company.id);
                         if (detail) {
                             const price = detail.current_price || detail.price || "N/A";
                             const change = detail.change_percent ? `${detail.change_percent}%` : "0%";
                             responseText = `**${detail.name} (${detail.symbol})**\nPrice: PKR ${price}\nChange: ${change}\nSector: ${detail.industry || 'N/A'}`;
                         } else {
                             throw new Error("No detail");
                         }
                     } catch (e) {
                         // Fallback to basic info if Detail API fails
                         responseText = `**${company.name} (${company.symbol})**\nFound, but live data is currently unavailable.`;
                     }
                } else {
                    responseText = `I searched for "${cleanTicker}" but couldn't find a matching stock. Try full name or ticker (e.g. SYSTEMS).`;
                }
            } catch (err) {
                console.error("AI Stock Lookup Error:", err);
                responseText = "I encountered an error looking up that stock. Please try again.";
            }
        } else {
             responseText = "Please specify the proper stock ticker (e.g., SYS, LUCK, ENGRO).";
        }

      } else if (lowerQuery.includes('trend') || lowerQuery.includes('market')) {
         const pulse = await aiService.getMarketPulse();
         responseText = pulse.summary || "The market is showing mixed signals today. Please check the dashboard for specific sector performance.";
      } else {
         responseText = "I can help with Market Trends or Stock Prices. Try asking 'Price of SYS' or 'Market Trends'.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to the market brain right now. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[400px] bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4 p-2 border-b border-gray-100 dark:border-slate-700">
        <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#10B981]" />
        </div>
        <div>
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-white">Market AI Assistant</h2>
            <p className="text-xs text-gray-500">Powered by Gemini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'assistant' ? 'bg-[#10B981]/10' : 'bg-blue-100 dark:bg-blue-900'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-[#10B981]" /> : <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
              msg.role === 'assistant' 
                ? 'bg-gray-50 dark:bg-slate-700/50 text-[#0F172A] dark:text-gray-200 rounded-tl-none' 
                : 'bg-[#10B981] text-white rounded-tr-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#10B981]" />
             </div>
             <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-2xl rounded-tl-none flex items-center">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
             </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-slate-700">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about stocks, trends, or analysis..."
          className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#10B981] dark:text-white"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !query.trim()}
          className="p-2 bg-[#10B981] text-white rounded-full hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
