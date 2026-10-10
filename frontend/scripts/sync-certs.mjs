#!/usr/bin/env node
/**
 * Sincroniza certificaciones desde el export de LinkedIn.
 *
 * Flujo para actualizar:
 *   1. LinkedIn → Configuración → Privacidad de datos → Obtener una copia de tus datos → "Certificaciones".
 *   2. Reemplaza content/linkedin/Certifications.csv con el nuevo archivo.
 *   3. (Opcional) Copia los PDFs a public/certs/ como diploma-<slug-platzi>.pdf
 *   4. npm run certs            → regenera src/data/generated/certifications.json
 *      npm run certs -- --thumbs → además genera miniaturas (requiere pdftoppm / poppler-utils)
 *
 * Corre en `prebuild`, así que en Vercel basta con hacer push del CSV nuevo.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, buildCertifications } from './lib/certs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CERTS_DIR = path.join(ROOT, 'public', 'certs');
const THUMBS_DIR = path.join(ROOT, 'public', 'media', 'certs');
const OUT = path.join(ROOT, 'src', 'data', 'generated', 'certifications.json');
const WANT_THUMBS = process.argv.includes('--thumbs');

/**
 * Por defecto el PDF se busca como diploma-<slug>.pdf. Excepciones por ID de curso:
 * string = otro nombre de archivo, null = no hay PDF local (p. ej. dos cursos con el mismo slug).
 */
const PDF_BY_COURSE_ID = {
  '12370': 'diploma-growth-ia.pdf',
  '13728': null, // ChatGPT (sep-2026): diploma-chatgpt.pdf es el curso 12319 (jun-2026)
};

const findPdf = ({ id, slug }) => {
  const name = id in PDF_BY_COURSE_ID ? PDF_BY_COURSE_ID[id] : `diploma-${slug}.pdf`;
  return name && existsSync(path.join(CERTS_DIR, name)) ? name : null;
};

const csv = await readFile(path.join(ROOT, 'content', 'linkedin', 'Certifications.csv'), 'utf8');
const extra = JSON.parse(await readFile(path.join(ROOT, 'content', 'certifications.extra.json'), 'utf8'));
const certs = buildCertifications(parseCsv(csv), extra, findPdf);

if (WANT_THUMBS) await mkdir(THUMBS_DIR, { recursive: true });

for (const cert of certs) {
  const thumb = path.join(THUMBS_DIR, `${cert.id}.webp`);
  if (WANT_THUMBS && cert.file && !existsSync(thumb)) {
    const src = path.join(CERTS_DIR, cert.file);
    try {
      const buffer = cert.file.endsWith('.pdf')
        ? execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-r', '110', '-png', src], { maxBuffer: 64 * 1024 * 1024 })
        : await readFile(src);
      const { default: sharp } = await import('sharp');
      await sharp(buffer).resize({ width: 720 }).webp({ quality: 72 }).toFile(thumb);
    } catch (err) {
      console.warn(`⚠ miniatura ${cert.id}: ${err.message.split('\n')[0]}`);
    }
  }
  cert.thumb = existsSync(thumb) ? `/media/certs/${cert.id}.webp` : null;
  cert.file = cert.file ? `/certs/${encodeURIComponent(cert.file)}` : null;
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(certs, null, 2) + '\n');
const withThumb = certs.filter((c) => c.thumb).length;
console.log(`✓ ${certs.length} certificaciones (${withThumb} con miniatura) → ${path.relative(ROOT, OUT)}`);
