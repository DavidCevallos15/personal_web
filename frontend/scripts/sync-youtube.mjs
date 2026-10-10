#!/usr/bin/env node
/**
 * Trae los últimos videos del canal desde el feed RSS público de YouTube (sin API key)
 * y los guarda en src/data/generated/youtube.json.
 *
 * Corre en `prebuild` (Vercel). Si no hay red o YouTube falla, conserva el JSON
 * anterior y NO rompe el build. Para refrescar sin commits: el workflow
 * `.github/workflows/refresh-content.yml` dispara un Deploy Hook de Vercel cada semana.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseYouTubeFeed, extractChannelId } from './lib/youtube.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'data', 'generated', 'youtube.json');
const HANDLE = process.env.YT_HANDLE ?? '@DavidCevaZam';
const MAX_VIDEOS = 9;

async function get(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { 'accept-language': 'es', 'user-agent': 'Mozilla/5.0 (portfolio build)' },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const previous = existsSync(OUT) ? JSON.parse(await readFile(OUT, 'utf8')) : null;

try {
  const channelId = process.env.YT_CHANNEL_ID
    ?? previous?.channel?.id
    ?? extractChannelId(await get(`https://www.youtube.com/${HANDLE}`));
  if (!channelId) throw new Error('no se encontró el channelId');

  const feed = parseYouTubeFeed(await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`));
  if (feed.videos.length === 0) throw new Error('feed vacío');

  const data = {
    channel: {
      id: channelId,
      handle: HANDLE,
      title: feed.title,
      url: `https://www.youtube.com/${HANDLE}`,
    },
    videos: feed.videos.slice(0, MAX_VIDEOS),
    updatedAt: new Date().toISOString(),
  };
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`✓ YouTube: ${data.videos.length} videos de ${feed.title}`);
} catch (err) {
  console.warn(`⚠ YouTube no disponible (${err.message}). Se mantiene youtube.json anterior.`);
}
