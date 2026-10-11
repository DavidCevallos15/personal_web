import { useEffect, useRef } from 'react';
import { projects } from '@/data/projects';
import { img } from '@/lib/media';

const shots = projects.filter((project) => project.image && !project.image.endsWith('-icon')).map((project) => img('projects', project.image!, 'card'));
export default function FooterTrail() {
  const root = useRef<HTMLDivElement>(null);
  const pool = useRef<(HTMLImageElement | null)[]>([]);
  useEffect(() => {
    const wordmark = root.current?.parentElement;
    if (!wordmark || !shots.length) return;
    let last: { x: number; y: number } | null = null, index = 0;
    const clear = () => { last = null; pool.current.forEach((image) => { image?.getAnimations().forEach((animation) => animation.cancel()); if (image) image.style.opacity = '0'; }); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (last && Math.hypot(event.clientX - last.x, event.clientY - last.y) < 80) return;
      last = { x: event.clientX, y: event.clientY };
      const image = pool.current[index % 8], shot = shots[index % shots.length];
      if (!image) return;
      image.src = shot.avif ?? shot.src;
      image.getAnimations().forEach((animation) => animation.cancel());
      const rect = wordmark.getBoundingClientRect(), x = event.clientX - rect.left - 100, y = event.clientY - rect.top - 65, rotation = index % 2 ? 6 : -6;
      image.animate([
        { opacity: 0, transform: `translate3d(${x}px,${y + 12}px,0) rotate(${rotation}deg) scale(.9)` },
        { opacity: 1, transform: `translate3d(${x}px,${y}px,0) rotate(${rotation}deg) scale(1)`, offset: .15 },
        { opacity: 0, transform: `translate3d(${x}px,${y - 18}px,0) rotate(${rotation}deg) scale(1)` },
      ], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
      index++;
    };
    const leave = () => { last = null; };
    const hidden = () => { if (document.hidden) clear(); };
    wordmark.addEventListener('pointermove', move, { passive: true });
    wordmark.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', hidden);
    return () => { clear(); wordmark.removeEventListener('pointermove', move); wordmark.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', hidden); };
  }, []);
  return <div ref={root} data-testid="footer-trail" aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">{Array.from({ length: 8 }, (_, index) => <img key={index} src={shots[index % shots.length]?.avif ?? shots[index % shots.length]?.src} loading="lazy" ref={(element) => { pool.current[index] = element; }} alt="" width="200" height="130" className="absolute left-0 top-0 h-[130px] w-[200px] rounded-lg object-cover opacity-0 shadow-lg" />)}</div>;
}
