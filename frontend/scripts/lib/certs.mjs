/**
 * Lógica pura (sin I/O) del pipeline de certificaciones, para poder testearla.
 */

/** Parser CSV RFC-4180 mínimo: comillas, comillas escapadas ("") y saltos CRLF. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((v) => v.trim() !== '')) rows.push(row);

  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const MONTHS = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };

/** "Oct 2024" → "2024-10" (formato del export de LinkedIn). */
export function parseLinkedInDate(value) {
  const m = /^([A-Za-z]{3})\w*\s+(\d{4})$/.exec(value?.trim() ?? '');
  if (!m) return '';
  const month = MONTHS[m[1].toLowerCase()];
  return month ? `${m[2]}-${month}` : '';
}

/** URL de diploma de Platzi → curso ("…/curso/12341-html/…" → { id: "12341", slug: "html" }). */
export function platziCourse(url) {
  const m = /\/curso\/(\d+)-([^/]+)/.exec(url ?? '');
  return m ? { id: m[1], slug: m[2] } : null;
}

export function slugify(text) {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60);
}

const SMALL_WORDS = new Set(['de', 'del', 'con', 'y', 'la', 'el', 'para', 'en']);

/**
 * Normaliza nombres de LinkedIn: quita "Curso (Gratis) de" y sufijos "(FEB-2024)";
 * los nombres en MAYÚSCULAS sostenidas pasan a Title Case ("CURSO PYTHON DEVELOPER" → "Curso Python Developer").
 */
export function cleanTitle(name) {
  let t = name.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const shouting = t.split(/\s+/).length > 2 && t === t.toUpperCase();
  t = t.replace(/^curso\s+(gratis\s+)?de\s+/i, '');
  if (shouting) {
    t = t.toLowerCase().split(' ')
      .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ');
  }
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Une el CSV de LinkedIn con los extras manuales.
 * @param {Record<string,string>[]} rows filas del CSV
 * @param {{items: object[]}} extra
 * @param {(course: {id: string, slug: string}) => string | null} findPdf resuelve un PDF local por curso de Platzi
 */
export function buildCertifications(rows, extra, findPdf) {
  const byUrl = new Map();
  const replaced = new Map(extra.items.filter((e) => e.replaces).map((e) => [e.replaces, e]));

  for (const r of rows) {
    const url = r.Url || '';
    if (!r.Name || byUrl.has(url)) continue; // dedupe: LinkedIn repite filas
    const override = replaced.get(url);
    const course = platziCourse(url);
    byUrl.set(url, {
      id: override?.id ?? (course ? `platzi-${course.id}-${course.slug}` : slugify(r.Name)),
      title: override?.title ?? cleanTitle(r.Name),
      issuer: override?.issuer ?? r.Authority,
      date: override?.date ?? parseLinkedInDate(r['Started On'] || r['Finished On']),
      credentialUrl: url || null,
      credentialId: r['License Number'] || null,
      file: override?.file ?? (course ? findPdf(course) : null),
      kind: override?.kind ?? 'course',
      source: 'linkedin',
    });
  }

  for (const e of extra.items) {
    if (e.replaces) continue;
    byUrl.set(e.id, { credentialUrl: null, credentialId: null, source: 'manual', ...e });
  }

  return [...byUrl.values()]
    .map(({ replaces: _r, ...c }) => c)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
