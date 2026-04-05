import { motion, AnimatePresence } from 'framer-motion';

export default function BrandingModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop Blur */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div 
            className="relative w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[32px] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0, rotateX: -10 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0, rotateX: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40"></div>
            
            <div className="flex flex-col items-center text-center gap-6">
              <div className="space-y-2">
                <h2 className="font-sans font-medium text-[var(--text-primary)] text-xl tracking-tight">
                  Where you want to go?
                </h2>
                <p className="font-sans text-[var(--text-muted)] text-xs tracking-wider uppercase opacity-60">
                  Select your destination
                </p>
              </div>

              <div className="w-full space-y-3">
                <a 
                  href="https://github.com/JinXSuper" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[var(--accent)] hover:border-transparent transition-all duration-300"
                >
                  <span className="font-mono text-sm tracking-widest text-[var(--text-primary)] transition-colors">
                    GITHUB JINXSUPER
                  </span>
                  <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </a>

                <a 
                  href="https://jinxsuper.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[var(--accent)] hover:border-transparent transition-all duration-300"
                >
                  <span className="font-mono text-sm tracking-widest text-[var(--text-primary)] transition-colors">
                    PERSONAL WEBSITE
                  </span>
                  <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </a>
              </div>

              <button 
                onClick={onClose}
                className="mt-2 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-4 py-2"
              >
                Cancel Explorer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
