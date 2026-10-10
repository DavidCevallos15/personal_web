import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');

describe('CSP de vercel.json', () => {
  const csp = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8'))
    .headers[0].headers.find((h) => h.key === 'Content-Security-Policy').value;

  it('autoriza por hash cada <script> inline de index.html (si editas el script, actualiza el hash)', () => {
    const html = readFileSync(path.join(root, 'index.html'), 'utf8');
    const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    expect(inline.length).toBeGreaterThan(0);
    for (const code of inline) {
      const hash = createHash('sha256').update(code).digest('base64');
      expect(csp).toContain(`'sha256-${hash}'`);
    }
  });

  it('no permite unsafe-inline/unsafe-eval en scripts ni ser embebido', () => {
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'));
    expect(scriptSrc).not.toMatch(/unsafe-(inline|eval)/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
});
