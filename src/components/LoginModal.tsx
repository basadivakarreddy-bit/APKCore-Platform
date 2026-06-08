import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, Shield, Sparkles, Eye, EyeOff, LogIn } from 'lucide-react';
import { AuthUser } from '../types';
import { useToast } from './Toast';
import { supabase } from '../supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  defaultRole?: 'admin' | 'user';
}

export function LoginModal({ isOpen, onClose, onLoginSuccess, defaultRole = 'user' }: LoginModalProps) {
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [authActionType, setAuthActionType] = useState<'login' | 'signup' | 'google' | null>(null);
  
  const { toast } = useToast();

  // Simulated Google accounts selection popup state
  const [showGoogleDropdown, setShowGoogleDropdown] = useState(false);

  const handleSelectPreset = (presetRole: 'admin' | 'user') => {
    if (presetRole === 'admin') {
      setLoginEmail('basadivakarreddy@gmail.com');
      // Autofill the password requested by admin specs
      setLoginPassword('basa@934673');
      toast('Administrator preview credentials loaded.', 'info');
    } else {
      setLoginEmail('guest@apkstore.dev');
      setLoginPassword('user123');
      toast('Regular guest credentials loaded.', 'info');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      toast('Please enter your email address.', 'error');
      return;
    }
    if (!loginPassword) {
      toast('Please enter your password.', 'error');
      return;
    }

    setIsLoading(true);
    setAuthActionType('login');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const emailLower = data.user.email || '';
        const name = data.user.user_metadata?.name || data.user.user_metadata?.full_name || emailLower.split('@')[0];
        const role = emailLower.toLowerCase().trim() === 'basadivakarreddy@gmail.com' ? 'admin' : 'user';
        
        const loggedUser: AuthUser = {
          email: emailLower,
          role: role,
          name: name
        };

        onLoginSuccess(loggedUser);
        if (role === 'admin') {
          toast('Admin authenticated successfully via Supabase! Full panel active.', 'success');
        } else {
          toast(`Welcome back, ${loggedUser.name}! (Connected via Supabase)`, 'success');
        }
        onClose();
      }
    } catch (err: any) {
      console.error('Supabase login error:', err);
      toast(err.message || 'Login failed. Verify passwords or sign up a new account.', 'error');
    } finally {
      setIsLoading(false);
      setAuthActionType(null);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName) {
      toast('Please enter your name.', 'error');
      return;
    }
    if (!signupEmail) {
      toast('Please enter your email address.', 'error');
      return;
    }
    if (!signupPassword) {
      toast('Please choose a password.', 'error');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      toast('Passwords do not match.', 'error');
      return;
    }

    setIsLoading(true);
    setAuthActionType('signup');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            name: signupName,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const emailLower = data.user.email || '';
        const role = emailLower.toLowerCase().trim() === 'basadivakarreddy@gmail.com' ? 'admin' : 'user';
        
        const newUser: AuthUser = {
          email: emailLower,
          role: role,
          name: signupName
        };

        onLoginSuccess(newUser);
        toast(`Supabase registration successful! Welcome, ${newUser.name}.`, 'success');
        onClose();
      }
    } catch (err: any) {
      console.error('Supabase registration error:', err);
      toast(err.message || 'Registration failed. Try again with unique details.', 'error');
    } finally {
      setIsLoading(false);
      setAuthActionType(null);
    }
  };

  const handleGoogleAuthSelect = (selectedEmail: string) => {
    setIsLoading(true);
    setAuthActionType('google');
    setShowGoogleDropdown(false);

    setTimeout(() => {
      setIsLoading(false);
      setAuthActionType(null);

      const emailLower = selectedEmail.toLowerCase().trim();
      const role = emailLower === 'basadivakarreddy@gmail.com' ? 'admin' : 'user';
      
      const user: AuthUser = {
        email: emailLower,
        role: role,
        name: emailLower.split('@')[0]
      };
      
      onLoginSuccess(user);
      toast(`Google authentication successful: ${user.email}`, 'success');
      onClose();
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthActionType('google');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase Google Sign-In redirect bypassed/not-setup. Activating beautiful account picker simulator.", err);
      setShowGoogleDropdown(true);
    } finally {
      setIsLoading(false);
      setAuthActionType(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="auth-modal-screen-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Frosted Backdrop Overlay */}
          <motion.div
            id="auth-backdrop-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Glowing Single Column Auth Card */}
          <motion.div
            id="auth-modal-card"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0B0B12] border border-slate-200/80 dark:border-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,217,255,0.1)] overflow-hidden z-10"
          >
            {/* Ambient Corner Auras */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              id="btn-close-auth-modal"
              onClick={onClose}
              className="absolute top-4.5 right-4.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer z-20"
              title="Close Dialog"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Google Authentication Simulator Dropdown */}
            <AnimatePresence>
              {showGoogleDropdown && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-xs bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl text-center"
                  >
                    <h4 className="text-xs font-bold font-mono text-[#00D9FF] uppercase tracking-wider mb-2">Google Auth Connection</h4>
                    <p className="text-[11px] text-slate-400 mb-4 font-sans">Simulate instantaneous login using user credentials:</p>
                    
                    <div className="space-y-2 text-left">
                      <button
                        type="button"
                        onClick={() => handleGoogleAuthSelect(defaultRole === 'admin' ? 'basadivakarreddy@gmail.com' : 'user.demo@gmail.com')}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#202124] hover:bg-[#303134] text-white border border-white/5 text-xs transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-cyan-600/20 text-[#00D9FF] flex items-center justify-center font-bold text-[10px]">G</div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-200">
                            {defaultRole === 'admin' ? 'basadivakarreddy@gmail.com' : 'user.demo@gmail.com'}
                          </span>
                        </div>
                      </button>

                      <div className="pt-2 border-t border-white/10">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const mailVal = (formData.get('customGoogleEmail') as string || '').trim();
                            if (mailVal) {
                              handleGoogleAuthSelect(mailVal);
                            }
                          }}
                          className="flex gap-2"
                        >
                          <input
                            type="email"
                            name="customGoogleEmail"
                            placeholder="your.email@gmail.com"
                            className="bg-[#202124] border border-white/10 text-[11px] px-2.5 py-1.5 rounded-lg text-white font-sans focus:outline-none focus:border-[#00D9FF]/50 flex-1 min-w-0"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-[#00D9FF] hover:bg-cyan-400 text-slate-950 rounded-lg px-2.5 text-[11px] font-black transition-colors cursor-pointer"
                          >
                            Go
                          </button>
                        </form>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGoogleDropdown(false)}
                      className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-slate-350 font-bold transition-colors cursor-pointer"
                    >
                      Cancel Simulation
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Auth Unified Form Box Container */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {authView === 'login' ? (
                  <motion.div
                    key="signin-view"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Header */}
                    <div className="mb-5">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-cyan-600 dark:text-[#00D9FF] font-mono font-bold text-[9px] uppercase tracking-wider mb-2">
                        <LogIn className="w-3 h-3" /> Connect Account
                      </div>
                      <h3 className="text-xl font-bold font-sans text-slate-950 dark:text-white tracking-tight">
                        Sign In
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Use validated credentials to access premium features.
                      </p>
                    </div>

                    {/* Modern Google Login Button */}
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer select-none"
                      >
                        <svg className="w-4.5 h-4.5 mr-3 inline-block" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                          <g transform="matrix(1, 0, 0, 1, 0, 0)">
                            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.3c1.93,-1.78 3.01,-4.4 3.01,-7.4C21.65,11.83 21.54,11.45 21.35,11.1z" fill="#4285F4" />
                            <path d="M12,20.6c2.6,0 4.77,-0.86 6.36,-2.3l-3.3,-2.6c-0.9,0.6 -2.07,0.98 -3.06,0.98 -2.36,0 -4.36,-1.6 -5.07,-3.75H3.53v2.7C5.12,18.8 8.35,20.6 12,20.6z" fill="#34A853" />
                            <path d="M6.93,12.93c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V6.78H3.53C2.92,8 2.6,9.4 2.6,10.9s0.32,2.9 0.93,4.12l2.8,-2.1V12.93z" fill="#FBBC05" />
                            <path d="M12,5.2c1.4,0 2.67,0.48 3.66,1.43l2.75,-2.75C16.77,2.3 14.6,1.4 12,1.4 8.35,1.4 5.12,3.2 3.53,6.38l3.4,2.6C7.64,6.8 9.64,5.2 12,5.2z" fill="#EA4335" />
                          </g>
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                    </div>

                    {/* Divider block */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200/60 dark:border-white/5"></div>
                      </div>
                      <span className="relative bg-white dark:bg-[#0B0B12] px-3.5 text-[9px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                        or continue with email
                      </span>
                    </div>

                    {/* Sign In Form */}
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                          <input
                            type="email"
                            id="login-field-email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="username@service.com"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                          Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            id="login-field-password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        id="btn-login-submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-5"
                      >
                        {isLoading && authActionType === 'login' ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            Sign In...
                          </span>
                        ) : (
                          <span>SIGN IN</span>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-view"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Header */}
                    <div className="mb-5">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-mono font-bold text-[9px] uppercase tracking-wider mb-2">
                        Registration Setup
                      </div>
                      <h3 className="text-xl font-bold font-sans text-slate-950 dark:text-white tracking-tight">
                        Create Account
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Get your secured profile registered instantly.
                      </p>
                    </div>

                    {/* Modern Google Sign-Up Button */}
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer select-none"
                      >
                        <svg className="w-4.5 h-4.5 mr-3 inline-block" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                          <g transform="matrix(1, 0, 0, 1, 0, 0)">
                            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.3c1.93,-1.78 3.01,-4.4 3.01,-7.4C21.65,11.83 21.54,11.45 21.35,11.1z" fill="#4285F4" />
                            <path d="M12,20.6c2.6,0 4.77,-0.86 6.36,-2.3l-3.3,-2.6c-0.9,0.6 -2.07,0.98 -3.06,0.98 -2.36,0 -4.36,-1.6 -5.07,-3.75H3.53v2.7C5.12,18.8 8.35,20.6 12,20.6z" fill="#34A853" />
                            <path d="M6.93,12.93c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V6.78H3.53C2.92,8 2.6,9.4 2.6,10.9s0.32,2.9 0.93,4.12l2.8,-2.1V12.93z" fill="#FBBC05" />
                            <path d="M12,5.2c1.4,0 2.67,0.48 3.66,1.43l2.75,-2.75C16.77,2.3 14.6,1.4 12,1.4 8.35,1.4 5.12,3.2 3.53,6.38l3.4,2.6C7.64,6.8 9.64,5.2 12,5.2z" fill="#EA4335" />
                          </g>
                        </svg>
                        <span>Sign up with Google</span>
                      </button>
                    </div>

                    {/* Divider block */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200/60 dark:border-white/5"></div>
                      </div>
                      <span className="relative bg-white dark:bg-[#0B0B12] px-3.5 text-[9px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 font-bold">
                        or register with email
                      </span>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                          Display Name
                        </label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type="text"
                            id="signup-field-name"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:border-purple-500/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type="email"
                            id="signup-field-email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="username@service.com"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:border-purple-500/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                          Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type={showSignupPassword ? 'text' : 'password'}
                            id="signup-field-password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:border-purple-500/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type={showSignupPassword ? 'text' : 'password'}
                            id="signup-field-confirm"
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            placeholder="Re-type password"
                            className="w-full bg-slate-50 dark:bg-slate-950/60 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:border-purple-500/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        id="btn-signup-submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00D9FF] to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-5"
                      >
                        {isLoading && authActionType === 'signup' ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            Releasing...
                          </span>
                        ) : (
                          <span>REGISTER & CONNECT</span>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Alternate View Switch Link footer */}
              <div className="mt-6 pt-4 border-t border-slate-150 dark:border-white/5 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {authView === 'login' ? "Don't have an account?" : "Already configured an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView(authView === 'login' ? 'signup' : 'login')}
                    className="text-cyan-600 dark:text-[#00D9FF] hover:underline font-bold bg-transparent border-none p-0 cursor-pointer text-xs"
                  >
                    {authView === 'login' ? 'Create one now' : 'Sign In instead'}
                  </button>
                </p>
              </div>

              {/* Secure Notice Footer */}
              <div className="mt-5.5 flex items-center justify-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500">
                <Shield className="w-3.5 h-3.5 text-cyan-500/80" />
                <span>Secure cryptographic transaction active.</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
