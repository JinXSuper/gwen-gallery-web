import { useRef, memo } from 'react';
import { motion } from 'framer-motion';
import BorderGlow from './reactbits/BorderGlow';

const ImageCard = memo(({ src, onClick, onLoad }) => {
  const cardRef = useRef(null);
  // Variants for Staggered Entrance
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      layoutId={src}
      variants={cardVariants}
      className="w-full break-inside-avoid inline-block cursor-pointer rounded-[28px] relative z-20 mb-[10px] bg-white/5 overflow-hidden" 
      style={{ 
        willChange: 'transform, opacity',
        aspectRatio: 'auto'
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => onClick(src)}
    >
      <BorderGlow 
        glowColor="var(--accent-glow)" 
        backgroundColor="var(--bg-surface)" 
        className="w-full h-full"
      >
        <img 
          src={src} 
          alt="Gallery Image" 
          decoding="async" 
          loading="lazy"   
          onLoad={(e) => {
            e.target.decode()
              .then(() => onLoad?.())
              .catch(() => onLoad?.());
          }}
          onError={() => {
            console.warn("Failed to decode image:", src);
            onLoad?.(); // Trigger onLoad as a fallback to continue the progress bar
          }}
          className="w-full h-auto object-contain md:object-cover pointer-events-none rounded-[28px] block min-h-[100px]" 
        />
      </BorderGlow>
    </motion.div>
  );
});

export default ImageCard;
