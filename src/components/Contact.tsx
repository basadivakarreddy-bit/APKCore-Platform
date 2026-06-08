import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from './Toast';
import { Message } from '../types';

interface ContactFormProps {
  onAddMessage: (msg: Message) => void;
}

export function ContactForm({ onAddMessage }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast('Please populate all contact form inputs.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate database delivery handshakes
    setTimeout(() => {
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        message,
        date: new Date().toISOString().split('T')[0]
      };

      onAddMessage(newMessage);
      toast('Your message was securely submitted to the developer!', 'success');
      
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <motion.section 
      id="contact-form-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-xl mx-auto px-4 py-8 md:py-12"
    >
      <div className="p-6 md:p-8 rounded-[28px] bg-white/5 border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full text-[10px] font-mono uppercase tracking-widest text-slate-950 font-bold inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,217,255,0.25)]">
            <Sparkles className="w-3 h-3 text-slate-950 animate-spin" /> Send Message
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-2.5">
            Contact Developer
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Submit bug audits, feedback loops, or feature requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-sm">
          {/* Your Name Input */}
          <div className="relative group">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Your Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                id="contact-input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Devon Lane"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 rounded-xl border border-white/5 focus:border-[#00D9FF]/40 text-white placeholder-slate-500 outline-none transition-all focus:shadow-[0_0_15px_rgba(0,217,255,0.1)] focus:bg-slate-950/80"
                required
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className="relative group">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                id="contact-input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devon@domain.corp"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 rounded-xl border border-white/5 focus:border-[#00D9FF]/40 text-white placeholder-slate-500 outline-none transition-all focus:shadow-[0_0_15px_rgba(0,217,255,0.1)] focus:bg-slate-950/80"
                required
              />
            </div>
          </div>

          {/* Message Content Input */}
          <div className="relative group">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Message / Feedback Details
            </label>
            <div className="relative flex items-start">
              <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <textarea
                id="contact-input-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail clear instructions, specifications, or concerns..."
                rows={4}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 rounded-xl border border-white/5 focus:border-[#00D9FF]/40 text-white placeholder-slate-500 outline-none transition-all focus:shadow-[0_0_15px_rgba(0,217,255,0.1)] focus:bg-slate-950/80 h-32 resize-none"
                required
              />
            </div>
          </div>

          {/* Submit Trigger Actions */}
          <motion.button
            id="btn-contact-submit"
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full mt-2 flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold transition-all relative overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(0,217,255,0.35)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Handshaking servers...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>SEND MESSAGES</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
}
