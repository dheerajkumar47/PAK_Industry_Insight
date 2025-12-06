import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { Lock, Moon, Smartphone, Mail, ChevronRight, X } from 'lucide-react';
import { authService, User } from '../services/auth';

interface SettingsProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Settings({ onNavigate, onLogout }: SettingsProps) {
  const [activeItem] = React.useState('settings');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage and Backend
  useEffect(() => {
    // Dark Mode (Local only)
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
      if (savedMode === 'true') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
    }

    // Notifications (Backend)
    const fetchSettings = async () => {
        try {
            const user = await authService.getCurrentUser();
            if (user) {
                setEmailNotifs(user.email_notifs ?? true);
                setPushNotifs(user.push_notifs ?? false);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };
    fetchSettings();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleEmailNotifs = async () => {
    const newState = !emailNotifs;
    setEmailNotifs(newState);
    try {
        await authService.updateUser({ email_notifs: newState });
    } catch (error) {
        console.error("Failed to update email notifications", error);
        // Revert on failure
        setEmailNotifs(!newState);
    }
  };

  const togglePushNotifs = async () => {
      const newState = !pushNotifs;
      setPushNotifs(newState);
      try {
          await authService.updateUser({ push_notifs: newState });
      } catch (error) {
          console.error("Failed to update push notifications", error);
          // Revert on failure
          setPushNotifs(!newState);
      }
  };

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setIsPasswordModalOpen(false), 2000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.detail || "Failed to update password");
    }
  };

  return (
    <div className={`min-h-screen pb-20 lg:pb-0 transition-colors duration-200 ${darkMode ? 'bg-slate-900' : 'bg-[#F9FAFB]'}`}>
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
          <div className="max-w-[1000px] mx-auto">
            <div className="mb-8">
              <h1 className={`text-3xl font-bold mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Settings</h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-[#64748B]'}`}>Manage your application preferences</p>
            </div>

            <div className="space-y-6">
              
              {/* Appearance Section */}
              <Card className={`overflow-hidden border-0 shadow-lg rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Appearance</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customize how the app looks on your device</p>
                </div>
                <div className="p-6">
                   <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                         <Moon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-semibold ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Dark Mode</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Switch between light and dark themes</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={darkMode}
                        onChange={toggleDarkMode}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10B981]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981] dark:bg-gray-600 dark:peer-checked:bg-[#10B981]"></div>
                    </label>
                  </div>
                </div>
              </Card>

              {/* Notifications Section */}
              <Card className={`overflow-hidden border-0 shadow-lg rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Notifications</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose how you want to be notified</p>
                </div>
                <div className="p-6 space-y-4">
                  
                  {/* Email Toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-semibold ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Email Notifications</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive updates about industry trends</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                         type="checkbox" 
                         className="sr-only peer" 
                         checked={emailNotifs}
                         onChange={toggleEmailNotifs}
                         disabled={loading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10B981]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981] dark:bg-gray-600 dark:peer-checked:bg-[#10B981]"></div>
                    </label>
                  </div>

                  {/* App Toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-semibold ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Push Notifications</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get real-time alerts on your device</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                         type="checkbox" 
                         className="sr-only peer" 
                         checked={pushNotifs}
                         onChange={togglePushNotifs}
                         disabled={loading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#10B981]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981] dark:bg-gray-600 dark:peer-checked:bg-[#10B981]"></div>
                    </label>
                  </div>

                </div>
              </Card>

              {/* Security Section */}
              <Card className={`overflow-hidden border-0 shadow-lg rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Account Security</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keep your account safe and secure</p>
                </div>
                <div className="p-6">
                  <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-semibold ${darkMode ? 'text-white' : 'text-[#0F172A]'}`}>Change Password</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update your password regularly</div>
                      </div>
                    </div>
                    <button 
                       onClick={() => setIsPasswordModalOpen(true)}
                       className={`px-4 py-2 border rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${darkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                    >
                       Update <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Change Password</h3>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                  {passwordSuccess}
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#10B981] outline-none transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#10B981] outline-none transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#10B981] outline-none transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
