# personal_web — David Cevallos

Portafolio personal de David Cevallos — IA Engineering & DevSecOps.

## Estructura del proyecto

```
personal_web/
├── frontend/          ← Proyecto Vite + React + TypeScript
│   ├── public/        ← Assets estáticos (imágenes, certs, SVGs)
│   ├── src/           ← Código fuente (componentes, datos, lib)
│   ├── scripts/       ← Scripts de utilidad (gen-favicons.js)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docs/              ← Documentación, reportes y prompts
├── references/        ← Referencias externas
└── .gitignore
```

## Desarrollo

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
cd frontend
npm run build
```

> **Nota:** La carpeta `frontend/dist` es generada por el build y está en `.gitignore`. No commitear.
