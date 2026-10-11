import { useEffect } from 'react';
import { useInteractionMode } from '@/lib/interaction';

export function ReactiveName() {
  const { fine, reduced } = useInteractionMode();
  useEffect(() => {
    if (!fine || reduced) return;
    const hero = document.querySelector<HTMLElement>('#hero');
    const letters = [...(hero?.querySelectorAll<HTMLElement>('.hero-letter') ?? [])];
    if (!hero || !letters.length) return;
    let rects: DOMRect[] = [];
    const measure = () => { rects = letters.map((letter) => letter.getBoundingClientRect()); };
    const reset = () => letters.forEach((letter) => { letter.style.setProperty('--near', '0'); });
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      letters.forEach((letter, index) => {
        const rect = rects[index]; if (!rect) return;
        const distance = Math.hypot(event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2);
        letter.style.setProperty('--near', distance < 160 ? '1' : '0');
      });
    };
    const resize = new ResizeObserver(measure); resize.observe(hero);
    measure(); hero.addEventListener('pointermove', move, { passive: true }); hero.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', measure, { passive: true });
    const timer = window.setTimeout(measure, 1400);
    return () => { resize.disconnect(); clearTimeout(timer); reset(); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', reset); window.removeEventListener('scroll', measure); };
  }, [fine, reduced]);
  return null;
}
