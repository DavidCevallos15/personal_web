import { useState } from 'react';
import { Play } from 'lucide-react';

export function LiteVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [active, setActive] = useState(false);
  return <div className="relative aspect-video overflow-hidden rounded-2xl bg-void">
    {active ? <video key={src} src={src} poster={poster} controls autoPlay playsInline preload="metadata" aria-label={title} className="size-full object-contain" /> :
      <button data-cursor="Play" type="button" aria-label={`Reproducir: ${title}`} onClick={() => setActive(true)} className="group absolute inset-0 flex size-full items-center justify-center">
        <img src={poster} alt="" loading="lazy" width="1280" height="720" className="absolute inset-0 size-full object-cover" />
        <span className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <span className="relative flex size-14 items-center justify-center rounded-full bg-accent-primary text-obsidian motion-interactive transition-transform group-hover:scale-110"><Play className="ml-0.5 size-6 fill-current" aria-hidden="true" /></span>
      </button>}
  </div>;
}
