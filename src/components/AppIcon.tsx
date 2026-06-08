import React from 'react';

interface AppIconProps {
  iconUrl: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
}

export function AppIcon({ iconUrl, className = '', size = 'md', glow = true }: AppIconProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-14 h-14 text-sm rounded-2xl',
    lg: 'w-24 h-24 text-lg rounded-3xl',
    xl: 'w-36 h-36 text-2xl rounded-[32px]'
  };

  const glowShadows = {
    'nova-ai-icon': 'shadow-[0_0_20px_rgba(0,217,255,0.4)]',
    'task-pulse-icon': 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    'retro-quest-icon': 'shadow-[0_0_20px_rgba(255,77,157,0.4)]',
    'dev-gate-icon': 'shadow-[0_0_20px_rgba(0,217,255,0.4)]',
    'aura-meditate-icon': 'shadow-[0_0_20px_rgba(168,85,247,0.4)]'
  };

  const finalGlow = glow ? (glowShadows[iconUrl as keyof typeof glowShadows] || 'shadow-[0_0_20px_rgba(255,255,255,0.15)]') : '';

  const renderIconContent = () => {
    switch (iconUrl) {
      case 'nova-ai-icon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
            <defs>
              <linearGradient id="nova-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D9FF" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#FF4D9D" />
              </linearGradient>
              <filter id="nova-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* outer ring */}
            <circle cx="50" cy="50" r="44" stroke="url(#nova-grad)" strokeWidth="1.5" strokeDasharray="15 5 5 5" className="animate-[spin_40s_linear_infinite]" />
            {/* inner orbit */}
            <circle cx="50" cy="50" r="32" stroke="url(#nova-grad)" strokeWidth="1.5" strokeDasharray="3 3" className="animate-[spin_10s_linear_infinite_reverse]" opacity="0.6" />
            {/* abstract core nodes */}
            <path d="M 50,15 A 35,35 0 0,0 15,50 A 35,35 0 0,0 50,85 A 35,35 0 0,0 85,50 Z" stroke="url(#nova-grad)" strokeWidth="2.5" opacity="0.8" />
            {/* glowing core planetary node */}
            <circle cx="50" cy="50" r="14" fill="url(#nova-grad)" filter="url(#nova-glow)" />
          </svg>
        );

      case 'task-pulse-icon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
            <defs>
              <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            {/* liquid progress track */}
            <circle cx="50" cy="50" r="40" stroke="#1E1935" strokeWidth="6" />
            <circle cx="50" cy="50" r="40" stroke="url(#pulse-grad)" strokeWidth="6" strokeDasharray="210" strokeDashoffset="50" strokeLinecap="round" className="rotate-[-90deg] origin-center" />
            {/* pulsing core node graph */}
            <path d="M30,50 L42,62 L70,34" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            {/* concentric dynamic rings */}
            <circle cx="50" cy="50" r="24" stroke="url(#pulse-grad)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          </svg>
        );

      case 'retro-quest-icon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
            <defs>
              <linearGradient id="retro-grad" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#FF4D9D" />
                <stop offset="50%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            {/* retro isometric grid boundary */}
            <rect x="15" y="15" width="70" height="70" rx="14" stroke="url(#retro-grad)" strokeWidth="2" opacity="0.4" />
            <line x1="15" y1="50" x2="85" y2="50" stroke="url(#retro-grad)" strokeWidth="1" opacity="0.15" />
            <line x1="50" y1="15" x2="50" y2="85" stroke="url(#retro-grad)" strokeWidth="1" opacity="0.15" />
            {/* stylized star/d-pad layout */}
            <g transform="translate(50, 50)" className="scale-75">
              {/* D pad */}
              <path d="M-12,-30 L12,-30 L12,-12 L30,-12 L30,12 L12,12 L12,30 L-12,30 L-12,12 L-30,12 L-30,-12 L-12,-12 Z" fill="url(#retro-grad)" />
              {/* glowing buttons */}
              <circle cx="20" cy="-20" r="6" fill="#FFFFFF" opacity="0.9" />
              <circle cx="34" cy="-34" r="4" fill="#00D9FF" opacity="0.8" />
            </g>
          </svg>
        );

      case 'dev-gate-icon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
            <defs>
              <linearGradient id="dev-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B0F19" />
                <stop offset="100%" stopColor="#00D9FF" />
              </linearGradient>
            </defs>
            {/* outer cyber shielding */}
            <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" stroke="url(#dev-grad)" strokeWidth="2" strokeLinejoin="round" />
            {/* inner prompt path */}
            <path d="M35,38 L48,50 L35,62" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* typing flashing cursor block */}
            <rect x="54" y="55" width="13" height="6" fill="#00D9FF" className="animate-[pulse_1s_infinite]" />
          </svg>
        );

      case 'aura-meditate-icon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
            <defs>
              <linearGradient id="aura-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            {/* symmetrical zen flower nodes */}
            <g transform="translate(50, 50)" className="animate-[spin_30s_linear_infinite]">
              {Array.from({ length: 8 }).map((_, i) => (
                <circle
                  key={i}
                  cx="0"
                  cy="18"
                  r="16"
                  stroke="url(#aura-grad)"
                  strokeWidth="1.5"
                  opacity="0.45"
                  transform={`rotate(${(i * 360) / 8})`}
                  className="origin-center"
                />
              ))}
              {/* breathing core node */}
              <circle cx="0" cy="0" r="12" fill="url(#aura-grad)" opacity="0.8" className="animate-[pulse_4s_ease-in-out_infinite]" />
            </g>
          </svg>
        );

      default:
        // Check if iconUrl is a valid base64 image or real URL path
        if (iconUrl.startsWith('http') || iconUrl.startsWith('data:image') || iconUrl.includes('/') || iconUrl.includes('.')) {
          return (
            <img 
              src={iconUrl} 
              alt="App Icon" 
              className="w-full h-full object-cover rounded-[inherit]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // fallback to procedural if loading fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          );
        }

        // Dynamic procedural abstract icon for standard uploaded apps
        const hash = iconUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue1 = hash % 360;
        const hue2 = (hue1 + 140) % 360;
        const initials = iconUrl.substring(0, 2).toUpperCase() || 'AP';

        return (
          <div 
            className="w-full h-full flex items-center justify-center font-bold tracking-widest text-white select-none overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, hsl(${hue1}, 80%, 45%) 0%, hsl(${hue2}, 90%, 55%) 100%)`
            }}
          >
            {/* subtle cyber pattern background overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
            <div className="absolute -inset-1 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
            <span className="relative z-10 text-shadow-sm font-mono truncate px-1">{initials}</span>
          </div>
        );
    }
  };

  return (
    <div
      id={`icon-${iconUrl}`}
      className={`relative inline-block ${sizeClasses[size]} ${finalGlow} ${className} bg-slate-900/45 p-[3px] border border-white/10 select-none overflow-hidden flex items-center justify-center`}
    >
      <div className="w-full h-full rounded-[inherit] overflow-hidden flex items-center justify-center bg-slate-950/80">
        {renderIconContent()}
      </div>
    </div>
  );
}
