import certificationsJson from './generated/certifications.json';
import youtubeJson from './generated/youtube.json';

// ── Certificaciones (generado por scripts/sync-certs.mjs desde el CSV de LinkedIn) ──
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  /** YYYY-MM */
  date: string;
  credentialUrl: string | null;
  credentialId: string | null;
  file: string | null;
  thumb: string | null;
  kind: 'course' | 'event';
  source: 'linkedin' | 'manual';
}
export const certifications = certificationsJson as Certification[];

// ── YouTube (generado por scripts/sync-youtube.mjs desde el RSS del canal) ──
export interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
  thumb: string;
  isShort: boolean;
  views: number | null;
}
export interface YouTubeData {
  channel: { id: string | null; handle: string; title: string; url: string };
  videos: YouTubeVideo[];
  updatedAt: string | null;
}
export const youtube = youtubeJson as YouTubeData;

// ── Videos con avatar IA (HeyGen) ──
export interface AvatarVideo {
  id: string;
  embed: string;
  title: string;
  label: string;
  local?: { src: string; poster: string };
  production?: string;
}
export const avatarVideos: AvatarVideo[] = [
  { id: 'jovenes', embed: '/media/video/jovenes-en-accion.mp4', title: 'Jóvenes en acción', label: 'Jóvenes', local: { src: '/media/video/jovenes-en-accion.mp4', poster: '/media/video/jovenes-en-accion-poster.webp' }, production: 'Una pieza narrativa con mi avatar, producida con IA. Dale play para verla con sonido.' },
  { id: 'hg-1', embed: 'https://app.heygen.com/embeds/b4aee93789934050a35f881a3a30c050', title: 'Presentación con avatar IA', label: 'Presentación' },
  { id: 'hg-2', embed: 'https://app.heygen.com/embeds/47998df8222f450ba2ee77ab21569cec', title: 'Contenido con avatar IA', label: 'Contenido' },
  { id: 'hg-3', embed: 'https://app.heygen.com/embeds/234440781f464f5ba1507e9a25d1753a', title: 'Showcase con avatar IA', label: 'Showcase' },
];

// ── Stack ──
export interface TechGroup {
  title: string;
  items: { name: string; use: string }[];
}
export const techStack: TechGroup[] = [
  {
    title: 'Frontend',
    items: [
      { name: 'React · Next.js · TypeScript', use: 'Interfaces adaptables y componentes reutilizables.' },
      { name: 'Tailwind CSS v4 · Motion', use: 'Sistemas de diseño con tokens y animación con presupuesto de rendimiento.' },
    ],
  },
  {
    title: 'Backend y datos',
    items: [
      { name: 'Node.js · Express · Django', use: 'APIs REST, autenticación y lógica de negocio.' },
      { name: 'PostgreSQL · Prisma · Supabase', use: 'Modelado relacional, RLS, storage y auth.' },
    ],
  },
  {
    title: 'Entrega y seguridad',
    items: [
      { name: 'Docker · Nginx · Linux', use: 'Despliegue en infraestructura propia (HPVC) y en la nube.' },
      { name: 'Vercel · Azure SWA · GitHub Actions', use: 'CI con lint, tests y build antes de cada deploy.' },
      { name: 'Zod · Helmet · JWT HttpOnly', use: 'Validación de entradas, cabeceras seguras y control por roles.' },
    ],
  },
  {
    title: 'IA aplicada al desarrollo',
    items: [
      { name: 'Claude Code · Cursor · Windsurf', use: 'Agentes en el flujo diario, siempre con revisión y tests.' },
      { name: 'Groq · Gemini APIs', use: 'Integración de LLMs en productos (Inforario).' },
      { name: 'Higgsfield · Google Flow · HeyGen', use: 'Video, avatares y arte generativo para contenido.' },
    ],
  },
];

export interface SectionLink {
  id: string;
  label: string;
}
export const navLinks: SectionLink[] = [
  { id: 'studio', label: 'Studio' },
  { id: 'works', label: 'Proyectos' },
  { id: 'game', label: 'Juego' },
  { id: 'certificates', label: 'Certificaciones' },
  { id: 'content', label: 'Contenido' },
  { id: 'contact', label: 'Contacto' },
];
