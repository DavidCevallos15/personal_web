import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import type { VideoAsset } from '@/lib/media';

type Props = {
  asset: VideoAsset;
  /** true = video crítico (above the fold): autoplay inmediato y preload completo. */
  priority?: boolean;
  className?: string;
  label?: string;
};

/**
 * Video loop decorativo: muted + playsInline + poster siempre visible.
 * Solo se reproduce mientras está en viewport (IntersectionObserver) y respeta reduced-motion.
 * `preload="none"` fuera del hero: no consume red hasta acercarse al viewport.
 */
export function VideoBg({ asset, priority = false, className, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (v.preload === 'none') v.preload = 'auto';
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      className={className}
      poster={asset.poster}
      width={asset.w}
      height={asset.h}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={priority ? 'auto' : 'none'}
      autoPlay={priority && !reduce}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={asset.webm} type="video/webm" />
      <source src={asset.mp4} type="video/mp4" />
    </video>
  );
}
