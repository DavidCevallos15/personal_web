/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v2.0.0
 * @description Stacked 3D drag-and-swipe certifications section.
 */
import { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { CheckCircle, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export function Certificates() {
  const [certs, setCerts] = useState(portfolioData.certifications);

  // Swipe logic: rotates card to the bottom of the stack to allow infinite swiping
  const handleSwipeAway = () => {
    setCerts((prev) => {
      const copy = [...prev];
      const first = copy.shift();
      if (first) {
        copy.push(first);
      }
      return copy;
    });
  };

  // Only render the top 4 cards for UX and performance
  const visibleCerts = certs.slice(0, 4).reverse();

  return (
    <div className="max-w-[1400px] mx-auto w-full px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left info column */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-[var(--color-text-muted)] text-base leading-relaxed text-pretty">
            Mi trayectoria de aprendizaje continuo e hitos validados. Arrastra las tarjetas hacia la izquierda o derecha para navegar por la colección interactiva.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-mono text-[var(--color-text-subtle)]">
            <span className="px-3 py-1.5 border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-full">
              ← Arrastra para deslizar →
            </span>
            <span className="px-3 py-1.5 border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-full text-[var(--color-accent-electric)] animate-pulse">
              Total: {certs.length} certificaciones
            </span>
          </div>
        </div>

        {/* Right stacked deck area */}
        <div className="lg:col-span-7 flex justify-center items-center h-[320px] md:h-[350px] relative">
          <div className="relative w-full max-w-[460px] h-full flex items-center justify-center">
            {visibleCerts.map((cert, index) => {
              const isTop = index === visibleCerts.length - 1;
              return (
                <SwipeableCard
                  key={cert.id}
                  cert={cert}
                  index={visibleCerts.length - 1 - index}
                  isTop={isTop}
                  onSwipe={handleSwipeAway}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SwipeableCardProps {
  cert: any;
  index: number;
  isTop: boolean;
  onSwipe: () => void;
}

function SwipeableCard({ cert, index, isTop, onSwipe }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 0.8, 1, 0.8, 0.5]);
  const controls = useAnimation();

  // Offset positions for stacked 3D cards
  const cardScale = 1 - index * 0.04;
  const cardY = index * 14;
  const cardZIndex = 30 - index;

  const handleDragEnd = async (_event: any, info: any) => {
    if (!isTop) return;

    const swipeThreshold = 100;
    const velocityThreshold = 450;

    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      const direction = info.offset.x > 0 ? 1 : -1;
      await controls.start({
        x: direction * 500,
        opacity: 0,
        transition: { duration: 0.2 }
      });
      onSwipe();
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={isTop ? controls : { scale: cardScale, y: cardY, zIndex: cardZIndex }}
      style={{
        x,
        rotate,
        opacity: isTop ? opacity : 1 - index * 0.15,
        scale: isTop ? 1 : cardScale,
        y: isTop ? y : cardY,
        zIndex: cardZIndex,
      }}
      className={`absolute w-full h-[230px] md:h-[250px] bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] rounded-xl p-5 md:p-6 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing transition-shadow duration-300 select-none ${
        isTop ? 'hover:shadow-[0_10px_30px_rgba(var(--accent-gemini-rgb),0.12)] hover:border-[var(--color-accent-primary)]/40 pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-[var(--color-accent-electric)] bg-[var(--color-accent-electric)]/10 px-2 py-0.5 rounded border border-[var(--color-accent-electric)]/20">
            {cert.date}
          </span>
          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            {cert.issuer}
          </span>
        </div>
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-[var(--color-obsidian)]/40 border border-[var(--color-border)] rounded-full hover:bg-[var(--color-accent-primary)] hover:border-[var(--color-accent-primary)]/50 transition-all cursor-pointer pointer-events-auto text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              title="Ver credencial"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
      </div>

      <div className="my-2 flex-1 flex items-center">
        <h3 className="text-base md:text-lg font-bold text-[var(--color-text-primary)] leading-snug line-clamp-2">
          {cert.title}
        </h3>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--color-border)] pt-3">
        <CheckCircle className="w-3.5 h-3.5 text-[var(--color-accent-green)] shrink-0" />
        <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
          Documentación validada
        </span>
      </div>
    </motion.div>
  );
}
