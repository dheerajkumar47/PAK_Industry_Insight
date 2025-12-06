import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, User, X, LogOut, Settings, Building2 } from 'lucide-react';
import { companyService } from '../services/api';
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-[#0F172A] dark:text-white font-semibold text-base sm:text-xl hidden sm:inline">
              PAK Industry Insight
            </span>
            <span className="text-[#0F172A] dark:text-white font-semibold text-base sm:hidden">
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
                  <button className="p-2 hover:bg-[#E5E7EB] dark:hover:bg-slate-800 rounded-lg transition-colors outline-none">
                    <User className="w-6 h-6 text-[#0F172A] dark:text-white" />
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
                className="px-4 sm:px-6 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm sm:text-base"
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
