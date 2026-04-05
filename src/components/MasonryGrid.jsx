import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from './ImageCard';
import SkeletonCard from './SkeletonCard';
import Pagination from './Pagination';

export default function MasonryGrid({ onImageClick, onFullyLoaded, onProgress }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPageReady, setIsPageReady] = useState(false);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Shuffle Utility (Fisher-Yates)
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // 1. Fetch images
    fetch('https://api.github.com/repos/JinXSuper/gwen-gallery/contents')
      .then(res => {
        if (!res.ok) throw new Error('Repository or images folder not found (yet).');
        return res.json();
      })
      .then(data => {
        const imageFiles = Array.isArray(data) ? data.filter(file => file.name.match(/\.(jpe?g|png|gif|webp)$/i)) : [];
        const shuffledUrls = shuffleArray(imageFiles.map(file => file.download_url));
        setImages(shuffledUrls);
        if (imageFiles.length === 0) onFullyLoaded(); 
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("GitHub fetch failed:", err.message);
        const dpr = window.devicePixelRatio || 1;
        const targetWidth = window.innerWidth < 768 ? 480 : 800;
        const optimizedWidth = Math.floor(targetWidth * Math.min(dpr, 2));

        const fallbackUrls = Array.from({ length: 48 }, (_, i) => 
          `https://picsum.photos/seed/${i + 1}/${optimizedWidth}/${Math.floor(optimizedWidth * (Math.random() > 0.5 ? 1.4 : 0.8))}`
        );
        setImages(shuffleArray(fallbackUrls));
        setIsLoading(false);
      });
  }, [onFullyLoaded]);

  // 2. Safety Timeout: If loading hangs, force reveal anyway
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isInitialLoad.current) {
        console.warn("Loading timeout reached: forcing reveal.");
        onProgress?.(100);
        onFullyLoaded();
        isInitialLoad.current = false;
        setIsPageReady(true);
      }
    }, 8000); // 8 second safety net
    return () => clearTimeout(timer);
  }, [onProgress, onFullyLoaded]);

  // Handle Page Change
  const handlePageChange = (page) => {
    setIsPageReady(false); // Lock entrance for the next page
    setLoadedCount(0);      // Reset decoding sync
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Progress Reporting (Hardware Decoding Sync for every Page)
  useEffect(() => {
    const totalImagesOnPage = Math.min(itemsPerPage, images.length - (currentPage - 1) * itemsPerPage);
    
    // Fallback for empty/skeleton states: Progress 100% immediately if no images to decode
    if (images.length === 0 && !isLoading && isInitialLoad.current) {
      onProgress?.(100);
      onFullyLoaded();
      isInitialLoad.current = false;
      setIsPageReady(true);
      return;
    }

    if (images.length > 0 && totalImagesOnPage > 0) {
      const percentage = Math.min(Math.round((loadedCount / totalImagesOnPage) * 100), 100);
      
      if (isInitialLoad.current) {
        onProgress?.(percentage);
      }

      if (loadedCount >= totalImagesOnPage) {
        // Anti-Flicker: Wait until hardware is ready, then unlock animation
        const timeout = setTimeout(() => {
          setIsPageReady(true);
          if (isInitialLoad.current) {
            onFullyLoaded();
            isInitialLoad.current = false;
          }
        }, isInitialLoad.current ? 300 : 50); // Faster reveal for subsequent pages
        return () => clearTimeout(timeout);
      }
    }
  }, [loadedCount, images.length, currentPage, isLoading, onProgress, onFullyLoaded]);

  const containerClasses = "w-full columns-2 md:columns-3 lg:columns-4 gap-[10px] py-4 mx-auto";
  const currentImages = images.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(images.length / itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.3 }
    }
  };

  if (isLoading) {
    const heights = [300, 450, 250, 350, 200, 400, 300, 250, 400, 350, 200, 300];
    return (
      <div className={containerClasses}>
        {heights.map((h, i) => (
          <SkeletonCard key={i} h={h} />
        ))}
      </div>
    );
  }

  // Handle case where no images are found but loading is finished
  if (images.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 opacity-40 uppercase tracking-widest text-[0.6rem] font-mono">
        NO_CONTENT_INDEXED
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate={isPageReady ? "show" : "hidden"}
          exit="exit"
          className={containerClasses}
        >
          {currentImages.map((src) => (
            <ImageCard 
              key={src} 
              src={src} 
              onClick={onImageClick} 
              onLoad={() => setLoadedCount(prev => prev + 1)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        previous={{ title: 'Previous page', href: '#' }}
        next={{ title: 'Next page', href: '#' }}
      />
    </div>
  );
}
