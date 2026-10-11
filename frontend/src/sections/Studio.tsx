import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { VideoBg } from '@/components/motion/VideoBg';
import { SectionHeading } from '@/components/motion/Reveal';
import { studioTemplates, type StudioTemplate } from '@/data/studio';
import { requestContact } from '@/lib/contactPrefill';
import { img, video } from '@/lib/media';
import { ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

const catLoop = video('dc-dev-loop');
const DRAG_THRESHOLD = 6;

/**
 * DC.dev Studio: landings para negocios locales. Una sola sección:
 * la gata de DC.dev en su escritorio como fondo completo + plantillas reales encima.
 * Las plantillas no enlazan al código: "Pedir demo" deja el mensaje escrito en el contacto.
 */
export function Studio() {
  return (
    <section id="studio" aria-labelledby="studio-heading" className="relative isolate overflow-hidden border-y border-border bg-void">
      <VideoBg
        asset={catLoop}
        label="La gata de DC.dev frente a la ThinkPad, moviendo la cola"
        className="studio-video aspect-video w-full object-cover md:absolute md:inset-0 md:-z-20 md:aspect-auto md:size-full"
      />
      <div className="studio-scrim absolute inset-0 -z-10 hidden md:block" aria-hidden="true" />

      <div className="container-lg flex pt-8 md:min-h-[min(72svh,680px)] md:items-end md:pt-28">
        <SectionHeading
          id="studio-heading"
          eyebrow="DC.dev Studio"
          title="Landings para"
          accent="negocios reales"
          description="Sitios rápidos y animados para negocios locales, construidos sobre plantillas propias que se adaptan a cada marca. ¿Te interesa una? Pídeme la demo."
          className="studio-copy relative max-w-xl"
        />
      </div>

      <TemplateCarousel />

      <p className="container-lg pb-6 text-right font-mono text-[11px] uppercase tracking-widest text-text-subtle">
        La gerente de DC.dev en horario de oficina
      </p>
    </section>
  );
}

/** Carrusel con scroll nativo + snap, arrastre con mouse y flechas para quien no tiene trackpad. */
function TemplateCarousel() {
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [dragging, setDragging] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    updateEdges();
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges]);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 20;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: reduce ? 'auto' : 'smooth' });
  };

  // Arrastre solo con mouse: touch y trackpad ya desplazan de forma nativa.
  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scroller.current) return;
    delete scroller.current.dataset.dragged;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = scroller.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      setDragging(true);
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    if (!drag.current) return;
    const moved = drag.current.moved;
    drag.current = null;
    setDragging(false);
    updateEdges();
    // El click que sigue a un arrastre no debe activar "Pedir demo".
    if (moved && scroller.current) scroller.current.dataset.dragged = '';
  };
  const onClickCapture = (e: MouseEvent<HTMLUListElement>) => {
    const el = scroller.current;
    if (el && 'dragged' in el.dataset) {
      e.preventDefault();
      e.stopPropagation();
      delete el.dataset.dragged;
    }
  };

  return (
    <div className="relative mt-10 md:mt-12">
      <div className="container-lg mb-5 flex items-end justify-between gap-4">
        <h3 className="font-display text-2xl uppercase tracking-wide text-text-primary md:text-3xl">Plantillas del estudio</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-controls="studio-templates"
            aria-label="Plantilla anterior"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-obsidian/70 text-text-primary backdrop-blur motion-micro transition-[border-color,opacity,transform] hover:border-accent-primary active:scale-[0.97] disabled:cursor-default disabled:opacity-35"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-controls="studio-templates"
            aria-label="Siguiente plantilla"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-obsidian/70 text-text-primary backdrop-blur motion-micro transition-[border-color,opacity,transform] hover:border-accent-primary active:scale-[0.97] disabled:cursor-default disabled:opacity-35"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        id="studio-templates"
        ref={scroller}
        data-cursor="Arrastra"
        aria-label="Plantillas del estudio"
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className={cn(
          'no-scrollbar flex gap-5 overflow-x-auto px-[max(1rem,calc((100vw-1400px)/2+2.5rem))] scroll-px-[max(1rem,calc((100vw-1400px)/2+2.5rem))] pb-6 select-none',
          dragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory',
        )}
      >
        {studioTemplates.map((t, i) => (
          <motion.li
            key={t.id}
            className="w-[78vw] shrink-0 snap-start sm:w-[400px]"
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: ease.reveal, delay: i * 0.06 }}
          >
            <TemplateCard template={t} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function TemplateCard({ template: t }: { template: StudioTemplate }) {
  const shot = img('projects', t.image, 'card');
  const ask = () => requestContact(`Hola David, me interesa la plantilla ${t.name} (${t.niche}). ¿Me puedes mostrar la demo y contarme cómo quedaría con mi marca?`);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-obsidian/90 backdrop-blur-sm motion-interactive transition-colors hover:border-accent-primary/60">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={shot.src}
          width={shot.w}
          height={shot.h}
          alt={`Captura de la plantilla ${t.name} (${t.niche})`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="size-full object-cover object-top transition-transform duration-700 ease-[var(--ease-disclosure)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="font-semibold text-text-primary">
            {t.name} <span className="font-normal text-text-subtle">/ {t.niche}</span>
          </p>
          <p className="mt-1 text-sm leading-snug text-text-muted">{t.highlight}</p>
          <p className="mt-2 font-mono text-[11px] text-text-subtle">{t.stack}</p>
        </div>
        <button
          type="button"
          onClick={ask}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-accent-primary px-4 py-2 text-sm font-semibold text-[#0b0f19] motion-micro transition-[filter,transform] hover:brightness-110 active:scale-[0.97]"
        >
          Pedir demo <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
