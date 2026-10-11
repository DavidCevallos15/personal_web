import { useCallback, useRef, type CSSProperties, type PointerEvent } from 'react';
import { img } from '@/lib/media';
import { cn } from '@/lib/utils';

interface HeroAvatarProps {
  onGlitch?: () => void;
  isGlitching?: boolean;
  className?: string;
}

const main = img('hero', 'hover_main', '900');
const mainSm = img('hero', 'hover_main', '600');
const after = img('hero', 'hover_after', '900');
const afterSm = img('hero', 'hover_after', '600');

/**
 * Avatar recortado (PNG con alfa → AVIF/WebP). Hover = "rayos X" con máscara radial
 * que sigue al puntero (variables CSS, sin re-render). Easter egg: 5 clics en 1.5 s → glitch.
 */
export function HeroAvatar({ onGlitch, isGlitching = false, className }: HeroAvatarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const clicks = useRef<number[]>([]);

  const setMask = (x: string, y: string) => {
    ref.current?.style.setProperty('--mx', x);
    ref.current?.style.setProperty('--my', y);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMask(`${e.clientX - rect.left}px`, `${e.clientY - rect.top}px`);
  };

  const onClick = useCallback(() => {
    const now = Date.now();
    clicks.current = [...clicks.current, now].filter((t) => now - t < 1500);
    if (clicks.current.length >= 5) {
      clicks.current = [];
      onGlitch?.();
    }
  }, [onGlitch]);

  const mask = 'radial-gradient(circle 190px at var(--mx) var(--my), #000 40%, transparent 80%)';

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setMask('-999px', '-999px')}
      onClick={onClick}
      className={cn('group relative select-none', isGlitching && 'glitch-active', className)}
      style={{ '--mx': '-999px', '--my': '-999px', aspectRatio: `${main.w} / ${main.h}` } as CSSProperties}
    >
      <picture>
        <source type="image/avif" srcSet={`${mainSm.avif} ${mainSm.w}w, ${main.avif} ${main.w}w`} sizes="(max-width: 768px) 80vw, 560px" />
        <img
          src={main.src}
          srcSet={`${mainSm.src} ${mainSm.w}w, ${main.src} ${main.w}w`}
          sizes="(max-width: 768px) 80vw, 560px"
          width={main.w}
          height={main.h}
          alt="David Cevallos"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 size-full object-contain object-bottom"
        />
      </picture>
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
        aria-hidden="true"
      >
        <picture>
          <source type="image/avif" srcSet={`${afterSm.avif} ${afterSm.w}w, ${after.avif} ${after.w}w`} sizes="(max-width: 768px) 80vw, 560px" />
          <img
            src={after.src}
            srcSet={`${afterSm.src} ${afterSm.w}w, ${after.src} ${after.w}w`}
            sizes="(max-width: 768px) 80vw, 560px"
            width={after.w}
            height={after.h}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="size-full object-contain object-bottom"
          />
        </picture>
      </div>
    </div>
  );
}
