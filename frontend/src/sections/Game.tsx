import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Gamepad2, Maximize2, Smartphone } from 'lucide-react';
import { Reveal, SectionHeading } from '@/components/motion/Reveal';
import { GithubIcon } from '@/components/ui/Icons';
import { game } from '@/data/game';
import { img } from '@/lib/media';
import { cn } from '@/lib/utils';

const poster = img('projects', 'cuntur', 'card');

/** Celular o tablet: puntero táctil. Se evalúa en el cliente (SSR no aplica: SPA). */
function useIsTouch() {
  const [touch, setTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const on = () => setTouch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return touch;
}

/** Banda tricolor del Ecuador (amarillo doble, azul, rojo). */
function Tricolor({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('inline-flex h-2.5 w-9 shrink-0 flex-col overflow-hidden rounded-[2px]', className)}>
      <span className="flex-[2] bg-[#ffd100]" />
      <span className="flex-1 bg-[#0072ce]" />
      <span className="flex-1 bg-[#ef3340]" />
    </span>
  );
}

/**
 * Cuntur jugable dentro del portafolio. El iframe se monta solo al tocar "Jugar aquí" (facade):
 * hasta entonces la sección pesa una imagen. En celular sugiere pantalla completa + horizontal.
 */
export function Game() {
  const touch = useIsTouch();
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  useEffect(() => {
    setCanFullscreen(typeof document !== 'undefined' && !!document.fullscreenEnabled && !!frame.current?.requestFullscreen);
  }, []);

  /** Pantalla completa + horizontal en Android; en iPhone (sin Fullscreen API) abre el juego en otra pestaña. */
  const goFullscreen = useCallback(async () => {
    const el = frame.current;
    if (!el?.requestFullscreen || !document.fullscreenEnabled) {
      window.open(game.url, '_blank', 'noopener');
      return;
    }
    setActive(true);
    try {
      await el.requestFullscreen({ navigationUI: 'hide' });
      const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
      await orientation.lock?.('landscape').catch(() => undefined);
    } catch {
      window.open(game.url, '_blank', 'noopener');
    }
  }, []);

  return (
    <section id="game" aria-labelledby="game-heading" className="relative overflow-hidden py-20 md:py-24">
      <div className="container-lg grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <SectionHeading
            id="game-heading"
            eyebrow="Videojuego propio"
            title={game.title}
            accent={game.subtitle}
            description={game.story}
          />

          <Reveal delay={0.05}>
            <p className="mt-6 flex items-center gap-3 font-semibold text-text-primary">
              <Tricolor />
              {game.tribute}
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2" aria-label="Mundos del juego">
              {game.worlds.map((w, i) => (
                <li key={w.region} className="flex items-baseline gap-3 rounded-xl border border-border px-3.5 py-2.5 sm:last:col-span-2">
                  <span className="font-mono text-[11px] text-text-subtle">0{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-text-primary">{w.dish}</span>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">{w.region} · {w.place}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              {!touch && (
                <a
                  href={game.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-obsidian motion-micro transition-transform active:scale-[0.97]"
                >
                  <Gamepad2 className="size-4" aria-hidden="true" /> Abrir en otra pestaña
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              )}
              <a
                href={game.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-text-muted motion-micro transition-colors hover:border-accent-primary hover:text-text-primary"
              >
                <GithubIcon className="size-4" /> Código y README
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          {touch && (
            <div role="note" className="mb-4 flex items-start gap-3 rounded-2xl border border-accent-primary/40 bg-accent-primary/10 p-4">
              <Smartphone className="mt-0.5 size-5 shrink-0 rotate-90 text-accent-primary" aria-hidden="true" />
              <div className="min-w-0 text-sm leading-relaxed text-text-primary">
                <p className="font-semibold">¿Estás en el celular? Este juego es para ti.</p>
                <p className="text-text-muted">Ábrelo en pantalla completa y gira el teléfono en horizontal. Toca la pantalla para aletear.</p>
                <button
                  type="button"
                  onClick={goFullscreen}
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-primary px-4 py-2 text-sm font-semibold text-obsidian active:scale-[0.97]"
                >
                  <Maximize2 className="size-4" aria-hidden="true" /> Jugar en pantalla completa
                </button>
              </div>
            </div>
          )}

          <div ref={frame} className="game-frame relative w-full overflow-hidden rounded-2xl border border-border bg-[#0d1b2a]" style={{ aspectRatio: '16 / 9' }}>
            {active ? (
              <iframe
                src={game.url}
                title="Cuntur · Ruta de los 5 Sabores (juego)"
                className="absolute inset-0 size-full border-0"
                allow="autoplay; fullscreen; screen-orientation"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                data-cursor="Jugar"
                onClick={() => setActive(true)}
                aria-label="Jugar Cuntur aquí"
                className="group absolute inset-0 flex size-full cursor-pointer items-center justify-center"
              >
                <img
                  src={poster.src}
                  width={poster.w}
                  height={poster.h}
                  alt="Cuntur, el cóndor, volando sobre una playa de la Costa ecuatoriana"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover [image-rendering:pixelated]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" aria-hidden="true" />
                <span className="relative inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-3 font-semibold text-obsidian shadow-xl motion-interactive transition-transform group-hover:scale-105">
                  <Gamepad2 className="size-5" aria-hidden="true" /> Jugar aquí
                </span>
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-text-subtle">
              {touch ? 'Toca para aletear' : 'Clic o barra espaciadora para aletear'} · 3 corazones · 10 de 15 platos
            </p>
            {active && canFullscreen && (
              <button
                type="button"
                onClick={goFullscreen}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-[11px] text-text-muted hover:border-accent-primary hover:text-accent-primary"
              >
                <Maximize2 className="size-3.5" aria-hidden="true" /> Pantalla completa
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
