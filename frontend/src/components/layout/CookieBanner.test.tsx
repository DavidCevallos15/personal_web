import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieBanner } from './CookieBanner';
import { openCookiePreferences, readConsent } from '@/lib/analytics';

beforeEach(() => {
  localStorage.clear();
  window.gtag = vi.fn();
});

describe('<CookieBanner />', () => {
  it('aparece sin elección previa y "Aceptar" concede analítica y se cierra', async () => {
    render(<CookieBanner />);
    await userEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(readConsent()).toBe('granted');
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', { analytics_storage: 'granted' });
    await waitFor(() => expect(screen.queryByRole('region', { name: /cookies/i })).not.toBeInTheDocument());
  });

  it('"Rechazar" deniega analítica', async () => {
    render(<CookieBanner />);
    await userEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    expect(readConsent()).toBe('denied');
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', { analytics_storage: 'denied' });
  });

  it('no aparece si ya hay elección y se reabre desde el footer', async () => {
    localStorage.setItem('cookie-consent', 'denied');
    render(<CookieBanner />);
    expect(screen.queryByRole('region', { name: /cookies/i })).not.toBeInTheDocument();
    openCookiePreferences();
    expect(await screen.findByRole('region', { name: /cookies/i })).toBeInTheDocument();
  });
});
