/**
 * Puente sin estado global entre una sección (p. ej. las plantillas del Studio) y el
 * formulario de contacto: deja el mensaje escrito y lleva al usuario a #contact.
 */
export const CONTACT_PREFILL_EVENT = 'dc:contact-prefill';

export function requestContact(message: string) {
  window.dispatchEvent(new CustomEvent<string>(CONTACT_PREFILL_EVENT, { detail: message }));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('contact')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
