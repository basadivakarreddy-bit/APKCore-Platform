import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ } from '../types';

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section 
      id="faq-accordion-section" 
      className="max-w-4xl mx-auto px-4 py-12 md:py-16"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
          <HelpCircle className="w-7 h-7 text-[#00D9FF] animate-pulse" />
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
          Need help installing or updating custom applications? Explore our guides to resolve questions instantly.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              id={`faq-item-${faq.id}`}
              className={`p-1 rounded-[20px] border transition-all duration-300 ${
                isOpen
                  ? 'bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-500/30 shadow-[0_4px_20px_rgba(139,92,246,0.1)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-slate-800'
              }`}
            >
              <div className="bg-slate-950/40 rounded-[15px] p-5 backdrop-blur-xl">
                {/* Trigger Heading button */}
                <button
                  id={`btn-faq-toggle-${faq.id}`}
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between text-left font-semibold text-white text-sm md:text-base gap-4 cursor-pointer focus:outline-none"
                >
                  <span className={isOpen ? 'text-[#00D9FF]' : 'text-slate-200'}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-colors ${isOpen ? 'text-[#00D9FF]' : 'text-slate-400'}`} />
                  </motion.div>
                </button>

                {/* Body Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                      className="overflow-hidden"
                    >
                      <div className="leading-relaxed text-xs md:text-sm text-slate-300 border-t border-white/5 pt-4 mt-4">
                        {faq.answer.split('\n\n').map((para, pIdx) => (
                          <p key={pIdx} className="mb-3 last:mb-0 font-sans tracking-wide">
                            {para}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
