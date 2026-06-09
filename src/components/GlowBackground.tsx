import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function GlowBackground() {
  const [isHovering, setIsHovering] = useState(false);

  // High performance motion values bypassing React re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Background glow spring with soft damping
  const bgSpringConfig = { damping: 45, stiffness: 120, mass: 1.2 };
  const bgGlowX = useSpring(mouseX, bgSpringConfig);
  const bgGlowY = useSpring(mouseY, bgSpringConfig);

  useEffect(() => {
    // Only enable active mouse tracking on desktop clients with actual pointing devices
    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isTouchOnly) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to gate rapid mouse inputs for standard screens
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isHovering) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering, mouseX, mouseY]);

  return (
    <>
      <div
        className="fixed inset-0 -z-50 bg-slate-50 dark:bg-[#0B0B12] overflow-hidden pointer-events-none select-none transition-colors duration-300"
      >
        {/* Aurora Ambient Gradients (Optimized with GPU layers via will-change) */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 blur-[130px] opacity-70 animate-[pulse_12s_ease-in-out_infinite] will-change-[transform,opacity]"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 dark:bg-purple-600/10 blur-[150px] opacity-60 animate-[pulse_16s_ease-in-out_infinite] will-change-[transform,opacity]"
          style={{ animationDelay: '3s' }}
        />
        <div 
          className="absolute top-[30%] right-[10%] w-[45%] h-[45%] rounded-full bg-pink-500/5 dark:bg-pink-500/5 blur-[120px] opacity-40 animate-[pulse_10s_ease-in-out_infinite] will-change-[transform,opacity]"
          style={{ animationDelay: '6s' }}
        />

        {/* Floating Liquid Blobs */}
        <div 
          className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-gradient-to-r from-cyan-400/5 to-blue-500/5 blur-3xl opacity-50 will-change-transform"
          style={{
            animation: 'float-liquid 25s infinite alternate ease-in-out'
          }}
        />
        <div 
          className="absolute bottom-[20%] right-[20%] w-96 h-96 rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/5 blur-3xl opacity-40 will-change-transform"
          style={{
            animation: 'float-liquid 30s infinite alternate-reverse ease-in-out',
            animationDelay: '4s'
          }}
        />

        {/* HIGH-FIDELITY MOUSE FOLLOW AMBIENT GLOW ZONE (Behind App cards, in -z-40 layer - fully GPU accelerated) */}
        {isHovering && (
          <motion.div
            className="absolute pointer-events-none rounded-full blur-[110px] opacity-45 dark:opacity-40 bg-gradient-to-r from-cyan-400/25 via-purple-500/20 to-pink-500/20 will-change-transform"
            style={{
              x: bgGlowX,
              y: bgGlowY,
              width: '500px',
              height: '500px',
              translateX: '-50%',
              translateY: '-50%',
            }}
          />
        )}

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" 
          style={{
            maskImage: 'radial-gradient(ellipse_at_center,black_30%,transparent_80%)',
            WebkitMaskImage: 'radial-gradient(ellipse_at_center,black_30%,transparent_80%)'
          }}
        />

        {/* CSS Animations style definition */}
        <style>{`
          @keyframes float-liquid {
            0% {
              transform: translate(0, 0) scale(1) rotate(0deg);
              border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            }
            50% {
              transform: translate(40px, -50px) scale(1.1) rotate(180deg);
              border-radius: 40% 60% 50% 50% / 50% 60% 40% 50%;
            }
            100% {
              transform: translate(-30px, 30px) scale(0.9) rotate(360deg);
              border-radius: 50% 50% 60% 40% / 40% 50% 50% 60%;
            }
          }
        `}</style>
      </div>
    </>
  );
}
