/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/react" />

// `client:intent` — custom hydration directive registered in astro.config.ts (src/directives/intent.ts)
declare namespace Astro {
  interface ClientDirectives {
    'client:intent'?: boolean;
  }
}
