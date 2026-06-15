# Arquitectura y Design Tokens — personal_web

## Identidad visual
- Personalidad: Precision Engineering + Editorial Dark
- Tipografía display: Geist Mono (JetBrains Mono como fallback)
- Tipografía body: Inter Variable (system-ui fallback)
- Escala tipográfica: 12 / 14 / 16 / 20 / 28 / 40 / 56 / 72px

## Paleta base (Tailwind v4 @theme)
```css
@theme {
  --color-obsidian: #0A0A0F;
  --color-void: #13131A;
  --color-surface: #1C1C26;
  --color-border: #2A2A38;
  --color-accent-primary: #7C6FF7;
  --color-accent-electric: #4DFFDB;
  --color-text-primary: #F0EFF5;
  --color-text-muted: #8B8A9B;
  --color-danger: #FF4D6D;
  --color-success: #4DFFB4;
}
```

## Grid system
- Layout: 12 columnas, gap 24px, max-width 1440px
- Breakpoints: mobile 375px | tablet 768px | desktop 1280px | wide 1440px+
- Secciones: padding vertical 120px desktop / 80px mobile

## Estructura de archivos /src
```
src/
├── components/
│   ├── layout/      # Navbar, Footer, Layout
│   ├── sections/    # Hero, Works, Certs, Contact
│   └── ui/          # Button, Tag, Card, Modal
├── hooks/           # useScrollTrigger, useMousePosition, useInView
├── lib/             # gsap-config.ts, motion-variants.ts
├── assets/          # Imágenes procesadas, SVGs optimizados
└── styles/          # main.css con @theme, globals
```
