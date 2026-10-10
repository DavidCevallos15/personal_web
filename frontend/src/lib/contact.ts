/**
 * Envío del formulario de contacto.
 * - Con VITE_WEB3FORMS_KEY: POST a Web3Forms (la access key es pública por diseño; solo
 *   permite enviar al correo registrado, no leer nada).
 * - Sin key: abre el cliente de correo con el mensaje prellenado (nunca finge un envío).
 */
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export type ContactResult = { ok: true; via: 'web3forms' | 'mailto' } | { ok: false; error: string };

const ENDPOINT = 'https://api.web3forms.com/submit';
const FALLBACK_EMAIL = 'jimdav1506ceva@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(p: ContactPayload): string | null {
  if (p.name.trim().length < 2) return 'Escribe tu nombre.';
  if (!EMAIL_RE.test(p.email.trim())) return 'Revisa tu email.';
  if (p.message.trim().length < 10) return 'Cuéntame un poco más (mínimo 10 caracteres).';
  return null;
}

export async function submitContact(
  payload: ContactPayload,
  {
    accessKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined,
    fetcher = fetch,
    openMailto = (url: string) => window.location.assign(url),
  } = {},
): Promise<ContactResult> {
  const invalid = validateContact(payload);
  if (invalid) return { ok: false, error: invalid };

  if (!accessKey) {
    const subject = encodeURIComponent(`Contacto desde el portafolio: ${payload.name}`);
    const body = encodeURIComponent(`${payload.message}\n\n${payload.name} <${payload.email}>`);
    openMailto(`mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`);
    return { ok: true, via: 'mailto' };
  }

  try {
    const res = await fetcher(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portafolio: mensaje de ${payload.name}`,
        from_name: 'DC.dev Portfolio',
        ...payload,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (res.ok && json.success) return { ok: true, via: 'web3forms' };
    return { ok: false, error: json.message ?? 'No se pudo enviar. Escríbeme directo al correo.' };
  } catch {
    return { ok: false, error: 'Sin conexión. Intenta de nuevo o escríbeme directo al correo.' };
  }
}
