import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { authService } from '../services/auth';

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginSignupProps {
  onLogin: () => void;
  onBackToHome: () => void;
}

export function LoginSignup({ onLogin, onBackToHome }: LoginSignupProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [passwordHints, setPasswordHints] = useState<string[]>([]);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showSignupSuggestion, setShowSignupSuggestion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20;

    const initGoogle = () => {
      if (cancelled) return;

      if (!window.google) {
        if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(initGoogle, 500);
        }
        return;
      }

      const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.warn('VITE_GOOGLE_CLIENT_ID is not set; Google login will be disabled.');
        return;
      }

      // Initialize for ID token (used by our backend)
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            await authService.googleLogin(response.credential);
            onLogin();
          } catch (err) {
            console.error(err);
            setError('Google login failed. Please try again.');
          }
        },
      });

      setIsGoogleReady(true);
    };

    initGoogle();

    return () => {
      cancelled = true;
    };
  }, [onLogin]);

  const handleGoogleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.google) {
      setError('Google sign-in library is not loaded. Please refresh the page.');
      return;
    }

    if (!isGoogleReady) {
      setError('Google sign-in is initializing. Please wait a moment and try again.');
      return;
    }

    try {
      const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setError('Google login is not configured.');
        return;
      }

      // Render Google's button in a hidden container and click it programmatically
      // This is the most reliable way to trigger Google sign-in from a custom button
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);
      
      try {
        window.google.accounts.id.renderButton(tempDiv, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
        });
        
        // Wait for the button to be rendered, then click it
        const tryClick = (attempts = 0) => {
          const button = tempDiv.querySelector('div[role="button"]') as HTMLElement;
          if (button) {
            console.log('Google button found, clicking...');
            button.click();
            // Clean up after a short delay
            setTimeout(() => {
              if (tempDiv.parentNode) {
                document.body.removeChild(tempDiv);
              }
            }, 2000);
          } else if (attempts < 10) {
            // Retry up to 10 times (1 second total)
            setTimeout(() => tryClick(attempts + 1), 100);
          } else {
            console.error('Google button not found after rendering');
            setError('Failed to initialize Google sign-in. Please try again.');
            if (tempDiv.parentNode) {
              document.body.removeChild(tempDiv);
            }
          }
        };
        
        tryClick();
      } catch (renderErr) {
        console.error('Error rendering Google button:', renderErr);
        setError('Failed to initialize Google sign-in. Please try again.');
        if (tempDiv.parentNode) {
          document.body.removeChild(tempDiv);
        }
      }
    } catch (err: any) {
      console.error('Error calling Google sign-in:', err);
      setError(err.message || 'Failed to open Google login. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSignupSuggestion(false);
    setLoading(true);

    try {
      if (isForgotPassword) {
        if (!email) {
          setError("Please enter your email address.");
          setLoading(false);
          return;
        }
        if (!password || !confirmPassword) {
          setError("Please enter and confirm your new password.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        try {
          await authService.resetPassword(email, password);
          alert("Password reset successfully. You can now log in with your new password.");
          setIsForgotPassword(false);
          setPassword('');
          setConfirmPassword('');
          setPasswordStrength('');
          setPasswordHints([]);
        } catch (err: any) {
          if (err.response?.status === 404) {
            setError("We don't recognize you.");
            setShowSignupSuggestion(true);
          } else if (err.response?.data?.detail) {
            setError(err.response.data.detail);
          } else {
            setError("An error occurred. Please try again.");
          }
        } finally {
          setLoading(false);
        }
        return;
      }

      if (isLogin) {
        await authService.login(email, password);
        onLogin();
      } else {
        // Frontend password validation for signup
        const hints = getPasswordValidationHints(password);
        if (hints.length > 0) {
          setError("Please fix the password requirements before continuing.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        // First register
        await authService.register(email, password, fullName);
        
        // Redirect to login view with success message
        setIsLogin(true);
        setError(""); // Clear any previous errors
        // You might want to add a success state/message here, but for now we'll just switch to login
        alert("Account created successfully! Please login.");
        setPassword(""); // Clear password for security
        setConfirmPassword("");
        setPasswordStrength('');
        setPasswordHints([]);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("We don't recognize you.");
        setShowSignupSuggestion(true);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordValidationHints = (value: string): string[] => {
    const issues: string[] = [];
    if (value.length < 8) {
      issues.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(value)) {
      issues.push("At least 1 uppercase letter");
    }
    if (!/\d/.test(value)) {
      issues.push("At least 1 number");
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      issues.push("At least 1 special character");
    }
    return issues;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    const hints = getPasswordValidationHints(value);
    setPasswordHints(hints);

    if (!value) {
      setPasswordStrength('');
    } else if (hints.length >= 3) {
      setPasswordStrength('weak');
    } else if (hints.length === 1 || hints.length === 2) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

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
              onClick={() => {
                setIsLogin(true);
                setIsForgotPassword(false);
                setError('');
                setShowSignupSuggestion(false);
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                isLogin 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-gray-100 text-[#0F172A]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setIsForgotPassword(false);
                setError('');
                setShowSignupSuggestion(false);
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isLogin 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-gray-100 text-[#0F172A]'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && !isForgotPassword && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {isForgotPassword ? 'Account Email' : 'Email Address'}
              </label>
              <input
                type="email"
                placeholder={isForgotPassword ? 'Enter the email associated with your account' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {isForgotPassword ? 'New Password' : 'Password'}
              </label>
              <div className="relative">
              <input
                  type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                required
                  className="w-full px-4 py-3 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-[#10B981]"
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.52 0 2.97-.3 4.29-.843M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L9 9m6 6l2.772 2.772M15 15l-3-3"
                      />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength indicator & rules - only shown on signup while password field is focused */}
              {!isLogin && !isForgotPassword && isPasswordFocused && (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Password strength</span>
                    {passwordStrength && (
                      <span
                        className={
                          passwordStrength === 'strong'
                            ? 'text-green-600'
                            : passwordStrength === 'medium'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }
                      >
                        {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div
                      className={
                        'h-full transition-all duration-200 ' +
                        (passwordStrength === 'strong'
                          ? 'bg-green-500 w-full'
                          : passwordStrength === 'medium'
                          ? 'bg-yellow-400 w-2/3'
                          : passwordStrength === 'weak'
                          ? 'bg-red-500 w-1/3'
                          : 'bg-transparent w-0')
                      }
                    />
                  </div>

                  <ul className="mt-4 space-y-0.5 text-xs">
                    {['At least 8 characters', 'At least 1 uppercase letter', 'At least 1 number', 'At least 1 special character'].map(
                      (rule) => {
                        const satisfied = password.length > 0 && !passwordHints.includes(rule);
                        return (
                          <li
                            key={rule}
                            className="flex items-center gap-1 text-gray-600"
                          >
                            <span
                              className={
                                'inline-flex items-center justify-center w-4 h-4 rounded-full mr-1 text-[10px] ' +
                                (satisfied ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                              }
                            >
                              {satisfied ? '✓' : '✕'}
                            </span>
                            <span>{rule}</span>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            {!isLogin && !isForgotPassword && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                    className="w-full px-4 py-3 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20"
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-[#10B981]"
                  >
                    {showConfirmPassword ? (
                      // Eye-off icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.52 0 2.97-.3 4.29-.843M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L9 9m6 6l2.772 2.772M15 15l-3-3"
                        />
                      </svg>
                    ) : (
                      // Eye icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {isLogin && !isForgotPassword && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setError('');
                  }}
                  className="text-[#10B981] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {isForgotPassword && (
              <div className="text-xs text-gray-500 space-y-1">
                <p>Enter your account email and a new password to reset your login.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                    setPasswordStrength('');
                    setPasswordHints([]);
                  }}
                  className="text-[#10B981] hover:underline"
                >
                  Back to login
                </button>
              </div>
            )}
            
            <Button 
              variant="primary" 
              size="large" 
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : isForgotPassword
                ? 'Reset Password'
                : isLogin
                ? 'Login'
                : 'Create Account'}
            </Button>

            {showSignupSuggestion && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">New to PAK Industry Insight?</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setIsForgotPassword(false);
                    setShowSignupSuggestion(false);
                    setError('');
                  }}
                  className="text-[#10B981] hover:underline font-medium text-sm"
                >
                  Create a new account
                </button>
              </div>
            )}
          </form>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
              <span className="flex-1 h-px bg-gray-200" />
              <span>or</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={!isGoogleReady}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-4 h-4"
              />
              <span>Continue with Google</span>
            </button>
          </div>
          
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
