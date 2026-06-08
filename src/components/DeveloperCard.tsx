import React from 'react';
import { Smartphone, ShieldCheck, Terminal, Cpu, Github, Twitter, Linkedin, Mail, BadgeCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function DeveloperCard() {
  const skills = [
    { name: 'Android SDK & Kotlin', level: '95%', icon: <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> },
    { name: 'Full-Stack TypeScript & APIs', level: '90%', icon: <Terminal className="w-3.5 h-3.5 text-purple-400" /> },
    { name: 'Reverse Engineering & APK Audits', level: '85%', icon: <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> },
    { name: 'Low-latency System Architectures', level: '80%', icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  return (
    <section 
      id="about-developer-section"
      className="max-w-4xl mx-auto px-4 py-12 md:py-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* LEFT PROFILE VISUAL COLUMN (MD: 5 COLS) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="md:col-span-5 flex justify-center"
        >
          <div className="relative group p-1.5 rounded-[32px] bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(139,92,246,0.25)] hover:shadow-[0_0_35px_rgba(0,217,255,0.45)] transition-all animate-[float-avatar_6s_infinite_alternate_ease-in-out]">
            {/* Transparent Glass Profile space */}
            <div className="w-[240px] h-[300px] rounded-[28px] bg-slate-950/90 backdrop-blur-3xl border border-white/5 p-6 flex flex-col justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 blur-2xl rounded-full" />
              
              {/* Procedural glowing avatar visual */}
              <div className="relative w-28 h-28 mt-4">
                {/* rotating halo ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#00D9FF] animate-[spin_20s_linear_infinite]" />
                {/* pulsing core spacer */}
                <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-pulse" />
                <div className="absolute inset-3 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-14 h-14 opacity-90 fill-none">
                    <defs>
                      <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00D9FF" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <path d="M50,15 A15,15 0 1,1 50,45 A15,15 0 1,1 50,15" fill="url(#avatar-grad)" />
                    <path d="M15,85 C15,62 30,55 50,55 C70,55 85,62 85,85" stroke="url(#avatar-grad)" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>
                {/* dynamic check badge */}
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#00D9FF] border-2 border-slate-950 flex items-center justify-center">
                  <BadgeCheck className="w-3.5 h-3.5 text-slate-950" />
                </div>
              </div>

              {/* Minimalist developer tag */}
              <div className="text-center mb-2">
                <h4 className="text-sm font-bold text-white tracking-tight leading-none">Aether Architect</h4>
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mt-1">Lead APK Developer</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT BIO COLUMN (MD: 7 COLS) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:col-span-7 flex flex-col gap-5 text-center md:text-left"
        >
          <div>
            <span className="px-2.5 py-0.5 bg-white/5 border border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-400 rounded-full inline-flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3 h-3 text-purple-400" /> Lead Architect Portfolio
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
              About the Developer
            </h2>
            <p className="text-slate-350 text-sm mt-3 leading-relaxed font-sans">
              Welcome. I program high-efficiency native systems, focus-driven tools, and spatial games. This store acts as my secondary, secure staging and deployment platform for custom Android applications. Everything published here is built with performance profiles, local SQLite sandbox states, and lightweight visual designs.
            </p>
          </div>

          {/* Skill lists metrics with sliding transition when viewed */}
          <div className="flex flex-col gap-3 text-left">
            {skills.map((skill, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span className="flex items-center gap-2 font-medium">
                    {skill.icon}
                    {skill.name}
                  </span>
                  <span className="font-mono text-slate-400">{skill.level}</span>
                </div>
                {/* custom glass level indicator progress track */}
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: skill.level }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Social icons contact grid */}
          <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
            <motion.a 
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3 bg-white/5 hover:bg-[#00D9FF]/10 border border-white/5 hover:border-[#00D9FF]/25 rounded-xl text-slate-400 hover:text-[#00D9FF] transition-all cursor-pointer shadow-sm"
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3 bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/25 rounded-xl text-slate-400 hover:text-purple-400 transition-all cursor-pointer shadow-sm"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3 bg-white/5 hover:bg-[#00D9FF]/10 border border-white/5 hover:border-[#00D9FF]/25 rounded-xl text-slate-400 hover:text-[#00D9FF] transition-all cursor-pointer shadow-sm"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="mailto:contact@domain.corp" 
              className="p-3 bg-white/5 hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/25 rounded-xl text-slate-400 hover:text-pink-400 transition-all cursor-pointer shadow-sm"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes float-avatar {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </section>
  );
}
