import { describe, expect, it } from 'vitest';
import { buildCertifications, cleanTitle, parseCsv, parseLinkedInDate, platziCourse } from './certs.mjs';

describe('parseCsv', () => {
  it('respeta comillas, comas internas, comillas escapadas y CRLF', () => {
    const rows = parseCsv('Name,Url\r\n"Curso de A, B",https://x\r\n"Dice ""hola""",\r\n\r\n');
    expect(rows).toEqual([
      { Name: 'Curso de A, B', Url: 'https://x' },
      { Name: 'Dice "hola"', Url: '' },
    ]);
  });
});

describe('parseLinkedInDate', () => {
  it.each([
    ['Oct 2024', '2024-10'],
    ['Jun 2026', '2026-06'],
    ['', ''],
    ['2024', ''],
  ])('%s → %s', (input, out) => expect(parseLinkedInDate(input)).toBe(out));
});

describe('cleanTitle', () => {
  it.each([
    ['Curso de Claude AI', 'Claude AI'],
    ['Curso Gratis de Introducción a la Inteligencia Artificial', 'Introducción a la Inteligencia Artificial'],
    ['Curso Definitivo de HTML y CSS', 'Curso Definitivo de HTML y CSS'],
    ['Curso de GPT-5.6', 'GPT-5.6'],
    ['CURSO PYTHON DEVELOPER', 'Curso Python Developer'],
    ['CURSO DE DESARRROLLO WEB CON DJANGO + REACT (FEB-2024)', 'Desarrrollo Web con Django + React'],
  ])('%s → %s', (input, out) => expect(cleanTitle(input)).toBe(out));
});

describe('platziCourse', () => {
  it('extrae id y slug del diploma', () => {
    expect(platziCourse('https://platzi.com/p/u/curso/12341-html/diploma/detalle/')).toEqual({ id: '12341', slug: 'html' });
    expect(platziCourse('https://api.badgr.io/x')).toBeNull();
  });
});

describe('buildCertifications', () => {
  const rows = [
    { Name: 'Curso de HTML', Url: 'https://platzi.com/p/u/curso/1-html/diploma/detalle/', Authority: 'Platzi', 'Started On': 'Nov 2025', 'License Number': 'abc' },
    { Name: 'Curso de HTML', Url: 'https://platzi.com/p/u/curso/1-html/diploma/detalle/', Authority: 'Platzi', 'Started On': 'Nov 2025', 'License Number': 'abc' },
    { Name: 'Badge', Url: 'https://badgr/1', Authority: 'Badgr', 'Started On': 'Oct 2024', 'License Number': '' },
  ];
  const extra = {
    items: [
      { id: 'override', title: 'Django + React', issuer: 'Codings', date: '2024-09', file: 'c.pdf', kind: 'course', replaces: 'https://badgr/1' },
      { id: 'evento', title: 'Convención', issuer: 'UTM', date: '2026-01', file: 'e.pdf', kind: 'event' },
    ],
  };
  const certs = buildCertifications(rows, extra, ({ slug }) => `diploma-${slug}.pdf`);

  it('deduplica filas repetidas de LinkedIn', () => {
    expect(certs.filter((c) => c.title === 'HTML')).toHaveLength(1);
  });
  it('aplica overrides manuales conservando la URL de verificación', () => {
    const o = certs.find((c) => c.id === 'override');
    expect(o).toMatchObject({ title: 'Django + React', file: 'c.pdf', credentialUrl: 'https://badgr/1' });
    expect(o).not.toHaveProperty('replaces');
  });
  it('ordena por fecha descendente e incluye extras', () => {
    expect(certs.map((c) => c.date)).toEqual(['2026-01', '2025-11', '2024-09']);
    expect(certs[1].file).toBe('diploma-html.pdf');
  });
});
