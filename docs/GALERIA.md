# Cómo agregar fotos a la Galería de arte IA

La galería no necesita panel de administrador: lee las imágenes del repo en cada build.
El contador ("N piezas generadas con Gemini") y el carrusel se actualizan solos.

## Pasos (Fedora)

```bash
cd frontend

# 1. Copia los originales (PNG, JPG o WebP) a la carpeta de la galería.
#    Usa el siguiente número libre para mantener el orden: ai-80.png, ai-81.png...
cp ~/Descargas/mi-imagen.png media-src/gallery/ai-80.png

# 2. Genera las versiones optimizadas (miniatura WebP ~25 KB + versión completa)
#    y actualiza src/data/generated/media.json con medidas reales (sin saltos de layout).
npm run media

# 3. Revisa en local y sube
npm run dev
git add media-src/gallery public/media/gallery src/data/generated/media.json
git commit -m "feat(galeria): agrega nuevas piezas"
git push
```

Vercel publica el cambio al hacer push a `main` (o en el preview del PR).

## Notas

- El orden de la galería es alfabético por nombre de archivo (`ai-00`, `ai-01`...).
- Para quitar una pieza: borra el archivo de `media-src/gallery/` y sus dos versiones en
  `public/media/gallery/` (`-thumb.webp` y `-full.webp`), luego `npm run media -- --force`.
- No subas imágenes con marcas de terceros ni fotos de otras personas sin permiso.
- Si algún día quieres subir fotos desde el navegador sin tocar código, la opción es un
  bucket de Supabase Storage + una tabla `gallery` con una página `/admin` protegida.
  Es más infraestructura (auth, CSP, moderación) para algo que hoy se resuelve en 3 comandos.
