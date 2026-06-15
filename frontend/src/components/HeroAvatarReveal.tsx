import React, { useRef, useCallback } from 'react';

interface HeroAvatarRevealProps {
  onGlitch?: () => void;
  isGlitching?: boolean;
}

export function HeroAvatarReveal({ onGlitch, isGlitching = false }: HeroAvatarRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Click tracking for 5-click glitch easter egg
  const clickTimesRef = useRef<number[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    containerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--mouse-x', '-1000px');
    containerRef.current.style.setProperty('--mouse-y', '-1000px');
  };

  // Easter egg: 5 rapid clicks within 1.5s triggers glitch
  const handleClick = useCallback(() => {
    const now = Date.now();
    clickTimesRef.current = [...clickTimesRef.current, now].filter(
      (t) => now - t < 1500
    );
    if (clickTimesRef.current.length >= 5) {
      clickTimesRef.current = [];
      onGlitch?.();
    }
  }, [onGlitch]);

  return (
    <div className="relative w-full h-full">
      {/* Glitch overlay — only renders when glitch is active */}
      {isGlitching && (
        <div
          className="absolute inset-0 z-40 pointer-events-none rounded-full"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(255,0,80,0.06) 0px, rgba(255,0,80,0.06) 1px, transparent 1px, transparent 4px)',
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />
      )}

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`relative w-full h-[600px] overflow-hidden group cursor-pointer select-none ${
          isGlitching ? 'glitch-active' : ''
        }`}
        style={{
          '--mouse-x': '-1000px',
          '--mouse-y': '-1000px',
        } as React.CSSProperties}
        aria-label="Avatar interactivo — haz hover para revelar"
      >
        {/* Base layer */}
        <img
          src="/hero-image-hover/hover_main.png"
          alt="David Cevallos — Avatar"
          className="absolute inset-0 w-full h-full object-contain object-bottom z-0"
          draggable={false}
        />

        {/* Revealed layer — X-Ray spotlight on hover */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            WebkitMaskImage:
              'radial-gradient(circle 250px at var(--mouse-x) var(--mouse-y), black 40%, transparent 80%)',
            maskImage:
              'radial-gradient(circle 250px at var(--mouse-x) var(--mouse-y), black 40%, transparent 80%)',
          }}
        >
          <img
            src="/hero-image-hover/hover_after.png"
            alt="David Cevallos — AI X-Ray Avatar"
            className="w-full h-full object-contain object-bottom"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
