#!/usr/bin/env node
/**
 * Pipeline de media: media-src/ (originales, NO se sirven) → public/media/ (optimizado).
 *
 *   npm run media           # procesa solo lo que cambió (compara mtime)
 *   npm run media -- --force
 *
 * Genera además src/data/generated/media.json con dimensiones reales
 * (width/height) para reservar espacio en el layout y evitar CLS.
 *
 * Videos: requiere ffmpeg en el PATH (Fedora: `sudo dnf install ffmpeg` desde RPM Fusion).
 */
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'media-src');
const OUT = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'src', 'data', 'generated', 'media.json');
const FORCE = process.argv.includes('--force');

const IMG_EXT = /\.(png|jpe?g|webp)$/i;

/**
 * Recorte inferior por carpeta (fracción de la altura). En el hero elimina la marca de agua
 * del generador (esquina inferior derecha) y se aplica igual a ambas capas para que el
 * efecto "rayos X" siga alineado.
 */
const TRIM_BOTTOM = { hero: 0.08 };

/** Variantes por carpeta. `h` = alto fijo (galería), `w` = ancho máximo. */
const PRESETS = {
  gallery: [
    { suffix: 'thumb', h: 560, quality: 68 },
    { suffix: 'full', h: 1600, quality: 78 },
  ],
  projects: [
    { suffix: 'card', w: 960, quality: 72 },
  ],
  hero: [
    { suffix: '900', w: 900, quality: 80, avif: true },
    { suffix: '600', w: 600, quality: 78, avif: true },
  ],
};

async function isStale(src, out) {
  if (FORCE || !existsSync(out)) return true;
  const [a, b] = await Promise.all([stat(src), stat(out)]);
  return a.mtimeMs > b.mtimeMs;
}

async function processImages(folder) {
  const dir = path.join(SRC, folder);
  if (!existsSync(dir)) return {};
  const outDir = path.join(OUT, folder);
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(dir)).filter((f) => IMG_EXT.test(f)).sort();
  const manifest = {};

  for (const file of files) {
    const name = file.replace(IMG_EXT, '');
    const src = path.join(dir, file);
    const raw = await sharp(src).metadata();
    const trim = TRIM_BOTTOM[folder] ?? 0;
    const crop = { left: 0, top: 0, width: raw.width, height: Math.round(raw.height * (1 - trim)) };
    const meta = { width: crop.width, height: crop.height };
    const load = () => (trim ? sharp(src).extract(crop) : sharp(src));
    const entry = { name, original: { w: meta.width, h: meta.height }, variants: {} };

    for (const preset of PRESETS[folder]) {
      const resize = preset.h
        ? { height: Math.min(preset.h, meta.height) }
        : { width: Math.min(preset.w, meta.width) };
      const base = path.join(outDir, `${name}-${preset.suffix}`);
      const webp = `${base}.webp`;

      if (await isStale(src, webp)) {
        await load().resize(resize).webp({ quality: preset.quality, effort: 5 }).toFile(webp);
        if (preset.avif) {
          await load().resize(resize).avif({ quality: preset.quality - 25, effort: 5 }).toFile(`${base}.avif`);
        }
      }
      const out = await sharp(webp).metadata();
      entry.variants[preset.suffix] = {
        src: `/media/${folder}/${name}-${preset.suffix}.webp`,
        ...(preset.avif ? { avif: `/media/${folder}/${name}-${preset.suffix}.avif` } : {}),
        w: out.width,
        h: out.height,
      };
    }
    manifest[name] = entry;
  }
  console.log(`✓ ${folder}: ${files.length} imágenes`);
  return manifest;
}

function hasFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Videos de fondo: sin audio, +faststart (moov al inicio → reproduce antes de bajar todo),
 * WebM VP9 + MP4 H.264 de respaldo y poster WebP del primer frame.
 */
async function processVideos() {
  const dir = path.join(SRC, 'video');
  if (!existsSync(dir)) return {};
  if (!hasFfmpeg()) {
    console.warn('⚠ ffmpeg no encontrado: se omiten videos (se usan los ya generados).');
    return null;
  }
  const outDir = path.join(OUT, 'video');
  await mkdir(outDir, { recursive: true });
  const jobs = {
    'dc-dev-loop': { width: 1280, crfWebm: 36, crfMp4: 27 },
    yo_animado_programando: { width: 960, crfWebm: 40, crfMp4: 30, out: 'coding-loop' },
  };
  const manifest = {};
  for (const file of await readdir(dir)) {
    const name = file.replace(/\.(mp4|webm|mov)$/i, '');
    const job = jobs[name];
    if (!job) continue;
    const src = path.join(dir, file);
    const outName = job.out ?? name;
    const base = path.join(outDir, outName);
    const vf = `scale=${job.width}:-2,fps=24`;
    const run = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, ...args], { stdio: 'inherit' });

    if (await isStale(src, `${base}.mp4`)) {
      run(['-an', '-vf', vf, '-c:v', 'libx264', '-crf', String(job.crfMp4), '-preset', 'slow',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${base}.mp4`]);
      run(['-an', '-vf', vf, '-c:v', 'libvpx-vp9', '-crf', String(job.crfWebm), '-b:v', '0',
        '-row-mt', '1', `${base}.webm`]);
      run(['-vf', `scale=${job.width}:-2`, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '70', `${base}-poster.webp`]);
    }
    const poster = await sharp(`${base}-poster.webp`).metadata();
    manifest[outName] = {
      webm: `/media/video/${outName}.webm`,
      mp4: `/media/video/${outName}.mp4`,
      poster: `/media/video/${outName}-poster.webp`,
      w: poster.width,
      h: poster.height,
    };
  }
  console.log(`✓ video: ${Object.keys(manifest).length} clips`);
  return manifest;
}

const previous = existsSync(MANIFEST)
  ? JSON.parse(await import('node:fs/promises').then((fs) => fs.readFile(MANIFEST, 'utf8')))
  : {};

const result = {
  gallery: await processImages('gallery'),
  projects: await processImages('projects'),
  hero: await processImages('hero'),
  video: (await processVideos()) ?? previous.video ?? {},
};

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(result, null, 2) + '\n');
console.log(`✓ manifest → ${path.relative(ROOT, MANIFEST)}`);
