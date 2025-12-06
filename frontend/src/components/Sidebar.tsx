import React from 'react';
import { Home, Layers, Building2, TrendingUp, Newspaper, BookmarkCheck, X } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ activeItem, onNavigate, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'industry-explorer', label: 'Industry Explorer', icon: Layers },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'market-trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'news', label: 'News & Insights', icon: Newspaper },
    { id: 'saved', label: 'Saved Reports', icon: BookmarkCheck }
  ];

  const handleNavigation = (item: string) => {
    onNavigate(item);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onMobileClose}
        />
      )}
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-[#E5E7EB] dark:border-slate-800 h-screen sticky top-0 transition-colors duration-200">
        <div className="p-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive 
                    ? 'bg-[#10B981] text-white' 
                    : 'text-[#0F172A] dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
      
      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden fixed top-0 left-0 w-64 bg-white dark:bg-slate-900 h-screen z-50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-[#0F172A] dark:text-white font-semibold">Menu</span>
            </div>
            <button 
              onClick={onMobileClose}
              className="p-2 hover:bg-[#E5E7EB] dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#0F172A] dark:text-gray-300" />
            </button>
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive 
                    ? 'bg-[#10B981] text-white' 
                    : 'text-[#0F172A] dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
      
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-[#E5E7EB] dark:border-slate-800 z-30">
        <div className="flex items-center justify-around px-2 py-3">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-[#10B981]' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
