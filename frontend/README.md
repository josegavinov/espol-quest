# ESPOL Quest · frontend

React 19 + TypeScript + Phaser 4 sobre Vite 8, empaquetado como PWA.

Las instrucciones de instalación, ejecución y prueba están en el
[README del repositorio](../README.md): requisitos y versiones, «Puesta en
marcha · 2. Frontend» y «Cómo probar el proyecto · B. Probar el frontend».

Resumen de comandos, desde esta carpeta:

```bash
cp .env.example .env   # solo la primera vez
npm install
npm run dev            # http://localhost:5173
npm run lint           # oxlint
npm run build          # tsc -b + vite build
npm run preview        # sirve dist/ para probar la PWA construida
```

El backend debe estar corriendo en el puerto 3000; la URL base se configura en
`VITE_API_URL` dentro de `.env`.
