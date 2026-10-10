# personal_web · David Cevallos

Portafolio de David Cevallos, desarrollador full-stack, y de **DC.dev Studio**.
Producción: https://davidcevallos.vercel.app

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · Vitest · Playwright · Vercel

## Estructura

```
frontend/
├── content/              ← Fuentes de datos editables
│   ├── linkedin/Certifications.csv    (export de LinkedIn)
│   └── certifications.extra.json      (certs fuera de LinkedIn: UTM, IVENTO…)
├── media-src/            ← Originales pesados (NO se sirven): galería, capturas, hero, videos
├── public/
│   ├── media/            ← Salida optimizada (WebP/AVIF/MP4/WebM) generada por `npm run media`
│   └── certs/            ← PDFs de certificados
├── scripts/              ← Pipelines: media, certificaciones, YouTube (+ tests)
├── src/
│   ├── sections/         ← Hero, Studio, Projects, Certificates, TechStack, ContentHub, AIGallery, Contact
│   ├── components/       ← motion/ (Reveal, VideoBg, CatPaw), ui/, layout/, easter/
│   ├── data/             ← profile, projects, studio, content + generated/*.json
│   └── lib/              ← media (manifest tipado), motion tokens, contact (Web3Forms)
├── e2e/                  ← Tests Playwright
└── vercel.json           ← CSP, cabeceras de seguridad y caché
```

## Comandos

```bash
cd frontend
npm install
npm run dev          # desarrollo
npm run build        # prebuild (certs + YouTube) → typecheck → build
npm test             # Vitest (pipelines, datos, contacto, componentes, CSP)
npm run test:e2e     # Playwright (desktop + móvil, reduced-motion)
npm run lint
```

## Actualizar contenido

| Qué | Cómo |
|---|---|
| **Certificaciones** | LinkedIn → Configuración → Privacidad de datos → *Obtener una copia de tus datos* → Certificaciones. Reemplaza `content/linkedin/Certifications.csv`. Para la imagen del certificado copia el PDF a `public/certs/diploma-<slug>.pdf` (slug = parte de la URL de Platzi después del número) y corre `npm run certs`. |
| **YouTube** | Automático: el `prebuild` lee el RSS de `@DavidCevaZam` en cada deploy. El workflow `refresh-content.yml` redeploya cada lunes si configuras el secret `VERCEL_DEPLOY_HOOK`. |
| **Proyectos / Studio** | `src/data/projects.ts` y `src/data/studio.ts`. Captura en `media-src/projects/<nombre>.png` y `npm run media`. |
| **Galería IA / videos / hero** | Original en `media-src/…` y `npm run media` (requiere ffmpeg para videos). |

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_WEB3FORMS_KEY` | Access key de [Web3Forms](https://web3forms.com) para el formulario. Sin ella, el formulario abre el correo con el mensaje prellenado. |
| `YT_CHANNEL_ID` / `YT_HANDLE` | Opcional, para fijar el canal de YouTube. |

## Easter eggs

`LOG` en el teclado · `destroy()` en la consola · 5 clics rápidos en el avatar · Konami code.
