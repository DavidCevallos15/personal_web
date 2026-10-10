import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, Loader2, Mail, MapPin } from 'lucide-react';
import { VideoBg } from '@/components/motion/VideoBg';
import { GithubIcon, LinkedinIcon, YoutubeIcon } from '@/components/ui/Icons';
import { profile } from '@/data/profile';
import { video } from '@/lib/media';
import { submitContact, type ContactPayload } from '@/lib/contact';
import { cn } from '@/lib/utils';

const codingLoop = video('coding-loop');
type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full rounded-xl border border-border bg-obsidian/70 px-4 py-3 text-sm text-text-primary placeholder:text-text-subtle motion-micro transition-[border-color,box-shadow] focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30';

/** Contacto real vía Web3Forms (o mailto si no hay access key) + footer con el video de fondo. */
export function Contact() {
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
    <div className="relative isolate overflow-hidden border-t border-border">
      <VideoBg asset={codingLoop} className="absolute inset-0 -z-10 size-full object-cover opacity-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" aria-hidden="true" />

      <section id="contact" aria-labelledby="contact-heading" className="container-lg grid gap-12 py-20 md:grid-cols-2 md:py-24">
        <div>
          <h2 id="contact-heading" className="font-display text-5xl uppercase leading-[0.95] text-text-primary md:text-7xl">
            Trabajemos
            <span className="block text-text-primary/35">juntos</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted text-pretty">
            Webs para negocios, sistemas a medida y mantenimiento. Cuéntame qué necesitas y te respondo por correo.
          </p>
          <ul className="mt-8 space-y-4 font-mono text-sm">
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-accent-primary" aria-hidden="true" />
              <a href={`mailto:${profile.email}`} className="text-text-muted hover:text-text-primary">{profile.email}</a>
            </li>
            <li className="flex items-center gap-3 text-text-muted">
              <MapPin className="size-4 text-accent-primary" aria-hidden="true" />
              {profile.location} ({profile.timezone})
            </li>
          </ul>
          <blockquote className="mt-10 max-w-sm border-l-2 border-accent-primary pl-4 text-sm italic leading-relaxed text-text-muted">
            “No se trata de tener la mejor idea, sino de ejecutar mejor que los demás y no rendirse en el proceso.”
          </blockquote>
        </div>

        <form onSubmit={onSubmit} noValidate={false} aria-label="Formulario de contacto" className="space-y-5 rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-md md:p-8">
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

      <footer className="container-lg flex flex-col items-center justify-between gap-4 border-t border-border py-8 font-mono text-xs text-text-subtle sm:flex-row">
        <p>© {new Date().getFullYear()} {profile.name}. Diseñado y desarrollado en Ecuador.</p>
        <div className="flex items-center gap-4">
          <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-text-primary"><GithubIcon className="size-4" /></a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-text-primary"><LinkedinIcon className="size-4" /></a>
          <a href={profile.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-text-primary"><YoutubeIcon className="size-4" /></a>
        </div>
      </footer>
    </div>
  );
}
