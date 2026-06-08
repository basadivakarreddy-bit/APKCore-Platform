import React from 'react';
import { History, Calendar, CheckSquare, Sparkles, Pin } from 'lucide-react';
import { motion } from 'motion/react';
import { UpdateTimeline } from '../types';
import { AppIcon } from './AppIcon';

interface LatestUpdatesProps {
  updates: UpdateTimeline[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 14 
    } 
  }
};

export function LatestUpdates({ updates }: LatestUpdatesProps) {
  const getUpdateStyles = (type: 'major' | 'minor' | 'patch') => {
    switch (type) {
      case 'major':
        return {
          bg: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
          dot: 'bg-pink-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]',
          label: 'MAJOR RELEASE'
        };
      case 'minor':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          dot: 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
          label: 'FEATURE UPDATE'
        };
      default:
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]',
          label: 'HOTFIX / PATCH'
        };
    }
  };

  return (
    <section 
      id="updates-timeline-section" 
      className="max-w-4xl mx-auto px-4 py-12 md:py-16"
    >
      <div className="text-center mb-12">
        <span className="px-3 py-1 bg-white/5 border border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-400 rounded-full inline-flex items-center gap-1.5 mb-2.5">
          <History className="w-3.5 h-3.5 text-cyan-400" /> Staging Release Updates
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Staging Logs & Updates
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          Monitor native staging progress, file builds audits, and security patches over time.
        </p>
      </div>

      {/* Vertical Timeline container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative border-l border-white/10 ml-4 md:ml-12 pl-6 md:pl-10 flex flex-col gap-10"
      >
        <div className="absolute top-0 bottom-0 left-[-1px] w-[1px] bg-gradient-to-b from-cyan-400 via-purple-600 to-transparent" />
        
        {updates.map((update) => {
          const styles = getUpdateStyles(update.type);
          
          return (
            <motion.div 
              key={update.id} 
              id={`update-node-${update.id}`}
              variants={itemVariants}
              className="relative group"
            >
              {/* Timeline outer floating dot */}
              <div 
                className={`absolute left-[-31px] md:left-[-45px] top-1.5 w-4 h-4 rounded-full border-4 border-slate-950 flex items-center justify-center transition-transform group-hover:scale-125 ${styles.dot}`} 
              />

              {/* Frosted Glass Timeline update card */}
              <div className="p-5 md:p-6 rounded-[22px] bg-white/5 border border-white/5 backdrop-blur-xl hover:border-white/15 hover:bg-white/10 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                
                {/* Heading details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <AppIcon iconUrl={update.appIcon || 'app-default'} name={update.appName} size="sm" glow={false} />
                    <div>
                      <h4 className="text-white font-bold text-sm md:text-base leading-tight group-hover:text-cyan-300 transition-colors">
                        {update.appName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-md border ${styles.bg}`}>
                          {styles.label}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-300">
                          v{update.version}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400 sm:self-center font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {update.date}
                  </span>
                </div>

                {/* Bullets change logs items list */}
                <div className="flex flex-col gap-2.5">
                  <h5 className="text-[10px] uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-[#00D9FF]" /> BUILD CHANGELOGS:
                  </h5>
                  <ul className="flex flex-col gap-2 font-sans text-xs md:text-sm text-slate-300 pl-1.5">
                    {update.changes.map((change, cIdx) => (
                      <li key={cIdx} className="flex gap-2 items-start">
                        <span className="text-[#00D9FF] flex-shrink-0 mt-0.5">✦</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
