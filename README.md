# Portafolio Tecnológico - Lain Sthid Ramirez Rueda

Este repositorio contiene mi portafolio profesional como **Analista y Desarrollador de Software**.

## 🚀 Sobre el Proyecto

Un portafolio moderno, responsivo y de alto impacto, diseñado con un enfoque en la experiencia de usuario (UX) y el rendimiento.

### Tecnologías Utilizadas:
- **Astro (SSG)** + **React 19 + TypeScript** (strict) como isla hidratada
- **CSS3** (custom properties, Material Design 3 & Motion)
- **Vitest + Testing Library** (pruebas)
- **@vite-pwa/astro** (PWA / Service Worker offline-first)
- **i18n** (Soporte bilingüe Español/Inglés, tipado)
- **Vercel** (Despliegue y optimización)

## 📂 Estructura del Repositorio

- `src/pages/index.astro`: Entry point de Astro (mantiene meta/OG/JSON-LD estáticos; pre-renderiza `<App>` a HTML real).
- `/src`: Código fuente — componentes, hooks, contexts, i18n, estilos y datos.
- `/public`: Assets estáticos servidos tal cual (imágenes, PDFs, manifest).
- `vercel.json`: Configuración de despliegue y cabeceras de seguridad.

## 🛠️ Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build       # build de producción (dist/)
npm run test        # pruebas (Vitest)
npm run typecheck   # verificación de tipos
npm run lint         # ESLint
```

## 🌐 Despliegue

Puedes ver el portafolio en vivo aquí: [lainramirez.vercel.app](https://lainramirez.vercel.app/)

---
Diseñado y desarrollado por [Lain Sthid Ramirez Rueda](https://github.com/Lain-Sthid-Ramirez-Rueda).
