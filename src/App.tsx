import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldCheck, Download, Star, ExternalLink, ArrowUp, Layers, 
  Sparkles, SlidersHorizontal, Eye, RefreshCw, Smartphone, HelpCircle, Terminal,
  Share2, Mic, MicOff, Lock, Unlock, LogIn, LogOut, Key, ShieldAlert, Monitor, AppWindow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { App as AppType, Message, StorageConfig, AuthUser } from './types';
import { 
  initialApps, initialUpdates, initialFAQs, initialCategories 
} from './data/initialData';
import { GlowBackground } from './components/GlowBackground';
import { ToastProvider, useToast } from './components/Toast';
import { Navigation } from './components/Navigation';
import { AppIcon } from './components/AppIcon';
import { AppDetails } from './components/AppDetails';
import { FAQSection } from './components/FAQ';
import { ContactForm } from './components/Contact';
import { DeveloperCard } from './components/DeveloperCard';
import { LatestUpdates } from './components/LatestUpdates';
import { AdminPanel } from './components/AdminPanel';
import { LoginModal } from './components/LoginModal';
import { supabase } from './supabaseClient';

export default function App() {
  return (
    <ToastProvider>
      <StoreContainer />
    </ToastProvider>
  );
}

function StoreContainer() {
  // Store Global DB states persistent via local storage
  const [apps, setApps] = useState<AppType[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [storageConfig, setStorageConfig] = useState<StorageConfig>({
    provider: 'local',
    apiKeys: {},
    isActive: false
  });

  // Client Routing states
  const [activeTab, setActiveTab] = useState<'catalog' | 'admin'>('catalog');
  const [selectedAppSlug, setSelectedAppSlug] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'explore' | 'updates' | 'developer' | 'faq' | 'admin'>('explore');

  // Auth states persistent via local storage
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const cached = localStorage.getItem('apk_store_current_user');
    try {
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  // Supabase Auth State synchronization
  useEffect(() => {
    const mapSupabaseUserToAuthUser = (user: any): AuthUser | null => {
      if (!user) return null;
      const email = user.email || '';
      const name = user.user_metadata?.name || user.user_metadata?.full_name || email.split('@')[0];
      const role = email.toLowerCase().trim() === 'basadivakarreddy@gmail.com' ? 'admin' : 'user';
      return { email, name, role };
    };

    // Get initial system login session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userObj = mapSupabaseUserToAuthUser(session.user);
        setCurrentUser(userObj);
        localStorage.setItem('apk_store_current_user', JSON.stringify(userObj));
      }
    }).catch(err => {
      console.warn("Supabase initial session fetch error:", err);
    });

    // Subscribe to real-time credential handshake changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userObj = mapSupabaseUserToAuthUser(session.user);
        const existingUser = localStorage.getItem('apk_store_current_user');
        
        setCurrentUser(userObj);
        localStorage.setItem('apk_store_current_user', JSON.stringify(userObj));
        
        // Only trigger a redirect to catalog home on brand new, explicit SIGNED_IN events
        // to prevent resetting the user's active tab/navigation when browser tab switching
        // triggers auth state background checks or token refreshes.
        if (event === 'SIGNED_IN' && !existingUser) {
          setActiveTab('catalog');
          setSelectedAppSlug(null);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('apk_store_current_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalDefaultRole, setLoginModalDefaultRole] = useState<'admin' | 'user'>('user');

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('apk_store_current_user', JSON.stringify(user));
    // Redirect user to the catalog Home view
    setActiveTab('catalog');
    setSelectedAppSlug(null);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase sign-out failed:', err);
    }
    setCurrentUser(null);
    localStorage.removeItem('apk_store_current_user');
    if (activeTab === 'admin') {
      setActiveTab('catalog');
    }
    toast('Logged out successfully.', 'info');
  };
  
  // Search and Filter controllers
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Visual shimmer loader simulation
  const [isLoading, setIsLoading] = useState(false);
  
  // Floating Action Button
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { toast } = useToast();

  // PWA/Homescreen stand-alone installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(() => {
    const dismissed = localStorage.getItem('pwa_banner_dismissed') === 'true';
    const installed = localStorage.getItem('pwa_banner_installed_sim') === 'true';
    return !dismissed && !installed;
  });
  const [isInstallingSim, setIsInstallingSim] = useState(false);
  const [installProgressSim, setInstallProgressSim] = useState(0);

  // Hook into Chrome/Android PWA install prompting pipeline
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto check if system is already executing under standalone desktop/mobile app shell
    const isAppRunningStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || false;
    
    if (isAppRunningStandalone) {
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      // Execute genuine chromium binary installer prompt
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        if (outcome === 'accepted') {
          setShowInstallBanner(false);
          localStorage.setItem('pwa_banner_installed_sim', 'true');
          toast('APKCore Platform successfully added to your home screen! Layout expanded to native standalone window.', 'success');
        }
      } catch (err) {
        console.error('PWA installation error:', err);
      }
    } else {
      // Run modular, high-fidelity responsive installing simulation
      setIsInstallingSim(true);
      setInstallProgressSim(0);
      
      const interval = setInterval(() => {
        setInstallProgressSim((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsInstallingSim(false);
              setShowInstallBanner(false);
              localStorage.setItem('pwa_banner_installed_sim', 'true');
              toast('APKCore Platform added to your home screen successfully!', 'success');
            }, 800);
            return 100;
          }
          return prev + 12;
        });
      }, 120);
    }
  };

  const handleDismissPWABanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
    toast('Installation banner minimized. Tap on top settings to recheck setup.', 'info');
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('apk_store_theme') as 'dark' | 'light') || 'dark';
  });

  const [isListening, setIsListening] = useState(false);

  const toggleSpeechRecognition = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast("Voice search is not supported by your current browser. Try Google Chrome or Safari.", "error");
      return;
    }

    if (isListening) {
      setIsListening(false);
      const activeRecognizer = (window as any)._activeSpeechRecognizer;
      if (activeRecognizer) {
        try {
          activeRecognizer.stop();
        } catch (e) {}
      }
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast("Listening... Speak now!", "success");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 200);
          toast(`Voice search found: "${transcript}"`, "success");
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error", event);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast("Microphone access denied. Please verify microphone permissions in your browser.", "error");
        } else if (event.error === 'no-speech') {
          toast("No speech detected. Please speak into your microphone.", "info");
        } else {
          toast(`Speech recognition error: ${event.error}`, "error");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      (window as any)._activeSpeechRecognizer = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      setIsListening(false);
      toast("Could not initialize voice recognition: " + err.message, "error");
    }
  };

  useEffect(() => {
    return () => {
      const activeRecognizer = (window as any)._activeSpeechRecognizer;
      if (activeRecognizer) {
        try {
          activeRecognizer.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('apk_store_theme', nextTheme);
    toast(`Switched to ${nextTheme === 'dark' ? 'Dark mode' : 'High-contrast Light mode'}.`, 'success');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const resolveSignedUrls = async (appsList: AppType[]): Promise<AppType[]> => {
    try {
      const pathsToSign: string[] = [];
      appsList.forEach(app => {
        // Collect private icon files (which won't start with HTTP/HTTPS or data image prefixes)
        if (app.iconUrl && !app.iconUrl.startsWith('http') && !app.iconUrl.startsWith('data:') && app.iconUrl.includes('/')) {
          pathsToSign.push(app.iconUrl);
        }
        // Collect private apk files
        if (app.apkUrl && !app.apkUrl.startsWith('http') && app.apkUrl.includes('/')) {
          pathsToSign.push(app.apkUrl);
        }
      });

      if (pathsToSign.length === 0) {
        return appsList;
      }

      // De-duplicate paths to sign
      const uniquePaths = Array.from(new Set(pathsToSign));

      // Fetch signed URLs (valid for 1 hour)
      const { data, error } = await supabase.storage
        .from('app-files')
        .createSignedUrls(uniquePaths, 3600);

      if (error || !data) {
        console.warn('Failed to retrieve signed URLs from Supabase Storage:', error);
        return appsList;
      }

      // Map signed URLs back to apps
      return appsList.map(app => {
        let signedIcon = app.iconUrl;
        let signedApk = app.apkUrl;

        const iconMatch = data.find(item => item.path === app.iconUrl);
        if (iconMatch?.signedUrl) {
          signedIcon = iconMatch.signedUrl;
        }

        const apkMatch = data.find(item => item.path === app.apkUrl);
        if (apkMatch?.signedUrl) {
          signedApk = apkMatch.signedUrl;
        }

        return {
          ...app,
          rawIconUrl: app.rawIconUrl || app.iconUrl,
          rawApkUrl: app.rawApkUrl || app.apkUrl,
          iconUrl: signedIcon,
          apkUrl: signedApk
        };
      });
    } catch (err) {
      console.error('Error resolving signed URLs:', err);
      return appsList;
    }
  };

  // Load apps from Supabase
  const loadApps = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const resolved = await resolveSignedUrls(data as AppType[]);
        setApps(resolved);
      } else {
        // DB is empty! Let's auto-seed the Supabase DB if the user has an auth session
        console.log("No apps found in Supabase. Seeding...");
        setApps(initialApps);
        
        const session = await supabase.auth.getSession();
        const userId = session?.data?.session?.user?.id || null;
        
        const seededApps = initialApps.map(app => ({
          ...app,
          user_id: userId
        }));

        const { error: seedError } = await supabase
          .from('apps')
          .insert(seededApps);

        if (!seedError) {
          console.log("Database successfully seeded with initialApps!");
          const { data: refetched } = await supabase
            .from('apps')
            .select('*')
            .order('created_at', { ascending: false });
          if (refetched) {
            const resolved = await resolveSignedUrls(refetched as AppType[]);
            setApps(resolved);
          }
        } else {
          console.warn("Seeding database failed (this is expected if not authenticated admin):", seedError);
        }
      }
    } catch (err) {
      console.error('Error fetching apps:', err);
      // Fallback to cache/initial data
      const cached = localStorage.getItem('apk_store_apps_data');
      setApps(cached ? JSON.parse(cached) : initialApps);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages from Supabase (restricted in real systems, loaded safely)
  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      const cached = localStorage.getItem('apk_store_messages_data');
      setMessages(cached ? JSON.parse(cached) : []);
    }
  };

  useEffect(() => {
    loadApps();

    const cachedStorage = localStorage.getItem('apk_store_storage_config');
    if (cachedStorage) {
      setStorageConfig(JSON.parse(cachedStorage));
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch messages reactively based on currentUser role
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'admin') {
      setActiveSection('admin');
      return;
    }
    
    if (selectedAppSlug) {
      setActiveSection('explore');
      return;
    }

    const handleScrollTracking = () => {
      const sectionIds = [
        { id: 'store-catalog-section', name: 'explore' },
        { id: 'updates-timeline-section', name: 'updates' },
        { id: 'about-developer-section', name: 'developer' },
        { id: 'faq-accordion-section', name: 'faq' }
      ];

      let currentSection = 'explore';
      let minDistance = Infinity;

      for (const section of sectionIds) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - 120);
          const isVisible = rect.top < window.innerHeight && rect.bottom > 100;
          
          if (isVisible && distance < minDistance) {
            minDistance = distance;
            currentSection = section.name;
          }
        }
      }
      setActiveSection(currentSection as any);
    };

    window.addEventListener('scroll', handleScrollTracking);
    handleScrollTracking();

    return () => window.removeEventListener('scroll', handleScrollTracking);
  }, [activeTab, selectedAppSlug]);

  // Sync utilities
  const saveAppsToCache = (updatedApps: AppType[]) => {
    setApps(updatedApps);
    localStorage.setItem('apk_store_apps_data', JSON.stringify(updatedApps));
  };

  // State manipulation interfaces
  const handleAddApp = async (newApp: AppType) => {
    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const userId = session?.data?.session?.user?.id || null;
      
      // Strip off virtual runtime attributes not present as DB columns
      const { rawIconUrl, rawApkUrl, ...cleanApp } = newApp;
      
      const appToInsert = {
        ...cleanApp,
        user_id: userId
      };
      
      const { error } = await supabase
        .from('apps')
        .insert([appToInsert]);

      if (error) throw error;
      
      toast(`"${newApp.name}" has been successfully added!`, 'success');
      loadApps();
    } catch (err: any) {
      console.error('Error adding app to Supabase:', err);
      toast(`Failed to add app: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateApp = async (updatedApp: AppType) => {
    setIsLoading(true);
    try {
      // Strip off virtual runtime attributes not present as DB columns
      const { rawIconUrl, rawApkUrl, ...cleanApp } = updatedApp;

      const { error } = await supabase
        .from('apps')
        .update(cleanApp)
        .eq('id', updatedApp.id);

      if (error) throw error;

      toast(`"${updatedApp.name}" has been successfully updated!`, 'success');
      loadApps();
    } catch (err: any) {
      console.error('Error updating app in Supabase:', err);
      toast(`Failed to update app: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    const appToRestore = apps.find((a) => a.id === appId);
    if (!appToRestore) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('apps')
        .delete()
        .eq('id', appId);

      if (error) throw error;

      // Clean up files in private Supabase Storage
      const iconPath = appToRestore.rawIconUrl || appToRestore.iconUrl;
      const apkPath = appToRestore.rawApkUrl || appToRestore.apkUrl;

      if (iconPath && !iconPath.startsWith('http') && !iconPath.startsWith('data:') && iconPath.includes('/')) {
        await supabase.storage.from('app-files').remove([iconPath]);
      }
      if (apkPath && !apkPath.startsWith('http') && apkPath.includes('/')) {
        await supabase.storage.from('app-files').remove([apkPath]);
      }

      toast(
        `"${appToRestore.name}" has been permanently deleted.`,
        'info',
        7000,
        async () => {
          try {
            const session = await supabase.auth.getSession();
            const userId = session?.data?.session?.user?.id || null;
            
            // Strip off virtual runtime attributes not present as DB columns
            const { rawIconUrl, rawApkUrl, ...cleanAppToRestore } = appToRestore;

            const restoredPayload = {
              ...cleanAppToRestore,
              user_id: userId
            };
            const { error: insertError } = await supabase
              .from('apps')
              .insert([restoredPayload]);

            if (insertError) throw insertError;
            toast(`"${appToRestore.name}": layout restored successfully!`, 'success');
            loadApps();
          } catch (undoErr: any) {
            console.error('Error undoing delete:', undoErr);
            toast(`Failed to restore app on server: ${undoErr.message}`, 'error');
          }
        },
        'UNDO'
      );
      loadApps();
    } catch (err: any) {
      console.error('Error deleting app from Supabase:', err);
      toast(`Failed to delete app: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMessage = async (newMsg: Message) => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session?.data?.session?.user?.id || null;
      const msgToInsert = {
        ...newMsg,
        user_id: userId
      };
      
      const { error } = await supabase
        .from('messages')
        .insert([msgToInsert]);

      if (error) throw error;
      toast('Your message has been sent successfully!', 'success');
      loadMessages();
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast(`Failed to register message: ${err.message}`, 'error');
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', msgId);

      if (error) throw error;
      toast('Message removed successfully.', 'info');
      loadMessages();
    } catch (err: any) {
      console.error('Error deleting message:', err);
      toast(`Failed to delete message: ${err.message}`, 'error');
    }
  };

  const handleClearMessages = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', 'placeholder-nonexistent'); // deletes all

      if (error) throw error;
      toast('Inbox cleared completely.', 'success');
      loadMessages();
    } catch (err: any) {
      console.error('Error clearing inbox:', err);
      toast(`Failed to clear inbox: ${err.message}`, 'error');
    }
  };

  const handleUpdateStorageConfig = (config: StorageConfig) => {
    setStorageConfig(config);
    localStorage.setItem('apk_store_storage_config', JSON.stringify(config));
  };

  const handleIncrementDownloads = async (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return;

    // Optimistic download increment
    setApps(prev => prev.map(a => a.id === appId ? { ...a, downloads: a.downloads + 1 } : a));

    try {
      const { error } = await supabase
        .from('apps')
        .update({ downloads: app.downloads + 1 })
        .eq('id', appId);

      if (error) {
        console.warn('Could not update download tally on Supabase:', error);
      }
    } catch (err) {
      console.error('Download increment error:', err);
    }
  };

  const handleAddReview = async (appId: string, rating: number, comment: string, author: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return;

    const session = await supabase.auth.getSession();
    const userEmail = session?.data?.session?.user?.email || currentUser?.email || null;

    const newReview = {
      id: Math.random().toString(36).substring(2, 9),
      rating,
      comment,
      author: author.trim() || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      email: userEmail
    };

    const currentReviews = app.reviews || [];
    const newReviews = [newReview, ...currentReviews];
    const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = parseFloat((totalRating / newReviews.length).toFixed(1));

    // Optimistic UI review addition
    setApps(prev => prev.map(a => a.id === appId ? { ...a, reviews: newReviews, rating: newAverage } : a));

    // Register this review ID as submitted by this local user
    try {
      const existingReviews = JSON.parse(localStorage.getItem('apk_store_submitted_reviews') || '[]');
      existingReviews.push(newReview.id);
      localStorage.setItem('apk_store_submitted_reviews', JSON.stringify(existingReviews));
    } catch (e) {
      console.error('Error updating locally submitted reviews cache', e);
    }

    try {
      const { error } = await supabase
        .from('apps')
        .update({
          reviews: newReviews,
          rating: newAverage
        })
        .eq('id', appId);

      if (error) {
        console.error('Could not submit review to Supabase:', error);
        toast('Your review was stored locally, but could not link to server.', 'info');
      } else {
        toast('Your review has been successfully submitted!', 'success');
        loadApps();
      }
    } catch (err) {
      console.error('Review submission error:', err);
    }
  };

  const handleDeleteReview = async (appId: string, reviewId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app || !app.reviews) return;

    const newReviews = app.reviews.filter((r) => r.id !== reviewId);
    let newAverage = 0;
    if (newReviews.length > 0) {
      const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
      newAverage = parseFloat((totalRating / newReviews.length).toFixed(1));
    }

    // Optimistic UI update
    setApps(prev => prev.map(a => a.id === appId ? { ...a, reviews: newReviews, rating: newAverage } : a));

    // Clean up local submission list
    try {
      const existingReviews = JSON.parse(localStorage.getItem('apk_store_submitted_reviews') || '[]');
      const updatedReviews = existingReviews.filter((id: string) => id !== reviewId);
      localStorage.setItem('apk_store_submitted_reviews', JSON.stringify(updatedReviews));
    } catch (e) {
      console.error('Error cleaning up locally submitted reviews cache', e);
    }

    try {
      const { error } = await supabase
        .from('apps')
        .update({
          reviews: newReviews,
          rating: newAverage
        })
        .eq('id', appId);

      if (error) throw error;
      toast('Review successfully deleted.', 'info');
      loadApps();
    } catch (err: any) {
      console.error('Error deleting review:', err);
      toast(`Failed to delete review: ${err.message}`, 'error');
    }
  };

  const handleShareApp = async (app: AppType) => {
    const shareUrl = `${window.location.origin}?app=${app.slug}`;
    const shareData = {
      title: `${app.name} - Android Application`,
      text: app.shortDescription,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast(`Shared ${app.name} successfully!`, 'success');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast(`Link to ${app.name} copied to clipboard!`, 'success');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast(`Could not share: ${err.message}`, 'error');
      }
    }
  };

  // Search filtering lists selector
  const filteredApps = apps.filter((app) => {
    const matchSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Handler toggling category with swift skeleton loader animation
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleSearchKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Instant micro shimmer when user pauses typing
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  };

  const handleViewAppDetails = (slug: string) => {
    setSelectedAppSlug(slug);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToCatalog = () => {
    setSelectedAppSlug(null);
  };

  const currentDetailsApp = apps.find((a) => a.slug === selectedAppSlug);
  const featuredApp = apps.find((a) => a.isFeatured) || apps[0];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic updates timeline, automatically synchronized with user uploads and deletions
  const siteUpdates = React.useMemo(() => {
    // 1. Filter out static updates where the parent application has been deleted from DB
    const activeStandardUpdates = initialUpdates.filter((up) => {
      return apps.some((app) => {
        return (
          app.id === up.appId ||
          app.slug === up.appId ||
          app.name.toLowerCase() === up.appName.toLowerCase()
        );
      });
    });

    // 2. Build current update profiles for all live applications
    const mappedUpdates = apps.map((app) => {
      // Find matching standard/pre-defined update entry
      const staticMatch = activeStandardUpdates.find(
        (up) =>
          up.appId === app.id ||
          up.appId === app.slug ||
          up.appName.toLowerCase() === app.name.toLowerCase()
      );

      if (staticMatch) {
        // Return structured entry, synced with any real-time admin changes (edited version, customized icons/titles)
        return {
          ...staticMatch,
          appName: app.name,
          appIcon: app.iconUrl,
          version: app.version,
          date: app.lastUpdated || staticMatch.date,
        };
      }

      // Generate a brand new, beautifully polished update timeline node for custom user apps
      let changesList: string[] = [];
      if (app.whatsNew) {
        changesList = app.whatsNew
          .split(/(?:\.|\n)+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => s.endsWith('.') ? s : s + '.');
      }

      if (changesList.length === 0) {
        changesList = [
          'Initial security and code signature validation audit complete.',
          'Configured responsive high-contrast grid layouts and interactive viewports.',
          'Initialized local SQLite replication schemas for offline persistent sessions.'
        ];
      }

      // Automatically determine update severity category
      let updateType: 'major' | 'minor' | 'patch' = 'minor';
      if (app.version.endsWith('.0') || app.version.endsWith('.0.0')) {
        updateType = 'major';
      } else if (/\.0\.[1-9]$/.test(app.version)) {
        updateType = 'patch';
      }

      return {
        id: `dynamic-up-${app.id}`,
        appId: app.id,
        appName: app.name,
        appIcon: app.iconUrl,
        version: app.version,
        date: app.lastUpdated || app.releaseDate || '2026-06-08',
        type: updateType,
        changes: changesList,
      };
    });

    // 3. Sort entries chronologically in descending order
    return mappedUpdates.sort((a, b) => b.date.localeCompare(a.date));
  }, [apps]);

  const siteFAQs = initialFAQs;

  return (
    <div className="min-h-screen text-slate-800 dark:text-white relative font-sans antialiased pb-12 selection:bg-cyan-500/30 selection:text-white transition-colors duration-300">
      {/* Premium Aurora Background and follow spotlight */}
      <GlowBackground />

      {/* Floating Action Button (FAB) Scroll to Top */}
      {showScrollTop && (
        <button
          id="btn-fab-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-slate-950/80 border border-white/10 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-slate-950 transition-all shadow-[0_4px_20px_rgba(0,217,255,0.2)] cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 animate-pulse" />
        </button>
      )}

      {/* Primary Navigation frosted Header bar */}
      <Navigation
        activeSection={activeSection}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedAppSlug(null);
        }}
        onExploreClick={() => {
          handleBackToCatalog();
          setTimeout(() => {
            const section = document.getElementById('store-catalog-section');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }}
        onUserClick={() => {
          handleBackToCatalog();
          setTimeout(() => scrollToSection('about-developer-section'), 100);
        }}
        onFAQClick={() => {
          handleBackToCatalog();
          setTimeout(() => scrollToSection('faq-accordion-section'), 100);
        }}
        searchOpen={searchOpen}
        setSearchOpen={(open) => {
          setSearchOpen(open);
          if (!open) {
            setSearchQuery('');
          } else {
            // Redirect to catalog and clear selected details view
            setActiveTab('catalog');
            setSelectedAppSlug(null);
            
            // Allow state changes to render, then scroll to & focus search input
            setTimeout(() => {
              const isMobile = window.innerWidth < 640;
              const targetId = isMobile ? 'search-input-mobile' : 'search-input-desktop';
              const inputEl = document.getElementById(targetId) as HTMLInputElement | null;
              if (inputEl) {
                inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                  inputEl.focus();
                }, 150);
              } else {
                const sect = document.getElementById('store-catalog-section');
                if (sect) sect.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLoginClick={(role) => {
          setLoginModalDefaultRole(role);
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* SUB-VIEW CONDITIONAL RENDERING CONTAINER */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {selectedAppSlug && currentDetailsApp ? (
            /* A. PUBLIC APP DEEP-DIVE DETAILS LAYOUT */
            <motion.div
              key={`details-${selectedAppSlug}`}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <AppDetails
                app={currentDetailsApp}
                onBack={handleBackToCatalog}
                onIncrementDownloads={handleIncrementDownloads}
                onAddReview={handleAddReview}
                onShareApp={handleShareApp}
                currentUser={currentUser}
                onDeleteReview={handleDeleteReview}
              />
            </motion.div>
          ) : activeTab === 'admin' ? (
            currentUser && currentUser.role === 'admin' ? (
              /* B. ADMIN MANAGEMENT DASHBOARD */
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full animate-[fade-in_0.2s_ease-out]"
              >
                <AdminPanel
                  apps={apps}
                  messages={messages}
                  storageConfig={storageConfig}
                  onAddApp={handleAddApp}
                  onUpdateApp={handleUpdateApp}
                  onDeleteApp={handleDeleteApp}
                  onUpdateStorageConfig={handleUpdateStorageConfig}
                  onViewAppDetails={handleViewAppDetails}
                  onDeleteMessage={handleDeleteMessage}
                  onClearMessages={handleClearMessages}
                />
              </motion.div>
            ) : (
              /* LOCKED COVER COVER SCREEN CARD FOR SECURE ADMIN PANEL */
              <motion.div
                key="admin-restricted"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl mx-auto px-4 py-20 text-center relative z-20"
              >
                <div className="bg-slate-950/85 dark:bg-[#0B0B13]/90 backdrop-blur-2xl border border-white/5 p-8 sm:p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
                  {/* Internal ambient glows */}
                  <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6 relative">
                    <Lock className="w-8 h-8 animate-pulse" />
                    <div className="absolute inset-0 rounded-2xl bg-purple-500/5 blur-md" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white tracking-tight leading-none mb-3">
                    Restricted Access Area
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto mb-8">
                    Superuser platform rights are required to append applications, update cloud package indexing, or view incoming message lists.
                  </p>

                  {currentUser ? (
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5 text-left flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-black flex items-center justify-center text-xs uppercase">
                          USR
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{currentUser.name}</h4>
                          <p className="text-[10px] font-mono text-slate-500 mt-1">{currentUser.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded-md">
                        {currentUser.role}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3">
                    <button
                      id="restricted-admin-login-btn"
                      onClick={() => {
                        setLoginModalDefaultRole('admin');
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(139,92,246,0.25)] flex items-center justify-center gap-2 cursor-pointer border-none"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticate admin profile</span>
                    </button>

                    <button
                       id="restricted-admin-home-btn"
                       onClick={() => setActiveTab('catalog')}
                       className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 hover:text-white transition-all font-bold cursor-pointer"
                    >
                      Return to catalog explorer
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          ) : (
            /* C. MAIN CLIENT-SIDE APKCORE PLATFORM CATALOG FRONT */
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              
              {/* 1. HERO HEADER BANNER */}
              <section id="store-hero-banner" className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center relative overflow-hidden flex flex-col items-center">
                {/* background glass drifting blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-cyan-400/5 to-purple-600/5 blur-3xl pointer-events-none" />
                
                <span className="px-3 py-1 bg-white/5 border border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-400 rounded-full inline-flex items-center gap-1.5 mb-4 shadow-sm animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" /> STAGING SERVER ONLINE: v2.6.0
                </span>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-none max-w-4xl text-shadow-sm font-sans">
                  Download My <br className="sm:hidden" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] via-[#8B5CF6] to-[#FF4D9D]">
                    Android Applications
                  </span>
                </h1>
                
                <p className="text-slate-400 text-sm md:text-base mt-4 max-w-xl leading-relaxed">
                  Discover and install premium-looking, secure, and performant Android utilities compiled directly from developer repositories.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8 relative z-10">
                  <button
                    id="hero-btn-explore"
                    onClick={() => scrollToSection('store-catalog-section')}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/5 hover:border-slate-700/50 text-white font-semibold text-xs tracking-wider transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-cyan-400" />
                    EXPLORE APPLICATIONS
                  </button>
                  {featuredApp && (
                    <button
                      id="hero-btn-latest"
                      onClick={() => handleViewAppDetails(featuredApp.slug)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold text-xs tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,217,255,0.3)] flex items-center gap-2 cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 text-slate-950" />
                      LATEST BUILD
                    </button>
                  )}
                </div>
              </section>

              {/* PWA INSTALLATION BANNER */}
              <AnimatePresence>
                {showInstallBanner && (
                  <motion.section
                    id="pwa-install-applet-banner"
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto px-4 mb-10 relative z-20"
                  >
                    <div className="relative p-6 sm:p-8 rounded-[28px] bg-slate-950/80 dark:bg-slate-950/70 border border-[#00D9FF]/20 hover:border-[#00D9FF]/40 shadow-[0_10px_35px_rgba(0,217,255,0.06)] backdrop-blur-2xl transition-all overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* background glowing decorative meshes */}
                      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500/5 to-transparent blur-2xl pointer-events-none" />

                      <div className="flex items-start sm:items-center gap-4.5 relative z-10 flex-1 min-w-0">
                        {/* App Icon Circle Grid representation */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D9FF] via-purple-600 to-pink-500 p-[1.5px] flex-shrink-0 shadow-[0_4px_20px_rgba(0,217,255,0.25)] relative group">
                          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                            <AppWindow className="w-8 h-8 text-[#00D9FF] animate-pulse" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 ml-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono tracking-widest font-black text-[#00D9FF] uppercase bg-cyan-950/45 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                              STANDALONE PWA APLET
                            </span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure Sandbox Verified
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-white tracking-tight leading-none mb-2 font-sans flex items-center gap-2">
                            Install APKCore App Hub
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                            Add this platform directly to your desktop or mobile app home screens. Launch instantaneously with full edge-to-edge standalone density, robust offline caching caches, and high-performance cold boots.
                          </p>
                        </div>
                      </div>

                      {/* Interactive Direct Custom PWA triggering controls */}
                      <div className="relative z-10 flex flex-col justify-center sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                        {isInstallingSim ? (
                          <div className="w-56 bg-slate-950/80 p-3.5 rounded-2xl border border-white/10 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400">
                              <span className="animate-pulse">MOUNTING APPLET...</span>
                              <span id="txt-pwa-install-pct">{installProgressSim}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5 p-[1px]">
                              <div 
                                id="bar-pwa-install-progress"
                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-150"
                                style={{ width: `${installProgressSim}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              id="btn-trigger-pwa-install"
                              onClick={handleInstallPWA}
                              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-black text-[11px] tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(0,217,255,0.25)] cursor-pointer hover:scale-[1.02] duration-200"
                            >
                              INSTALL APKCORE
                            </button>
                            <button
                              id="btn-dismiss-pwa-banner"
                              onClick={handleDismissPWABanner}
                              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold cursor-pointer border border-white/5"
                            >
                              DISMISS
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* 2. HIGHLIGHTED FEATURED APP HIGHLIGHT CARD */}
              {featuredApp && (
                <motion.section 
                  id="store-featured-card" 
                  className="max-w-4xl mx-auto px-4 mb-16 relative"
                  whileHover="hover"
                  initial="initial"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl pointer-events-none transition-all"
                    variants={{
                      initial: { opacity: 0.5, scale: 0.95 },
                      hover: { opacity: 1, scale: 1.12 }
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  
                  <motion.div 
                    className="p-1 rounded-[28px] bg-gradient-to-tr from-cyan-500/15 via-white/5 to-purple-500/15 border border-white/5 shadow-2xl relative overflow-hidden"
                    variants={{
                      initial: { 
                        scale: 1, 
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
                      },
                      hover: { 
                        scale: 1.015, 
                        boxShadow: "0 20px 40px rgba(0, 217, 255, 0.15), 0 35px 60px -15px rgba(139, 92, 246, 0.2)"
                      }
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  >
                    <div className="absolute top-0 right-0 px-4 py-1 bg-[#16A34A]/20 border-b border-l border-emerald-500/20 rounded-bl-2xl text-[9px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                      ★ FEATURED INSTALLER
                    </div>

                    {/* Frosted Container */}
                    <div className="bg-slate-950/75 backdrop-blur-2xl rounded-[23px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                      <AppIcon iconUrl={featuredApp.iconUrl} name={featuredApp.name} size="lg" glow={true} className="flex-shrink-0" />
                      
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                          <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider bg-[#00D9FF]/10 text-[#00D9FF] rounded-md font-bold uppercase border border-[#00D9FF]/15">
                            {featuredApp.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            v{featuredApp.version}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {featuredApp.size}
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                          {featuredApp.name}
                        </h3>
                        
                        <p className="text-slate-350 text-xs md:text-sm leading-relaxed mb-5 max-w-xl">
                          {featuredApp.shortDescription}
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-1 mb-5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3.5 h-3.5 ${
                                idx < Math.floor(featuredApp.rating) 
                                  ? 'fill-[#00D9FF] text-[#00D9FF]' 
                                  : 'text-slate-700'
                              }`} 
                            />
                          ))}
                          <span className="text-xs font-semibold text-slate-300 ml-2">({featuredApp.rating} Rating)</span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <motion.button
                            id="btn-featured-view"
                            key="btn-featured-view"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleViewAppDetails(featuredApp.slug)}
                            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/5 text-xs text-white font-sans font-bold flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            VIEW DETAILS
                          </motion.button>
                          <motion.button
                            id="btn-featured-download"
                            key="btn-featured-download"
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleViewAppDetails(featuredApp.slug)}
                            className="px-5 py-2.5 rounded-xl bg-[#00D9FF] text-slate-950 font-bold text-xs flex items-center gap-2 transition-all hover:bg-cyan-300 cursor-pointer shadow-[0_4px_15px_rgba(0,183,212,0.2)] hover:shadow-[0_4px_20px_rgba(0,217,255,0.4)]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            DOWNLOAD APK
                          </motion.button>
                          <motion.button
                            id="btn-featured-share"
                            key="btn-featured-share"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleShareApp(featuredApp)}
                            className="px-5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-xs text-[#C084FC] hover:text-white font-sans font-bold flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            SHARE
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.section>
              )}

              {/* 3. APPS GRID / GALLERY SECTOR */}
              <section id="store-catalog-section" className="max-w-7xl mx-auto px-4 py-8 relative">
                
                {/* Category selector row styled in liquid-glass */}
                <div className="flex flex-col gap-6 mb-10">
                  <div className="flex items-center justify-between gap-4 flex-wrap border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
                      <Layers className="w-5 h-5 text-cyan-400" /> Catalog Applications
                    </h3>

                    {/* Desktop Inline Search box with Voice-to-Text Search */}
                    <div className="relative w-full max-w-xs group hidden sm:block">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                      <input
                        id="search-input-desktop"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchKeyPress}
                        placeholder={isListening ? "Listening... Speak now!" : "Search items, keywords..."}
                        className="w-full pl-10 pr-10 py-2 bg-slate-950/40 border border-white/5 focus:border-[#00D9FF]/40 outline-none text-xs text-white rounded-xl placeholder-slate-500 transition-colors focus:bg-slate-950/85"
                      />
                      <button
                        id="btn-voice-search-desktop"
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isListening
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }`}
                        title="Voice Search"
                      >
                        {isListening ? (
                          <MicOff className="w-3.5 h-3.5 animate-[bounce_1s_infinite]" />
                        ) : (
                          <Mic className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Search input with Voice-to-Text Search */}
                  {searchOpen && (
                    <div className="relative w-full group sm:hidden animate-[fade-in_0.2s_ease-out]">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00D9FF] transition-colors" />
                      <input
                        id="search-input-mobile"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchKeyPress}
                        placeholder={isListening ? "Listening... Speak now!" : "Type search keys..."}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-white/5 focus:border-[#00D9FF]/40 outline-none text-xs text-white rounded-xl placeholder-slate-500 focus:bg-slate-950/80"
                      />
                      <button
                        id="btn-voice-search-mobile"
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isListening
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                            : 'text-slate-500 hover:text-[#00D9FF] hover:bg-white/5'
                        }`}
                        title="Voice Search"
                      >
                        {isListening ? (
                          <MicOff className="w-3.5 h-3.5 animate-[bounce_1s_infinite]" />
                        ) : (
                          <Mic className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Categories Scroll Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none max-w-full">
                    {initialCategories.map((cat) => (
                      <button
                        key={cat}
                        id={`btn-cat-${cat.toLowerCase()}`}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                          selectedCategory === cat
                            ? 'bg-[#00D9FF]/15 border-cyan-400/40 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)] backdrop-blur-md'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* APPLICATIONS RENDERING NODES */}
                {isLoading ? (
                  /* Shimmer Skeleton Loading view */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[22px] h-60 flex flex-col justify-between">
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 bg-white/10 rounded-2xl" />
                          <div className="flex-1">
                            <div className="h-4 bg-white/10 rounded w-2/3" />
                            <div className="h-2 bg-white/5 rounded w-1/2 mt-2" />
                          </div>
                        </div>
                        <div className="h-3 bg-white/5 rounded w-full my-4" />
                        <div className="flex gap-2">
                          <div className="h-8 bg-white/10 rounded flex-1" />
                          <div className="h-8 bg-cyan-400/20 rounded flex-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredApps.length === 0 ? (
                  /* Empty results feedback */
                  <div className="text-center py-20 p-6 bg-white/5 border border-white/5 rounded-[24px]">
                    <p className="text-slate-400 text-sm font-semibold">No applications matched your search filters.</p>
                    <button
                      id="btn-clear-search"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="mt-4 px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-white hover:bg-white/10"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  /* Grid of Apps */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApps.map((app) => (
                      <div
                        key={app.id}
                        id={`app-card-${app.id}`}
                        className="group p-[1.5px] rounded-[24px] bg-white/5 hover:bg-gradient-to-tr hover:from-cyan-400/20 hover:via-purple-500/5 hover:to-pink-500/20 border border-white/5 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] flex flex-col justify-between overflow-hidden relative"
                      >
                        {/* Frosted Interior Card Wrapper */}
                        <div className="bg-slate-950/70 group-hover:bg-slate-950/85 backdrop-blur-xl p-5.5 rounded-[22.5px] flex-1 flex flex-col justify-between gap-5">
                          
                          {/* Upper app info */}
                          <div className="flex items-start gap-4">
                            <AppIcon iconUrl={app.iconUrl} name={app.name} size="md" glow={false} className="transition-transform group-hover:scale-105 duration-300" />
                            <div className="flex-1 min-w-0">
                              <span className="text-[9px] font-mono bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded text-purple-300 font-bold uppercase tracking-wider">
                                {app.category}
                              </span>
                              <h4 className="text-white font-bold text-base tracking-tight truncate mt-1 group-hover:text-[#00D9FF] transition-colors">
                                {app.name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                                <span>v{app.version}</span>
                                <span>•</span>
                                <span>{app.size}</span>
                              </div>
                            </div>
                          </div>

                          {/* Mid descriptions */}
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                            {app.shortDescription}
                          </p>

                          {/* Rating block & Downloads metric count */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-auto">
                            <div className="flex items-center gap-1 text-[#00D9FF] text-xs font-semibold">
                              <span>★</span>
                              <span>{app.rating}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              <strong>{app.downloads.toLocaleString()}</strong> downloads
                            </span>
                          </div>

                          {/* Grid Card interactive actions buttons */}
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              id={`btn-card-details-${app.id}`}
                              onClick={() => handleViewAppDetails(app.slug)}
                              className="py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                              VIEW DETAILS
                            </button>
                            <button
                              id={`btn-card-dl-${app.id}`}
                              onClick={() => handleViewAppDetails(app.slug)}
                              className="py-2 rounded-xl bg-cyan-400/10 hover:bg-cyan-400 text-[#00D9FF] hover:text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              GET APK
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 4. LATEST TIMELINE RELEASES TIMELINE */}
              <LatestUpdates updates={siteUpdates} />

              {/* 5. ABOUT DEVELOPER PROFILE SECTION */}
              <DeveloperCard />

              {/* 6. EXPANDABLE FREQUENT ACCORDIONS FAQ */}
              <FAQSection faqs={siteFAQs} />

              {/* 7. CONTACT MESSAGES INPUT BARS */}
              <ContactForm onAddMessage={handleAddMessage} />

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER WRAPPER */}
      <footer 
        id="main-footer" 
        className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 px-4 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10"
      >
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="font-sans font-bold text-sm text-white">
            APKCore Platform
          </span>
          <p className="text-slate-500 text-[10px] sm:text-xs mt-1">
            © {new Date().getFullYear()} Staging Deployment Sandbox. Built securely with React & Tailwind.
          </p>
        </div>

        {/* Legal links */}
        <div id="footer-links-group" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-sans">
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Use</a>
          <a href="#sitemap" className="hover:text-slate-300 transition-colors">Package Index</a>
          <a href="#contact" onClick={() => scrollToSection('contact-form-section')} className="hover:text-slate-300 transition-colors">Contact Support</a>
        </div>
      </footer>

      {/* SECURE PASSWORD ACCESS GATE */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultRole={loginModalDefaultRole}
      />
    </div>
  );
}
