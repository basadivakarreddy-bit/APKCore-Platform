import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, Shield, Sparkles, Eye, EyeOff, LogIn, HelpCircle } from 'lucide-react';
import { AuthUser } from '../types';
import { useToast } from './Toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  defaultRole?: 'admin' | 'user';
}

export function LoginModal({ isOpen, onClose, onLoginSuccess, defaultRole = 'user' }: LoginModalProps) {
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
  const [authActionType, setAuthActionType] = useState<'login' | 'signup' | 'google-login' | 'google-signup' | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'login' | 'signup'>('login');
  
  const { toast } = useToast();

  // Handle Google accounts selection popup state
  const [showGoogleDropdown, setShowGoogleDropdown] = useState(false);
  const [googleDropdownType, setGoogleDropdownType] = useState<'login' | 'signup'>('login');

  const handleSelectPreset = (presetRole: 'admin' | 'user') => {
    if (presetRole === 'admin') {
      setLoginEmail('basadivakarreddy@gmail.com');
      setLoginPassword('basa@934673');
      toast('Administrator credentials pre-filled on the login side.', 'info');
    } else {
      setLoginEmail('guest@apkstore.dev');
      setLoginPassword('user123');
      toast('Regular guest credentials pre-filled on the login side.', 'info');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      toast('Please enter your email address.', 'error');
      return;
    }
    if (!loginPassword) {
      toast('Please enter your security passcode.', 'error');
      return;
    }

    setIsLoading(true);
    setAuthActionType('login');

    setTimeout(() => {
      setIsLoading(false);
      setAuthActionType(null);

      const emailLower = loginEmail.toLowerCase().trim();
      
      // Strict credentials check for Administrator requested
      if (emailLower === 'basadivakarreddy@gmail.com' && loginPassword === 'basa934673') {
        const adminUser: AuthUser = {
          email: 'basadivakarreddy@gmail.com',
          role: 'admin',
          name: 'Divakar Reddy'
        };
        onLoginSuccess(adminUser);
        toast('Admin authenticated successfully! You now have full dashboard control.', 'success');
        onClose();
      } else if (emailLower === 'basadivakarreddy@gmail.com') {
        toast('Incorrect password for admin account. Hint: use passcode basa934673', 'error');
      } else {
        // Any other standard user accounts
        const standardUser: AuthUser = {
          email: loginEmail,
          role: 'user',
          name: loginEmail.split('@')[0]
        };
        onLoginSuccess(standardUser);
        toast(`Welcome back, ${standardUser.name}! (Standard user login)`, 'success');
        onClose();
      }
    }, 1000);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
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
      toast('Please choose a security password.', 'error');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      toast('Passwords do not match. Please verify your entries.', 'error');
      return;
    }

    setIsLoading(true);
    setAuthActionType('signup');

    setTimeout(() => {
      setIsLoading(false);
      setAuthActionType(null);

      const emailLower = signupEmail.toLowerCase().trim();

      // If user registers with the administrative email, make sure they verify with administrative pass
      if (emailLower === 'basadivakarreddy@gmail.com') {
        if (signupPassword === 'basa934673') {
          const adminUser: AuthUser = {
            email: 'basadivakarreddy@gmail.com',
            role: 'admin',
            name: signupName || 'Divakar Reddy'
          };
          onLoginSuccess(adminUser);
          toast('Admin account registered and logged in successfully!', 'success');
          onClose();
        } else {
          toast('This email is reserved for Administrator. Use appropriate passcode to proceed.', 'error');
        }
      } else {
        // Standard User account registered
        const newUser: AuthUser = {
          email: signupEmail,
          role: 'user',
          name: signupName
        };
        onLoginSuccess(newUser);
        toast(`Registration successful! Welcome to the APKCore Platform, ${newUser.name}.`, 'success');
        onClose();
      }
    }, 1000);
  };

  const handleGoogleAuthSelect = (selectedEmail: string) => {
    setIsLoading(true);
    setAuthActionType(googleDropdownType === 'login' ? 'google-login' : 'google-signup');
    setShowGoogleDropdown(false);

    setTimeout(() => {
      setIsLoading(false);
      setAuthActionType(null);

      const emailLower = selectedEmail.toLowerCase().trim();
      if (emailLower === 'basadivakarreddy@gmail.com') {
        const adminUser: AuthUser = {
          email: 'basadivakarreddy@gmail.com',
          role: 'admin',
          name: 'Divakar Reddy'
        };
        onLoginSuccess(adminUser);
        toast('Google Account basadivakarreddy@gmail.com logged in as Administrator!', 'success');
        onClose();
      } else {
        const user: AuthUser = {
          email: emailLower || 'guest.google@gmail.com',
          role: 'user',
          name: (emailLower ? emailLower.split('@')[0] : 'Google Guest')
        };
        onLoginSuccess(user);
        toast(`Signed in successfully with Google account: ${user.email}.`, 'success');
        onClose();
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Frosted Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Glowing Side-By-Side Split Auth Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-4xl bg-white dark:bg-[#0B0B12] border border-slate-200/80 dark:border-white/10 backdrop-blur-2xl rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(139,92,246,0.15)] overflow-hidden z-10 my-8"
          >
            {/* Ambient Background Aura inside matching theme */}
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              id="login-modal-close-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/5 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer z-20"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Dual-Platform Quick Selection Popup Panel (Simulated Identity Dialog) */}
            <AnimatePresence>
              {showGoogleDropdown && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative"
                  >
                    <h4 className="text-sm font-bold font-mono text-[#00D9FF] uppercase tracking-wider mb-2">Simulated Google Auth</h4>
                    <p className="text-xs text-slate-400 mb-5">Select a profiles simulation or key in a Google identity below:</p>
                    <div className="space-y-3.5">
                      <button
                        type="button"
                        onClick={() => handleGoogleAuthSelect('guest.google@gmail.com')}
                        className="w-full py-3 px-4 rounded-xl bg-[#202124] hover:bg-[#303134] text-white border border-white/5 text-left transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-[#00D9FF] flex items-center justify-center font-bold text-xs">U</div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-200">guest.google@gmail.com</span>
                          <span className="text-[10px] text-slate-400">Standard user account</span>
                        </div>
                      </button>

                      <div className="pt-3 border-t border-white/15">
                        <label className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                          Or Enter Custom Google Email
                        </label>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const mailVal = (formData.get('customGoogleEmail') as string || '').trim();
                            if (mailVal) {
                              handleGoogleAuthSelect(mailVal);
                            } else {
                              toast('Please enter a Google email first or click above.', 'error');
                            }
                          }}
                          className="flex gap-2"
                        >
                          <input
                            type="email"
                            name="customGoogleEmail"
                            placeholder="username@gmail.com"
                            className="bg-[#202124] border border-white/10 text-xs px-3 py-2.5 rounded-xl text-white font-sans focus:outline-none focus:border-[#00D9FF]/50 flex-1 min-w-0"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-[#00D9FF] hover:bg-cyan-400 text-slate-950 rounded-xl px-4 py-2.5 text-xs font-black transition-colors cursor-pointer"
                          >
                            Go
                          </button>
                        </form>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGoogleDropdown(false)}
                      className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 font-bold transition-colors cursor-pointer"
                    >
                      Cancel Simulation
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden border-b border-slate-150 dark:border-white/5 p-4 bg-slate-50 dark:bg-slate-950/20">
              <div className="relative flex w-full p-1 bg-slate-200/60 dark:bg-slate-900/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveMobileTab('login')}
                  className={`relative z-10 w-1/2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeMobileTab === 'login'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMobileTab('signup')}
                  className={`relative z-10 w-1/2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeMobileTab === 'signup'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Split Two-Column Side-By-Side Layout (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-150 dark:divide-white/5">
              
              {/* LEFT COLUMN: SIGN IN / LOGIN PANEL */}
              <div className={`p-6 sm:p-10 flex flex-col justify-between ${activeMobileTab === 'login' ? 'flex' : 'hidden md:flex'}`}>
                <div>
                  {/* Column Header */}
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-[#00D9FF] font-mono font-bold text-[10px] uppercase tracking-wider mb-2">
                        <LogIn className="w-3.5 h-3.5" /> Sign In
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white tracking-tight">
                        Welcome Back
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Access your curated profile space and private dashboard settings.
                      </p>
                    </div>
                  </div>

                  {/* Google Authenticate Button for Login */}
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleDropdownType('login');
                      setShowGoogleDropdown(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.04-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative my-5 flex items-center justify-center">
                    <div className="absolute inset-x-0 border-t border-slate-150 dark:border-white/5" />
                    <span className="relative z-10 px-3 bg-white dark:bg-[#0B0B12] text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      or use email passcode
                    </span>
                  </div>

                  {/* Standard Sign In Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                        <input
                          type="email"
                          id="login-col-email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="guest@apkstore.dev"
                          className="w-full bg-slate-50 dark:bg-slate-950/60 pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                        Passcode Or Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          id="login-col-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 dark:bg-slate-950/60 pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="login-col-submit-btn"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
                    >
                      {isLoading && authActionType === 'login' ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                          Verifying Account...
                        </span>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>SIGN IN</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Left Column Quick Presets */}
                <div className="mt-8 pt-5 border-t border-slate-150 dark:border-white/5">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <span>Demo Profile</span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  </div>
                  <div>
                    <button
                      type="button"
                      id="preset-user-btn"
                      onClick={() => handleSelectPreset('user')}
                      className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-all text-left cursor-pointer flex flex-col justify-center"
                    >
                      <span className="text-slate-900 dark:text-white font-bold">👤 Trial Guest Account</span>
                      <span className="text-[9px] text-slate-500 truncate mt-0.5">guest@apkstore.dev</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: SIGN UP / CREATION PANEL */}
              <div className={`p-6 sm:p-10 flex flex-col justify-between ${activeMobileTab === 'signup' ? 'flex' : 'hidden md:flex'}`}>
                <div>
                  {/* Column Header */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-mono font-bold text-[10px] uppercase tracking-wider mb-2">
                      Join APKCore
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white tracking-tight">
                      Create Account
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Register to publish secure packages, leave comments and sync.
                    </p>
                  </div>

                  {/* Google Authenticate Button for SignUp */}
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleDropdownType('signup');
                      setShowGoogleDropdown(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.04-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Sign up with Google
                  </button>

                  <div className="relative my-5 flex items-center justify-center">
                    <div className="absolute inset-x-0 border-t border-slate-150 dark:border-white/5" />
                    <span className="relative z-10 px-3 bg-white dark:bg-[#0B0B12] text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      or input registry details
                    </span>
                  </div>

                  {/* Standard Sign Up Form */}
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                        User Display Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                        <input
                          type="text"
                          id="signup-col-name"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-slate-50 dark:bg-slate-950/60 pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                        <input
                          type="email"
                          id="signup-col-email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="developer@apkstore.dev"
                          className="w-full bg-slate-50 dark:bg-slate-950/60 pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          id="signup-col-password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full bg-slate-50 dark:bg-slate-950/60 pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          id="signup-col-confirm"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full bg-slate-50 dark:bg-slate-950/60 pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-white/5 focus:border-[#00D9FF]/40 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="signup-col-submit-btn"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
                    >
                      {isLoading && authActionType === 'signup' ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          Creating Profile...
                        </span>
                      ) : (
                        <span>REGISTER & CONNECT</span>
                      )}
                    </button>
                  </form>
                </div>

                {/* Secure Notice */}
                <div className="mt-8 pt-5 border-t border-slate-150 dark:border-white/5 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                  <Shield className="w-4 h-4 flex-shrink-0 text-cyan-500" />
                  <span>Secure 256-bit simulated credential handshake encryption active.</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
