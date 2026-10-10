import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Projects } from './Projects';
import { Certificates } from './Certificates';
import { projects } from '@/data/projects';
import { certifications } from '@/data/content';

describe('<Projects />', () => {
  it('muestra 6 proyectos y expande el resto con "Ver más"', async () => {
    render(<Projects />);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    await userEvent.click(screen.getByRole('button', { name: /ver \d+ proyectos más/i }));
    expect(screen.getAllByRole('article')).toHaveLength(projects.length);
  });

  it('filtra por categoría', async () => {
    render(<Projects />);
    await userEvent.click(screen.getByRole('tab', { name: 'Seguridad' }));
    const expected = projects.filter((p) => p.category === 'seguridad').length;
    // AnimatePresence mantiene las cards salientes hasta terminar su exit
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(expected));
    const cards = screen.getAllByRole('article');
    expect(within(cards[0]).getByRole('heading')).toHaveTextContent(/crypto|sanitizer/i);
  });
});

describe('<Certificates />', () => {
  it('las flechas recorren el deck y el panel anuncia el certificado actual', async () => {
    render(<Certificates />);
    const panel = screen.getByRole('status');
    expect(panel).toHaveTextContent(certifications[0].title);
    await userEvent.click(screen.getByRole('button', { name: /siguiente certificado/i }));
    expect(panel).toHaveTextContent(certifications[1].title);
    await userEvent.click(screen.getByRole('button', { name: /certificado anterior/i }));
    expect(panel).toHaveTextContent(certifications[0].title);
  });
});
