import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const userManuallyPaused = useRef(false);

  useEffect(() => {
    const autoPlayAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Autoplay was blocked by browser. Awaiting interaction:", err.message);
        }
      }
    };

    autoPlayAudio();

    // Trigger one-time play if browser blocked
    const forcePlay = async () => {
      // NEVER force play if the user already clicked "Mute" manually
      if (!userManuallyPaused.current && audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          // Auto remove once it succeeds
          ['click', 'scroll', 'keydown'].forEach(evt => window.removeEventListener(evt, forcePlay));
        } catch (e) {}
      }
    };

    ['click', 'scroll', 'keydown'].forEach(evt => window.addEventListener(evt, forcePlay));

    return () => {
      ['click', 'scroll', 'keydown'].forEach(evt => window.removeEventListener(evt, forcePlay));
    };
  }, []); // Run only ONCE on mount

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        userManuallyPaused.current = true;
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        userManuallyPaused.current = false;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient.mp3" loop />
      <button 
        onClick={toggleMute}
        className="fixed bottom-6 left-6 z-[90] flex items-center justify-center gap-[4px] p-4 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] transition-colors backdrop-blur-md cursor-pointer group shadow-xl"
        aria-label="Toggle Audio"
      >
        <span className="sr-only">Toggle Background Music</span>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-[3px] bg-[var(--text-primary)] rounded-full group-hover:bg-[var(--accent)] transition-colors"
            animate={{
              height: isPlaying ? [6, 16, 6] : 4,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
            style={{ width: '3px' }}
          />
        ))}
      </button>
    </>
  );
}
