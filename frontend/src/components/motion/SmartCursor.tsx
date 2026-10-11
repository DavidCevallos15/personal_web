import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react';
import { layers } from '@/lib/layers';

function Paw({ stamp = false }: { stamp?: boolean }) {
  const shapes = <><ellipse cx="10" cy="17" rx="5" ry="7" transform="rotate(-25 10 17)" /><ellipse cx="20" cy="10" rx="5" ry="7" /><ellipse cx="31" cy="11" rx="5" ry="7" /><ellipse cx="40" cy="20" rx="5" ry="7" transform="rotate(25 40 20)" /><path d="M12 32C12 27 18 20 24 20S37 28 37 34C37 41 30 40 25 37C20 41 12 41 12 32Z" /></>;
  return <svg viewBox="0 0 48 48" aria-hidden="true">{stamp ? <g fill="currentColor">{shapes}</g> : <>
    <defs><radialGradient id="cursor-paw-white" cx=".4" cy=".3" r=".8"><stop offset="0" stopColor="#fff"/><stop offset=".65" stopColor="#f1ece4"/><stop offset="1" stopColor="#cfc6b9"/></radialGradient></defs>
    <g fill="url(#cursor-paw-white)" stroke="#0b0f19" strokeWidth=".6">{shapes}</g>
    <g fill="#d98d94"><ellipse cx="10" cy="17" rx="2.5" ry="3.7"/><ellipse cx="20" cy="10" rx="2.5" ry="3.7"/><ellipse cx="31" cy="11" rx="2.5" ry="3.7"/><ellipse cx="40" cy="20" rx="2.5" ry="3.7"/><path d="M18 31C18 28 22 24 25 24S32 29 32 33C32 36 28 36 25 34C21 36 18 35 18 31Z"/></g>
  </>}</svg>;
}

export default function SmartCursor() {
  const px = useMotionValue(-100), py = useMotionValue(-100);
  const dotX = useSpring(px, { stiffness: 1500, damping: 80, mass: .2 });
  const dotY = useSpring(py, { stiffness: 1500, damping: 80, mass: .2 });
  const ringX = useSpring(px, { stiffness: 260, damping: 28, mass: .5 });
  const ringY = useSpring(py, { stiffness: 260, damping: 28, mass: .5 });
  const vx = useVelocity(ringX), vy = useVelocity(ringY);
  const stretch = useTransform(() => Math.min(1.35, 1 + Math.hypot(vx.get(), vy.get()) / 2600));
  const angle = useTransform(() => Math.atan2(vy.get(), vx.get()) * 180 / Math.PI);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState('');
  const [paw, setPaw] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [stamps, setStamps] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const html = document.documentElement;
    let native = false, keyboard = false, lastTarget: Element | null = null;
    const inspect = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return;
      lastTarget = target;
      native = !!target.closest('input, textarea, select, [contenteditable="true"], [data-cursor-native]:not(html), iframe, p:not([aria-hidden="true"]), blockquote');
      html.toggleAttribute('data-cursor-native', native);
      const interactive = target.closest('a, button, [role="tab"], label, summary, [data-cursor]');
      setHovered(!!interactive);
      setLabel(target.closest('[data-cursor]')?.getAttribute('data-cursor') ?? '');
      setPaw(!!target.closest('[data-cursor-zone="paw"]') && !native);
      setVisible(!native && !keyboard);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      px.set(event.clientX); py.set(event.clientY);
      keyboard = false;
      html.setAttribute('data-cursor-on', '');
      if (event.target !== lastTarget) inspect(event.target);
      setVisible(!native);
    };
    const over = (event: PointerEvent) => inspect(event.target);
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      setPressed(true);
      if ((event.target as Element)?.closest('[data-cursor-zone="paw"]') && !native) {
        setStamps((previous) => [...previous.slice(-7), { id: event.timeStamp, x: event.clientX, y: event.clientY }]);
      }
    };
    const up = () => setPressed(false);
    const leave = () => { setVisible(false); html.removeAttribute('data-cursor-on'); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Tab') { keyboard = true; leave(); } };
    const visibility = () => { if (document.hidden) leave(); };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointercancel', up, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('keydown', key);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', leave);
    return () => {
      html.removeAttribute('data-cursor-on'); html.removeAttribute('data-cursor-native');
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerdown', down); document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up); document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('keydown', key); document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', leave);
    };
  }, [px, py]);

  const scale = (label ? 2.2 : hovered ? 1.5 : 1) * (pressed ? .85 : 1);
  return <div data-testid="smart-cursor" aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: layers.cursor }}>
    <motion.div className="cursor-position" style={{ x: ringX, y: ringY }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: .12 }}>
      <motion.div className="cursor-ring" style={{ rotate: label || paw ? 0 : angle, scaleX: label || paw ? 1 : stretch }} animate={{ scale, opacity: paw ? 0 : 1, backgroundColor: label ? 'var(--color-accent-primary)' : 'transparent' }} transition={{ duration: .2 }} />
      <motion.span className="cursor-label" animate={{ opacity: paw ? 0 : 1 }}>{label}</motion.span>
      <motion.div className="cursor-paw" animate={{ opacity: paw ? 1 : 0, scale: pressed ? .9 : 1 }} transition={{ duration: .18 }}><Paw /></motion.div>
    </motion.div>
    <motion.div className="cursor-position" style={{ x: dotX, y: dotY }} animate={{ opacity: visible && !hovered && !paw ? 1 : 0, scale: hovered ? .5 : 1 }}><span className="cursor-dot" /></motion.div>
    {stamps.map((stamp) => <motion.div key={stamp.id} className="cursor-stamp" style={{ left: stamp.x, top: stamp.y }} initial={{ opacity: .45, scale: .85 }} animate={{ opacity: 0, scale: 1 }} transition={{ duration: .7 }} onAnimationComplete={() => setStamps((previous) => previous.filter((item) => item.id !== stamp.id))}><Paw stamp /></motion.div>)}
  </div>;
}
