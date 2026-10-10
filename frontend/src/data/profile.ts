/**
 * Quién soy — solo afirmaciones verificables (proyectos publicados, formación, repos).
 * Fuente: README de github.com/DavidCevallos15 y proyectos en producción.
 */
export const profile = {
  name: 'David Cevallos',
  legalName: 'Jimmy David Cevallos Zambrano',
  displayName: 'CEVALLOS',
  role: 'Desarrollador Full-Stack',
  tagline: 'Software que conecta con las personas.',
  bio: 'Construyo sitios y sistemas web para profesionales, negocios e instituciones de salud: desde la interfaz que ve una persona hasta la API y el panel que usa su equipo.',
  focus: ['Interfaces claras', 'Arquitectura mantenible', 'Seguridad desde el diseño'],
  /** Fila superior del póster (como el "cast" de una película). */
  credits: ['Full-Stack Dev', 'Ingeniería TI · UTM', 'Freelance', 'Creador en YouTube'],
  chips: ['React', 'Node.js', 'PostgreSQL'],
  location: 'Manabí, Ecuador',
  timezone: 'UTC-5',
  email: 'jimdav1506ceva@gmail.com',
  socials: {
    github: 'https://github.com/DavidCevallos15',
    linkedin: 'https://www.linkedin.com/in/jimmy-david-cevallos-zambrano-859876191/',
    youtube: 'https://www.youtube.com/@DavidCevaZam',
  },
  site: 'https://davidcevallos.vercel.app',
} as const;

export const reminderQuotes = [
  { text: 'No necesitas tener todas las respuestas, solo necesitas dar el primer paso y mejorar en el camino.', author: 'Enfoque' },
  { text: 'La acción imperfecta hoy, siempre será mejor que la idea perfecta mañana.', author: 'Acción' },
  {
    text: 'Allá lejos, a la luz del sol, están mis mayores aspiraciones. Puede que no las alcance, pero puedo mirar hacia arriba y ver su belleza.',
    author: 'Louisa May Alcott',
  },
] as const;
