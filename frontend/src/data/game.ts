/** Cuntur · Ruta de los 5 Sabores: videojuego propio, desplegado aparte y embebido en el portafolio. */
export const game = {
  title: 'Cuntur',
  subtitle: 'Ruta de los 5 Sabores',
  url: 'https://cuntur-ruta-de-los-5-sabores.vercel.app/',
  repo: 'https://github.com/DavidCevallos15/Cuntur-Ruta-de-los-5-Sabores',
  /** Por qué existe, en una línea (también lo usa el aviso para celulares). */
  tribute: 'Hecho en honor a mi tierra, Ecuador.',
  story:
    'Cuntur es un cóndor andino con hambre. Sale de la Costa buscando un encebollado con chifle y termina recorriendo cinco regiones, cada una con su plato, su paisaje y su gente que le habla con frases que cualquier ecuatoriano reconoce.',
  worlds: [
    { region: 'Costa', place: 'Manabí · Guayaquil', dish: 'Encebollado con chifle' },
    { region: 'Islas', place: 'Galápagos', dish: 'Ceviche de atún' },
    { region: 'Viento', place: 'Sierra · Cotopaxi', dish: 'Hornado' },
    { region: 'Lava', place: 'Ruta de volcanes', dish: 'Llapingachos' },
    { region: 'Selva', place: 'Amazonía', dish: 'Maito' },
  ],
} as const;
