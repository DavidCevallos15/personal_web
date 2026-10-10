import { useMemo, useState } from 'react';
import { motion, useAnimation, useMotionValue, useReducedMotion, useTransform, type PanInfo } from 'motion/react';
import { ArrowLeft, ArrowRight, BadgeCheck, ExternalLink, FileText } from 'lucide-react';
import { certifications, type Certification } from '@/data/content';
import { cn } from '@/lib/utils';

const VISIBLE = 4;
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const formatDate = (ym: string) => {
  const [y, m] = ym.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
};

/**
 * Deck 3D arrastrable (se conserva la animación original), ahora con la imagen real del
 * certificado. Datos generados desde el export de LinkedIn (scripts/sync-certs.mjs).
 */
export function Certificates() {
  const [order, setOrder] = useState(() => certifications.map((_, i) => i));
  const reduce = useReducedMotion();

  const issuers = useMemo(() => {
    const counts = new Map<string, number>();
    certifications.forEach((c) => counts.set(c.issuer, (counts.get(c.issuer) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const next = () => setOrder((prev) => [...prev.slice(1), prev[0]]);
  const prev = () => setOrder((p) => [p[p.length - 1], ...p.slice(0, -1)]);
  const current = certifications[order[0]];
  const deck = order.slice(0, VISIBLE).reverse();

  return (
    <div className="container-lg py-10">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <p className="text-base leading-relaxed text-text-muted text-pretty">
            Aprendizaje continuo, sincronizado desde mi perfil de LinkedIn. Arrastra la carta o usa las flechas.
          </p>
          <ul className="flex flex-wrap gap-2 font-mono text-xs" aria-label="Certificaciones por emisor">
            <li className="rounded-full border border-accent-electric/40 px-3 py-1.5 text-accent-electric">
              {certifications.length} certificaciones
            </li>
            {issuers.map(([issuer, n]) => (
              <li key={issuer} className="rounded-full border border-border px-3 py-1.5 text-text-muted">
                {issuer} · {n}
              </li>
            ))}
          </ul>

          <div role="status" aria-live="polite" className="rounded-2xl border border-border bg-surface/50 p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-text-subtle">
              {current.issuer} · {formatDate(current.date)}
            </p>
            <p className="mt-1.5 text-lg font-semibold leading-snug text-text-primary">{current.title}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {current.credentialUrl && (
                <a href={current.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary px-3.5 py-1.5 text-xs font-semibold text-obsidian hover:brightness-110">
                  <BadgeCheck className="size-3.5" aria-hidden="true" /> Verificar
                </a>
              )}
              {current.file && (
                <a href={current.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-text-muted hover:border-accent-primary hover:text-text-primary">
                  <FileText className="size-3.5" aria-hidden="true" /> Ver documento
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={prev} aria-label="Certificado anterior" className="cursor-pointer rounded-full border border-border p-2.5 text-text-muted hover:border-accent-primary hover:text-text-primary">
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button onClick={next} aria-label="Siguiente certificado" className="cursor-pointer rounded-full border border-border p-2.5 text-text-muted hover:border-accent-primary hover:text-text-primary">
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative flex h-[330px] items-center justify-center sm:h-[400px] lg:col-span-7">
          <div className="relative aspect-[1.32] w-full max-w-[500px]">
            {deck.map((idx, i) => {
              const depth = deck.length - 1 - i;
              return (
                <SwipeCard
                  key={certifications[idx].id}
                  cert={certifications[idx]}
                  depth={depth}
                  onSwipe={next}
                  reduce={!!reduce}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SwipeCard({ cert, depth, onSwipe, reduce }: { cert: Certification; depth: number; onSwipe: () => void; reduce: boolean }) {
  const isTop = depth === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const opacity = useTransform(x, [-220, -150, 0, 150, 220], [0.4, 0.85, 1, 0.85, 0.4]);
  const controls = useAnimation();

  const onDragEnd = async (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 450) {
      await controls.start({ x: Math.sign(info.offset.x) * 520, opacity: 0, transition: { duration: 0.2 } });
      onSwipe();
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } });
    }
  };

  return (
    <motion.article
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      animate={isTop ? controls : { scale: 1 - depth * 0.05, y: depth * 16 }}
      initial={false}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      style={{
        x: isTop ? x : 0,
        rotate: isTop && !reduce ? rotate : 0,
        opacity: isTop ? opacity : 1 - depth * 0.18,
        zIndex: 30 - depth,
      }}
      className={cn(
        'absolute inset-0 select-none overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl',
        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none',
      )}
      aria-hidden={!isTop}
    >
      {cert.thumb ? (
        <img src={cert.thumb} alt={`Certificado: ${cert.title}`} draggable={false} loading="lazy" decoding="async" className="size-full bg-white object-contain" />
      ) : (
        <DiplomaFallback cert={cert} />
      )}
      {isTop && cert.credentialUrl && (
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noreferrer"
          onPointerDownCapture={(e) => e.stopPropagation()}
          className="absolute right-3 top-3 rounded-full bg-obsidian/80 p-2 text-text-primary backdrop-blur hover:bg-accent-primary hover:text-obsidian"
          aria-label={`Verificar ${cert.title}`}
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      )}
    </motion.article>
  );
}

/** Diploma renderizado cuando aún no hay PDF/imagen local (p. ej. cursos recién terminados). */
function DiplomaFallback({ cert }: { cert: Certification }) {
  return (
    <div className="relative flex size-full flex-col items-center justify-center bg-[#fbfaf7] p-8 text-center text-[#14161c]">
      <div className="absolute inset-3 rounded-xl border border-[#d9d2c3]" aria-hidden="true" />
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#7a7466]">{cert.issuer}</p>
      <p className="mt-4 text-xs uppercase tracking-widest text-[#7a7466]">Certifica a</p>
      <p className="font-display text-2xl uppercase tracking-wide">David Cevallos</p>
      <p className="mt-3 text-xs uppercase tracking-widest text-[#7a7466]">por aprobar</p>
      <p className="mt-1 max-w-[85%] text-lg font-bold leading-tight text-balance">{cert.title}</p>
      <p className="mt-4 font-mono text-[11px] text-[#7a7466]">{formatDate(cert.date)}</p>
      {cert.credentialId && <p className="mt-1 max-w-[80%] truncate font-mono text-[9px] text-[#a39d8f]">ID {cert.credentialId}</p>}
    </div>
  );
}
