/**
 * Analítica y consentimiento. El contenedor GTM (GTM-TP42PVRG) y el consentimiento por defecto
 * se inicializan en index.html; aquí solo se emiten eventos y se guarda la elección del usuario.
 * Vercel Web Analytics no usa cookies y no depende de este consentimiento.
 */
export type ConsentChoice = 'granted' | 'denied';

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export const CONSENT_STORAGE_KEY = 'cookie-consent';
export const COOKIE_PREFERENCES_EVENT = 'dc:cookie-preferences';

/** Eventos de GA4 propios (el resto — descargas, clics salientes, scroll — los mide la medición mejorada). */
export type AnalyticsEvent = 'generate_lead' | 'contact_email_click';

export function track(event: AnalyticsEvent, params: Record<string, string | number> = {}) {
  window.gtag?.('event', event, params);
}

export function readConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* storage bloqueado: la elección vale solo para esta visita */
  }
  window.gtag?.('consent', 'update', { analytics_storage: choice });
}

/** Reabre el aviso desde el footer para cambiar la elección. */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT));
}
