# Sub-Skill: Paleta de Color — Tailwind v4

## Reglas de aplicación
- Fondo base: --color-obsidian (#0A0A0F)
- Superficies: --color-void y --color-surface para elevación z
- Acentos: NUNCA usar ambos en el mismo componente visible
  - --color-accent-primary (#7C6FF7) → CTAs, links activos, selección
  - --color-accent-electric (#4DFFDB) → Tags técnicos, highlights de código
- Texto: primario en --color-text-primary, secundario en --color-text-muted
- Semántico: danger rojo (#FF4D6D), success verde (#4DFFB4)

## Contraste mínimo (WCAG AA)
- Texto sobre --color-obsidian: ratio mínimo 4.5:1
- --color-text-primary sobre --color-obsidian: ratio ~14:1 ✓
- --color-text-muted sobre --color-surface: ratio ~4.8:1 ✓

## Uso en Tailwind v4
```css
/* En main.css */
@import "tailwindcss";
@theme {
  --color-obsidian: #0A0A0F;
  /* ... resto de tokens */
}

/* En componentes */
<div class="bg-obsidian text-text-primary border border-border">
```
