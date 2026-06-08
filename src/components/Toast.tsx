import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'info' | 'error' | 'download';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onActionClick?: () => void;
  actionLabel?: string;
}

interface ToastContextType {
  toast: (
    message: string,
    type: ToastType,
    duration?: number,
    onActionClick?: () => void,
    actionLabel?: string
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((
    message: string,
    type: ToastType,
    duration = 4000,
    onActionClick?: () => void,
    actionLabel?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration, onActionClick, actionLabel }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Node */}
      <div 
        className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none"
        id="toast-container"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

interface ToastCardProps {
  key?: string;
  item: ToastItem;
  onClose: (id: string) => void;
}

function ToastCard({ item, onClose }: ToastCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(Math.round((item.duration || 4000) / 1000));

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(item.id);
    }, item.duration || 4000);
    return () => clearTimeout(timer);
  }, [item, onClose]);

  useEffect(() => {
    if (!item.onActionClick) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [item]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" id="icon-toast-success" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" id="icon-toast-error" />,
    info: <Info className="w-5 h-5 text-cyan-400" id="icon-toast-info" />,
    download: <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" id="icon-toast-download" />
  };

  const borders = {
    success: 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    error: 'border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    info: 'border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    download: 'border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
  };

  return (
    <motion.div
      id={`toast-${item.id}`}
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, x: 50 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: 100, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-slate-950/75 border backdrop-blur-xl ${borders[item.type]} text-white`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[item.type]}</div>
      <div className="flex-1 text-sm font-sans font-medium text-slate-150 leading-snug flex flex-col gap-1.5">
        <span>{item.message}</span>
        {item.onActionClick && (
          <button
            id={`btn-action-toast-${item.id}`}
            onClick={() => {
              item.onActionClick?.();
              onClose(item.id);
            }}
            className="self-start mt-1 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25 rounded-lg text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-all uppercase tracking-widest cursor-pointer select-none flex items-center gap-1.5"
          >
            <span>{item.actionLabel || 'UNDO'}</span>
            <span className="opacity-60 bg-white/10 px-1 rounded font-sans font-bold text-[9px]">{timeLeft}s</span>
          </button>
        )}
      </div>
      <button
        id={`btn-close-toast-${item.id}`}
        onClick={() => onClose(item.id)}
        className="flex-shrink-0 hover:bg-white/10 p-1 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
