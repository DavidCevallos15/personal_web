import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { categoryLabels, projects, type Project, type ProjectCategory } from '@/data/projects';
import { img } from '@/lib/media';
import { ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

const INITIAL_VISIBLE = 6;
type Filter = ProjectCategory | 'all';
const filters = Object.keys(categoryLabels) as Filter[];

/** Bento compacto: 2 destacados grandes + cards chicas, filtro por categoría y "ver más". */
export function Projects() {
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );
  const visible = expanded || filter !== 'all' ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hidden = filtered.length - visible.length;

  return (
    <div className="container-lg pb-16">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <p className="max-w-xl text-base leading-relaxed text-text-muted text-pretty">
          Sistemas en producción, productos propios y herramientas de seguridad. Cada uno con el problema real que resuelve.
        </p>
        <div role="tablist" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider motion-micro transition-colors',
                filter === f
                  ? 'border-accent-primary bg-accent-primary text-obsidian'
                  : 'border-border text-text-muted hover:border-accent-primary/50 hover:text-text-primary',
              )}
            >
              {categoryLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout={!reduce} className="grid grid-cols-1 gap-5 md:grid-cols-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => {
            const big = filter === 'all' && i < 2;
            return (
              <motion.li
                key={project.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, ease: ease.reveal, delay: (i % 3) * 0.05 }}
                className={cn(big ? 'md:col-span-3' : 'md:col-span-2')}
              >
                <ProjectCard project={project} big={big} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {filter === 'all' && filtered.length > INITIAL_VISIBLE && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-text-muted motion-interactive transition-colors hover:border-accent-primary hover:text-text-primary"
          >
            {expanded ? 'Ver menos' : `Ver ${hidden} proyectos más`}
            <ChevronDown className={cn('size-4 motion-interactive transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, big }: { project: Project; big: boolean }) {
  const shot = project.image ? img('projects', project.image, 'card') : null;
  const isIcon = project.image?.endsWith('-icon');
  const primaryUrl = project.demoUrl;

  return (
    <article data-cursor="Ver" className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 motion-interactive transition-[border-color,transform] hover:-translate-y-1 hover:border-accent-primary/50">
      <div className={cn('relative overflow-hidden bg-void', big ? 'aspect-[16/8]' : 'aspect-[16/7]')}>
        {shot && !isIcon ? (
          <img
            src={shot.src}
            width={shot.w}
            height={shot.h}
            alt={`Captura de ${project.title}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-700 ease-[var(--ease-disclosure)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-gemini-rgb),0.25),transparent_60%),linear-gradient(135deg,var(--color-void),var(--color-surface))]">
            {shot ? (
              <img src={shot.src} width={shot.w} height={shot.h} alt="" loading="lazy" className="size-24 drop-shadow-2xl" />
            ) : (
              <span className="font-display text-6xl uppercase text-text-primary/15">{project.title.slice(0, 2)}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 flex flex-wrap items-center gap-x-3 font-mono text-[11px] uppercase tracking-wider text-text-subtle">
          <span className="text-accent-electric">{project.context}</span>
          {project.status && <span className={project.status === 'en producción' ? 'text-accent-green' : ''}>{project.status}</span>}
        </p>
        <h3 className={cn('font-semibold leading-tight text-text-primary', big ? 'text-xl' : 'text-lg')}>
          {primaryUrl ? (
            <a href={primaryUrl} target="_blank" rel="noreferrer" className="after:absolute after:inset-0 group-hover:text-accent-primary">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className={cn('mt-2 text-sm leading-relaxed text-text-muted', !big && 'line-clamp-3')}>{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tecnologías">
          {project.tags.slice(0, big ? 6 : 4).map((tag) => (
            <li key={tag} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-muted">
              {tag}
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex gap-2 pt-4">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`Ver ${project.title} en vivo`} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-mono text-[11px] text-text-muted hover:border-accent-primary hover:text-accent-primary">
              En vivo <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
