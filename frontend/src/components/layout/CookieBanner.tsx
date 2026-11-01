import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Cookie } from 'lucide-react';
import { COOKIE_PREFERENCES_EVENT, readConsent, saveConsent, type ConsentChoice } from '@/lib/analytics';

const buttonBase =
  'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold motion-micro transition-[filter,background-color] focus-visible:outline-2 focus-visible:outline-offset-2';

/** Aviso de cookies: solo Google Analytics; sin publicidad. Se puede reabrir desde el footer. */
export function CookieBanner() {
  const [open, setOpen] = useState(() => readConsent() === null);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_PREFERENCES_EVENT, reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          aria-label="Aviso de cookies"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-3 z-[70] rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-5 sm:max-w-sm"
          style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 size-5 shrink-0 text-accent-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-text-muted">
              Uso Google Analytics para medir las visitas y mejorar la web. Si lo rechazas, no se guardan cookies de análisis. No uso cookies de publicidad.
            </p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => choose('denied')} className={`${buttonBase} border border-border text-text-primary hover:bg-border/40`}>
              Rechazar
            </button>
            <button type="button" onClick={() => choose('granted')} className={`${buttonBase} bg-accent-primary text-obsidian hover:brightness-110`}>
              Aceptar
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
