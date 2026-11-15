// Comentarios de David Launcher TV: Firestore (proyecto davidcevallos-web) vía REST, sin SDK.
// Las reglas (firebase/firestore.rules) validan todo en el servidor; aquí solo hay UX.
(() => {
  const PROJECT = 'davidcevallos-web';
  const COLLECTION = 'launcher_feedback';
  const DB = `projects/${PROJECT}/databases/(default)/documents`;
  const API = `https://firestore.googleapis.com/v1/${DB}`;
  const COOLDOWN_MS = 60_000;
  const WORKS = {
    si: { label: 'Funcionó', cls: 'ok' },
    problemas: { label: 'Con problemas', cls: 'warn' },
    no: { label: 'No funcionó', cls: 'no' },
  };

  const root = document.getElementById('comentarios');
  if (!root) return;
  const form = root.querySelector('form');
  const list = root.querySelector('.fb-list');
  const count = root.querySelector('.fb-count');
  const status = root.querySelector('.fb-status');
  const textarea = form.querySelector('textarea');
  const chars = root.querySelector('.fb-chars');
  const submit = form.querySelector('button[type=submit]');

  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  function ago(date) {
    const s = (date.getTime() - Date.now()) / 1000;
    const steps = [[60, 'second'], [60, 'minute'], [24, 'hour'], [7, 'day'], [4.35, 'week'], [12, 'month'], [Infinity, 'year']];
    let v = s;
    for (const [n, unit] of steps) {
      if (Math.abs(v) < n) return rtf.format(Math.round(v), unit);
      v /= n;
    }
    return '';
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text; // textContent: nunca HTML del usuario
    return n;
  }

  function render(items) {
    list.replaceChildren();
    count.textContent = items.length ? `(${items.length})` : '';
    if (!items.length) {
      list.append(el('li', 'fb-empty', 'Aún no hay comentarios. Sé el primero en contar en qué TV lo probaste.'));
      return;
    }
    for (const c of items) {
      const li = el('li', 'fb-item');
      const head = el('div', 'fb-head');
      head.append(el('b', null, c.name || 'Anónimo'));
      if (c.tv) head.append(el('span', 'fb-tv', c.tv));
      const w = WORKS[c.works];
      if (w) head.append(el('span', `fb-badge ${w.cls}`, w.label));
      const time = el('time', 'fb-time', c.createdAt ? ago(c.createdAt) : 'ahora');
      if (c.createdAt) {
        time.dateTime = c.createdAt.toISOString();
        time.title = c.createdAt.toLocaleString('es');
      }
      head.append(time);
      li.append(head, el('p', 'fb-msg', c.message));
      list.append(li);
    }
  }

  const str = (f) => (f && f.stringValue) || '';
  let items = [];

  async function load() {
    try {
      const res = await fetch(`${API}:runQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: COLLECTION }],
            where: { fieldFilter: { field: { fieldPath: 'hidden' }, op: 'EQUAL', value: { booleanValue: false } } },
            orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'DESCENDING' }],
            limit: 100,
          },
        }),
      });
      if (!res.ok) throw new Error(res.status);
      const rows = await res.json();
      items = rows.filter((r) => r.document).map(({ document: { fields: f } }) => ({
        name: str(f.name), tv: str(f.tv), works: str(f.works), message: str(f.message),
        createdAt: f.createdAt ? new Date(f.createdAt.timestampValue) : null,
      }));
      render(items);
    } catch {
      list.replaceChildren(el('li', 'fb-empty', 'No se pudieron cargar los comentarios. Recarga la página en un momento.'));
    }
  }

  function say(msg, kind) {
    status.textContent = msg;
    status.dataset.kind = kind || '';
  }

  textarea.addEventListener('input', () => { chars.textContent = `${textarea.value.length}/600`; });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get('website')) return; // honeypot: los bots lo llenan
    const name = String(data.get('name') || '').trim().slice(0, 40);
    const tv = String(data.get('tv') || '').trim().slice(0, 60);
    const works = String(data.get('works') || '');
    const message = String(data.get('message') || '').trim();

    if (!WORKS[works]) return say('Cuéntame si te funcionó: elige una opción.', 'error');
    if (message.length < 3) return say('Escribe un comentario (mínimo 3 caracteres).', 'error');

    let last = 0;
    try { last = Number(localStorage.getItem('fb-last') || 0); } catch { /* sin storage */ }
    if (Date.now() - last < COOLDOWN_MS) return say('Espera un minuto antes de enviar otro comentario.', 'error');

    const fields = { works: { stringValue: works }, message: { stringValue: message }, hidden: { booleanValue: false } };
    if (name) fields.name = { stringValue: name };
    if (tv) fields.tv = { stringValue: tv };
    const id = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()).replace(/-/g, '');

    submit.disabled = true;
    say('Enviando…');
    try {
      const res = await fetch(`${API}:commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          writes: [{
            update: { name: `${DB}/${COLLECTION}/${id}`, fields },
            updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }],
            currentDocument: { exists: false },
          }],
        }),
      });
      if (!res.ok) throw new Error(res.status);
      try { localStorage.setItem('fb-last', String(Date.now())); } catch { /* sin storage */ }
      items = [{ name, tv, works, message, createdAt: new Date() }, ...items];
      render(items);
      form.reset();
      chars.textContent = '0/600';
      say('¡Gracias! Tu comentario ya está publicado.', 'ok');
    } catch {
      say('No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.', 'error');
    } finally {
      submit.disabled = false;
    }
  });

  load();
})();
