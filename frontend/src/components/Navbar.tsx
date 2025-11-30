import React, { useState } from 'react';
import { Search, Menu, User, X, LogOut, Settings } from 'lucide-react';
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
}

export function Navbar({ 
  showSearch = true, 
  showProfile = false, 
  onLoginClick, 
  onMenuClick, 
  onLogout,
  onProfileClick,
  onSettingsClick
}: NavbarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <nav className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-4">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          {showProfile && (
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-[#0F172A]" />
            </button>
          )}
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-[#0F172A] font-semibold text-base sm:text-xl hidden sm:inline">
              PAK Industry Insight
            </span>
            <span className="text-[#0F172A] font-semibold text-base sm:hidden">
              PAK Insight
            </span>
          </div>
          
          {/* Desktop Search */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search industries, companies..."
                  className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
              </div>
            </div>
          )}
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            {showSearch && (
              <button 
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors"
              >
                {showMobileSearch ? (
                  <X className="w-5 h-5 text-[#0F172A]" />
                ) : (
                  <Search className="w-5 h-5 text-[#0F172A]" />
                )}
              </button>
            )}
            
            {showProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors outline-none">
                    <User className="w-6 h-6 text-[#0F172A]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={onProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={onSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={onLogout}>
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
                placeholder="Search industries, companies..."
                className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
