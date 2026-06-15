# Sub-Skill: Generación de Favicons

## Pipeline recomendado (sin dependencias pesadas)
1. Crear SVG maestro 512×512 en assets/brand/logo.svg
2. Usar sharp en script Node para generar PNG en 16/32/48/180/192/512px
3. Generar favicon.ico multi-size con ico-endec
4. Registrar en index.html

## Comandos
```bash
npm install -D sharp ico-endec
node scripts/gen-favicons.js
```

## Meta tags mínimos (index.html)
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0A0A0F">
```
