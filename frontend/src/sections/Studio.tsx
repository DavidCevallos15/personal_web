import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { VideoBg } from '@/components/motion/VideoBg';
import { Reveal, SectionHeading } from '@/components/motion/Reveal';
import { GithubIcon } from '@/components/ui/Icons';
import { studioTemplates } from '@/data/studio';
import { img, video } from '@/lib/media';
import { ease } from '@/lib/motion';

const catLoop = video('dc-dev-loop');

/**
 * DC.dev Studio: la "startup" — landings para negocios locales.
 * Video loop de la gata en el escritorio + tira horizontal de templates reales.
 */
export function Studio() {
  const reduce = useReducedMotion();

  return (
    <section id="studio" aria-labelledby="studio-heading" className="relative overflow-hidden border-y border-border bg-void py-20 md:py-24">
      <div className="container-lg grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading
            id="studio-heading"
            eyebrow="DC.dev Studio"
            title="Landings para"
            accent="negocios reales"
            description="Mi estudio: sitios rápidos y animados para negocios locales, construidos sobre plantillas propias que se adaptan a cada marca desde un solo archivo de contenido."
          />
          <Reveal delay={0.1} className="mt-8 grid grid-cols-3 gap-3 font-mono text-xs">
            {[
              [String(studioTemplates.length), 'plantillas'],
              ['React 19', '+ TypeScript'],
              ['A11y', 'reduced-motion'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-border bg-obsidian/60 p-3">
                <p className="font-display text-2xl text-accent-primary">{value}</p>
                <p className="mt-1 uppercase tracking-wider text-text-subtle">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <motion.div
          className="relative lg:col-span-7"
          initial={reduce ? false : { opacity: 0, scale: 0.96, rotateX: 8 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: ease.reveal }}
          style={{ transformPerspective: 1200 }}
        >
          <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/30">
            <VideoBg
              asset={catLoop}
              label="La gata de DC.dev frente a la ThinkPad, moviendo la cola"
              className="aspect-video w-full object-cover"
            />
          </div>
          <p className="mt-3 text-right font-mono text-[11px] uppercase tracking-widest text-text-subtle">
            La gerente de DC.dev en horario de oficina
          </p>
        </motion.div>
      </div>

      {/* Tira de templates: scroll horizontal nativo con snap (arrastrable en touch) */}
      <div className="mt-14">
        <div className="container-lg mb-5 flex items-end justify-between gap-4">
          <h3 className="font-display text-2xl uppercase tracking-wide text-text-primary md:text-3xl">Plantillas del estudio</h3>
        </div>
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1rem,calc((100vw-1400px)/2+2.5rem))] pb-4">
          {studioTemplates.map((t, i) => {
            const shot = img('projects', t.image, 'card');
            return (
              <motion.li
                key={t.id}
                className="group w-[78vw] shrink-0 snap-start sm:w-[420px]"
                initial={reduce ? false : { opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: ease.reveal, delay: i * 0.06 }}
              >
                <a href={t.repoUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-border bg-obsidian motion-interactive transition-colors hover:border-accent-primary/60">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={shot.src}
                      width={shot.w}
                      height={shot.h}
                      alt={`Captura de la plantilla ${t.name} (${t.niche})`}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover object-top transition-transform duration-700 ease-[var(--ease-disclosure)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {t.name} <span className="font-normal text-text-subtle">/ {t.niche}</span>
                      </p>
                      <p className="mt-1 text-sm leading-snug text-text-muted">{t.highlight}</p>
                      <p className="mt-2 font-mono text-[11px] text-text-subtle">{t.stack}</p>
                    </div>
                    <span className="mt-0.5 flex shrink-0 items-center gap-1 text-text-muted group-hover:text-accent-primary">
                      <GithubIcon className="size-4" />
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
