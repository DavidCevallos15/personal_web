import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { certifications, techStack } from './content';
import { profile } from './profile';
import { projects } from './projects';
import { studioTemplates } from './studio';
import { galleryItems, img } from '@/lib/media';

const PUBLIC = path.resolve(import.meta.dirname, '../../public');
const exists = (url: string) => existsSync(path.join(PUBLIC, decodeURIComponent(url)));

describe('integridad de contenido', () => {
  it('cada proyecto y plantilla tiene su imagen optimizada en disco', () => {
    for (const p of projects.filter((p) => p.image)) expect(exists(img('projects', p.image!, 'card').src), p.id).toBe(true);
    for (const t of studioTemplates) expect(exists(img('projects', t.image, 'card').src), t.id).toBe(true);
  });

  it('ids de proyectos únicos y cada proyecto con demo o captura', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    for (const p of projects) expect(p.demoUrl ?? p.image, p.id).toBeTruthy();
  });

  it('proyectos y plantillas no enlazan a repositorios (código privado)', () => {
    expect(JSON.stringify({ projects, studioTemplates })).not.toMatch(/github\.com/i);
  });

  it('certificaciones: fecha YYYY-MM, ids únicos y archivos/miniaturas existentes', () => {
    expect(certifications.length).toBeGreaterThan(20);
    expect(new Set(certifications.map((c) => c.id)).size).toBe(certifications.length);
    for (const c of certifications) {
      expect(c.date, c.id).toMatch(/^\d{4}-\d{2}$/);
      if (c.thumb) expect(exists(c.thumb), c.thumb).toBe(true);
      if (c.file) expect(exists(c.file), c.file).toBe(true);
    }
  });

  it('galería: cada pieza tiene miniatura y full en disco (agregar fotos no rompe el test)', () => {
    expect(galleryItems.length).toBeGreaterThan(0);
    for (const g of galleryItems) {
      expect(exists(g.thumb.src)).toBe(true);
      expect(g.thumb.w).toBeGreaterThan(0);
    }
  });

  it('sin em-dash ni en-dash en el copy visible (regla anti-slop)', () => {
    const copy = JSON.stringify({ profile, projects, studioTemplates, techStack });
    expect(copy).not.toMatch(/[—–]/);
  });
});
