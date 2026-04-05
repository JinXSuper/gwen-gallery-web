import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Lightbox({ isOpen, src, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);
  
  // High-Performance 3D Tracking (Skips React Render Loop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Rotate between -15 and 15 degrees based on mouse position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  // Gloss Reflection Transforms (Moved to Top Level)
  const glossOpacity = useTransform(rotateX, [-15, 15], [0.2, 0]);
  const glossX = useTransform(rotateY, [-15, 15], [-50, 50]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setIsZoomed(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorSmoothX = useSpring(cursorX, { stiffness: 400, damping: 40 });
  const cursorSmoothY = useSpring(cursorY, { stiffness: 400, damping: 40 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Update cursor pos
    cursorX.set(clientX);
    cursorY.set(clientY);

    if (isZoomed) return;
    // Normalize to -0.5 to 0.5 for 3D tilt
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    const randomId = Math.random().toString().slice(2, 14).padEnd(12, '0');
    const extension = src.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
    const filename = `JinXSuper-GwenGallery_${randomId}.${extension}`;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(20, Math.floor(img.width * 0.025));
      ctx.font = `${fontSize}px "Geist Mono", monospace`;
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; 
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText("Gwen Gallery", img.width - 20, img.height - 20);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.9);
    } catch (err) {
      window.open(src, '_blank');
    }
  };

  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
    // Reset rotation on zoom
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-2xl overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
      onClick={onClose}
    >
      {/* Custom Cursor Hint */}
      <motion.div 
        className="fixed top-0 left-0 w-4 h-4 bg-[var(--accent)] rounded-full mix-blend-difference pointer-events-none z-[130]"
        style={{ x: cursorSmoothX, y: cursorSmoothY }}
      />

      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          layoutId={src}
          initial={{ scale: 0.9, opacity: 0, z: -100 }}
          animate={{ scale: isZoomed ? 2.2 : 1, opacity: 1, z: isZoomed ? 100 : 0 }}
          style={{ 
            rotateX: isZoomed ? 0 : rotateX, 
            rotateY: isZoomed ? 0 : rotateY,
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
          transition={{ 
            layout: { type: 'spring', damping: 25, stiffness: 150 },
            opacity: { duration: 0.2 }
          }}
          className={`relative z-[110] rounded-[28px] overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.9)] border border-white/10 ${isZoomed ? 'cursor-grab active:cursor-grabbing' : ''}`}
          drag={isZoomed}
          onClick={toggleZoom}
        >
          <img
            src={src}
            alt="3D View"
            className="max-w-[85vw] max-h-[75vh] md:max-w-4xl md:max-h-[85vh] object-contain pointer-events-none"
          />
          
          {/* Gloss Reflection Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
            style={{ 
              opacity: glossOpacity,
              x: glossX
            }}
          />
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div 
        className="absolute bottom-10 z-[120] flex gap-4 bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleDownload} className="text-white hover:text-[var(--accent)] font-mono text-[0.65rem] tracking-[0.4em] uppercase transition-all">Download</button>
        <div className="w-px h-3 bg-white/10"></div>
        <button onClick={toggleZoom} className="text-white hover:text-[var(--accent)] font-mono text-[0.65rem] tracking-[0.4em] uppercase transition-all">{isZoomed ? "Reset" : "Zoom"}</button>
        <div className="w-px h-3 bg-white/10"></div>
        <button onClick={onClose} className="text-white hover:text-red-400 font-mono text-[0.65rem] tracking-[0.4em] uppercase transition-all">Close</button>
      </motion.div>
    </motion.div>
  );
}
