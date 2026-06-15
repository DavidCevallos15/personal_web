# Sub-Skill: Tailwind CSS v4 — Design System

## Configuración en Vite (NO tailwind.config.js)
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## Entry point CSS
```css
/* src/styles/main.css */
@import "tailwindcss";

@theme {
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
  /* Colores → ver color-palette.md */
}
```

## Clases utilitarias personalizadas frecuentes
```css
@layer utilities {
  .text-balance { text-wrap: balance; }
  .gpu { transform: translateZ(0); will-change: transform; }
  .blur-backdrop { backdrop-filter: blur(16px) saturate(180%); }
}
```

## Regla crítica v4
En Tailwind v4 NO existe tailwind.config.ts.
Toda customización va en @theme dentro del CSS entry.
Las clases se generan desde las variables CSS nativas.
