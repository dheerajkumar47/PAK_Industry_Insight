import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, User, X, LogOut, Settings, Building2 } from 'lucide-react';
import { companyService } from '../services/api';
import { authService } from '../services/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavbarProps {
  showSearch?: boolean;
  showProfile?: boolean;
  onLoginClick?: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onViewCompany?: (id: string) => void;
}

export function Navbar({ 
  showSearch = true, 
  showProfile = false, 
  onLoginClick, 
  onMenuClick, 
  onLogout,
  onProfileClick,
  onSettingsClick,
  onViewCompany
}: NavbarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (showProfile) {
      authService.getCurrentUser().then(setUser).catch(() => {});
    }
  }, [showProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getBgColor = (name?: string) => {
    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-orange-600', 'bg-indigo-600'];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // ... (existing search logic) ...

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await companyService.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (companyId: string) => {
    onViewCompany?.(companyId);
    setSearchQuery('');
    setSearchResults([]);
    setShowMobileSearch(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-[#E5E7EB] dark:border-slate-800 px-4 sm:px-6 py-4 relative z-50 transition-colors duration-200">
      <div className="w-full">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          {showProfile && (
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-[#E5E7EB] dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-[#0F172A] dark:text-white" />
            </button>
          )}
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-lg shadow-sm" />
            <span className="text-[#0F172A] dark:text-white font-bold text-lg sm:text-xl hidden sm:inline tracking-tight">
              PAK Industry Insight
            </span>
            <span className="text-[#0F172A] dark:text-white font-bold text-lg sm:hidden tracking-tight">
              PAK Insight
            </span>
          </div>
          
          {/* Desktop Search */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search companies..."
                  className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {searchResults.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleResultClick(company.id)}
                      className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 last:border-0"
                    >
                      <div className="w-8 h-8 bg-[#0F172A] rounded flex items-center justify-center text-white text-xs">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-[#0F172A] dark:text-white">{company.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {company.industry}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            {showSearch && (
              <button 
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2 hover:bg-[#E5E7EB] dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {showMobileSearch ? (
                  <X className="w-5 h-5 text-[#0F172A] dark:text-white" />
                ) : (
                  <Search className="w-5 h-5 text-[#0F172A] dark:text-white" />
                )}
              </button>
            )}
            
            {showProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-[#E5E7EB] dark:hover:bg-slate-800 rounded-full transition-colors outline-none">
                    {user ? (
                      user.picture ? (
                        <div className="relative">
                           <img 
                             src={user.picture} 
                             alt={user.full_name} 
                             className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                           />
                           {user.picture.includes('googleusercontent') && (
                             <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm">
                               <svg className="w-3 h-3" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                             </div>
                           )}
                        </div>
                      ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${getBgColor(user.full_name)}`}>
                          {getInitials(user.full_name)}
                        </div>
                      )
                    ) : (
                      <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 border-[#E5E7EB] dark:border-slate-700">
                  <DropdownMenuLabel className="dark:text-white">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-slate-700" />
                  <DropdownMenuItem className="cursor-pointer dark:text-gray-200 dark:focus:bg-slate-700" onClick={onProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer dark:text-gray-200 dark:focus:bg-slate-700" onClick={onSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-slate-700" />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:focus:bg-slate-700" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button 
                onClick={onLoginClick}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-all shadow-lg shadow-emerald-500/20 text-sm sm:text-base"
              >
                Login
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showSearch && showMobileSearch && (
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 placeholder-gray-400 dark:placeholder-gray-500"
              />
              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                  {searchResults.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleResultClick(company.id)}
                      className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 last:border-0"
                    >
                      <div className="w-8 h-8 bg-[#0F172A] rounded flex items-center justify-center text-white text-xs">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-[#0F172A] dark:text-white">{company.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {company.industry}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
