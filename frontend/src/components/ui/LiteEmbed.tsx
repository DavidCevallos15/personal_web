import { useState, type ReactNode } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  /** URL del iframe que se monta SOLO al hacer clic (patrón facade). */
  src: string;
  title: string;
  /** Miniatura o fondo mientras no se carga el iframe. */
  cover?: ReactNode;
  aspect?: string;
  className?: string;
  allow?: string;
};

/**
 * Facade para iframes de terceros (YouTube, HeyGen): cada embed real pesa >500 KB de JS.
 * Hasta que el usuario hace clic solo se pinta una miniatura + botón.
 */
export function LiteEmbed({ src, title, cover, aspect = '16 / 9', className, allow }: Props) {
  const [active, setActive] = useState(false);

  return (
    <div className={cn('relative w-full overflow-hidden bg-void', className)} style={{ aspectRatio: aspect }}>
      {active ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 size-full border-0"
          allow={allow ?? 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen'}
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          data-cursor="Play"
          onClick={() => setActive(true)}
          className="group absolute inset-0 flex size-full cursor-pointer items-center justify-center"
          aria-label={`Reproducir: ${title}`}
        >
          {cover}
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true" />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-accent-primary text-obsidian shadow-xl motion-interactive transition-transform group-hover:scale-110">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
