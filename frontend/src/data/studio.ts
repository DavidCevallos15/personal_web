/** DC.dev Studio: landings para negocios locales, listas para rebrandear por cliente. Código privado: se muestran solo capturas y se piden por contacto. */
export interface StudioTemplate {
  id: string;
  name: string;
  niche: string;
  /** Técnica de motion destacada (lo que la diferencia). */
  highlight: string;
  stack: string;
  image: string;
}

export const studioTemplates: StudioTemplate[] = [
  { id: 'arqui', name: 'Estudio Axis', niche: 'Arquitectura', highlight: 'Alzado que se dibuja con el scroll, planta con callouts', stack: 'React · Motion', image: 'arqui-template' },
  { id: 'gym', name: 'Fitness', niche: 'Gimnasio', highlight: 'Titular que se separa en 3D, 15 secciones animadas', stack: 'React · Motion', image: 'gym-template' },
  { id: 'dojo', name: 'Dojo Academia', niche: 'Artes marciales', highlight: 'Visual tipográfico: kanji, ensō y cinturones', stack: 'React · Motion', image: 'dojo-template' },
  { id: 'burger', name: 'La Burger', niche: 'Hamburguesería', highlight: 'Burger que se arma con el scroll, carrito y menú', stack: 'HTML · CSS · JS vanilla', image: 'burguer-template' },
  { id: 'brun', name: 'Dulce Atelier', niche: 'Repostería', highlight: 'Tests Playwright en 3 breakpoints + reduced motion', stack: 'React · Motion', image: 'reposteria-brun' },
  { id: 'barber', name: '[Barber Studio]', niche: 'Barbería', highlight: 'Reservas por WhatsApp, sin backend', stack: 'React · Motion', image: 'jgbarberstudio' },
];
