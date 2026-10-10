import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { HeroAvatar } from '@/components/HeroAvatar';
import { DottedSurface } from '@/components/ui/DottedSurface';
import { VideoBg } from '@/components/motion/VideoBg';
import { profile } from '@/data/profile';
import { video } from '@/lib/media';
import { dur, ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

const catLoop = video('dc-dev-loop');

/**
 * Hero tipo póster de cine: nombre gigante detrás, avatar al centro rompiendo el titular,
 * círculo de acento, "créditos" arriba y badge con la gata del Studio abajo a la derecha.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [glitch, setGlitch] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.35]);
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const triggerGlitch = useCallback(() => {
    setGlitch(true);
    window.setTimeout(() => setGlitch(false), 2000);
  }, []);

  const enter = (delay: number, y = 18) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: dur.reveal * 0.8, ease: ease.reveal, delay },
        };

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Presentación"
      className="relative isolate h-svh min-h-[640px] overflow-hidden bg-obsidian"
    >
      {/* Piso de puntos */}
      <DottedSurface className="top-auto bottom-0 h-[62%] opacity-80" />

      {/* Círculo de acento */}
      <motion.div
        aria-hidden="true"
        style={{ scale: circleScale }}
        className="absolute left-1/2 top-[54%] -z-0 aspect-square w-[min(78vw,50svh)] -translate-x-1/2 -translate-y-1/2 md:top-1/2"
      >
        <motion.div
          className="size-full rounded-full bg-accent-primary"
          initial={reduce ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: ease.disclosure, delay: 0.15 }}
        />
      </motion.div>

      {/* Fila superior: tags + ubicación */}
      <motion.div style={{ opacity: fade }} className="container-lg absolute inset-x-0 top-[84px] z-30 flex items-center justify-between gap-4">
        <motion.div {...enter(0.2, -8)} className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider',
              glitch ? 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'border-border text-text-muted',
            )}
          >
            <span className={cn('size-1.5 animate-pulse rounded-full', glitch ? 'bg-red-500' : 'bg-accent-green')} aria-hidden="true" />
            {glitch ? 'AI_OVERRIDE: DETECTED' : 'Disponible para proyectos'}
          </span>
          {profile.chips.map((chip) => (
            <span key={chip} className="hidden rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-text-muted md:inline-flex">
              {chip}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* "Créditos" */}
      <motion.ul
        style={{ opacity: fade }}
        className="container-lg absolute inset-x-0 top-[19%] z-10 flex justify-between font-display text-[clamp(0.95rem,1.9vw,1.9rem)] uppercase tracking-wide text-poster md:top-[21%]"
      >
        {profile.credits.map((credit, i) => (
          <motion.li key={credit} {...enter(0.35 + i * 0.06)} className={cn(i === 1 || i === 2 ? 'hidden md:block' : '')}>
            {credit}
          </motion.li>
        ))}
      </motion.ul>

      {/* Nombre gigante */}
      <motion.h1
        style={{ y: nameY }}
        className="absolute inset-x-0 top-[27%] z-10 select-none text-center font-display uppercase leading-[0.82] tracking-[-0.01em] text-poster md:top-[28%]"
      >
        <span className="sr-only">
          {profile.name}, {profile.role}
        </span>
        <span aria-hidden="true" className="inline-flex overflow-hidden text-[clamp(4.6rem,21vw,26rem)] md:text-[clamp(6rem,19.5vw,26rem)]">
          {profile.displayName.split('').map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={reduce ? false : { y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, ease: ease.disclosure, delay: 0.25 + i * 0.05 }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </motion.h1>

      {/* Etiqueta vertical */}
      <motion.p
        {...enter(0.9)}
        aria-hidden="true"
        className="absolute right-[1.2vw] top-[43%] z-10 hidden origin-center rotate-90 font-display text-[clamp(1rem,1.8vw,2rem)] tracking-widest text-poster lg:block"
      >
        [DC.dev]
      </motion.p>

      {/* Tira de perforaciones */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[74%] z-10 h-3 overflow-hidden opacity-50 md:top-[72%]">
        <div className="film-strip h-full w-[200%] animate-strip motion-reduce:animate-none" />
      </div>

      {/* Avatar central */}
      <motion.div
        style={{ y: avatarY }}
        className="absolute bottom-0 left-1/2 z-20 h-[68%] -translate-x-1/2 md:h-[84%]"
        initial={reduce ? false : { opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: ease.reveal, delay: 0.45 }}
      >
        <HeroAvatar
          onGlitch={triggerGlitch}
          isGlitching={glitch}
          className="h-full [mask-image:linear-gradient(to_bottom,#000_86%,transparent_99%)]"
        />
      </motion.div>

      {/* Historia (abajo izquierda) */}
      <motion.div style={{ opacity: fade }} className="container-lg absolute inset-x-0 bottom-6 z-30 flex items-end justify-between gap-6 md:bottom-10">
        <motion.div {...enter(0.8)} className="hidden max-w-[300px] md:block">
          <p className="mb-2 font-display text-lg uppercase tracking-wide text-text-primary">{profile.role}</p>
          <p className="text-sm leading-relaxed text-text-muted text-pretty">{profile.bio}</p>
        </motion.div>

        {/* CTA + badge con la gata */}
        <motion.div {...enter(0.9)} className="ml-auto flex items-center gap-3 md:gap-4">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-text-primary/70 bg-obsidian/60 px-5 py-2.5 font-display text-lg uppercase tracking-wide text-text-primary backdrop-blur motion-interactive transition-colors hover:border-accent-primary hover:bg-accent-primary hover:text-obsidian active:scale-[0.97] md:px-6 md:text-xl"
          >
            Trabajemos
            <ArrowUpRight className="size-5 motion-interactive transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <StudioBadge />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Badge circular: texto girando + la gata de DC.dev moviendo la cola. Lleva a #studio. */
function StudioBadge() {
  return (
    <a href="#studio" aria-label="Conoce DC.dev Studio" className="group relative block size-[92px] shrink-0 md:size-[118px]">
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-spin-slow motion-reduce:animate-none" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M60,60 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text className="fill-text-primary font-mono text-[9.5px] uppercase tracking-[0.18em]">
          <textPath href="#badge-circle">DC.dev Studio · supervisión felina · </textPath>
        </text>
      </svg>
      <span className="absolute inset-[18%] overflow-hidden rounded-full border border-accent-primary/60 bg-void motion-interactive transition-transform group-hover:scale-105">
        <VideoBg asset={catLoop} className="size-full origin-[22%_52%] scale-[1.9] object-cover object-[24%_50%]" />
      </span>
    </a>
  );
}
