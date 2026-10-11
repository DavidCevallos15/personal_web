import { useEffect, useRef, type RefObject } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { poseAxis } from '@/lib/avatarPose';
import poses from '@/data/avatar-poses.json';

export default function HeadTracker({ host }: { host: RefObject<HTMLDivElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tx = useMotionValue(0), ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 180, damping: 24, mass: .5 });
  const sy = useSpring(ty, { stiffness: 180, damping: 24, mass: .5 });
  useEffect(() => {
    const node = host.current, surface = canvas.current, context = surface?.getContext('2d');
    if (!node || !surface || !context) return;
    let image: HTMLImageElement | null = null, alive = true, active = true, frame = -1, column = 3, row = 1, blinking = false;
    let touchReset = 0, blinkTimer = 0, idle = 0;
    const blinkSteps: number[] = [];
    const paint = (next: number) => {
      if (!image || next === frame || !active || document.hidden) return;
      context.clearRect(0, 0, poses.cellWidth, poses.cellHeight);
      context.drawImage(image, (next % 7) * poses.cellWidth, Math.floor(next / 7) * poses.cellHeight, poses.cellWidth, poses.cellHeight, 0, 0, poses.cellWidth, poses.cellHeight);
      frame = next; surface.dataset.frame = String(next);
    };
    const draw = () => {
      if (blinking) return;
      column = poseAxis(sx.get(), column, 7); row = poseAxis(sy.get(), row, 3);
      paint(row * 7 + column);
    };
    const point = (x: number, y: number, touch = false) => {
      const rect = node.getBoundingClientRect();
      const rangeX = touch ? Math.max(80, rect.width * .45) : Math.max(180, innerWidth * .38);
      const rangeY = touch ? Math.max(120, rect.height * .3) : Math.max(180, innerHeight * .4);
      tx.set(Math.max(-1, Math.min(1, (x - rect.left - rect.width * .5) / rangeX)));
      ty.set(Math.max(-1, Math.min(1, (y - rect.top - rect.height * .25) / rangeY)));
    };
    const move = (event: PointerEvent) => { if (event.pointerType === 'mouse' && active) point(event.clientX, event.clientY); };
    const tap = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || !(event.target instanceof Element) || !event.target.closest('#hero')) return;
      point(event.clientX, event.clientY, true); clearTimeout(touchReset); touchReset = window.setTimeout(() => { tx.set(0); ty.set(0); }, 1500);
    };
    const reset = () => { tx.set(0); ty.set(0); };
    const blink = () => {
      if (!alive) return;
      if (frame === 10 && active && !document.hidden && poses.frames > 21) {
        blinking = true; paint(21);
        blinkSteps.push(window.setTimeout(() => paint(22), 45), window.setTimeout(() => paint(21), 95), window.setTimeout(() => { blinking = false; draw(); }, 140));
      }
      blinkTimer = window.setTimeout(blink, 2500 + Math.random() * 3500);
    };
    const load = () => {
      const source = new Image(); source.decoding = 'async';
      source.onload = () => {
        if (!alive) return;
        image = source; paint(10); node.dataset.trackingReady = '';
        if (node.dataset.touchX) { point(Number(node.dataset.touchX), Number(node.dataset.touchY), true); touchReset = window.setTimeout(reset, 1500); }
        blinkTimer = window.setTimeout(blink, 3000);
      };
      source.onerror = () => { if (source.src.endsWith('.avif')) source.src = poses.webp; };
      source.src = poses.avif;
    };
    const defer = () => { idle = window.requestIdleCallback ? window.requestIdleCallback(load, { timeout: 2000 }) : window.setTimeout(load, 200); };
    if (document.readyState === 'complete') defer(); else window.addEventListener('load', defer, { once: true });
    const unsubscribeX = sx.on('change', draw), unsubscribeY = sy.on('change', draw);
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) { frame = -1; draw(); } else reset(); }, { threshold: .05 });
    observer.observe(node);
    document.addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerdown', tap, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset); window.addEventListener('blur', reset);
    return () => {
      alive = false; delete node.dataset.trackingReady;
      observer.disconnect(); unsubscribeX(); unsubscribeY();
      clearTimeout(touchReset); clearTimeout(blinkTimer); blinkSteps.forEach(clearTimeout);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle); else clearTimeout(idle);
      window.removeEventListener('load', defer); document.removeEventListener('pointermove', move); document.removeEventListener('pointerdown', tap);
      document.documentElement.removeEventListener('pointerleave', reset); window.removeEventListener('blur', reset);
    };
  }, [host, tx, ty, sx, sy]);
  return <canvas ref={canvas} data-testid="head-tracker" aria-hidden="true" width={poses.cellWidth} height={poses.cellHeight} className="absolute inset-0 size-full object-contain object-bottom" />;
}
