import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { User, Mail, Shield } from 'lucide-react';
import { authService } from '../services/auth';

interface ProfileProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

interface UserData {
  full_name?: string;
  email: string;
  id: string;
}

export function Profile({ onNavigate, onLogout }: ProfileProps) {
  const [activeItem] = React.useState('profile');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 lg:pb-0">
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
            <div className="mb-8">
              <h1 className="text-3xl text-[#0F172A] mb-2">My Profile</h1>
              <p className="text-[#1E293B]">Manage your account information</p>
            </div>

            <div className="max-w-2xl">
              <Card>
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading profile...</div>
                ) : user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                      <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-[#10B981]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-[#0F172A]">{user.full_name || 'User'}</h2>
                        <p className="text-gray-500">Member since 2025</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">Full Name</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-[#0F172A]">{user.full_name || 'Not provided'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">Email Address</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-[#0F172A]">{user.email}</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-1 block">Account ID</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <span className="text-[#0F172A] font-mono text-sm">{user.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-red-500">Failed to load profile data.</div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
