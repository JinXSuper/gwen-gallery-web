import { useScrollFade } from '../hooks/useScrollFade';
import LightRays from './reactbits/LightRays';

export default function LightRaysIntro() {
  const opacity = useScrollFade(80);

  if (opacity === 0) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div 
      className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-600 ease-out"
      style={{ opacity }}
    >
      <LightRays 
        raysColor="var(--accent)"
        raysOrigin="top-center"
        raysSpeed={1.5}
        lightSpread={1.2}
      />
    </div>
  );
}
