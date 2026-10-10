import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Bot } from 'lucide-react';
import { literaryArchive } from '@/data/blogPost';
import { reminderQuotes } from '@/data/profile';

declare global {
  interface Window {
    destroy?: () => string;
  }
}

/**
 * Easter eggs (se conservan todos):
 *  - Escribir "LOG" → archivo literario en modo terminal.
 *  - `destroy()` en la consola → la página se desarma y recarga.
 *  - 5 clics rápidos en el avatar → glitch (ver HeroAvatar).
 *  - Konami code → firma del autor (ver lib/AuthorSignature).
 */
export function EasterEggs() {
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    let keys = '';
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable]')) return;
      keys = (keys + e.key.toUpperCase()).slice(-3);
      if (keys === 'LOG') {
        setShowLog(true);
        keys = '';
      }
      if (e.key === 'Escape') setShowLog(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    window.destroy = () => {
      document.body.classList.add('destroy-shake');
      const targets = document.querySelectorAll<HTMLElement>('main > *, header, footer');
      targets.forEach((el, i) => {
        animate(
          el,
          { y: window.innerHeight, rotate: Math.random() * 90 - 45, opacity: 0 },
          { duration: 2.5, delay: i * 0.1, ease: [0.55, 0, 1, 0.45] },
        );
      });
      window.setTimeout(() => window.location.reload(), 5000);
      return 'System override accepted. Initiating self-destruct sequence...';
    };
    console.log('%c¿Quieres probar el rendimiento del sistema? Escribe destroy() en la consola.', 'color:#34D399;font-size:14px;');
    return () => { delete window.destroy; };
  }, []);

  return (
    <AnimatePresence>
      {showLog && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1d]/90 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLog(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={literaryArchive.title}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-blue-900/50 bg-[#0a0f1d] font-mono shadow-2xl"
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
          >
            <div className="terminal-scanline" />
            <div className="flex items-center justify-between border-b border-blue-900/50 bg-[#0f172a] p-4">
              <p className="flex items-center gap-2 text-sm text-green-500">
                <Bot className="size-4" aria-hidden="true" />
                <span className="terminal-cursor">[ACCESS_GRANTED]: LOADING_PERSONAL_ARCHIVES</span>
              </p>
              <button onClick={() => setShowLog(false)} className="rounded border border-blue-900/50 px-3 py-1 text-xs text-blue-500 hover:border-cyan-400/50 hover:text-cyan-400">
                SYS.EXIT()
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6 md:p-8">
              <h2 className="mb-2 text-xl font-bold text-cyan-400">{literaryArchive.title}</h2>
              <p className="mb-6 text-xs uppercase text-blue-500/60">
                {literaryArchive.date} // CODENAME: {literaryArchive.codename}
              </p>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-blue-100/80">{literaryArchive.content}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Widget de citas (minimizable). Arranca minimizado para no tapar contenido en móvil. */
export function ReminderWidget() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setPastHero(y > window.innerHeight * 0.8));
  const quote = reminderQuotes[i];

  if (!pastHero && !open) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[60] hidden sm:block">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'bottom left' }}
            className="w-80 rounded-2xl border border-border bg-surface/95 p-5 font-mono text-xs shadow-2xl backdrop-blur-md"
          >
            <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold tracking-wider text-accent-electric">SYS_REMINDER</span>
              <button onClick={() => setOpen(false)} className="cursor-pointer text-text-muted hover:text-text-primary">[MINIMIZAR]</button>
            </div>
            <p className="min-h-[72px] text-[11px] italic leading-relaxed text-text-primary/90 text-pretty">“{quote.text}”</p>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[10px] font-semibold text-accent-primary">- {quote.author}</span>
              <button onClick={() => setI((v) => (v + 1) % reminderQuotes.length)} className="cursor-pointer text-[10px] text-accent-electric hover:text-text-primary">
                SIGUIENTE &gt;
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            onClick={() => setOpen(true)}
            className="cursor-pointer rounded-full border border-accent-electric/30 bg-surface/90 px-3.5 py-2 font-mono text-xs text-accent-electric shadow-lg backdrop-blur-md hover:border-accent-electric active:scale-[0.97]"
          >
            [ ✦ ] SYS_REMINDER
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
