import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, ShieldCheck, HelpCircle, Calendar, Sparkles, Layers, Info, Check, Play, Star, MessageSquare, User, PenTool, Server, Zap, Wifi, Cpu, Activity, Share2 } from 'lucide-react';
import { App } from '../types';
import { AppIcon } from './AppIcon';
import { useToast } from './Toast';

interface AppDetailsProps {
  app: App;
  onBack: () => void;
  onIncrementDownloads: (appId: string) => void;
  onAddReview: (appId: string, rating: number, comment: string, author: string) => void;
  onShareApp: (app: App) => void;
}

export function AppDetails({ app, onBack, onIncrementDownloads, onAddReview, onShareApp }: AppDetailsProps) {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(-1); // -1 means idle
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  // CDN Optimizer features
  const [cdnNode, setCdnNode] = useState('Cloudflare CDN (Global Edge)');
  const [speedBoost, setSpeedBoost] = useState(true);
  const [currentSpeed, setCurrentSpeed] = useState(0); // in MB/s
  const [etaSeconds, setEtaSeconds] = useState(0);

  const downloadIntervalRef = useRef<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (downloadIntervalRef.current) {
        clearInterval(downloadIntervalRef.current);
      }
    };
  }, []);

  const handleDownload = () => {
    if (downloadProgress >= 0) return; // already in progress

    toast(`Starting download for ${app.name} (${app.size}) via ${cdnNode}...`, 'download');
    setDownloadProgress(0);
    setIsDownloaded(false);

    const appSizeNum = parseFloat(app.size) || 15.0;
    
    // Initial display stats
    const initialSpeed = speedBoost 
      ? parseFloat((Math.random() * 8 + 18).toFixed(1)) 
      : parseFloat((Math.random() * 2 + 2.5).toFixed(1));
    setCurrentSpeed(initialSpeed);
    setEtaSeconds(Math.ceil(appSizeNum / initialSpeed));

    let currentProgress = 0;

    if (downloadIntervalRef.current) {
      clearInterval(downloadIntervalRef.current);
    }

    downloadIntervalRef.current = setInterval(() => {
      // Dynamic live speed flickers to simulate realistic network jitter
      const currentSpeedNow = speedBoost 
        ? parseFloat((Math.random() * 6 + 20).toFixed(1)) 
        : parseFloat((Math.random() * 1.5 + 2.5).toFixed(1));
      setCurrentSpeed(currentSpeedNow);

      // progressive download simulation curve dependent on speed boost
      const step = speedBoost 
        ? Math.floor(Math.random() * 20) + 15 // massive packet chunks
        : Math.floor(Math.random() * 6) + 4; // slow standard blocks

      currentProgress = Math.min(currentProgress + step, 100);
      setDownloadProgress(currentProgress);

      // Calculate remaining ETA dynamically
      const remainingSize = appSizeNum * (1 - currentProgress / 100);
      setEtaSeconds(Math.ceil(remainingSize / currentSpeedNow));

      if (currentProgress >= 100) {
        if (downloadIntervalRef.current) {
          clearInterval(downloadIntervalRef.current);
          downloadIntervalRef.current = null;
        }

        // Execute download completion side effects EXACTLY once
        onIncrementDownloads(app.id);
        setIsDownloaded(true);
        setCurrentSpeed(0);
        setEtaSeconds(0);
        toast(`${app.name} APK downloaded successfully via ${cdnNode}!`, 'success');

        // Trigger simulated file download
        try {
          const blob = new Blob([`Simulated APK binary payload for ${app.name} v${app.version}`], { type: 'application/vnd.android.package-archive' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${app.slug}_v${app.version}.apk`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error('File generation skipped inside sandbox format.', e);
        }

        // Return progress hook to idle
        setDownloadProgress(-1);
      }
    }, 250);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim()) {
      toast('Please enter your name.', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      toast('Please write a short comment.', 'error');
      return;
    }
    
    onAddReview(app.id, reviewRating, reviewComment, reviewAuthor);
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
  };

  // Render a mock layout inside the interactive wireframe screenshot card depending on the App category and ID
  const renderMockScreenshotContent = (index: number) => {
    const glassPhoneTheme = "relative w-full h-full bg-[#0E0F16] rounded-2xl overflow-hidden border border-white/5 p-3 flex flex-col justify-between text-xs";
    
    if (app.id === 'nova-ai') {
      if (index === 0) {
        return (
          <div className={glassPhoneTheme}>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-[#00D9FF]">NOVA CLIENT v2.4</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex-1 flex flex-col gap-3 justify-center py-4">
              <div className="self-end bg-purple-500/10 border border-purple-500/20 rounded-xl rounded-tr-none px-2.5 py-1.5 max-w-[85%] text-[10px] text-purple-200">
                Write a quick fibonacci function in Rust.
              </div>
              <div className="self-start bg-cyan-950/20 border border-cyan-500/20 rounded-xl rounded-tl-none px-2.5 py-2 max-w-[85%] text-[9px] text-cyan-200 font-mono">
                {"fn fib(n: u32) -> u32 {\n  match n {\n    0 => 0,\n    1 | 2 => 1,\n    _ => fib(n-1) + fib(n-2)\n  }\n}"}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-1.5 flex items-center justify-between border border-white/5">
              <span className="text-slate-400 text-[9px]">Analyzing input logs...</span>
              <div className="w-4 h-4 rounded-full bg-[#00D9FF] flex items-center justify-center text-[10px] text-slate-950">✦</div>
            </div>
          </div>
        );
      } else if (index === 1) {
        return (
          <div className={glassPhoneTheme}>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-purple-400">AURORA GENERATOR</span>
              <span className="text-[9px] text-pink-400">★ ACTIVE</span>
            </div>
            <div className="flex flex-col gap-2 my-2 flex-1 justify-center">
              <div className="w-full h-24 rounded-lg bg-gradient-to-tr from-cyan-500/25 via-purple-500/25 to-pink-500/25 border border-white/10 flex items-center justify-center overflow-hidden relative">
                <div className="absolute top-1 left-1 text-[8px] font-mono bg-black/60 px-1 rounded border border-white/5">SEED: 8847291</div>
                <div className="w-10 h-10 rounded-full bg-white/20 filter blur-lg animate-pulse" />
              </div>
              <span className="text-center text-[9px] text-slate-400 italic">"An organic futuristic aurora over slate structures"</span>
            </div>
            <div className="h-6 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-[10px] text-slate-950">
              REGENERATE ARTIFACT
            </div>
          </div>
        );
      } else {
        return (
          <div className={glassPhoneTheme}>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-pink-400">HOME SCREEN RESIZE</span>
            </div>
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600" />
                <div className="flex-1">
                  <div className="h-2 w-16 bg-white/20 rounded" />
                  <div className="h-1.5 w-24 bg-white/10 rounded mt-1" />
                </div>
              </div>
              <div className="bg-[#00D9FF]/5 border border-[#00D9FF]/10 p-2 rounded-xl text-[9px] text-[#00D9FF]">
                <span className="font-bold">✦ Voice Handshake Active:</span> Listening for hotword trigger command.
              </div>
            </div>
            <div className="text-[8px] text-slate-500 text-center">Settings panel synchronization</div>
          </div>
        );
      }
    }

    if (app.id === 'task-pulse') {
      return (
        <div className={glassPhoneTheme}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[9px] text-purple-400 uppercase">Kanban Board</span>
            <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1 rounded">AGENDA</span>
          </div>
          <div className="flex-1 flex flex-col justify-around py-2 gap-1.5">
            <div className="bg-[#131522] border border-white/5 p-2 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[9px] text-slate-200">Refactor database</span>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[80%]" />
              </div>
            </div>
            <div className="bg-[#131522] border border-white/5 p-2 rounded-xl opacity-80">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[9px] text-slate-200">Write APK test suites</span>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full w-[45%]" />
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-2 flex justify-between items-center">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded bg-white/10" />
              <div className="w-3 h-3 rounded bg-[#8B5CF6]/20" />
            </div>
            <span className="text-[8px] text-slate-400">Streak: 12 Days</span>
          </div>
        </div>
      );
    }

    if (app.id === 'retro-quest') {
      return (
        <div className={glassPhoneTheme}>
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="font-mono text-[8px] text-pink-400 text-shadow-sm">RETROQUEST GAME ENGINE</span>
            <span className="font-mono text-[8px] text-right">60 FPS</span>
          </div>
          <div className="flex-1 rounded-lg bg-black/80 my-2 relative overflow-hidden flex flex-col justify-between p-1.5 border border-white/5">
            {/* screen background */}
            <div className="absolute inset-0 bg-radial-gradient flex items-center justify-center opacity-15">
              <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px]" />
            </div>
            <div className="flex justify-between items-center z-10 text-[8px] font-mono text-[#FF4D9D]">
              <span>SCORE: 02930</span>
              <span>LIVES: ❤❤❤</span>
            </div>
            <div className="flex items-center justify-center flex-1 my-1">
              <Play className="w-8 h-8 text-[#FF4D9D] animate-ping opacity-60 absolute" />
              <span className="font-sans font-bold text-shadow text-[11px] text-white tracking-widest z-10">LEVEL 1-2 START</span>
            </div>
            <div className="flex justify-between items-end z-10">
              <div className="w-6 h-6 rounded-full bg-zinc-800/85 border border-white/10 flex items-center justify-center text-[7px]">🕹</div>
              <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center font-bold text-[8px] text-slate-950 font-mono">B</div>
                <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center font-bold text-[8px] text-slate-950 font-mono">A</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default universal smartphone glass layout representation
    return (
      <div className={glassPhoneTheme}>
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="font-mono text-[9px] text-slate-300 uppercase">{app.name} preview</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
            <div className="w-1 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3 text-center gap-2">
          <AppIcon iconUrl={app.iconUrl} size="sm" glow={false} />
          <div>
            <h5 className="font-bold text-[10px] text-white leading-tight">{app.name}</h5>
            <p className="text-[8px] text-slate-400 mt-0.5 mt-1">{app.shortDescription}</p>
          </div>
        </div>
        <div className="text-[8px] text-slate-500 text-center">Interactive screenshot {index + 1} of 3</div>
      </div>
    );
  };

  return (
    <div 
      id={`page-detail-${app.id}`}
      className="max-w-6xl mx-auto px-4 py-6 md:py-10 animate-[fade-in-slide-up_0.35s_ease-out]"
    >
      {/* Return Catalog Link & Compagnion Share controllers */}
      <div className="flex items-center justify-between gap-4 mb-6 md:mb-10">
        <button
          id="btn-back-to-catalog"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-slate-700/50 text-slate-300 hover:text-white transition-all text-sm font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App Store
        </button>

        <button
          id={`btn-share-app-top-${app.slug}`}
          onClick={() => onShareApp(app)}
          className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/20 hover:border-[#00D9FF]/40 text-[#00D9FF] hover:text-cyan-200 transition-all text-sm font-bold cursor-pointer shadow-[0_4px_15px_rgba(0,217,255,0.05)] active:scale-95 duration-150"
        >
          <Share2 className="w-4 h-4" />
          <span>Share App</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COMPACT INFORMATION GRID (LG: 7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Header Block of Application */}
          <div className="p-6 md:p-8 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-gradient-to-tr from-cyan-400/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none" />
            
            <AppIcon iconUrl={app.iconUrl} size="lg" glow={true} className="flex-shrink-0" />
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                <span className="px-2.5 py-0.5 text-[11px] font-mono tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full font-semibold uppercase">
                  {app.category}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-mono bg-white/5 text-slate-400 border border-white/5 rounded-full font-medium">
                  v{app.version}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-1">
                {app.name}
              </h1>
              <p className="text-slate-400 text-sm mb-4">
                Designed by <span className="text-slate-200 font-semibold">{app.developer}</span>
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-slate-400 border-t border-white/5 pt-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Updated: <strong className="text-slate-200">{app.lastUpdated}</strong>
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Safe
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Screen Display Carousel */}
          <section id="screenshots-slideshow-section" className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase ml-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" /> App Screenshots
            </h3>
            
            <div className="relative w-full flex flex-col md:flex-row gap-4 items-center justify-center bg-white/5 border border-white/5 rounded-[24px] p-6 backdrop-blur-md">
              {/* Screenshot Display Phone Wireframe View */}
              <div className="w-[200px] h-[360px] md:w-[220px] md:h-[400px] bg-slate-950 rounded-[36px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-4 border-zinc-800/80 relative flex items-center justify-center">
                {/* Speaker mesh & dynamic notch node */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-8 h-1 bg-zinc-800 rounded-full" />
                </div>
                
                {/* The display screen inner body */}
                <div className="w-full h-full rounded-[28px] overflow-hidden">
                  {renderMockScreenshotContent(activeScreenshot)}
                </div>
              </div>

              {/* Side Selector Buttons Desktop */}
              <div className="flex-1 flex flex-col gap-3 w-full">
                <h4 className="text-white font-sans font-bold text-base hidden md:block">Interactive UI Blueprint</h4>
                <p className="text-slate-400 text-xs hidden md:block leading-relaxed">
                  Toggle the carousel tabs below to explore some of the actual responsive screens and core modular layouts designed for this app.
                </p>
                
                {/* Slide indicator navigation pill bars */}
                <div className="flex md:flex-col gap-2.5 justify-center w-full mt-2 md:mt-0">
                  {app.screenshots.map((_, idx) => (
                    <button
                      key={idx}
                      id={`btn-screenshot-dot-${idx}`}
                      onClick={() => setActiveScreenshot(idx)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex-1 md:flex-initial flex items-center justify-between ${
                        activeScreenshot === idx
                          ? 'bg-[#00D9FF]/10 border-[#00D9FF]/35 text-white shadow-[0_0_15px_rgba(0,217,255,0.1)]'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[11px] font-mono uppercase tracking-wider">Screen {idx + 1}</span>
                      <Sparkles className={`w-3.5 h-3.5 text-[#00D9FF] hidden md:block ${activeScreenshot === idx ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Deep Description & Feature Sheets */}
          <section id="full-description-section" className="p-6 md:p-8 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">About this App</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                {app.description}
              </p>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h4 className="text-md font-bold text-white mb-3 text-shadow-sm flex items-center gap-2">
                <Check className="w-5 h-5 text-cyan-400" /> Key Features
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {app.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] mt-1.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h4 className="text-md font-bold text-white mb-3 text-shadow-sm flex items-center gap-2 text-purple-300">
                <ShieldCheck className="w-4 h-4" /> Permissions Required
              </h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                This installer requires access parameters in compliance with standard Android Sandboxes permissions. You might be asked to approve these on first startup:
              </p>
              <div className="flex flex-wrap gap-2">
                {app.permissions.map((p, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs font-medium font-mono leading-none">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* User Reviews Section */}
          <section id="user-reviews-section" className="p-6 md:p-8 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" /> User Reviews & Ratings
              </h3>
              <p className="text-slate-400 text-xs font-sans">
                Real feedback from the user community on this distribution package.
              </p>
            </div>

            {/* Ratings Summary Stats */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950/30 border border-white/5 animate-[fade-in_0.3s_ease-out]">
              <div className="text-center sm:border-r sm:border-white/5 sm:pr-8 sm:py-2">
                <span className="block text-3xl font-black text-white">{app.rating}</span>
                <span className="block text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">Average Rating</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 font-sans">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < Math.floor(app.rating)
                          ? 'fill-[#00D9FF] text-[#00D9FF]'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-mono text-slate-300 ml-1">
                    Based on {(app.reviews?.length || 0) + 12} community audits
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Every rating contributes to the dynamic average. Submit your feedback to assist fellow developers!
                </p>
              </div>
            </div>

            {/* Submit New Review Form */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                <PenTool className="w-3.5 h-3.5 text-[#00D9FF]" /> Write a Review
              </h4>
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 font-sans text-xs">
                {/* Interactive Star Selection */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starValue = idx + 1;
                      const active = hoveredStar !== null ? starValue <= hoveredStar : starValue <= reviewRating;
                      return (
                        <button
                          key={idx}
                          type="button"
                          id={`star-btn-${starValue}`}
                          onClick={() => setReviewRating(starValue)}
                          onMouseEnter={() => setHoveredStar(starValue)}
                          onMouseLeave={() => setHoveredStar(null)}
                          className="p-1 scale-110 focus:outline-none focus:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              active
                                ? 'fill-[#00D9FF] text-[#00D9FF]'
                                : 'text-slate-700 hover:text-slate-500'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-mono font-bold text-cyan-400 ml-2">
                      {reviewRating} / 5
                    </span>
                  </div>
                </div>

                {/* Name Input */}
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                    Your Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#00D9FF] transition-colors" />
                    <input
                      id="review-input-author"
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="Devon Lane"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/40 rounded-xl border border-white/5 focus:border-[#00D9FF]/40 text-xs text-white placeholder-slate-500 outline-none transition-all focus:bg-slate-950/80"
                      required
                    />
                  </div>
                </div>

                {/* Comment Textarea */}
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                    Your Comment / Thoughts
                  </label>
                  <div className="relative flex items-start">
                    <MessageSquare className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#00D9FF] transition-colors" />
                    <textarea
                      id="review-input-comment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe your installation experience, performance speed, or feature proposals..."
                      rows={3}
                      maxLength={300}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/40 rounded-xl border border-white/5 focus:border-[#00D9FF]/40 text-xs text-white placeholder-slate-500 outline-none transition-all h-20 resize-none focus:bg-slate-950/80"
                      required
                    />
                  </div>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-600 block">
                    {reviewComment.length}/300
                  </span>
                </div>

                {/* Submit button */}
                <button
                  id="btn-submit-review"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500/10 hover:bg-[#00D9FF] hover:text-slate-950 border border-purple-500/20 hover:border-transparent text-xs text-[#C084FC] font-sans font-bold transition-all cursor-pointer shadow-sm hover:shadow-[0_4px_15px_rgba(0,217,255,0.2)]"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>SUBMIT MY REVIEW</span>
                </button>
              </form>
            </div>

            {/* List of Reviews */}
            <div className="flex flex-col gap-3 font-sans">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 ml-1">
                Recent Reviews ({app.reviews?.length || 0})
              </h4>
              {(!app.reviews || app.reviews.length === 0) ? (
                <div className="p-4 bg-slate-950/20 border border-dashed border-white/5 rounded-xl text-center">
                  <p className="text-slate-500 text-xs">No user reviews yet. Be the first to leave one!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
                  {app.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-950/30 border border-white/5 rounded-xl flex flex-col gap-2 transition-all hover:bg-slate-950/50">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-bold text-slate-200 text-xs block">{rev.author}</span>
                          <span className="text-[9px] text-[#00D9FF] font-semibold mt-0.5 block flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Verified Installer
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-[#00D9FF] text-[#00D9FF]' : 'text-slate-800'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[8px] font-mono text-slate-500">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT ACTION SHEET / SPECS DISPLAY (LG: 5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          
          {/* Main Download Glass Card Component */}
          <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col gap-5 text-center shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-[-50px] left-[-50px] w-44 h-44 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none" />
            
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-1">Direct APK Installer</h2>
              <span className="text-xs text-slate-400">Install safely without ads, timers, or redirects</span>
            </div>

            <div className="h-[1px] bg-white/10 w-full" />

            {/* Spec breakdown inline matrix */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-900/50 hover:bg-slate-900/60 transition-all border border-white/5 p-3 rounded-2xl">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500">File Size</span>
                <strong className="text-sm text-slate-100 font-bold">{app.size}</strong>
              </div>
              <div className="bg-slate-900/50 hover:bg-slate-900/60 transition-all border border-white/5 p-3 rounded-2xl">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500">Rating</span>
                <strong className="text-sm text-[#00D9FF] font-bold">★ {app.rating}</strong>
              </div>
              <div className="bg-slate-900/50 hover:bg-slate-900/60 transition-all border border-white/5 p-3 rounded-2xl">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500">Downloads</span>
                <strong className="text-sm text-purple-400 font-bold">{(app.downloads + (isDownloaded ? 1 : 0)).toLocaleString()}</strong>
              </div>
            </div>

            {/* Interactive CDN Delivery Optimizer & Download Engine */}
            <div className="bg-slate-950/65 rounded-2xl p-4 border border-white/5 text-left flex flex-col gap-3.5 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#00D9FF] flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 animate-pulse" /> CDN Network Router
                </span>
                <span id="selected-cdn-indicator" className="text-[10px] font-mono text-slate-400 font-semibold">{cdnNode}</span>
              </div>

              {/* Edge Node & Optimizer Configuration Hub (Configurable when Idle) */}
              {downloadProgress < 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono uppercase text-slate-500">Fastest Edge Node</label>
                    <select
                      id="cdn-node-select"
                      disabled={downloadProgress >= 0}
                      value={cdnNode}
                      onChange={(e) => setCdnNode(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 focus:outline-none focus:border-[#00D9FF]/40 cursor-pointer"
                    >
                      <option value="Cloudflare CDN (Global Edge)">Cloudflare (Global Edge)</option>
                      <option value="Fastly Node (Tokyo, JP)">Fastly Node (Tokyo, JP)</option>
                      <option value="Akamai Core (Frankfurt, DE)">Akamai Core (Frankfurt, DE)</option>
                      <option value="Direct Webhost (AWS S3-East)">Direct Webhost (AWS S3-East)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono uppercase text-slate-500">Acceleration Mode</label>
                    <button
                      id="btn-toggle-turbo-boost"
                      type="button"
                      disabled={downloadProgress >= 0}
                      onClick={() => setSpeedBoost(!speedBoost)}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-all text-left ${
                        speedBoost 
                          ? 'bg-purple-950/30 border-purple-500/30 text-purple-200' 
                          : 'bg-slate-900 border-white/10 text-slate-400'
                      }`}
                    >
                      <span className="text-[11px] font-bold flex items-center gap-1">
                        <Zap className={`w-3 h-3 ${speedBoost ? 'text-yellow-400 fill-yellow-400 animate-bounce' : 'text-slate-500'}`} />
                        Turbo 4x Mode
                      </span>
                      <span className="text-[9px] font-mono font-bold bg-white/10 px-1.5 rounded">
                        {speedBoost ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Download Real-time Metrics dashboard (Visible when Downloading) */
                <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-center font-mono">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase text-slate-500">Live Rate</span>
                    <span id="txt-live-rate" className="text-xs font-bold text-cyan-400 mt-0.5 flex items-center justify-center gap-1">
                      <Activity className="w-3 h-3 text-[#00D9FF] animate-pulse" />
                      {currentSpeed} MB/s
                    </span>
                  </div>
                  <div className="flex flex-col border-x border-white/10">
                    <span className="text-[8px] uppercase text-slate-500">Remaining Size</span>
                    <span id="txt-remaining-size" className="text-xs font-bold text-purple-300 mt-0.5">
                      {Math.max(0, parseFloat(((1 - downloadProgress / 100) * parseFloat(app.size || '15')).toFixed(1)))} MB
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase text-slate-500">ETA Clock</span>
                    <span id="txt-eta-clock" className="text-xs font-bold text-pink-400 mt-0.5 animate-pulse">
                      {etaSeconds > 0 ? `${etaSeconds}s` : 'Calculating'}
                    </span>
                  </div>
                </div>
              )}

              {/* Download trigger or Progress Gauge container */}
              {downloadProgress >= 0 ? (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                    <span className="animate-pulse flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      Streaming Packet PIPELINES...
                    </span>
                    <span id="lbl-download-pct">{downloadProgress}%</span>
                  </div>
                  {/* sleek animated progress loader */}
                  <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-white/10 p-[1.5px] relative">
                    <div 
                      id="bar-download-progress"
                      className="h-full rounded-full bg-gradient-to-r from-[#00D9FF] via-purple-500 to-pink-500 transition-all duration-200 shadow-[0_0_10px_rgba(0,217,255,0.5)]"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 italic text-center font-sans">
                    Secure handshake verified. Streaming CDN blocks over parallel ports...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <button
                    id={`btn-download-apk-exec-${app.id}`}
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-slate-950 font-bold transition-all relative overflow-hidden group cursor-pointer shadow-[0_4px_25px_rgba(0,183,212,0.3)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.5)]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    <Download className="w-4.5 h-4.5 relative z-10" />
                    <span className="relative z-10 font-sans tracking-wide">
                      {isDownloaded ? 'DOWNLOAD AGAIN' : 'DOWNLOAD APK NOW'}
                    </span>
                  </button>

                  <button
                    id={`btn-share-apk-installer-${app.id}`}
                    type="button"
                    onClick={() => onShareApp(app)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 border border-white/5 hover:border-slate-700/50 dark:border-white/5 dark:hover:border-slate-700 text-slate-350 hover:text-white transition-all text-xs font-bold cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>SHARE THIS APP</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 mt-0.5 font-mono uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Secure CDN nodes active
            </div>
          </div>

          {/* Compatibility Specification Table card */}
          <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" /> Package Details
            </h3>

            <div className="flex flex-col gap-3 font-sans text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Target Framework</span>
                <span className="text-right text-slate-200">Android SDK 34</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Compatibility</span>
                <span className="text-right text-slate-200">{app.compatibility}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">APK SHA-256</span>
                <span className="text-right font-mono text-[9px] text-[#00D9FF] truncate w-40 text-ellipsis select-all" title="fb4b67a1d68bc42c0b631bbfc803f51c7">
                  fb4b67a1d68bc4...e906751d
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Release Date</span>
                <span className="text-right text-slate-200">{app.releaseDate}</span>
              </div>
            </div>
          </div>

          {/* What's New Block Card */}
          <div className="p-6 rounded-[24px] bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/15 backdrop-blur-xl flex flex-col gap-3 transition-colors">
            <h4 className="text-sm font-bold text-pink-400 uppercase tracking-widest flex items-center gap-2">
              ★ WHAT’S NEW IN v{app.version}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
              "{app.whatsNew}"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
