import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_STORAGE_KEY, openCookiePreferences, COOKIE_PREFERENCES_EVENT, readConsent, saveConsent, track } from './analytics';

beforeEach(() => {
  localStorage.clear();
  window.gtag = vi.fn();
});

describe('track', () => {
  it('emite el evento por gtag con sus parámetros', () => {
    track('generate_lead', { method: 'web3forms' });
    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', { method: 'web3forms' });
  });

  it('no falla si gtag no existe (bloqueador de scripts)', () => {
    delete window.gtag;
    expect(() => track('contact_email_click')).not.toThrow();
  });
});

describe('consentimiento', () => {
  it('sin elección guardada devuelve null y rechaza valores inválidos', () => {
    expect(readConsent()).toBeNull();
    localStorage.setItem(CONSENT_STORAGE_KEY, 'quizas');
    expect(readConsent()).toBeNull();
  });

  it('guarda la elección y actualiza el consentimiento de Google', () => {
    saveConsent('denied');
    expect(readConsent()).toBe('denied');
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', { analytics_storage: 'denied' });
    saveConsent('granted');
    expect(window.gtag).toHaveBeenLastCalledWith('consent', 'update', { analytics_storage: 'granted' });
  });

  it('openCookiePreferences emite el evento que reabre el aviso', () => {
    const handler = vi.fn();
    window.addEventListener(COOKIE_PREFERENCES_EVENT, handler);
    openCookiePreferences();
    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener(COOKIE_PREFERENCES_EVENT, handler);
  });
});
