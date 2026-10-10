import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';
import { navLinks } from '@/data/content';
import { profile } from '@/data/profile';
import { ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Theme = 'dark' | 'light';

export function Navbar({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  return (
    <motion.header
      className={cn('fixed inset-x-0 top-0 z-50 h-16 transition-[background-color,border-color] duration-300', scrolled ? 'glass-nav' : 'border-b border-transparent')}
      initial={reduce ? false : { y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: ease.disclosure }}
    >
      <nav aria-label="Principal" className="container-lg flex h-full items-center justify-between">
        <a href="#hero" aria-label="DC.dev, inicio" className="font-mono text-lg font-bold tracking-tight">
          <span className="text-accent-primary">DC</span>
          <span className="text-accent-electric">.</span>
          <span className="text-text-primary">dev</span>
        </a>

        <div className="flex items-center gap-2 md:gap-6">
          <ul className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="text-text-muted motion-micro transition-colors hover:text-text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-3 border-l border-border pl-5 md:flex">
            <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-text-muted hover:text-text-primary"><GithubIcon className="size-[18px]" /></a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-text-muted hover:text-text-primary"><LinkedinIcon className="size-[18px]" /></a>
          </div>
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-border text-text-primary motion-micro transition-[border-color,transform] hover:border-accent-primary/60 active:scale-[0.94]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={theme}
                initial={{ y: -14, opacity: 0, rotate: -40 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 14, opacity: 0, rotate: 40 }}
                transition={{ duration: 0.22, ease: ease.interactive }}
              >
                {theme === 'dark' ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-text-primary active:scale-[0.94] md:hidden"
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            className="glass-nav absolute inset-x-0 top-16 flex flex-col gap-1 px-4 pb-5 pt-2 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: ease.disclosure }}
          >
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-display text-2xl uppercase tracking-wide text-text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
