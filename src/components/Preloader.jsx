import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Preloader({ isFullyLoaded, progress = 0 }) {
  const containerRef = useRef(null);
  const textGroupRef = useRef(null);
  const [complete, setComplete] = useState(false);
  const tlRef = useRef(null);

  const welcomeChars = "WELCOME TO".split("");
  const nameChars = "GWEN GALLERY".split("");

  const [hasStarted, setHasStarted] = useState(false);
  const shutterTopRef = useRef(null);
  const shutterBottomRef = useRef(null);

  useEffect(() => {
    // 1. Initial State
    gsap.set(".char-welcome", { opacity: 0, x: -20 });
    gsap.set(".char-name", { opacity: 0, x: 20 });
    gsap.set(".status-text", { opacity: 0, y: 10 });
    gsap.set(".loading-line", { scaleX: 0 });
    gsap.set(".start-trigger", { opacity: 0, scale: 0.95 });

    // 2. Entrance Sequence
    const entranceTl = gsap.timeline();
    entranceTl
      .to(".char-welcome", { opacity: 0.6, x: 0, duration: 1.2, ease: "power3.out" })
      .to(".char-name", { opacity: 0.6, x: 0, duration: 1.2, ease: "power3.out" }, "-=1")
      .to(".status-text", { opacity: 0.4, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" }, "-=0.5")
      .to(".loading-line", { scaleX: 1, duration: 1.5, ease: "expo.inOut" }, "-=0.8");

    return () => {};
  }, []);

  useEffect(() => {
    // Reveal start button at 100%
    if (progress === 100) {
      gsap.to(".start-trigger", {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)"
      });
    }
  }, [progress]);

  const handleStart = () => {
    setHasStarted(true);
    
    const exitTl = gsap.timeline({
      onComplete: () => setComplete(true)
    });

    exitTl
      .to(".center-content, .corner-ui, .bottom-ui", {
        opacity: 0,
        y: (i, el) => el.classList.contains('top') ? -20 : 20,
        duration: 0.6,
        ease: "power3.in"
      })
      .to(shutterTopRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut"
      }, "+=0.1")
      .to(shutterBottomRef.current, {
        yPercent: 100,
        duration: 1.2,
        ease: "expo.inOut"
      }, "<");
  };

  if (complete) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-black text-[var(--text-primary)] font-mono overflow-hidden"
    >
      {/* SHUTTER PANELS */}
      <div 
        ref={shutterTopRef}
        className="absolute top-0 left-0 w-full h-[50.5vh] bg-[#050505] z-[10] border-b border-white/5"
      ></div>
      <div 
        ref={shutterBottomRef}
        className="absolute bottom-0 left-0 w-full h-[50.5vh] bg-[#050505] z-[10] border-t border-white/5"
      ></div>

      {/* CORNER UI - TOP */}
      <div className="corner-ui top absolute top-10 left-10 z-[20] flex flex-col gap-1">
        <span className="char-welcome text-[0.55rem] tracking-[0.5em] uppercase opacity-60">Welcome To</span>
        <div className="h-px w-8 bg-[var(--accent)] opacity-40 mt-1"></div>
      </div>

      <div className="corner-ui top absolute top-10 right-10 z-[20] text-right">
        <span className="char-name text-[0.65rem] tracking-[0.8em] uppercase opacity-80 decoration-[var(--accent)]">Gwen Gallery</span>
        <div className="status-text mt-2 text-[0.45rem] tracking-[0.4em] opacity-30 uppercase">System_State: Live</div>
      </div>

      {/* CENTER CONTENT */}
      <div className="center-content absolute inset-0 z-[30] flex items-center justify-center pointer-events-none">
        <div className="start-trigger pointer-events-auto">
          {progress === 100 && !hasStarted && (
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-16 py-4 transition-all duration-500 group"
            >
              {/* Geist Industrial Button */}
              <div className="absolute inset-0 border border-white/10 group-hover:border-[var(--accent)] transition-colors duration-500"></div>
              <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-[var(--accent)]/5 transition-colors duration-500"></div>
              
              <span className="relative z-10 text-white font-mono text-[0.65rem] tracking-[0.8em] uppercase">
                Initialize_Start
              </span>

              {/* Scanline line */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </motion.button>
          )}
        </div>
      </div>

      {/* BOTTOM UI & LOADING BAR */}
      <div className="bottom-ui absolute bottom-12 left-10 right-10 z-[20]">
        <div className="flex justify-between items-end mb-4">
          <div className="status-text flex flex-col gap-1">
            <span className="text-[0.5rem] tracking-[0.4em] opacity-30 uppercase">JinXSuper Creative Engine</span>
            <span className="text-[0.45rem] tracking-[0.3em] opacity-20 uppercase">Core_Ver: 1.0.4 - Build_Final</span>
          </div>
          
          <div className="status-text flex flex-col items-end gap-1">
            <span className="text-[0.75rem] tracking-[0.4em] text-[var(--text-primary)]">{progress}%</span>
            <span className="text-[0.45rem] tracking-[0.3em] opacity-30 uppercase">Buffer_Sync_Status</span>
          </div>
        </div>

        <div className="loading-line w-full h-[1px] bg-white/10 relative origin-left overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
