import { motion } from 'framer-motion';

export default function Navbar({ onBrandingClick }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-[80] bg-transparent md:bg-black/20 backdrop-blur-none md:backdrop-blur-xl border-b-0 md:border-b border-white/5 transition-all duration-500">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
        {/* Logo / Brand */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_12px_var(--accent)]"></div>
          <span className="text-[var(--text-primary)] font-sans font-medium text-sm md:text-base tracking-[0.15em] uppercase">
            Gwen Gallery
          </span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center">
          <button 
            onClick={onBrandingClick}
            className="text-[var(--text-primary)] font-mono text-[0.65rem] tracking-[0.3em] font-medium opacity-80 hover:opacity-100 hover:text-[var(--accent)] transition-all duration-300 cursor-pointer"
          >
            JINXSUPER<span className="text-[var(--accent)] ml-1">©</span>
          </button>
        </div>

        {/* Fluid Mobile Navbar Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 w-[90%] flex items-center justify-between bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full px-6 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
          
          <span className="text-[var(--text-primary)] font-sans font-medium text-[0.7rem] tracking-widest uppercase">
            Gwen.v1
          </span>
          
          <button 
            onClick={onBrandingClick}
            className="text-[var(--text-primary)] font-mono text-[0.6rem] tracking-[0.2em] font-medium hover:text-[var(--accent)] active:scale-95 transition-all"
          >
            JINXSUPER<span className="text-[var(--accent)] text-[0.5rem] align-top ml-0.5">©</span>
          </button>
        </motion.div>
      </div>
    </nav>
  )
}
