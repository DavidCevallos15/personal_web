import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  wrap,
} from 'motion/react';
import { X } from 'lucide-react';
import { SectionHeading } from '@/components/motion/Reveal';
import { galleryItems } from '@/lib/media';

const SPEED = 0.05; // px por ms
const ROW_HEIGHT = 340;

/**
 * Marquee arrastrable de arte IA (misma animación de antes, sin el costo):
 * - 1 copia duplicada (2 nodos por pieza) en vez de 10, con wrap infinito.
 * - Para agregar piezas: ver docs/GALERIA.md (media-src/gallery + npm run media).
 * - Miniaturas WebP de ~25 KB con width/height reales (sin CLS), lazy + decoding async.
 * - Se detiene fuera de viewport. Clic → lightbox con la versión full.
 */
export function AIGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { margin: '200px 0px' });
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const [halfWidth, setHalfWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const drag = useRef<{ startX: number; lastX: number; moved: boolean } | null>(null);
  const dragMoved = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => setHalfWidth(track.scrollWidth / 2));
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const x = useTransform(baseX, (v) => (halfWidth ? wrap(-halfWidth, 0, v) : v));

  useAnimationFrame((_, delta) => {
    if (reduce || paused || !inView || open !== null) return;
    baseX.set(baseX.get() - SPEED * delta);
  });

  const items = [...galleryItems, ...galleryItems];

  // Arrastre manual con pointer events: suma el delta al mismo motion value del marquee.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { startX: e.clientX, lastX: e.clientX, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    baseX.set(baseX.get() + (e.clientX - d.lastX));
    d.lastX = e.clientX;
    if (!d.moved && Math.abs(e.clientX - d.startX) > 6) {
      d.moved = true;
      dragMoved.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };
  const onPointerUp = () => {
    drag.current = null;
    window.setTimeout(() => { dragMoved.current = false; }, 0);
  };

  return (
    <section ref={sectionRef} id="art" aria-labelledby="gallery-heading" className="overflow-hidden py-20 md:py-24">
      <div className="container-lg mb-10">
        <SectionHeading
          id="gallery-heading"
          title="Galería"
          accent="de arte IA"
          description={`${galleryItems.length} piezas generadas con Gemini. Arrastra para explorar, toca una para verla completa.`}
        />
      </div>

      <div
        className="cursor-grab touch-pan-y select-none active:cursor-grabbing"
        data-cursor="Arrastra"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
        onPointerLeave={() => { setPaused(false); onPointerUp(); }}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <motion.div ref={trackRef} className="flex w-max gap-4" style={{ x }}>
          {items.map((art, i) => (
            <button
              key={`${art.id}-${i}`}
              type="button"
              tabIndex={i < galleryItems.length ? 0 : -1}
              aria-hidden={i >= galleryItems.length}
              aria-label={`Ver arte IA ${i % galleryItems.length + 1}`}
              onClick={() => !dragMoved.current && setOpen(i % galleryItems.length)}
              className="shrink-0 overflow-hidden rounded-xl border border-border bg-void motion-micro transition-colors hover:border-accent-primary/50"
              style={{ height: ROW_HEIGHT, aspectRatio: `${art.thumb.w} / ${art.thumb.h}` }}
            >
              <img
                src={art.thumb.src}
                width={art.thumb.w}
                height={art.thumb.h}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="size-full object-cover"
              />
            </button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Arte IA ampliado"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(null)}
          >
            <motion.img
              key={galleryItems[open].full.src}
              src={galleryItems[open].full.src}
              width={galleryItems[open].full.w}
              height={galleryItems[open].full.h}
              alt={`Arte IA ${open + 1}`}
              className="max-h-[90svh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
            />
            <button autoFocus onClick={() => setOpen(null)} aria-label="Cerrar" className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20">
              <X className="size-5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
