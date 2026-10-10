import media from '@/data/generated/media.json';

export interface ImageVariant {
  src: string;
  avif?: string;
  w: number;
  h: number;
}

interface MediaEntry {
  name: string;
  original: { w: number; h: number };
  variants: Record<string, ImageVariant>;
}

export interface VideoAsset {
  webm: string;
  mp4: string;
  poster: string;
  w: number;
  h: number;
}

type Folder = 'gallery' | 'projects' | 'hero';
const images = media as unknown as Record<Folder, Record<string, MediaEntry>> & {
  video: Record<string, VideoAsset>;
};

/** Variante optimizada por carpeta/nombre; lanza en build si el asset no existe (falla rápido). */
export function img(folder: Folder, name: string, variant: string): ImageVariant {
  const entry = images[folder][name]?.variants[variant];
  if (!entry) throw new Error(`Media no encontrada: ${folder}/${name}@${variant}. Corre npm run media.`);
  return entry;
}

export function video(name: string): VideoAsset {
  const entry = images.video[name];
  if (!entry) throw new Error(`Video no encontrado: ${name}. Corre npm run media.`);
  return entry;
}

export const galleryItems = Object.values(images.gallery).map((e) => ({
  id: e.name,
  thumb: e.variants.thumb,
  full: e.variants.full,
}));
