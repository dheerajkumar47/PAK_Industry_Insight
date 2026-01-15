import React from 'react';
import { Home, Layers, Building2, TrendingUp, Newspaper, BookmarkCheck, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ activeItem, onNavigate, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
      )}
      
      {/* Desktop Sidebar (Collapsible) */}
      <aside 
         className={`hidden lg:flex flex-col border-r border-[#E5E7EB] dark:border-slate-800 h-[calc(100vh-64px)] sticky top-16 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out ${
           isCollapsed ? 'w-20' : 'w-64'
         }`}
      >
        <div className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-200">
                        {item.label}
                    </span>
                )}
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                    <div className="absolute left-16 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                    </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Toggle Button */}
        <div className="p-4 border-t border-[#E5E7EB] dark:border-slate-800">
             <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} p-2 text-gray-400 hover:text-[#10B981] transition-colors`}
             >
                 {isCollapsed ? <ChevronRight className="w-5 h-5"/> : (
                     <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                         <span>Collapse</span>
                         <ChevronLeft className="w-5 h-5"/>
                     </div>
                 )}
             </button>
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
