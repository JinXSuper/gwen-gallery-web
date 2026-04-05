import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import Navbar from './components/Navbar'
import MasonryGrid from './components/MasonryGrid'
import Lightbox from './components/Lightbox'
import Preloader from './components/Preloader'
import AudioController from './components/AudioController'
import BrandingModal from './components/BrandingModal'

function App() {
  const [lightboxData, setLightboxData] = useState({ isOpen: false, src: null });
  const [isGalleryLoaded, setIsGalleryLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);

  const handleImageClick = useCallback((src) => {
    setLightboxData({ isOpen: true, src });
  }, []);

  const handleFullyLoaded = useCallback(() => {
    setIsGalleryLoaded(true);
  }, []);

  const handleProgress = useCallback((p) => {
    setLoadProgress(p);
  }, []);

  const handleBrandingClick = useCallback(() => {
    setIsBrandingModalOpen(true);
  }, []);

  const handleCloseBranding = useCallback(() => {
    setIsBrandingModalOpen(false);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxData({ isOpen: false, src: null });
  }, []);

  // Refresh/Exit Optimization: Collapse card back to grid before refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (lightboxData.isOpen) {
        handleCloseLightbox();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [lightboxData.isOpen, handleCloseLightbox]);

  return (
    <ReactLenis root>
      <Preloader isFullyLoaded={isGalleryLoaded} progress={loadProgress} />
      <div className="min-h-screen">
        <Navbar onBrandingClick={handleBrandingClick} />
        
        <main className={`w-full max-w-7xl mx-auto px-4 pt-24 pb-32 transition-all duration-500 ${lightboxData.isOpen ? 'pointer-events-none opacity-20 scale-[0.98] blur-sm' : ''}`}>
          <MasonryGrid 
            onImageClick={handleImageClick} 
            onFullyLoaded={handleFullyLoaded}
            onProgress={handleProgress}
          />
        </main>

        <AnimatePresence>
          {lightboxData.isOpen && (
            <Lightbox 
              key={lightboxData.src}
              isOpen={lightboxData.isOpen} 
              src={lightboxData.src} 
              onClose={handleCloseLightbox} 
            />
          )}
        </AnimatePresence>
        
        <BrandingModal 
          isOpen={isBrandingModalOpen} 
          onClose={handleCloseBranding} 
        />
        
        <AudioController />
      </div>
    </ReactLenis>
  )
}

export default App
