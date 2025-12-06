import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { User, Mail, Shield, Smartphone, PenSquare, X, Lock, Check, AlertCircle } from 'lucide-react';
import { authService, User as UserType } from '../services/auth';

interface ProfileProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Profile({ onNavigate, onLogout }: ProfileProps) {
  const [activeItem] = React.useState('profile');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateStatus, setUpdateStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error: any) {
        console.error("Failed to fetch user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Standard material colors for Email users
  const getBgColor = (name?: string) => {
    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-orange-600', 'bg-indigo-600'];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const isGoogleUser = user?.picture && user.picture.includes('googleusercontent');

  // Google G Icon (SVG)
  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-900 pb-20 lg:pb-0 font-sans transition-colors duration-200">
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
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-6">Profile Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                    {loading ? (
                       <div className="animate-pulse flex flex-col items-center w-full">
                           <div className="w-24 h-24 bg-gray-200 dark:bg-slate-700 rounded-full mb-4"></div>
                           <div className="h-6 bg-gray-200 dark:bg-slate-700 w-1/2 rounded mb-2"></div>
                       </div>
                    ) : user ? (
                        <>
                           <div className="relative mb-4">
                             {user.picture && !imageError ? (
                               <div className="relative">
                                   <img 
                                     src={user.picture} 
                                     alt={user.full_name} 
                                     onError={() => setImageError(true)}
                                     className="w-24 h-24 object-cover rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                                   />
                                   {isGoogleUser && (
                                       <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm border border-gray-100 dark:border-slate-600">
                                           <GoogleIcon />
                                       </div>
                                   )}
                               </div>
                             ) : (
                               <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-semibold shadow-sm ${getBgColor(user.full_name)}`}>
                                 {getInitials(user.full_name)}
                               </div>
                             )}
                           </div>
                           
                            <div className="text-center w-full mb-6">
                               <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">{user.full_name || 'User'}</h2>
                               <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                               
                               {!isGoogleUser && (
                                 <button 
                                   onClick={() => {
                                     setEditName(user.full_name || '');
                                     setCurrentPassword('');
                                     setNewPassword('');
                                     setConfirmPassword('');
                                     setUpdateStatus(null);
                                     setIsEditModalOpen(true);
                                   }}
                                   className="mt-4 px-4 py-2 text-sm font-medium text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#10B981]/5 transition-colors inline-flex items-center gap-2"
                                 >
                                   <PenSquare className="w-4 h-4" />
                                   Edit Profile
                                 </button>
                               )}
                           </div>

                           <div className="w-full space-y-4 border-t border-gray-100 dark:border-slate-700 pt-6">
                               <div className="flex items-center justify-between">
                                   <span className="text-sm text-gray-500 dark:text-gray-400">Account Type</span>
                                   <span className="text-sm font-medium text-[#0F172A] dark:text-white flex items-center gap-2">
                                       {isGoogleUser ? (
                                           <>
                                             <GoogleIcon /> Google
                                           </>
                                       ) : (
                                           <>
                                             <Mail className="w-4 h-4 text-gray-400" /> Standard
                                           </>
                                       )}
                                   </span>
                               </div>

                           </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Please log in to view your profile.</p>
                            {/* Debug info in case of silent failures */}
                            <div className="hidden">{JSON.stringify(imageError)}</div> 
                            <button 
                                onClick={onLogout}
                                className="px-6 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors"
                            >
                                Log In
                            </button>
                        </div>
                    )}
                </Card>
              </div>

               {/* Right Column: General Info */}
               <div className="lg:col-span-2 space-y-6">
                 {user && (
                     <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                            <h3 className="font-semibold text-[#0F172A] dark:text-white flex items-center gap-2">
                               <Shield className="w-5 h-5 text-gray-400" />
                               Membership & Security
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-[#0F172A] dark:text-white mb-1">Current Plan</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Free Tier</p>
                                </div>
                                <button className="text-sm text-[#10B981] font-medium hover:underline">Upgrade</button>
                            </div>
                            
                            <hr className="border-gray-100 dark:border-slate-700" />

                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-[#0F172A] dark:text-white mb-1">Device Sessions</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Smartphone className="w-4 h-4" />
                                        <span>Windows PC · Chrome · Active now</span>
                                    </div>
                                </div>
                                <button className="text-sm text-red-500 font-medium hover:text-red-600">Sign out all</button>
                            </div>
                        </div>
                     </Card>
                 )}
               </div>
            </div>
          </div>
        </main>
      </div>


      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {updateStatus && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  updateStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {updateStatus.type === 'success' ? <Check className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
                  <p className="text-sm">{updateStatus.message}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Name Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                    placeholder="Your Name"
                  />
                </div>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                  <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Change Password
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm"
                        placeholder="Current Password (Required for password change)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm"
                        placeholder="New Password"
                      />
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#10B981] outline-none transition-all text-sm"
                        placeholder="Confirm New"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3 bg-gray-50 dark:bg-slate-800/50">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setUpdateStatus(null);
                  setIsUpdating(true);
                  let successMsg = "";
                  
                  try {
                    // Update Name
                    if (editName !== user?.full_name) {
                      await authService.updateUser({ full_name: editName });
                      setUser((prev: UserType | null) => prev ? ({ ...prev, full_name: editName }) : null);
                      successMsg += "Name updated. ";
                    }

                    // Update Password
                    if (newPassword || confirmPassword) {
                      if (!currentPassword) throw new Error("Current password is required to change password.");
                      if (newPassword !== confirmPassword) throw new Error("New passwords do not match.");
                      if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
                      
                      await authService.changePassword(currentPassword, newPassword);
                      successMsg += "Password updated. ";
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }

                    if (!successMsg && editName === user?.full_name) {
                      setIsEditModalOpen(false);
                      return;
                    }

                    setUpdateStatus({ type: 'success', message: successMsg || "Profile updated successfully!" });
                    setTimeout(() => {
                        setIsEditModalOpen(false);
                        setUpdateStatus(null);
                    }, 1500);

                  } catch (error: any) {
                    setUpdateStatus({ type: 'error', message: error.response?.data?.detail || error.message || "Failed to update profile." });
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
