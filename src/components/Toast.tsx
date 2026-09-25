import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Heart, Sparkles, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-container"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-max max-w-[90vw]"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center gap-3 bg-[#173c2d] text-white px-5 py-3 rounded-full shadow-xl border border-[#2d5744] text-sm font-medium"
          >
            {toast.type === 'favorite' ? (
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300 shrink-0" />
            ) : toast.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-[#8a9b82] shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white ml-1 p-0.5 rounded-full transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
