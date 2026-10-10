import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Superficie de puntos ondulante (antes con three.js: ~600 KB).
 * Misma proyección en perspectiva calculada a mano sobre Canvas 2D:
 * cámara en (0, 355, 1220), FOV 60°, niebla lineal 2000→10000.
 * Corre a ~30 fps, se pausa fuera de viewport / pestaña oculta y respeta reduced-motion.
 */
const SEPARATION = 150;
const AMOUNT_X = 40;
const AMOUNT_Y = 60;
const CAM_Y = 355;
const CAM_Z = 1220;
const FOG_NEAR = 2000;
const FOG_FAR = 10000;
const BUCKETS = 8;

function dotColor() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? '0,119,182' : '0,180,216';
}

export function DottedSurface({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let focal = 0;
    let color = dotColor();
    let count = 0;
    let raf = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      focal = height / 2 / Math.tan((30 * Math.PI) / 180);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const paths = Array.from({ length: BUCKETS }, () => new Path2D());
      const half = height / 2;

      for (let ix = 0; ix < AMOUNT_X; ix++) {
        const x = ix * SEPARATION - (AMOUNT_X * SEPARATION) / 2;
        const waveX = Math.sin((ix + count) * 0.3) * 50;
        for (let iy = 0; iy < AMOUNT_Y; iy++) {
          const z = iy * SEPARATION - (AMOUNT_Y * SEPARATION) / 2;
          const depth = CAM_Z - z;
          if (depth < 50) continue;
          const y = waveX + Math.sin((iy + count) * 0.5) * 50;
          const sx = width / 2 + (x * focal) / depth;
          const sy = half + ((CAM_Y - y) * focal) / depth;
          if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) continue;
          const fog = 1 - Math.min(Math.max((depth - FOG_NEAR) / (FOG_FAR - FOG_NEAR), 0), 1);
          const bucket = Math.min(BUCKETS - 1, Math.floor(fog * BUCKETS));
          const r = Math.max(0.6, (4 * half) / depth);
          paths[bucket].moveTo(sx + r, sy);
          paths[bucket].arc(sx, sy, r, 0, Math.PI * 2);
        }
      }
      paths.forEach((p, i) => {
        ctx.fillStyle = `rgba(${color},${(0.5 * (i + 1)) / BUCKETS})`;
        ctx.fill(p);
      });
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || t - last < 33) return; // ~30 fps
      last = t;
      count += 0.05;
      draw();
    };

    resize();
    draw();
    if (!reduce) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; });
    io.observe(canvas);
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);
    const mo = new MutationObserver(() => { color = dotColor(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 size-full', className)} />;
}
