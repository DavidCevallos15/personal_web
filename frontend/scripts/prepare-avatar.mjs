import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const [source, blinks] = process.argv.slice(2);
if (!source || !blinks) throw new Error('Usage: node scripts/prepare-avatar.mjs <21-pose atlas.png> <two-blinks.png>');
const output = 'public/media/avatar';
await mkdir(output, { recursive: true });
const metadata = await sharp(source).metadata();
const width = Math.floor(metadata.width / 7), height = Math.floor(metadata.height / 3);
async function clean(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const seen = new Uint8Array(info.width * info.height);
  let largest = [];
  for (let start = 0; start < seen.length; start++) {
    if (seen[start] || data[start * 4 + 3] < 100) continue;
    const component = [start]; seen[start] = 1;
    for (let index = 0; index < component.length; index++) {
      const point = component[index], x = point % info.width, y = Math.floor(point / info.width);
      for (const next of [x > 0 ? point - 1 : -1, x < info.width - 1 ? point + 1 : -1, y > 0 ? point - info.width : -1, y < info.height - 1 ? point + info.width : -1]) {
        if (next >= 0 && !seen[next] && data[next * 4 + 3] >= 100) { seen[next] = 1; component.push(next); }
      }
    }
    if (component.length > largest.length) largest = component;
  }
  const keep = new Uint8Array(seen.length);
  for (const point of largest) {
    const x = point % info.width, y = Math.floor(point / info.width);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (x + dx >= 0 && x + dx < info.width && y + dy >= 0 && y + dy < info.height) keep[(y + dy) * info.width + x + dx] = 1;
  }
  for (let point = 0; point < seen.length; point++) if (!keep[point]) data[point * 4 + 3] = 0;
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}
const frames = [];
for (let row = 0; row < 3; row++) for (let column = 0; column < 7; column++) frames.push(await clean(await sharp(source).extract({ left: column * width, top: row * height, width, height }).png().toBuffer()));
const neutral = await sharp(frames[10]).ensureAlpha().raw().toBuffer();
const torsoStart = Math.round(height * .67);
for (let index = 0; index < 21; index++) {
  const data = await sharp(frames[index]).ensureAlpha().raw().toBuffer();
  for (let y = torsoStart; y < height; y++) for (let x = 0; x < width; x++) {
    const t = Math.min(1, (y - torsoStart) / 10), point = (y * width + x) * 4;
    for (let channel = 0; channel < 4; channel++) data[point + channel] = Math.round(data[point + channel] * (1 - t) + neutral[point + channel] * t);
  }
  frames[index] = await sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}
const blinkMeta = await sharp(blinks).metadata();
for (let index = 0; index < 2; index++) {
  const face = await sharp(blinks).extract({ left: Math.floor(index * blinkMeta.width / 2), top: 0, width: Math.floor(blinkMeta.width / 2), height: blinkMeta.height }).resize(width, height).ensureAlpha().raw().toBuffer();
  const data = Buffer.from(neutral);
  for (let y = 61; y < 95; y++) for (let x = 71; x < 167; x++) {
    const edge = Math.min(1, Math.min(x - 71, 167 - x, y - 61, 95 - y) / 5), point = (y * width + x) * 4, from = ((y + 8) * width + x + 3) * 4;
    for (let channel = 0; channel < 3; channel++) data[point + channel] = Math.round(data[point + channel] * (1 - edge) + face[from + channel] * edge);
  }
  frames.push(await sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer());
}
await sharp(frames[10]).webp({ quality: 88 }).toFile(`${output}/neutral.webp`);
await sharp(frames[10]).avif({ quality: 75, effort: 5 }).toFile(`${output}/neutral.avif`);
const packed = await sharp({ create: { width: width * 7, height: height * 4, channels: 4, background: '#00000000' } }).composite(frames.map((input, index) => ({ input, left: index % 7 * width, top: Math.floor(index / 7) * height }))).png().toBuffer();
await sharp(packed).webp({ quality: 84 }).toFile(`${output}/head-atlas.webp`);
await sharp(packed).avif({ quality: 65, effort: 6 }).toFile(`${output}/head-atlas.avif`);
await writeFile('src/data/avatar-poses.json', JSON.stringify({ cellWidth: width, cellHeight: height, columns: 7, rows: 4, frames: 23, neutral: 10, avif: '/media/avatar/head-atlas.avif', webp: '/media/avatar/head-atlas.webp', yaw: [-30, -20, -10, 0, 10, 20, 30], pitch: [-12, 0, 12] }, null, 2) + '\n');
await mkdir('../avatar-frames', { recursive: true });
await Promise.all(frames.map((input, index) => writeFile(`../avatar-frames/${String(index).padStart(2, '0')}.png`, input)));
console.log(`Prepared ${frames.length} poses: ${width}×${height}, with a fixed torso and a neutral LCP image.`);
