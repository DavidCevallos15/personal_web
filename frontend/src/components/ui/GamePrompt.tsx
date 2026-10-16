import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Gamepad2, X } from 'lucide-react';
import { game } from '@/data/game';
import { ease } from '@/lib/motion';

const KEY = 'cuntur-prompt-dismissed';
const DELAY_MS = 6000;

function wasDismissed() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Solo en celular/tablet: tras unos segundos sugiere jugar Cuntur. Se oculta mientras la sección
 * del juego está en pantalla y no vuelve a salir si la persona la cierra.
 */
export function GamePrompt() {
  const [show, setShow] = useState(false);
  const [gameInView, setGameInView] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches || wasDismissed()) return;
    const t = window.setTimeout(() => setShow(true), DELAY_MS);
    const section = document.getElementById('game');
    const io = section ? new IntersectionObserver(([e]) => setGameInView(e.isIntersecting), { threshold: 0.2 }) : null;
    if (section && io) io.observe(section);
    return () => {
      window.clearTimeout(t);
      io?.disconnect();
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* storage bloqueado: solo se oculta en esta visita */
    }
  };

  const goToGame = () => {
    document.getElementById('game')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    dismiss();
  };

  return (
    <AnimatePresence>
      {show && !gameInView && (
        <motion.aside
          aria-label="Sugerencia: jugar Cuntur"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: ease.disclosure }}
          className="fixed inset-x-3 z-[60] flex items-center gap-3 rounded-2xl border border-accent-primary/40 bg-surface/95 p-3 pr-2 shadow-2xl backdrop-blur-md sm:hidden"
          style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-primary text-obsidian">
            <Gamepad2 className="size-5" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-[13px] leading-snug text-text-primary">
            <span className="font-semibold">¿Un minuto libre? Juega {game.title}.</span>{' '}
            <span className="text-text-muted">Mi juego en honor a Ecuador.</span>
          </p>
          <button
            type="button"
            onClick={goToGame}
            className="shrink-0 cursor-pointer rounded-full bg-accent-primary px-3.5 py-2 text-sm font-semibold text-obsidian active:scale-[0.97]"
          >
            Jugar
          </button>
          <button type="button" onClick={dismiss} aria-label="Cerrar sugerencia" className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-text-muted hover:text-text-primary">
            <X className="size-4" aria-hidden="true" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
