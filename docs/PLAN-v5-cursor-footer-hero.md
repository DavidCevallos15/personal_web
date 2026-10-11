# Plan v5: cursor, footer y hero que mira al cursor

Repo: `DavidCevallos15/personal_web` · rama propuesta: `feat/v5-cursor-footer-hero` desde `main`.
Skills aplicadas: web-animation-stack, design-taste-frontend, impeccable (modo Experience, refinamiento sobre el sistema actual), motion-design (LottieFiles), frontend-design. `creative-portfolio-resume` es para CVs: solo aporta el link "Descargar CV" del footer.

## 1. Análisis de las referencias

| | Video 1: Ownitt (agencia, Bayona) | Video 2: Matteo Backer (motion artist solo) |
|---|---|---|
| Tipo | Agencia de branding, editorial | Portafolio de una persona |
| Tipografía | Condensada + serif itálica mezclada en titulares | Condensada gigante (familia Anton/Bebas), sans de apoyo |
| Color | B/N + verde ácido, alterna fondos negro y crema | Negro + un acento naranja saturado |
| Hero | Wordmark + foto B/N de terceros | Nombre gigante cortado + retrato |
| Cursor | Punto + anillo con retraso que se estira con la velocidad y muestra "SCROLL" | Nativo |
| Footer | Newsletter crema, columnas de links | Bloque naranja, "Let's chat", nombre gigante con **rastro de imágenes de proyectos** al pasar el mouse |
| Riesgos con tus skills | Serif mezclada (taste §4.1), 4+ cambios de tema (§4.11), fotografía editorial que no tienes | Stats inventadas (12+, 96%, 3.7X: §4.9), tabla de premios, testimonios que todavía no tienes |

**Veredicto: el video 2 te conviene más** como estructura y footer. Ya es tu sistema (nombre gigante, condensada, un solo acento saturado, retrato), es un portafolio de una persona como el tuyo y su footer es el remate natural de tu hero. Del video 1 tomas solo el **cursor punto + anillo con estiramiento y etiqueta**, que coincide con el código que mandaste. No copiar de ninguno: serif mezclada, stats inventadas, premios, tabla de testimonios.

Video 3 (referencia del hero): avatar 3D cuya cabeza gira y se inclina hacia el cursor (yaw + pitch), parpadeo ocasional; letras del titular que se pintan del acento cuando el cursor pasa cerca y vuelven; pill "Hire me" que se rellena en hover.

## 2. Cursor: revisión del código que mandaste

| Problema | Por qué importa | Fix |
|---|---|---|
| `setRenderPos` dentro de `requestAnimationFrame` | Re-render de React a 60 fps aunque el mouse esté quieto (taste §3.B y §5.D) | `useMotionValue` + `useSpring`, cero renders por movimiento |
| Anima `left/top` y `width/height` | Layout + paint por frame (regla: solo transform/opacity) | `x/y` y `scale` |
| `querySelectorAll` una sola vez al montar | No ve cards de "Ver más", filtros, lightbox, contenido lazy | Delegación con `pointerover` + `closest()` |
| `img` cuenta como interactivo | Las 160 imágenes de la galería y el avatar agrandan el anillo sin ser clic | Solo `a, button, [role=tab], label, summary, [data-cursor]` |
| Sin `pointer: fine` ni reduced-motion | Se dibuja en touch y con reduced-motion | Gate con `matchMedia` en vivo; no se descarga el chunk |
| No oculta el cursor nativo | Se ven dos cursores | `html[data-cursor-on] { cursor: none }` solo con el custom activo |
| `dark:` de Tailwind | En v4 sigue a `prefers-color-scheme`, no a tu toggle `data-theme` | Tokens CSS (`--color-text-primary`, `--color-accent-primary`) |
| `z-50` | Queda debajo del lightbox (z-90) y del skip link | Escala en `src/lib/layers.ts`, cursor en 110 |
| `'use client'` | No aplica en Vite | Quitar |

### Motion Spec del cursor

| Pieza | Técnica | Trigger | Duración / ease | Reduced-motion / touch |
|---|---|---|---|---|
| Punto 6px oro | `useSpring` stiffness 1500, damping 80, mass 0.2 (casi pegado) | `pointermove` passive | spring | No existe; cursor nativo |
| Anillo 34px (borde `text-primary/50`) | `useSpring` stiffness 260, damping 28, mass 0.5 (el retraso del video 1) | idem | spring | idem |
| Estiramiento por velocidad | `useVelocity` → `scaleX` 1 → 1.35 + `rotate` según dirección | movimiento | spring | idem |
| Hover link/botón | anillo `scale` 1 → 1.5, punto `opacity` 0 + `scale` 0.5 | `pointerover` delegado | 200 ms `ease-interactive`, interrumpible | idem |
| Etiqueta contextual (`data-cursor="Ver"`, `"Arrastra"`, `"Play"`) | anillo `scale` 2.2 relleno oro, texto mono 10px obsidiana | idem | 240 ms `ease-disclosure` | idem |
| Press | anillo `scale` × 0.85, vuelve al soltar | `pointerdown/up` | 120 ms `ease-feedback` | idem |
| Texto e inputs | custom `opacity` 0, cursor nativo de texto | `pointerover` | 120 ms | idem |
| Footer | se transforma en la **patita** (prototipo SVG ya aprobado visualmente), tap 0.9 → 1 + huella oro | entrar a `[data-cursor-zone="paw"]` | crossfade 180 ms | idem |
| Fuera de ventana / iframes | oculto | `pointerleave` del documento | 120 ms | idem |

Dónde va cada etiqueta: galería IA y deck de certificados "Arrastra", cards de proyecto y plantillas "Ver", facades de YouTube/HeyGen "Play". Se elimina `CatPaw.tsx` (patita de scroll) y su aserción E2E.

## 3. Footer nuevo (referencia: video 2)

Se fusiona con Contacto. Un único cambio de tema deliberado al final de la página (taste §4.11 lo permite una vez): bloque **oro full-bleed con texto obsidiana** (contraste ~9:1 oscuro, ~5.6:1 claro).

| Zona | Contenido | Motion |
|---|---|---|
| Arriba izquierda | Retrato pequeño (frame central del avatar) + "Trabajemos" | reveal 0.5 s |
| Arriba derecha | Email, ubicación, botón "Descargar CV" | n/a |
| Formulario | Se queda (Web3Forms), sobre surface obsidiana para no perder contraste de inputs | estados actuales |
| Fila de links | Inicio, Proyectos, Studio, YouTube + íconos + "Volver arriba" | hover con subrayado `scaleX` |
| Wordmark | `DC.DEV` gigante en Anton a todo el ancho (el hero ya dice CEVALLOS; el footer firma la marca) | reveal por letra al entrar, 0.6 s, stagger 35 ms |
| Rastro de imágenes | Al mover el mouse sobre el wordmark aparecen capturas reales de proyectos (AVIF ya existentes) que siguen al cursor y se desvanecen | pool de 8 `<img>`, cada una `scale` 0.9 → 1 + `rotate` ±6°, fade 700 ms; solo `pointer: fine`; se dispara cada 80px recorridos |
| Cursor | Patita de la gata dentro del footer | ver Motion Spec |
| Legal | © + "Hecho en Ecuador" | n/a |

Sin video de fondo en el footer (hoy se ve como manchas en modo claro). Reduced-motion: wordmark estático, sin rastro.

## 4. Hero que mira al cursor (referencia: video 3)

**Lo que NO cambia:** layout póster, CEVALLOS gigante, círculo oro, `[DC.dev]` vertical, CTA, badge de la gata.

### 4.1 Técnica: atlas de poses (sin three.js en el bundle)

La cabeza no es 3D en el navegador: es una **hoja de sprites** con poses prerenderizadas y el componente elige el frame según el ángulo del cursor. Es lo que hacen estos heroes; cuesta ~3 KB de JS.

| Paso | Detalle |
|---|---|
| Poses | 7 yaw (-30° a +30°) × 3 pitch (arriba, centro, abajo) = 21 frames + 2 de parpadeo (centro) |
| Formato | Un sprite AVIF ~3150×1800 (≈450 KB) + el frame central suelto como LCP (≈40 KB, igual que hoy) |
| Carga | Frame central con `fetchpriority="high"`; el sprite después de `load` con `requestIdleCallback`; solo en `pointer: fine` |
| Render | `<canvas>` del tamaño del avatar; `drawImage` solo cuando cambia el índice de frame (no por frame de animación) |
| Mapeo | Vector puntero → ancla de la cabeza; `useSpring` sobre x/y normalizados para que la cabeza **pase** por las poses intermedias en vez de saltar; histéresis de 0.15 para no parpadear entre dos frames |
| Parpadeo | Cada 2.5 a 6 s aleatorio, 2 frames, 140 ms total; solo con la cabeza en pose central |
| Touch | Mira hacia donde tocas 1.5 s y vuelve al centro; sin sprite en móvil de gama baja (`navigator.deviceMemory < 4`) |
| Reduced-motion | Frame central estático, sin parpadeo, sin sprite |

### 4.2 Letras que reaccionan (CEVALLOS)

Cada letra tiene una copia oro encima con `opacity` 0. En `pointermove` dentro del hero (rects cacheados con `ResizeObserver`) se calcula la distancia a cada letra: las que están a menos de 160px suben a `opacity` 1 en 120 ms y bajan en 600 ms. Solo opacidad, nada de animar `color`. Las letras tapadas por el avatar también reaccionan porque el cálculo es por distancia, no por hover.

### 4.3 Conflicto con los rayos X

Los dos efectos responden al mismo puntero sobre el mismo elemento y compiten. Opciones: (a) los rayos X pasan a "mantener clic" sobre el avatar (recomendado: se conserva el easter egg), (b) se eliminan, (c) rayos X solo en pose central (duplica los 23 assets, descartado).

### 4.4 Pipeline de assets (decisión pendiente: realista o plastilina)

| Opción | Cómo | Pro | Contra |
|---|---|---|---|
| A. Realista (tu avatar actual) | Higgsfield image-to-video desde `hover_main`: "locked camera, subject slowly turns head left to right then up and down, same lighting, neutral background"; extraer frames con ffmpeg por ángulo; quitar fondo con `remove_background` | Mantiene la identidad actual del hero | La cara puede derivar entre frames; hay que curar a mano |
| B. Plastilina 3D (tu Avatar David de Flow) | Higgsfield `generate_3d` desde la hoja de referencia → GLB; script offline (`scripts/render-head-poses.py`, Blender headless en tu Fedora) renderiza las 23 poses con fondo transparente | Ángulos exactos, consistencia total, fondo limpio, combina con la gata clay y con la referencia | Cambia el hero de realista a cartoon |

Recomendación: **B** si aceptas el cambio de identidad; **A** si el hero debe seguir siendo foto.

## 5. Fases y commits

| Fase | Commits | Verificación |
|---|---|---|
| F0 | `chore: skills (impeccable, motion-design, frontend-design, portfolio-resume)` | lint |
| F1 Cursor | `feat(cursor): punto + anillo con springs` · `feat(cursor): etiquetas contextuales` · `refactor: elimina CatPaw` · `test(cursor): unit + e2e` | 5 checks + capturas |
| F2 Footer | `feat(footer): bloque oro + wordmark` · `feat(footer): rastro de imágenes` · `feat(cursor): patita en el footer` | 5 checks + capturas |
| F3 Hero | `feat(hero): letras reactivas` · `feat(hero): HeadTracker con atlas` (al tener assets) · ajuste rayos X | 5 checks + capturas + Lighthouse |
| F4 Crítica | P0/P1 de la tabla anterior, un commit por grupo | 5 checks + capturas |

Checks antes de cada push: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`.

Tests nuevos: cursor se renderiza con pointer fine, no con coarse ni reduced-motion; cursor nativo visible cuando el custom no existe; rayos X y drag de galería siguen funcionando; HeadTracker muestra frame central con reduced-motion; footer sin rastro en móvil.

Presupuesto: JS inicial hoy 155.3 KB gz. Cursor, rastro y HeadTracker van en chunks `lazy()` que solo bajan en `pointer: fine`; objetivo < 160 KB inicial. CSP sin cambios (todo same-origin, canvas no requiere nada nuevo).
