import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';
import JavaScriptObfuscator from 'javascript-obfuscator';
import type { Plugin } from 'vite';

/**
 * Obfuscates emitted JS chunks in production builds only.
 * Ported unchanged from the previous vite.config.ts.
 */
function obfuscatePlugin(): Plugin {
  return {
    name: 'obfuscate-bundle',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      if (process.env.SKIP_OBFUSCATION === '1') return;
      for (const file of Object.values(bundle)) {
        /* Vendor-only chunks (react-dom, react, workbox) are public open-source code — obfuscating
         * them protects nothing, yet it more than doubled react-dom (184KB → 422KB) and its
         * base64 string-array decoding added ~1.5s of mobile Total Blocking Time in Lighthouse.
         * Only chunks containing at least one of our own modules are obfuscated. */
        const isVendorOnly =
          file.type === 'chunk' &&
          file.moduleIds.length > 0 &&
          file.moduleIds.every((id) => id.includes('/node_modules/') || id.startsWith('\0'));
        if (file.type === 'chunk' && file.fileName.endsWith('.js') && !isVendorOnly) {
          const result = JavaScriptObfuscator.obfuscate(file.code, {
            compact: true,
            /* `stringArray`'s runtime needs a reference to the global object, and by default gets
             * it via a `Function('return this')()`-style construction — which our CSP's
             * `script-src` (correctly, no `'unsafe-eval'`) blocks. The obfuscator already wraps
             * that call in try/catch with a `window` fallback (functionality was never actually
             * broken — confirmed via a real headless-browser load with zero console/page errors),
             * but Chrome still logs it as a blocked-eval "Issue" on every single chunk, which is
             * exactly what Lighthouse's Best Practices `inspector-issues` audit dings. `target:
             * 'browser-no-eval'` is the obfuscator's own purpose-built output mode for strict-CSP
             * sites like this one — same string-array protection, no eval/Function construction
             * at all, instead of us weakening the CSP with 'unsafe-eval' to silence a warning we
             * caused ourselves. */
            target: 'browser-no-eval',
            /* controlFlowFlattening + deadCodeInjection were the dominant size cost — together they
             * inflated one chunk from 184KB to 1.44MB (verified via SKIP_OBFUSCATION=1 comparison).
             * Dropped for load speed.
             * selfDefending, numbersToExpressions and stringArrayCallsTransform were then found to be
             * the dominant *runtime* cost instead of size: selfDefending runs continuous tamper/
             * formatting self-checks, numbersToExpressions re-derives every number literal via
             * arithmetic on each execution (this app re-runs numeric-heavy code every animation
             * frame — cursor follower, card tilt), and stringArrayCallsTransform/chained-calls add an
             * extra indirection layer per string access. All three inflate mobile Total Blocking
             * Time for no size benefit, so they're off. hexadecimal identifiers + a shuffled/rotated
             * base64 string array (with a longer split-chunk length, since short chunks meant more
             * runtime concatenation per string) still keep the output meaningfully harder to read
             * than plain minification — just without paying for it on every frame. */
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: false,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 30,
            stringArray: true,
            stringArrayCallsTransform: false,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: false,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: 'variable',
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false,
          });
          file.code = result.getObfuscatedCode();
        }
      }
    },
  };
}

export default defineConfig({
  output: 'static',
  /* Single-page site: inlining the one stylesheet removes the render-blocking CSS round trip that
   * Lighthouse measured at ~1.1s of mobile FCP/LCP delay. style-src already allows inline styles. */
  build: { inlineStylesheets: 'always' },
  integrations: [
    react(),
    {
      // `client:intent` — see src/directives/intent.ts
      name: 'client-intent-directive',
      hooks: {
        'astro:config:setup': ({ addClientDirective }) => {
          addClientDirective({ name: 'intent', entrypoint: './src/directives/intent.ts' });
        },
      },
    },
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,svg,png,webp,avif,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'lsrr-pages',
              networkTimeoutSeconds: 4,
            },
          },
          {
            urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'lsrr-assets' },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lsrr-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: false, // manifest.json is hand-authored in public/
      includeAssets: ['assets/img/*.svg', 'assets/img/favicon-*.png'],
    }),
  ],
  vite: {
    plugins: [obfuscatePlugin()],
    build: {
      target: 'es2022',
      sourcemap: false,
    },
  },
});
