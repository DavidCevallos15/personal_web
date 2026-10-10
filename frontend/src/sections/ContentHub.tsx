import { useState, type SyntheticEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionHeading } from '@/components/motion/Reveal';
import { LiteEmbed } from '@/components/ui/LiteEmbed';
import { YoutubeIcon } from '@/components/ui/Icons';
import { avatarVideos, youtube } from '@/data/content';
import { img } from '@/lib/media';
import { ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

const avatarCover = img('hero', 'hover_main', '600');
const ytEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

/** Oculta miniaturas que no cargan (sin red, video borrado) en vez de mostrar un ícono roto. */
const hideOnError = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = 'hidden';
};

/**
 * YouTube (se actualiza en cada build desde el RSS del canal) + videos con avatar IA en tabs.
 * Todos los iframes son facades: 0 KB de terceros hasta que el usuario da play.
 */
export function ContentHub() {
  const longform = youtube.videos.filter((v) => !v.isShort);
  const [featured, ...rest] = longform.length ? longform : youtube.videos;
  const latest = [...rest, ...youtube.videos.filter((v) => v.isShort && v !== featured)].slice(0, 4);
  const [tab, setTab] = useState(0);
  const avatar = avatarVideos[tab];

  return (
    <section id="content" aria-labelledby="content-heading" className="border-y border-border bg-void py-20 md:py-24">
      <div className="container-lg">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="content-heading"
            title="Desarrollo real"
            accent="en YouTube"
            description="Arquitectura, desarrollo web, DevSecOps e IA aplicada, más videos producidos con avatares IA."
          />
          <Reveal>
            <a
              href={youtube.channel.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#e5002e] px-5 py-2.5 text-sm font-semibold text-white motion-micro transition-[background-color,transform] hover:bg-[#c40027] active:scale-[0.97]"
            >
              <YoutubeIcon className="size-4" /> {youtube.channel.handle}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {featured && (
            <Reveal className="lg:col-span-7">
              <LiteEmbed
                src={ytEmbed(featured.id)}
                title={featured.title}
                className="rounded-2xl border border-border"
                cover={<img src={featured.thumb} alt="" loading="lazy" decoding="async" onError={hideOnError} className="absolute inset-0 size-full object-cover" />}
              />
              <p className="mt-3 font-semibold text-text-primary">{featured.title}</p>

              {latest.length > 0 && (
                <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {latest.map((v) => (
                    <li key={v.id}>
                      <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="group block">
                        <span className="block aspect-video overflow-hidden rounded-lg border border-border bg-surface">
                          <img src={v.thumb} alt="" loading="lazy" decoding="async" onError={hideOnError} className="size-full object-cover motion-interactive transition-transform group-hover:scale-105" />
                        </span>
                        <span className="mt-2 block text-xs leading-snug text-text-muted line-clamp-2 group-hover:text-text-primary">{v.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          )}

          <Reveal delay={0.08} className="lg:col-span-5">
            <h3 className="font-display text-2xl uppercase tracking-wide text-text-primary">Videos con avatar IA</h3>
            <div role="tablist" aria-label="Videos con avatar IA" className="mt-4 flex gap-2">
              {avatarVideos.map((v, i) => (
                <button
                  key={v.id}
                  role="tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
                  className={cn(
                    'relative cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider motion-micro transition-colors',
                    tab === i ? 'text-obsidian' : 'text-text-muted hover:text-text-primary',
                  )}
                >
                  {tab === i && (
                    <motion.span layoutId="avatar-tab" className="absolute inset-0 -z-0 rounded-full bg-accent-primary" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                  )}
                  <span className="relative">{v.label}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.22, ease: ease.interactive }}
                className="mt-4"
              >
                <LiteEmbed
                  src={avatar.embed}
                  title={avatar.title}
                  allow="encrypted-media; fullscreen; autoplay"
                  className="rounded-2xl border border-border"
                  cover={
                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_115%,rgba(var(--accent-gemini-rgb),0.4),transparent_65%)]">
                      <img src={avatarCover.src} alt="" loading="lazy" decoding="async" className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2 object-contain" />
                    </span>
                  }
                />
              </motion.div>
            </AnimatePresence>
            <p className="mt-3 text-sm text-text-muted">Producidos con HeyGen: guion, voz y avatar generados con IA.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
