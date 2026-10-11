import { lazy, Suspense, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, ArrowUpRight, Check, Download, Loader2, Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon, YoutubeIcon } from '@/components/ui/Icons';
import { profile } from '@/data/profile';
import { useInteractionMode } from '@/lib/interaction';
import { submitContact, type ContactPayload } from '@/lib/contact';
import { cn } from '@/lib/utils';

const FooterTrail = lazy(() => import('@/components/motion/FooterTrail'));
type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-border bg-obsidian/70 px-4 py-3 text-sm text-text-primary placeholder:text-text-subtle motion-micro transition-[border-color,box-shadow] focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30';

/** Contacto real y firma DC.dev: oro, proyectos reales y supervisión felina. */
export function Contact() {
  const { fine, reduced } = useInteractionMode();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('botcheck')) return; // honeypot
    setStatus('loading');
    setError('');
    const payload: ContactPayload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };
    const result = await submitContact(payload);
    if (result.ok) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
      setError(result.error);
    }
  };

  return (
    <div className="contact-footer relative isolate overflow-hidden" data-cursor-zone="paw">

      <section id="contact" aria-labelledby="contact-heading" className="container-lg grid gap-12 py-20 md:grid-cols-2 md:py-24">
        <div>
          <div className="mb-7 flex items-center gap-4"><img src="/media/avatar/neutral.webp" alt="" width="80" height="107" loading="lazy" className="size-20 rounded-xl bg-[#0b0f19]/10 object-cover object-top" /><span className="text-sm font-medium">David Cevallos<br />Desarrollador Full-Stack</span></div>
          <h2 id="contact-heading" className="font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Trabajemos
            <span className="block">juntos</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-pretty">
            Webs para negocios, sistemas a medida y mantenimiento. Cuéntame qué necesitas y te respondo por correo.
          </p>
          <ul className="mt-8 space-y-4 font-mono text-sm">
            <li className="flex items-center gap-3">
              <Mail className="size-4" aria-hidden="true" />
              <a href={`mailto:${profile.email}`} className="footer-link break-all">{profile.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4" aria-hidden="true" />
              {profile.location} ({profile.timezone})
            </li>
          </ul>
          <a href="/cv-david-cevallos.pdf" download className="mt-7 inline-flex items-center gap-2 rounded-full border border-current px-5 py-2.5 text-sm font-semibold motion-interactive transition-colors hover:bg-[#0b0f19] hover:text-[#f4f6fc]"><Download className="size-4" aria-hidden="true" />Descargar CV</a>
          <blockquote className="mt-8 max-w-sm text-sm italic leading-relaxed">
            “No se trata de tener la mejor idea, sino de ejecutar mejor que los demás y no rendirse en el proceso.”
          </blockquote>
        </div>

        <form onSubmit={onSubmit} noValidate={false} aria-label="Formulario de contacto" className="contact-form space-y-5 rounded-2xl bg-surface p-6 md:p-8">
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-text-primary">Nombre</label>
            <input id="name" name="name" required minLength={2} autoComplete="name" className={inputClass} placeholder="Tu nombre" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-text-primary">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="tu@email.com" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium text-text-primary">Mensaje</label>
            <textarea id="message" name="message" required minLength={10} rows={5} className={cn(inputClass, 'resize-none')} placeholder="Qué quieres construir, plazos y presupuesto aproximado" />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-primary py-3 text-sm font-semibold text-obsidian motion-micro transition-[filter,transform] hover:brightness-110 active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                className="inline-flex items-center gap-2"
                initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
                transition={{ duration: 0.16 }}
              >
                {status === 'loading' && <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Enviando</>}
                {status === 'success' && <><Check className="size-4" aria-hidden="true" /> Mensaje enviado</>}
                {(status === 'idle' || status === 'error') && <>Enviar mensaje <ArrowUpRight className="size-4" aria-hidden="true" /></>}
              </motion.span>
            </AnimatePresence>
          </button>
          <p role="status" aria-live="polite" className={cn('min-h-5 text-sm', status === 'error' ? 'text-red-400' : 'text-accent-green')}>
            {status === 'success' && 'Gracias. Te escribo pronto a tu correo.'}
            {status === 'error' && error}
          </p>
        </form>
      </section>

      <footer className="container-lg">
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-current/20 py-5">
          <nav aria-label="Enlaces del footer" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold"><a href="#hero" className="footer-link">Inicio</a><a href="#works" className="footer-link">Proyectos</a><a href="#studio" className="footer-link">Studio</a><a href={profile.socials.youtube} target="_blank" rel="noreferrer" className="footer-link">YouTube</a></nav>
          <a href="#hero" className="footer-link inline-flex items-center gap-2 text-sm">Volver arriba<ArrowUp className="size-4" aria-hidden="true" /></a>
        </div>
        <div className="footer-wordmark relative select-none" data-testid="footer-wordmark"><motion.p aria-hidden="true" className="m-0 flex justify-between font-display uppercase leading-none" initial={false} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {'DC.DEV'.split('').map((letter, index) => <motion.span key={index} initial={reduced ? false : { opacity: .65, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: index * .035, ease: [.16, 1, .3, 1] }}>{letter}</motion.span>)}
        </motion.p>{fine && !reduced && <Suspense fallback={null}><FooterTrail /></Suspense>}</div>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-current/20 py-7 text-xs sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {profile.name}. Hecho en Ecuador.</p>
        <div className="flex items-center gap-4">
          <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="footer-link"><GithubIcon className="size-4" /></a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-link"><LinkedinIcon className="size-4" /></a>
          <a href={profile.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-link"><YoutubeIcon className="size-4" /></a>
        </div>
        </div>
      </footer>
    </div>
  );
}
