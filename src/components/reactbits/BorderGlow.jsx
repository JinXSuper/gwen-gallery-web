import { useRef, useState, useCallback, useEffect } from 'react';

function buildBoxShadow(glowColor) {
  const match = glowColor.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  const base = match ? `${match[1]}deg ${match[2]}% ${match[3]}%` : '40deg 80% 80%';
  
  // Simplified for performance: 3 layers instead of 13
  return `
    0 0 10px 0 hsl(${base} / 30%),
    0 0 30px 2px hsl(${base} / 15%),
    inset 0 0 15px 0 hsl(${base} / 20%)
  `.trim().replace(/\n/g, '');
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#060010',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  fillOpacity = 0.5,
}) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    // Calculate Angle
    const dx = x - cx;
    const dy = y - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    // Calculate Proximity (Higher near edges)
    const px = Math.abs(dx) / cx;
    const py = Math.abs(dy) / cy;
    const proximity = Math.max(px, py);

    // Set Native CSS Variables (Skip React State Re-renders)
    el.style.setProperty('--mouse-angle', `${angle.toFixed(2)}deg`);
    el.style.setProperty('--proximity', proximity.toFixed(3));
  }, []);

  const boxShadow = buildBoxShadow(glowColor);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={`relative grid isolate border border-white/5 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0)',
        '--mouse-angle': '45deg',
        '--proximity': '0',
        '--visibility': isHovered ? '1' : '0'
      }}
    >
      {/* mesh gradient border */}
      <div
        className="absolute inset-0 rounded-[inherit] -z-[1] pointer-events-none transition-opacity duration-300"
        style={{
          border: '1px solid transparent',
          opacity: 'calc(var(--visibility) * (var(--proximity) - 0.2))',
          background: `
            linear-gradient(${backgroundColor}, ${backgroundColor}) padding-box,
            conic-gradient(from var(--mouse-angle) at center, transparent 0%, var(--accent-glow) ${coneSpread}%, transparent ${coneSpread * 2}%) border-box
          `,
          maskImage: `conic-gradient(from var(--mouse-angle) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from var(--mouse-angle) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
        }}
      />

      {/* outer glow */}
      <span
        className="absolute pointer-events-none z-[110] rounded-[inherit] transition-opacity duration-300"
        style={{
          inset: `${-glowRadius}px`,
          opacity: 'calc(var(--visibility) * (var(--proximity) - 0.3))',
          maskImage: `conic-gradient(from var(--mouse-angle) at center, black 0%, transparent 15%, transparent 85%, black 100%)`,
          WebkitMaskImage: `conic-gradient(from var(--mouse-angle) at center, black 0%, transparent 15%, transparent 85%, black 100%)`,
        }}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: boxShadow,
          }}
        />
      </span>

      <div className="flex flex-col relative overflow-hidden z-[1] h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
