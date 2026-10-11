export type ProjectCategory = 'web' | 'sistemas' | 'seguridad' | 'producto';

export interface Project {
  id: string;
  title: string;
  /** Una línea: qué problema resuelve y para quién. */
  summary: string;
  category: ProjectCategory;
  /** Etiqueta corta visible en la card (contexto real del proyecto). */
  context: string;
  tags: string[];
  /** Nombre en media-src/projects (sin extensión). */
  image?: string;
  /** Solo enlaces públicos a la página en vivo. El código de los proyectos es privado. */
  demoUrl?: string;
  status?: 'en producción' | 'en desarrollo' | 'académico';
  featured?: boolean;
}

export const categoryLabels: Record<ProjectCategory | 'all', string> = {
  all: 'Todos',
  web: 'Web',
  sistemas: 'Sistemas',
  seguridad: 'Seguridad',
  producto: 'Producto',
};

export const projects: Project[] = [
  {
    id: 'restore',
    title: 'Restore Chiropractic',
    summary: 'Web bilingüe para un consultorio quiropráctico: servicios, perfil profesional, FAQ y acceso al sistema de citas.',
    category: 'web',
    context: 'Cliente · Charlotte, EE. UU.',
    tags: ['Next.js', 'React', 'Tailwind', 'i18n', 'SEO técnico'],
    image: 'restore',
    demoUrl: 'https://www.restorechiropracticcare.com/',
    status: 'en producción',
    featured: true,
  },
  {
    id: 'hpvc',
    title: 'HPVC · Sistema web institucional',
    summary: 'Portal, panel CMS y API REST desacoplados para el Hospital Verdi Cevallos Balda. JWT HttpOnly, roles, Zod y Helmet.',
    category: 'sistemas',
    context: 'Proyecto de titulación · Hospital',
    tags: ['React', 'Express', 'PostgreSQL', 'Prisma', 'Docker', 'Nginx'],
    image: 'hpvc',
    demoUrl: 'https://hpvc.gob.ec',
    status: 'en producción',
    featured: true,
  },
  {
    id: 'inforario',
    title: 'Inforario UTM',
    summary: 'App web + extensión Manifest V3 que convierte los PDF de horarios del SGU en un calendario interactivo con Google Calendar.',
    category: 'producto',
    context: 'Herramienta para estudiantes',
    tags: ['React', 'TypeScript', 'Supabase', 'Manifest V3'],
    image: 'inforario-extension',
    demoUrl: 'https://inforario-ia-null.vercel.app/',
    featured: true,
  },
  {
    id: 'java-crypto',
    title: 'Java Crypto Sockets',
    summary: 'Transferencia segura de archivos por TCP: AES-GCM, intercambio de llaves RSA híbrido e integridad SHA-256.',
    category: 'seguridad',
    context: 'Sistemas distribuidos',
    tags: ['Java', 'AES-GCM', 'RSA', 'SHA-256', 'Sockets'],
    image: 'java-crypto-sockets',
    status: 'académico',
  },
  {
    id: 'win-sec',
    title: 'win-sec-sanitizer',
    summary: 'Script PowerShell de higiene del host: limpieza, auditoría de ejecutables en zonas de riesgo y reporte de auditoría.',
    category: 'seguridad',
    context: 'DevSecOps · Open source',
    tags: ['PowerShell', 'Windows', 'Auditoría'],
    image: 'win-sec-sanitizer',
  },
  {
    id: 'finanzas',
    title: 'Plantilla de finanzas personales',
    summary: 'Landing de una plantilla gratuita en Google Sheets para registrar ingresos, gastos y metas de ahorro.',
    category: 'producto',
    context: 'Producto digital',
    tags: ['React', 'TypeScript', 'Tailwind', 'Google Sheets'],
    image: 'finanzas',
  },
  {
    id: 'espacio',
    title: 'Semana Mundial del Espacio',
    summary: 'Sistema Solar en 3D con viaje por escalas hasta GN-z11 y retraso de luz calculado con astronomy-engine.',
    category: 'producto',
    context: 'Divulgación · 3D',
    tags: ['Three.js', 'TypeScript', 'Vite', 'Vitest'],
    image: 'semana-mundial-del-espacio',
  },
  {
    id: 'enfermero',
    title: 'Lic. Jimmy Cevallos · Enfermería',
    summary: 'Mi primer proyecto: servicios de enfermería a domicilio en Portoviejo con contacto directo por WhatsApp.',
    category: 'web',
    context: 'Primer cliente · Portoviejo',
    tags: ['JavaScript', 'Bootstrap', 'Vite'],
    image: 'enfermero',
    demoUrl: 'https://enfermero-jimmy-cevallos.vercel.app/',
    status: 'en producción',
  },
  {
    id: 'of-essence',
    title: 'Of Essence',
    summary: 'Catálogo digital interactivo para preventa de perfumería exclusiva.',
    category: 'web',
    context: 'E-commerce',
    tags: ['Next.js', 'Tailwind', 'Motion'],
    image: 'of-essence',
    demoUrl: 'https://of-essence.vercel.app/',
  },
  {
    id: 'bernarda',
    title: 'Teatro Bernarda',
    summary: 'Plataforma de difusión para una tesis de Artes Escénicas.',
    category: 'web',
    context: 'Proyecto académico',
    tags: ['React', 'Node.js', 'Vercel'],
    image: 'bernarda',
    demoUrl: 'https://teatrobernarda.vercel.app/',
  },
];
