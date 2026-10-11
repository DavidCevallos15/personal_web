import { lazy, Suspense, useCallback, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { img } from '@/lib/media';
import { useInteractionMode } from '@/lib/interaction';
import { cn } from '@/lib/utils';
import poses from '@/data/avatar-poses.json';

const HeadTracker = lazy(() => import('./motion/HeadTracker'));
const after = img('hero', 'hover_after', '900');
interface Props { onGlitch?: () => void; isGlitching?: boolean; className?: string }
export function HeroAvatar({ onGlitch, isGlitching = false, className }: Props) {
  const ref = useRef<HTMLDivElement>(null), clicks = useRef<number[]>([]);
  const { fine, reduced } = useInteractionMode();
  const [touched, setTouched] = useState(false);
  const setMask = (x: string, y: string) => { ref.current?.style.setProperty('--mx', x); ref.current?.style.setProperty('--my', y); };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMask(`${event.clientX - rect.left}px`, `${event.clientY - rect.top}px`);
  };
  const release = () => { if (ref.current) { delete ref.current.dataset.xray; ref.current.setAttribute('aria-pressed', 'false'); } };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (event.pointerType !== 'mouse') {
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      if (!reduced && (!memory || memory >= 4)) {
        event.currentTarget.dataset.touchX = String(event.clientX); event.currentTarget.dataset.touchY = String(event.clientY); setTouched(true);
      }
      return;
    }
    onMove(event); event.currentTarget.dataset.xray = ''; event.currentTarget.setAttribute('aria-pressed', 'true'); event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onClick = useCallback(() => {
    if (reduced) return;
    const now = Date.now(); clicks.current = [...clicks.current, now].filter((time) => now - time < 1500);
    if (clicks.current.length >= 5) { clicks.current = []; onGlitch?.(); }
  }, [onGlitch, reduced]);
  const mask = 'radial-gradient(circle 190px at var(--mx) var(--my), #000 40%, transparent 80%)';
  return <div ref={ref} role="button" tabIndex={0} aria-label="Explorar avatar de David: mantén pulsado para ver los rayos X" aria-pressed="false"
    onPointerMove={onMove} onPointerDown={down} onPointerUp={release} onPointerCancel={release} onPointerLeave={() => { release(); setMask('-999px', '-999px'); }} onClick={onClick}
    onKeyDown={(event) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); setMask('50%', '28%'); event.currentTarget.dataset.xray = ''; event.currentTarget.setAttribute('aria-pressed', 'true'); } }} onKeyUp={release} onBlur={release}
    className={cn('hero-avatar relative select-none', isGlitching && !reduced && 'glitch-active', className)}
    style={{ '--mx': '-999px', '--my': '-999px', aspectRatio: `${poses.cellWidth} / ${poses.cellHeight}` } as CSSProperties}>
    <picture><source type="image/avif" srcSet="/media/avatar/neutral.avif" /><img src="/media/avatar/neutral.webp" width={poses.cellWidth} height={poses.cellHeight} alt="David Cevallos" fetchPriority="high" decoding="async" draggable={false} className="absolute inset-0 size-full object-contain object-bottom" /></picture>
    {!reduced && (fine || touched) && <Suspense fallback={null}><HeadTracker host={ref} /></Suspense>}
    <div className="avatar-xray absolute inset-0 opacity-0 transition-opacity duration-200" style={{ WebkitMaskImage: mask, maskImage: mask }} aria-hidden="true">
      <img src={after.src} width={after.w} height={after.h} alt="" loading="lazy" decoding="async" draggable={false} className="size-full object-contain object-bottom" />
    </div>
  </div>;
}
