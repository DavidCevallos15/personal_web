---
name: personal_web
version: 1.0.0
author: Jimmy David Cevallos Zambrano
stack: React 18 + Vite 5 + Tailwind v4 + GSAP + Framer Motion
environment: Fedora Linux / Node 20 LTS
freedom: low
---

# personal_web — Agent Skill Master

## Propósito
SPA de portafolio premium. Autoridad técnica en IA Engineering y DevSecOps.
Prohibido generar código fuera del stack declarado.

## Inicialización segura (ejecutar en orden)
```bash
node -v                          # Verificar Node 20 LTS
npm create vite@latest src -- --template react-ts
cd src && npm install
npm install -D tailwindcss@next @tailwindcss/vite
npm install gsap @gsap/react framer-motion
npm install -D @types/gsap
```

## Reglas absolutas (low-freedom)
1. NUNCA usar Create React App, Next.js, o Webpack
2. NUNCA instalar Tailwind v3 — solo v4 con plugin @tailwindcss/vite
3. GSAP controla scroll (ScrollTrigger). Framer Motion controla estados UI
4. Toda animación debe respetar prefers-reduced-motion
5. Antes de escribir código consultar references/ según dominio

## Mapa de referencias (cargar bajo demanda)
- Diseño visual → references/ARQUITECTURA.md
- Sistema de color → references/color-palette.md
- Animaciones → references/interaction-design.md
- Tailwind config → references/tailwind-design-system.md + tailwind-v4-shadcn.md
- Favicons → references/favicon-gen.md
- Identidad comercial → references/PLAN.md

## Firma de autor (obligatoria en cada módulo generado)
```js
/**
 * @author Jimmy David Cevallos Zambrano
 * @project personal_web v1.0.0
 * @integrity SHA256:<hash-del-archivo>
 * @license Propietario — Prohibida reproducción sin autorización
 */
```
