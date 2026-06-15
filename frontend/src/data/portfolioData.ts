export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  image?: string;
}

export interface TechItem {
  id: string;
  name: string;
  desc: string;
  items?: string[];
}

export interface TechCategory {
  title: string;
  items: TechItem[];
}

export interface ArtItem {
  id: string;
  image: string;
}

export interface LinkedInPost {
  id: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  url: string;
}

const generateAIGallery = (): ArtItem[] => {
  const gallery: ArtItem[] = [];
  gallery.push({
    id: "img-0",
    image: "/ai-showcase/Gemini_Generated_Image_.png"
  });
  for (let i = 1; i <= 79; i++) {
    gallery.push({
      id: `img-${i}`,
      image: `/ai-showcase/Gemini_Generated_Image_ (${i}).png`
    });
  }
  return gallery;
};

export const portfolioData = {
  hero: {
    badge: "Disponible para proyectos",
    title: "Diseñando el futuro con sistemas inteligentes.",
    subtitle: "Estudiante de 9no semestre de Ingeniería en TI en la UTM. Especialista en AI Engineering & DevSecOps, construyendo arquitecturas resilientes y de alto rendimiento.",
    philosophyQuote: "La creación actual con IA no es como los demás piensan; no se trata de delegar a ciegas, se requiere un conocimiento profundo tanto de los fundamentos como de las herramientas específicas a elegir para cada tipo de proyecto con la finalidad real de resolver un problema.",
    primaryCta: "Iniciar Protocolo",
    secondaryCta: "Ver Proyectos",
  },
  socials: {
    github: "https://github.com/DavidCevallos15",
    linkedin: "https://www.linkedin.com/in/jimmy-david-cevallos-zambrano-859876191/"
  },
  environments: [
    { name: "Fedora Workstation", role: "Sistema principal" },
    { name: "Windows 11", role: "Entorno secundario" },
    { name: "Ubuntu Server", role: "Despliegue y producción" }
  ],
  projects: [
    {
      id: "hpvc",
      title: "Sistema Web Institucional HPVC",
      category: "Full-Stack",
      description: "Sitio web oficial y público del Hospital Verdi Cevallos. Desarrollado para ofrecer información institucional y servicios a la comunidad.",
      tags: ["React", "Node.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
      image: "/previews/hpvc.png"
      // CERO ENLACES PÚBLICOS AL CÓDIGO DEL SISTEMA HPVC
    },
    {
      id: "inforario",
      title: "Inforario UTM",
      category: "Integración IA",
      description: "Aplicación inteligente diseñada para optimizar y gestionar la visualización de horarios mediante la integración de IA.",
      tags: ["Vite", "TypeScript", "Tailwind", "GenAI API"],
      image: "/previews/inforario.png",
      demoUrl: "https://inforario-ia-null.vercel.app/"
    },
    {
      id: "enfermero",
      title: "Servicios de Enfermería",
      category: "Diseño Web",
      description: "Landing page profesional optimizada para la marca personal y servicios de enfermería independiente.",
      tags: ["React", "Tailwind", "Vercel"],
      image: "/previews/enfermero.png",
      demoUrl: "https://enfermero-jimmy-cevallos.vercel.app/"
    },
    {
      id: "of-essence",
      title: "Of Essence - Catálogo de Perfumes",
      category: "E-Commerce",
      description: "Landing page interactiva y moderna que funciona como catálogo digital para la visualización y preventa de perfumería exclusiva.",
      tags: ["Next.js", "Tailwind", "Framer Motion"],
      image: "/previews/perfumería.png",
      demoUrl: "https://of-essence.vercel.app/"
    },
    {
      id: "teatro-bernarda",
      title: "Teatro Bernarda",
      category: "Plataforma Web",
      description: "Plataforma web desarrollada como proyecto de tesis para la carrera de Artes Escénicas. Centraliza la gestión y difusión de la obra.",
      tags: ["React", "Node.js", "Vercel"],
      image: "/previews/bernarda.png",
      demoUrl: "https://teatrobernarda.vercel.app/"
    }
  ] as Project[],
  certifications: [
    { id: "cert-26-1", title: "ChatGPT", issuer: "Platzi", date: "2026", credentialUrl: "/certs/diploma-chatgpt.pdf" },
    { id: "cert-26-2", title: "Herramientas de IA para Devs", issuer: "Platzi", date: "2026", credentialUrl: "/certs/diploma-devs-ai-tools.pdf" },
    { id: "cert-26-3", title: "Habilidades de Liderazgo", issuer: "Platzi", date: "2026", credentialUrl: "/certs/diploma-habilidades-liderazgo.pdf" },
    { id: "cert-26-4", title: "Ingeniería de Prompt", issuer: "Platzi", date: "2026", credentialUrl: "/certs/diploma-prompt-engineering.pdf" },
    { id: "cert-26-5", title: "Desarrollo con v0", issuer: "Platzi", date: "2026", credentialUrl: "/certs/diploma-v0.pdf" },
    { id: "cert-26-6", title: "Certificado Universitario", issuer: "UTM", date: "2026", credentialUrl: "/certs/certificado.pdf" },
    { id: "cert-26-7", title: "Aprobación Universitario", issuer: "UTM", date: "2026", credentialUrl: "/certs/Jimmy David Cevallos Zambrano-signed-signed.pdf" },
    { id: "cert-25-1", title: "Growth Marketing IA", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-growth-ia.pdf" },
    { id: "cert-25-2", title: "Introducción a la IA", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-introduccion-ai.pdf" },
    { id: "cert-25-3", title: "Desarrollo Frontend", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-frontend-developer.pdf" },
    { id: "cert-25-4", title: "Frontend Práctico", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-frontend-developer-practico.pdf" },
    { id: "cert-25-5", title: "Ingeniería de Software", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-ingenieria.pdf" },
    { id: "cert-25-6", title: "HTML Definitivo", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-html.pdf" },
    { id: "cert-25-7", title: "Terminal y Línea de Comandos", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-terminal.pdf" },
    { id: "cert-25-8", title: "Introducción a la Web", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-introweb.pdf" },
    { id: "cert-25-9", title: "Computación Básica", issuer: "Platzi", date: "2025", credentialUrl: "/certs/diploma-computacion-basica.pdf" },
    { id: "cert-24-1", title: "Django + React Badge", issuer: "Codings Academy", date: "2024", credentialUrl: "/certs/Insignia (Badge) - Curso Django + React.png" },
    { id: "cert-24-2", title: "IVENTO Asistencia 1", issuer: "IVENTO", date: "2024", credentialUrl: "/certs/IVENTO_Certificado_Asistente_1781493891203.pdf" },
    { id: "cert-24-3", title: "IVENTO Asistencia 2", issuer: "IVENTO", date: "2024", credentialUrl: "/certs/IVENTO_Certificado_Asistente_1781493903469.pdf" },
    { id: "cert-24-4", title: "IVENTO Asistencia 3", issuer: "IVENTO", date: "2024", credentialUrl: "/certs/IVENTO_Certificado_Asistente_1781493917891.pdf" },
    { id: "cert-20-1", title: "HTML & CSS", issuer: "Platzi", date: "2020", credentialUrl: "/certs/diploma-html-css-2020.pdf" },
    { id: "cert-20-2", title: "HTML & CSS Práctico", issuer: "Platzi", date: "2020", credentialUrl: "/certs/diploma-html-practico.pdf" },
    { id: "cert-19-1", title: "Computación Básica", issuer: "Platzi", date: "2019", credentialUrl: "/certs/diploma-computacion-basica-2019.pdf" },
  ] as Certification[],
  techStack: [
    {
      title: "Frameworks & Frontend",
      items: [
        { id: "fw-1", name: "React / Vite / Next.js", desc: "Arquitecturas escalables y componentización reactiva en ecosistema JS/TS." },
        { id: "fw-2", name: "Tailwind CSS v4", desc: "Sistemas de diseño dinámicos, utility-first y ultra rápidos." }
      ]
    },
    {
      title: "Infra & Bases de Datos",
      items: [
        { id: "db-1", name: "Prisma ORM & PostgreSQL", desc: "Modelado relacional robusto y transacciones ACID seguras." },
        { id: "db-2", name: "Supabase", desc: "Backend-as-a-Service, Auth y edge functions de altísimo rendimiento." },
        { id: "db-3", name: "Fedora Workstation / Ubuntu Server", desc: "Administración nativa de servidores y virtualización local." }
      ]
    },
    {
      title: "Gen AI Tools & LLMs",
      items: [
        { id: "ai-1", name: "Claude 3.5 Sonnet", desc: "Pilar central en mi flujo de trabajo para ingeniería de software compleja." },
        { id: "ai-2", name: "Gemini LLM & ChatGPT", desc: "Integración de APIs para procesamiento avanzado y análisis de datos rápidos." },
        { id: "ai-3", name: "Ollama (Local Models)", desc: "DeepSeek, Llama 3, Mixtral y Kimi K2.7 Code ejecutados localmente." },
        { id: "ai-4", name: "Agentes e IDEs IA", desc: "Antigravity, Cursor Agent, Windsurf y Warp (terminal ultra-moderna)." }
      ]
    }
  ] as TechCategory[],
  aiGallery: generateAIGallery(),
  linkedinFeed: [
    {
      id: "post-1",
      date: "Junio 2026",
      content: "🚀 Optimización extrema: Desplegando entornos estables con Fedora Workstation y automatizando pipelines con arquitectura DevSecOps para sistemas críticos de salud. #AI #DevSecOps #Fedora",
      likes: 142,
      comments: 28,
      url: "https://www.linkedin.com/in/jimmy-david-cevallos-zambrano-859876191/"
    },
    {
      id: "post-2",
      date: "Mayo 2026",
      content: "Culminando detalles del despliegue del Monorepo Institucional para el HPVC. Un ecosistema robusto construido con React, Node.js y PostgreSQL corriendo sobre servidores locales. 💻🛡️",
      likes: 198,
      comments: 42,
      url: "https://www.linkedin.com/in/jimmy-david-cevallos-zambrano-859876191/"
    }
  ] as LinkedInPost[]
};
