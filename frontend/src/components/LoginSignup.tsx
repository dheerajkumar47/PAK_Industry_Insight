import React from 'react';
import { Button } from './Button';

interface LoginSignupProps {
  onLogin: () => void;
  onBackToHome: () => void;
}

export function LoginSignup({ onLogin, onBackToHome }: LoginSignupProps) {
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">P</span>
            </div>
          </div>
          <h1 className="text-3xl text-white mb-2">PAK Industry Insight</h1>
          <p className="text-gray-300">Access real-time industry data and insights</p>
        </div>
        
        {/* Login/Signup Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                isLogin 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-gray-100 text-[#0F172A]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isLogin 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-gray-100 text-[#0F172A]'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          <form className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
              </div>
            )}
            
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-[#10B981] hover:underline">Forgot password?</a>
              </div>
            )}
            
            <Button 
              variant="primary" 
              size="large" 
              className="w-full"
              onClick={onLogin}
            >
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={onBackToHome}
              className="text-sm text-gray-600 hover:text-[#10B981] transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
