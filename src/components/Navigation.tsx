import React, { useState } from 'react';
import { ShieldAlert, BookOpen, User, Layers, Search, Terminal, Sun, Moon, Menu, X, LogIn, LogOut, Lock, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthUser } from '../types';

interface NavigationProps {
  activeSection: 'explore' | 'updates' | 'developer' | 'faq' | 'admin';
  activeTab: 'catalog' | 'admin';
  setActiveTab: (tab: 'catalog' | 'admin') => void;
  onExploreClick: () => void;
  onUserClick: () => void;
  onFAQClick: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUser: AuthUser | null;
  onLoginClick: (role: 'admin' | 'user') => void;
  onLogout: () => void;
}

export function Navigation({
  activeSection,
  activeTab,
  setActiveTab,
  onExploreClick,
  onUserClick,
  onFAQClick,
  searchOpen,
  setSearchOpen,
  theme,
  toggleTheme,
  currentUser,
  onLoginClick,
  onLogout
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header 
        id="main-header"
        className="sticky top-0 z-40 w-full px-4 py-3 md:px-8 border-b border-slate-200/60 dark:border-white/5 bg-white/70 dark:bg-[#0B0B12]/40 backdrop-blur-xl transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo and store title */}
          <div 
            id="store-logo-group"
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => {
              setActiveTab('catalog');
              onExploreClick();
              closeMobileMenu();
            }}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-[1px] flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,217,255,0.25)] group-hover:shadow-[0_0_20px_rgba(0,217,255,0.45)] transition-all">
              <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950 rounded-[11px] flex items-center justify-center p-1.5 select-none">
                <svg viewBox="0 0 120 120" className="w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                  <defs>
                    <linearGradient id="androidLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00D9FF" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                  
                  {/* Antennae */}
                  <line x1="38" y1="26" x2="26" y2="10" stroke="url(#androidLogoGrad)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="82" y1="26" x2="94" y2="10" stroke="url(#androidLogoGrad)" strokeWidth="6" strokeLinecap="round" />

                  {/* Head */}
                  <path d="M 30 35 A 30 30 0 0 1 90 35 Z" fill="url(#androidLogoGrad)" />

                  {/* Eyes */}
                  <circle cx="46" cy="23" r="4.5" fill="#ffffff" />
                  <circle cx="74" cy="23" r="4.5" fill="#ffffff" />

                  {/* Body */}
                  <rect x="30" y="41" width="60" height="42" rx="7" fill="url(#androidLogoGrad)" />

                  {/* Arms */}
                  <rect x="13" y="42" width="11" height="30" rx="5.5" fill="url(#androidLogoGrad)" />
                  <rect x="96" y="42" width="11" height="30" rx="5.5" fill="url(#androidLogoGrad)" />

                  {/* Legs */}
                  <rect x="44" y="87" width="11" height="18" rx="5.5" fill="url(#androidLogoGrad)" />
                  <rect x="65" y="87" width="11" height="18" rx="5.5" fill="url(#androidLogoGrad)" />
                </svg>
              </div>
              {/* liquid motion dot inside logo container */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 blur-sm opacity-60 animate-[pulse_1.5s_infinite]" />
            </div>
            <span className="font-sans font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
              APKCore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-300 to-pink-500">Platform</span>
            </span>
          </div>

          {/* Floating Middle Navigation Menu (Desktop Only) */}
          <nav 
            id="navbar-anchors"
            className="hidden md:flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-2xl backdrop-blur-md transition-colors"
          >
            <button
              id="nav-btn-explore"
              onClick={() => {
                setActiveTab('catalog');
                onExploreClick();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === 'catalog' && activeSection === 'explore'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-900 dark:bg-white/10 dark:text-[#00D9FF] font-semibold border-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-150 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              Explore Apps
            </button>
            
            <button
              id="nav-btn-timeline"
              onClick={() => {
                setActiveTab('catalog');
                // Scroll to Updates
                const section = document.getElementById('updates-timeline-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === 'catalog' && activeSection === 'updates'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-900 dark:bg-white/10 dark:text-[#A855F7] font-semibold border-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-150 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Updates
            </button>

            <button
              id="nav-btn-dev"
              onClick={() => {
                setActiveTab('catalog');
                onUserClick();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === 'catalog' && activeSection === 'developer'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-900 dark:bg-white/10 dark:text-[#EC4899] font-semibold border-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-150 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <User className="w-4 h-4 text-pink-500 dark:text-pink-400" />
              Developer
            </button>

            <button
              id="nav-btn-faq"
              onClick={() => {
                setActiveTab('catalog');
                onFAQClick();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === 'catalog' && activeSection === 'faq'
                  ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-900 dark:bg-white/10 dark:text-[#6366F1] font-semibold border-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-150 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              FAQ
            </button>
          </nav>

          {/* Trailing Tools Option (Theme Toggle + Search Button + Admin Access Toggle) */}
          <div id="nav-actions-group" className="flex items-center gap-2 md:gap-3">
            {/* Global Theme Toggle Button (Desktop Only) */}
            <button
              id="nav-btn-theme-toggle"
              onClick={toggleTheme}
              className="hidden md:flex p-2.5 rounded-xl border border-slate-200/80 bg-slate-200/50 hover:bg-slate-250 hover:text-slate-900 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 backdrop-blur-md cursor-pointer transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 md:w-5 h-5 text-amber-400 animate-[spin_20s_linear_infinite]" />
              ) : (
                <Moon className="w-4 h-4 md:w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Quick Search trigger button */}
            <button
              id="nav-btn-search-trigger"
              onClick={() => {
                if (searchOpen) {
                  setSearchOpen(true);
                  const isMobile = window.innerWidth < 640;
                  const targetId = isMobile ? 'search-input-mobile' : 'search-input-desktop';
                  const inputEl = document.getElementById(targetId) as HTMLInputElement | null;
                  if (inputEl) {
                    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                      inputEl.focus();
                    }, 50);
                  }
                } else {
                  setSearchOpen(true);
                }
              }}
              className={`p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                searchOpen
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
                  : 'bg-slate-200/50 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-250 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10'
              }`}
              title="Search Applications"
            >
              <Search className="w-4 h-4 md:w-5 h-5" />
            </button>

            {/* Secure Admin Dashboard direct link (Desktop Only) */}
            {currentUser && currentUser.role === 'admin' && (
              <button
                id="nav-btn-admin-panel"
                onClick={() => setActiveTab(activeTab === 'admin' ? 'catalog' : 'admin')}
                className={`hidden md:flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-sm font-semibold transition-all border backdrop-blur-md cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-700 dark:text-purple-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-slate-200/50 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-250 dark:bg-white/5 dark:border-white/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 dark:hover:border-slate-700/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#00D9FF] animate-pulse" />
                <span>Admin Dashboard</span>
              </button>
            )}

            {/* Account / Authentication Button (Desktop Only) */}
            {currentUser ? (
              <div id="nav-user-profile-pill" className="hidden md:flex items-center gap-2 pl-2 pr-1.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-xl transition-all select-none">
                <div className={`w-6 h-6 rounded-lg ${currentUser.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'} flex items-center justify-center font-mono font-bold text-xs uppercase tracking-tight`}>
                  {currentUser.name.substring(0, 2)}
                </div>
                <div className="flex flex-col text-left max-w-[100px] sm:max-w-[120px]">
                  <span className="text-[11px] font-bold text-slate-850 dark:text-gray-100 truncate leading-none">
                    {currentUser.name}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 dark:text-slate-400 leading-none mt-1 uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  id="nav-btn-logout"
                  onClick={onLogout}
                  className="p-1 rounded bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors cursor-pointer ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="nav-btn-signin-trigger"
                onClick={() => onLoginClick('user')}
                className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-[#00D9FF]/20 bg-cyan-500/10 hover:bg-cyan-500 text-[#00D9FF] hover:text-slate-950 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,217,255,0.1)] hover:shadow-[0_2px_15px_rgba(0,217,255,0.25)]"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN</span>
              </button>
            )}

            {/* Mobile Hamburger Side Navbar Trigger (3-line button) */}
            <button
              id="nav-btn-mobile-menu"
              onClick={() => setMobileMenuOpen(true)}
              className="flex md:hidden p-2.5 rounded-xl border border-slate-200/80 bg-slate-200/50 hover:bg-slate-250 hover:text-slate-900 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 backdrop-blur-md cursor-pointer transition-all"
              title="Open Menu"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer for Mobile Layouts */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              id="mobile-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Sidebar Slide-out Panel */}
            <motion.div
              id="mobile-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] h-full bg-white/95 dark:bg-[#0B0B12]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-white/5 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto md:hidden"
            >
              <div className="flex flex-col gap-8">
                {/* Drawer Header Brand & Close Action */}
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-600 font-bold font-mono text-[10px] text-white tracking-widest leading-none">
                      MENU
                    </span>
                    Navigation
                  </span>
                  
                  <button
                    id="mobile-drawer-close-btn"
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 hover:dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Close Menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Vertical Side Navigation Anchors */}
                <nav id="mobile-navbar-anchors" className="flex flex-col gap-2.5">
                  <button
                    id="mobile-nav-btn-explore"
                    onClick={() => {
                      setActiveTab('catalog');
                      onExploreClick();
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border-l-4 ${
                      activeTab === 'catalog' && activeSection === 'explore'
                        ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-[#00D9FF] border-cyan-500'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <Layers className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                    <span>Explore Apps</span>
                  </button>

                  <button
                    id="mobile-nav-btn-timeline"
                    onClick={() => {
                      setActiveTab('catalog');
                      closeMobileMenu();
                      setTimeout(() => {
                        const section = document.getElementById('updates-timeline-section');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                      }, 120);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border-l-4 ${
                      activeTab === 'catalog' && activeSection === 'updates'
                        ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-[#A855F7] border-purple-500'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <Terminal className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <span>Updates & Log</span>
                  </button>

                  <button
                    id="mobile-nav-btn-dev"
                    onClick={() => {
                      setActiveTab('catalog');
                      onUserClick();
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border-l-4 ${
                      activeTab === 'catalog' && activeSection === 'developer'
                        ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-[#EC4899] border-pink-500'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <User className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                    <span>Developer Info</span>
                  </button>

                  <button
                    id="mobile-nav-btn-faq"
                    onClick={() => {
                      setActiveTab('catalog');
                      onFAQClick();
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border-l-4 ${
                      activeTab === 'catalog' && activeSection === 'faq'
                        ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-[#6366F1] border-indigo-500'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    <span>Platform FAQ</span>
                  </button>
                </nav>
              </div>

              {/* Bottom Sidebar Action Utilities (Theme toggle & Admin link) */}
              <div className="flex flex-col gap-3 pt-6 border-t border-slate-150 dark:border-white/5">
                
                {/* Mobile Active User profile display */}
                {currentUser ? (
                  <div id="mobile-nav-user-profile" className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-white/5 select-none animate-[fade-in_0.2s_ease-out]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${currentUser.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'} flex flex-shrink-0 items-center justify-center font-mono font-bold text-sm uppercase`}>
                        {currentUser.name.substring(0, 2)}
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate">{currentUser.name}</span>
                        <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{currentUser.role} Account</span>
                      </div>
                    </div>
                    <button
                      id="mobile-nav-btn-logout"
                      onClick={() => {
                        onLogout();
                        closeMobileMenu();
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    id="mobile-nav-btn-signin"
                    onClick={() => {
                      closeMobileMenu();
                      onLoginClick('user');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-[#00D9FF] font-black text-xs uppercase tracking-wider cursor-pointer shadow-[0_2px_12px_rgba(0,217,255,0.08)]"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>SIGN IN / LOGIN</span>
                  </button>
                )}

                {/* Theme toggle banner option */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Interface Theme</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                      {theme === 'dark' ? 'Eye-safe Dark mode' : 'High-contrast Light mode'}
                    </span>
                  </div>
                  <button
                    id="mobile-nav-btn-theme-toggle"
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                    title="Toggle Theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                </div>

                {/* Direct Mobile Admin access */}
                {currentUser && currentUser.role === 'admin' && (
                  <button
                    id="mobile-nav-btn-admin-panel"
                    onClick={() => {
                      setActiveTab(activeTab === 'admin' ? 'catalog' : 'admin');
                      closeMobileMenu();
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      activeTab === 'admin'
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-700 dark:text-purple-200 shadow-lg'
                        : 'bg-slate-900 border-transparent text-white dark:bg-white/5 dark:border-white/5 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>ADMIN DASHBOARD ACCESS</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
