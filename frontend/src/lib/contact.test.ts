import { describe, expect, it, vi } from 'vitest';
import { submitContact, validateContact } from './contact';

const valid = { name: 'Ana Zambrano', email: 'ana@correo.ec', message: 'Necesito una landing para mi cafetería.' };

describe('validateContact', () => {
  it('rechaza nombre, email o mensaje inválidos', () => {
    expect(validateContact({ ...valid, name: 'A' })).toMatch(/nombre/);
    expect(validateContact({ ...valid, email: 'no-es-email' })).toMatch(/email/);
    expect(validateContact({ ...valid, message: 'corto' })).toMatch(/10/);
    expect(validateContact(valid)).toBeNull();
  });
});

describe('submitContact', () => {
  it('sin access key abre mailto con el mensaje (nunca finge un envío)', async () => {
    const openMailto = vi.fn();
    const res = await submitContact(valid, { accessKey: '', openMailto, fetcher: vi.fn() });
    expect(res).toEqual({ ok: true, via: 'mailto' });
    expect(openMailto.mock.calls[0][0]).toMatch(/^mailto:.*subject=.*Ana%20Zambrano/);
  });

  it('con access key hace POST a Web3Forms', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    const res = await submitContact(valid, { accessKey: 'k', fetcher });
    expect(res).toEqual({ ok: true, via: 'web3forms' });
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe('https://api.web3forms.com/submit');
    expect(JSON.parse(init.body)).toMatchObject({ access_key: 'k', email: valid.email });
  });

  it('propaga el error del servicio y maneja fallos de red', async () => {
    const fail = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, message: 'Spam' }), { status: 400 }));
    expect(await submitContact(valid, { accessKey: 'k', fetcher: fail })).toEqual({ ok: false, error: 'Spam' });
    const offline = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
    expect(await submitContact(valid, { accessKey: 'k', fetcher: offline })).toMatchObject({ ok: false });
  });

  it('no envía si la validación falla', async () => {
    const fetcher = vi.fn();
    expect(await submitContact({ ...valid, email: 'x' }, { accessKey: 'k', fetcher })).toMatchObject({ ok: false });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
