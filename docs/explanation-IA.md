# Repository Architecture & Technical Specifications [AI-ONLY]
This document provides a formal, logical, and mathematically structured explanation of the codebase for AI agents, LLMs, and compiler agents interacting with this repository.

---

## 📐 1. Graph Representation of File Hierarchy

**⚠️ Superseded (Phase 12):** the tree below described the pre-migration static-site layout (`css/`, `js/`, hand-rolled `sw.js`, `build.js`). The repository is now a Vite + React 19 + TypeScript SPA. See §6 for the current authoritative hierarchy; this section is retained only as historical record of $G_{v1}$.

Let $G = (V, E)$ represent the directory tree structure where $V$ represents the files/folders and $E$ represents the parent-child file relationships:

```mermaid
graph TD
    Root["/ (Root Directory)"]
    Assets["assets/ (Static assets)"]
    CSS["css/ (Styling sheets)"]
    JS["js/ (Execution scripts)"]
    Docs["docs/ (Documentation)"]
    
    Root --> Assets
    Root --> CSS
    Root --> JS
    Root --> Docs
    
    Root --> GEMINI["GEMINI.md (AI Context & Workflow)"]
    Root --> IndexHTML["index.html (Core DOM structure)"]
    Root --> ManifestJSON["manifest.json (PWA definitions)"]
    Root --> VercelJSON["vercel.json (Server/CDN headers)"]
    Root --> Headers["_headers (Edge headers fallback)"]
    Root --> Robots["robots.txt (Crawler directives)"]
    Root --> Sitemap["sitemap.xml (SEO index map)"]
    Root --> SW["sw.js (Caching Service Worker)"]
    
    Assets --> Img["img/ (Images & favicons)"]
    CSS --> StyleCSS["style.css (Custom design tokens)"]
    JS --> MainJS["main.js (Dynamic logic module)"]
    JS --> I18nJS["i18n.js (Localization maps)"]
    Docs --> ExpIA["explanation-IA.md"]
    Docs --> ExpLain["explanation-LAIN.md"]
```

---

## ⚡ 2. Performance & Optimizations Model

### 2.1. DOM Paint Latency & Payload Weight Reduction
The initial page load size $W_{total}$ is modeled as the sum of all resources blocking the critical rendering path:

$$W_{total} = W_{HTML} + W_{CSS} + W_{JS} + W_{assets}$$

Prior to optimizations, $W_{HTML} = 134\text{ KB}$ due to an inline base64 image $I_{b64}$ of size $99\text{ KB}$ embedded directly into the DOM structure. By extracting $I_{b64}$ into a physical file `assets/img/profile.png` loaded asynchronously, the weight was reduced to:

$$W_{HTML\_opt} = W_{HTML} - |I_{b64}| = 36\text{ KB}$$

This satisfies the performance budget constraint $W_{HTML} \le 64\text{ KB}$, ensuring a rapid Time to Interactive (TTI).

### 2.2. CSS Rendering Optimization
To prevent main-thread layout bottleneck during page rendering, sections off-screen are optimized using the CSS containment property, guarded by `@supports` for progressive enhancement (single canonical declaration at lines 169-177):

```css
@supports (content-visibility: auto) {
  .about, .skills, .projects, .contact {
    content-visibility: auto;
    contain-intrinsic-size: 0 600px;
  }
}
```
This forces the browser to bypass layout calculations and painting of these containers until they approach the viewport margin, reducing initial paint time $T_{paint}$ by:

$$\Delta T_{paint} \propto \sum_{i \in \text{Offscreen}} \text{Layout Complexity}(i)$$

### 2.3. Dead Code & Duplication Cleanup
A cleanup pass removed ~20 lines of dead or duplicate CSS:
- **Dead `font-display` property**: `font-display` is a `@font-face` descriptor; applying it to `.hero-title`, `.section-title`, `.project-title` had zero effect. The `?display=swap` parameter in the Google Fonts URL handles this.
- **Dead selectors `.chip-react`, `.chip-node`**: No matching HTML elements exist in the DOM.
- **Duplicate `content-visibility`**: Was declared twice; consolidated into the `@supports` guard above.
- **Duplicate `will-change: transform`**: Was declared twice for `.profile-card`, `.float-chip`, `.hero-orb`; consolidated into section 2 (lines 180-186).
- **Duplicate `prefers-reduced-motion`**: Was declared twice; consolidated into the comprehensive rule at lines 189-204.

---

## 🔍 3. SEO (Search Engine Optimization) Mathematical Model

### 3.1. Text-to-HTML Ratio Constraints
Let $C_{text}$ be the character count of visible content and $C_{HTML}$ be the character count of HTML tags. Google indexers prioritize pages satisfying the minimum content density:

$$\rho_{text} = \frac{C_{text}}{C_{HTML}} \ge 0.15 \quad \land \quad N_{words} \ge 500$$

Expanding translations in `js/i18n.js` yielded $N_{words\_es} = 590$, satisfying the minimum crawling threshold.

### 3.2. Title and Description Length Boundary Conditions
Meta titles ($L_{title}$) and description string lengths ($L_{desc}$) are bounded to fit search engine results page (SERP) snippets without truncation:

$$L_{title} \in [50, 60] \text{ characters} \quad (\text{Current: } 58)$$
$$L_{desc} \in [120, 160] \text{ characters} \quad (\text{Current: } 122)$$

---

## 🛡️ 4. Security Policy & Hardening Specifications

All HTTP headers are configured edge-side via `vercel.json` to defend against key vector attacks. The security configuration satisfies:

### 4.1. Frame Ancestors Constraint (Clickjacking defense)
$$\text{FrameAncestors} = \emptyset \implies \text{X-Frame-Options: DENY}$$
Additionally, a frame-breaking fallback script is executed in `main.js`:
$$\text{if } (\text{window.top} \neq \text{window.self}) \implies \text{window.top.location} \leftarrow \text{window.self.location}$$

### 4.1.5. SEO, Accessibility & Caching Enhancements (Phase 1 Update)
*   **Dynamic Localization**: The `i18n.js` module dynamically mutates `document.title` and `<meta name="description">` to match the active language state (`lang`).
*   **ARIA attributes**: Toggle buttons translate their `aria-label` via a custom `data-i18n-aria` attribute hook to ensure screen readers announce the correct language context.
*   **Hreflang Tags**: Alternate language URLs explicitly mapped in `<head>` for indexing bots.
*   **Cache Busting**: `/sw.js` cache versioned as `v2` for busting stale immutable assets.

### 4.2. Content Security Policy (CSP) Directives
The CSP is specified to restrict execution scopes, preventing Cross-Site Scripting (XSS):
$$\text{CSP} = \{ \text{default-src: 'self'}, \text{script-src: 'self' } \cup \mathcal{S}_{trusted}, \text{style-src: 'self' 'unsafe-inline' } \cup \mathcal{T}_{fonts}, \text{frame-src: 'self' } \cup \mathcal{F}_{embeds} \}$$
Where:
- $\mathcal{S}_{trusted} = \{ \text{https://cdnjs.cloudflare.com}, \text{https://fonts.googleapis.com}, \text{https://cdn.vercel-insights.com} \}$
- $\mathcal{T}_{fonts} = \{ \text{https://fonts.googleapis.com} \}$
- $\mathcal{F}_{embeds} = \{ \text{https://proassist-r1q6.onrender.com} \}$ — **(Phase 12 fix)** `frame-src` was previously undeclared, so it fell back to `default-src 'self'`, silently blocking the ProAssist live-demo `<iframe>` in `LiveDemoDialog.tsx` in production. Now declared identically across `index.html`'s meta tag, `vercel.json`, and `_headers`.
- `formsubmit.co` was previously present in `connect-src`/`form-action` for a `ContactForm` module that had no corresponding DOM element (`#contact-form` never existed in `index.html`) — confirmed dead code and removed from both the CSP and the component tree (§6.4).

---

## ⚙️ 5. Offline Caching State Machine & Auto-Update Mechanism

**⚠️ Implementation superseded (Phase 12):** the hand-written `sw.js` described below no longer exists. The *strategy* (network-first for navigations, cache-first/SWR for static assets, auto-reload on new SW activation) is preserved conceptually but is now generated by `vite-plugin-pwa` (Workbox `generateSW` strategy) — see §6.6. The state machine below remains accurate as a description of runtime caching *behavior*, not of the current source file.

The Service Worker defined in `sw.js` controls resource interception using a strict dual caching strategy designed to eliminate stale asset retention:

```mermaid
stateDiagram-v2
    [*] --> InstallState : SW Registered
    InstallState --> PrecacheCritical : Cache CACHE_NAME ('lsrr-portfolio-v5')
    PrecacheCritical --> ActivateState : skipWaiting()
    ActivateState --> ClearOldCaches : Delete caches != [CACHE_NAME, ASSETS_CACHE]
    ClearOldCaches --> FetchInterceptor
    
    state FetchInterceptor {
        [*] --> InterceptRequest
        InterceptRequest --> IsCode : Match Accept HTML OR .css/.js OR manifest?
        IsCode --> NetworkFirst : Yes (Code & Structure)
        IsCode --> IsAsset : No
        IsAsset --> CacheFirst : Yes (Images, Fonts)
        
        state NetworkFirst {
            [*] --> QueryNetwork
            QueryNetwork --> UpdateCache : Success (Always Fresh)
            QueryNetwork --> OfflineFallback : Failure (Fetch from local cache)
        }
        
        state CacheFirst {
            [*] --> CheckLocalCache
            CheckLocalCache --> ServeCached : Hit
            CheckLocalCache --> QueryNetworkAsync : Miss
        }
    }
```

- **Code & Structure (HTML, CSS, JS, Manifest) -> Network-First:** Guarantees indexers and users always receive the newest DOM state and styling if connected, falling back to cached versions only on network disconnect. This resolves stale "ghost" caches.
- **Media Assets (Images, Fonts) -> Cache-First + Background Update:** Serves large binary files instantly from cache, updating in the background to ensure next-visit consistency.
- **Auto-Update Mechanism:** When a new `sw.js` is detected and installed, it immediately calls `skipWaiting()`. `main.js` listens for the `controllerchange` event and triggers a seamless `window.location.reload()`, ensuring the user is immediately transitioned to the new version without manual intervention.

- **Custom Branding Styling (Phase 5 Update)**: Reverted the navbar logo back to the text `[LSRR]`. Styled the 3D orbit core logo (`.orbit-center`) using pure CSS (`background: #000000;`, `color: #FFFFFF;`, `font-family: 'Space Grotesk'`) to match the user's reference image style without relying on raster images. Generated a crisp vector SVG (`favicon.svg`) with the same black background and white `LR` text for infinite resolution. `sw.js` cache bumped to `v7`.
  - **Backup**: Pre-upgrade snapshot saved to `backup_promax/` for instant rollback if needed.
- **Tablet Responsive Logic**: Adjusted CSS `@media (max-width: 1024px)` to activate the `.bottom-bar` navigation and hide `.nav-links`. This resolves previous Hamburger UI redundancy and provides a flawless app-like Dock experience on iPad/Tablet screens.
- **Build Architecture & High Security Obfuscation**: Transitioned from a pure static repository to a build-step repository using Node.js (`npm`).
  - **Source Code**: Readable, well-documented source files now reside in `src/js/` and `src/css/`.
  - **Build Process**: `build.js` executes `javascript-obfuscator` and `clean-css-cli`.
  - **Obfuscation**: JS is compiled with strict protections: `controlFlowFlattening`, `stringArrayEncoding (rc4)`, `deadCodeInjection`, and `debugProtection` (crashes DevTools when attackers try to inspect the logic).
  - **Deployment**: Vercel automatically runs `npm run build` targeting `package.json` before serving the root directory, ensuring that `js/` and `css/` are always overwritten with highly secure, unreadable payloads on the live site while preserving `src/` for the developer.

- **Skills Bento Grid Rebalance & IA Card Enhancement (Phase 6)**:
  - **Grid change**: `grid-template-columns` reverted from `repeat(4, 1fr)` (asymmetric `span 3 + span 1`) to `repeat(2, 1fr)` (symmetric `span 1` for all 4 children). This eliminates the disproportionate 75%/25% desktop split on `.skill-category:nth-child(3)` / `:nth-child(4)`.
  - **IA card accent**: `.skill-category:nth-child(3)` receives `background: linear-gradient(135deg, surface-2, color-mix(primary 6%, surface-2))` and `border-color: color-mix(primary 30%, border)` to visually distinguish it without breaking the design system.
  - **Decorative watermark**: `::before` pseudo-element on `:nth-child(3)` renders the Font Awesome `\f544` (fa-robot) glyph at `6rem / opacity: 0.04` — purely cosmetic, `pointer-events: none`, `user-select: none`.
  - **Hover glow**: `:nth-child(3):hover` adds `box-shadow: 0 8px 40px color-mix(primary 18%, transparent)` for a themed depth effect.
  - **Pill stagger animation**: `.skill-tag-pill` now enters with `animation: pill-enter 0.4s forwards` (opacity 0→1, translateY 8px→0). Delays are scoped to `nth-child(3) .skill-tag-pill:nth-child(n)` at 50ms increments (50ms–400ms).
  - **Mobile reset**: `@media (max-width: 768px)` overrides `.skill-category:nth-child(3)` back to `background: surface-2` and resets `border-color` to prevent color-mix artifacts; `::before` font-size reduced to `4rem`.
  - **Tablet**: `@media (max-width: 1024px)` already used 2-col equal-span — comments updated for clarity.

- **Industry Best Practices Audit & Sprint 1+2 Implementation (Phase 7)**:
  - **XSS fix — ToastManager**: `toast.innerHTML = \`...\`` replaced with `document.createElement` + `textContent`. Dynamic message strings can no longer inject HTML. `addEventListener('animationend', ..., { once: true })` prevents event listener leaks.
  - **RAF loop optimization — CustomCursor**: Loop now uses a `running` boolean flag + early return when `|cx - fx| < 0.5 && |cy - fy| < 0.5`. Saves ~60 calls/s when cursor is idle. `startLoop()` guard prevents duplicate RAF chains.
  - **pill-enter animation scoped correctly**: Pills changed from `opacity: 0` (global) → `opacity: 1` (global default). The `animation: pill-enter` is now scoped to `.skill-category.visible .skill-tag-pill` — only fires after the IntersectionObserver adds `.visible` to the parent. Prevents invisible pills on cards that haven't entered the viewport.
  - **`prefers-reduced-motion` override**: Added explicit `{ opacity: 1 !important; transform: none !important; animation: none !important; }` for `.skill-tag-pill` inside the `@media (prefers-reduced-motion: reduce)` block — overrides the scoped animation.
  - **hreflang corrected**: Removed duplicate `hreflang="es"` and `hreflang="en"` links pointing to the same canonical URL. Per Google's multi-regional/multilingual guidelines, a single-URL SPA with client-side i18n should only declare `hreflang="x-default"`. Duplicate same-URL alternates cause Google to arbitrarily pick a language signal.
  - **`color-scheme` meta**: `<meta name="color-scheme" content="dark light">` added. Allows browsers to style native UI elements (scrollbars, form inputs, `<select>`, `<date>`) with OS-matched dark/light rendering. Complement to `data-theme` CSS attribute.
  - **`aria-modal="true"` on `<dialog>`**: Explicit attribute added. While the native `<dialog>` element has implicit ARIA role `dialog`, adding `aria-modal="true"` ensures compatibility with AT (Assistive Technologies) that don't fully implement the implicit semantics, particularly NVDA + Firefox and older VoiceOver versions.
  - **Google Fonts `display=swap`**: URL already contained `display=swap` — confirmed correct. Prevents FOIT by showing fallback font while custom font loads (font-display: swap behavior).
  - **DOM order fix — bottom-bar**: `<nav class="bottom-bar">` moved before `<footer>` in source order. Correct semantic order: `<main>` → navigational chrome (`<nav>`) → `<footer>`. Screen readers and AT navigate by source order, not visual position.
  - **Dead code isolation**: `ContactForm` module retained but `init()` returns early on `if (!form) return` since `#contact-form` was removed from HTML when the orbit animation replaced the contact form. No execution overhead.
  - **Folder Restructuring & Build system**: Removed the obsolete `/src` folder, directing `build.js` to construct `public/` directly from root `css` and `js` source files, complying with the stated structural rule and eliminating duplication.
  - **WCAG AAA Compliance**: Injected `:focus-visible` UI state improvements in `css/style.css` matching WCAG AAA contrast ratio requirements (3px solid cyan outline with offset). Corrected primary buttons contrast for readability (#0B0D12 on cyan).
  - **Fluid Typography (Chrome UX)**: Leveraged CSS `clamp()` capabilities to map `font-size` adaptively to viewport width instead of discrete breakpoints. Integrated `prefers-reduced-motion` override.

### 4.1.6. Pro Max Cache & UI Enhancements (Phase 8 Update)
*   **Stale-While-Revalidate Caching**: `sw.js` upgraded to `Stale-While-Revalidate` for all requests, ensuring instant load times (cache-first delivery) combined with background network synchronization to update the cache for the next reload. Cache version bumped to `v8`.
*   **Proactive Auto-Update Sync**: In `main.js`, an event listener for `visibilitychange` triggers `reg.update()` whenever the tab becomes visible, forcing the browser to check for Service Worker byte-level changes and initiating an auto-refresh via the controllerchange listener without user intervention.
*   **Universal 3D Tilt**: `CardTilt` logic generalized to apply a 3D perspective rotation (`perspective(1000px) rotateY/X`) to `.project-card`, `.about-card`, and `.cert-item-card`, enhancing spatial depth.
*   **Interactive Neural Canvas**: Added a `HeroCanvas` module that dynamically renders an interactive, physics-based 3D particle network (constellation effect) in the hero section, replacing the static CSS grid for a PRO MAX visual experience.

### 4.1.7. Smart Prefetch & Contact Section Redesign (Phase 9 Update)
*   **SmartPrefetch Module**: Replaced `injectPerfHints` IIFE with a proper `SmartPrefetch` singleton. Uses a two-tier strategy: `IntersectionObserver` (`rootMargin: 50px`) triggers `preconnect` + `dns-prefetch` for external link origins when they enter the viewport, and `mouseenter`/`touchstart` events trigger a full `prefetch` `<link>` injection on user intent. Deduplication via `Set`. Respects `connection.saveData` and `2g` effective type via the Network Information API.
*   **Contact Section Redesign**: Replaced `.hero-socials` + `.social-chip` pattern in the contact section with a `.contact-links-grid` (2-col grid) of `.contact-link-card` components. Each card contains a branded `.clc-icon`, `.clc-label`, `.clc-sub`, and a `.clc-arrow` that animates on hover. Brand-specific RGBA backgrounds applied per platform (WhatsApp #25D366, LinkedIn #0A66C2, etc.).
*   **Copy Change**: Removed trailing clause "— mi línea siempre está abierta" from `contact.desc` in `index.html`.

### 4.1.8. Interactive AI Suite & Full UX Upgrade (Phase 10 Update)
*   **Interactive AI Terminal CLI (`AITerminal`)**: Integrated a retro-futuristic AI CLI modal (`#terminal-dialog`) launched via Hero button (`#btn-open-terminal`). Built with full keyboard controls (`Esc` to close, auto-focus input, command history auto-scroll). Supports interactive commands: `help`, `bio`, `stack`, `projects`, `contact`, `ai`, `clear`, `date`, `whoami`, and `exit` with custom prompt formatting (`visitor@lsrr-agent`).
*   **Project Deep-Dive Modals (`ProjectDetailModal`)**: Added a "Ver detalles" button to every project card launching a detailed breakdown dialog (`#project-modal`). Dynamically populates problem statements, architecture choices (Offline-First, LLaMA 3.3-70B + Groq API + Docker), key technical metrics, and direct live/repo CTAs.
*   **One-Click Copy to Clipboard (`CopyManager`)**: Embedded inline copy buttons (`.clc-copy-btn`) within contact cards for Email (`lainramirez18@gmail.com`) and WhatsApp/Phone (`+57 3209735859`). Executes `navigator.clipboard.writeText` with immediate bilingual Toast feedback (`ToastManager.show()`).
*   **Interactive Skills Filter (`SkillsFilterManager`)**: Added a category filter pill bar (`.skills-filter-wrap`) in the `#skills` section. Enables real-time filtering across `all`, `frontend`, `backend`, `ai`, `tools`, and `soft` categories using `.filtered-out` CSS state mapping.
*   **Animated Counter Statistics (`CounterAnim`)**: Instrumented `.stat-number[data-counter]` with an `IntersectionObserver` trigger that smoothly animates target metric counters upon viewport entrance.
*   **Security CSP Consolidation**: Synchronized Content Security Policy declarations across `vercel.json`, `_headers`, and `<meta http-equiv="Content-Security-Policy">` in `index.html` ensuring strict multi-origin compatibility for `formsubmit.co`, `vercel-insights.com`, `cdnjs.cloudflare.com`, and `fonts.googleapis.com`.
*   **Accessibility & ARIA Audit**: Enforced `aria-hidden="true"` on 3D orbit nodes and added semantic `aria-label` tags for screen readers.

### 4.1.9. Next-Gen Assets, Cert Viewer, Live Demo, PWA Status & Sound Design (Phase 11 Update)

*   **Next-Gen Image Optimization (`<picture>` + WebP + AVIF)**: Converted `profile.png` (72 KB) → `profile.webp` (10 KB, -86%) and `profile.avif` (11 KB, -85%). Converted `og-image.jpg` (535 KB) → `og-image.webp` (42 KB, -92%) and `og-image.avif` (35 KB, -93%). HTML updated to use `<picture>` element with cascading `<source>` declarations (`image/avif` → `image/webp` → PNG fallback), enabling automatic browser-native selection of the most efficient format. `<link rel="preload">` updated to reference `profile.webp` with explicit `type="image/webp"`.

*   **Certificate Viewer Modal (`CertViewer`)**: Native `<dialog id="cert-modal">` modal activated by `.btn-view-cert` buttons on each `.cert-item-card`. Lazy-loads PDF via `<iframe src="…#toolbar=0&view=FitH">` with an animated ring loader. Implements a 10-second fallback timeout: if the browser blocks PDF embedding (sandbox or CORS), the modal transitions gracefully to a LinkedIn deep-link fallback panel. Download button (`<a download>`) is dynamically bound to the cert URL; hidden when no PDF is available.

*   **Live Demo Preview Modal (`LiveDemoModal`)**: `<dialog id="demo-modal">` renders a fully functional browser-chrome simulation (macOS-style window dots, fake URL bar, external link control). Triggered by `.btn-project-demo` buttons. Iframe `src` is assigned with an 80ms render delay (lazy injection after dialog paint) to avoid CLS. A 60-second cold-start timeout auto-hides the loading spinner, accounting for Render free-tier container wake times. On viewports < 520px, falls back to `window.open()` to prevent iframe UX degradation on mobile.

*   **Network / PWA Status Badge (`NetworkStatus`)**: Footer-mounted live indicator using `navigator.onLine` + `window.addEventListener('online' | 'offline')`. LED indicator uses CSS `box-shadow` pulse animation on offline state. Text updates bilingually from the i18n dictionary. On offline transition, triggers a `ToastManager.show()` notification. On reconnection, shows "Conexión restablecida" toast.

*   **Sound Design via Web Audio API (`SoundDesign`)**: Synthesizes UI micro-sounds in real-time using `AudioContext` (zero-byte footprint — no audio file downloads). Implements 7 named presets: `click`, `modalOpen`, `modalClose`, `toast`, `terminal`, `themeToggle`, `copy`. Each preset is a carefully tuned `OscillatorNode` → `GainNode` chain with exponential gain ramp-down for natural decay. Disabled by default (`aria-pressed="false"`), stored in `localStorage` key `lain-sound-enabled`. Proxies `ToastManager.show()` to inject `sounds.toast()` on every notification without modifying the ToastManager source.

---

## 🧬 6. Phase 12: React 19 + TypeScript + Vite Migration

The site was rewritten from a vanilla HTML/CSS/JS SPA with a hand-rolled build (`build.js`) into a **statically-typed, component-based SPA**: Vite 8 + React 19 + TypeScript (strict mode). This is an architectural change, not a visual redesign — `src/styles/global.css` is a near-verbatim port of `css/style.css` (same custom-property tokens, same class names), so $G_{DOM}$ is structurally isomorphic to $G_{v1}$ while the *generation mechanism* of that DOM moved from imperative `querySelector`/`innerHTML` mutation to declarative JSX reconciliation.

### 6.1. Current File Hierarchy $G_{v2}$

```mermaid
graph TD
    Root["/ (Root)"]
    Root --> IndexHTML["index.html (Vite entry — <head> unchanged: meta/OG/JSON-LD/CSP)"]
    Root --> ViteConfig["vite.config.ts (React plugin, PWA plugin, obfuscation plugin)"]
    Root --> TSConfigs["tsconfig*.json (strict, project-referenced)"]
    Root --> ESLintConfig["eslint.config.js (flat config)"]
    Root --> Public["public/ (Vite passthrough — no hashing)"]
    Root --> Src["src/"]
    Root --> Docs["docs/"]

    Public --> PubManifest["manifest.json, robots.txt, sitemap.xml"]
    Public --> PubAssets["assets/img/*, assets/docs/*.pdf"]

    Src --> MainTsx["main.tsx (ReactDOM.createRoot + virtual:pwa-register)"]
    Src --> AppTsx["App.tsx (composes providers + sections + dialogs)"]
    Src --> Styles["styles/global.css (ported CSS, bugs fixed)"]
    Src --> I18n["i18n/ (translations.ts + LangContext.tsx)"]
    Src --> Contexts["contexts/ (Theme, Sound, Toast, Dialogs)"]
    Src --> Hooks["hooks/ (12 custom hooks — see §6.3)"]
    Src --> Components["components/ (layout/, sections/, dialogs/, ui/)"]
    Src --> Data["data/ (projects.ts, skills.ts, certifications.ts)"]
    Src --> Test["test/setup.ts + *.test.tsx (Vitest)"]
```

`dist/` (Vite build output, content-hashed filenames under `dist/assets/`) is git-ignored and regenerated per deploy; `vercel.json`'s `outputDirectory` points there.

### 6.2. State Management Topology

No Redux/Zustand — state cardinality did not justify a normalized store. Global state is five independent React Context providers, composed at the root of `App.tsx` with no cross-dependencies (a DAG of depth 1):

$$\text{Providers} = \{\text{ThemeContext}, \text{LangContext}, \text{SoundContext}, \text{ToastContext}, \text{DialogsContext}\}$$

`DialogsContext` holds a single discriminated union `state: { name: 'none' } | { name: 'cv' } | { name: 'terminal' } | { name: 'project'; project: Project } | { name: 'cert'; cert: Cert } | { name: 'demo'; demo: Demo }` — this makes "which dialog is open, with what payload" a single exhaustively-typed value instead of five independent boolean/nullable flags, eliminating a class of "two modals open at once" bugs possible in the original imperative version.

### 6.3. Original Module → React Primitive Mapping

| `js/main.js` (removed) | `src/` destination |
|---|---|
| `ThemeManager` | `contexts/ThemeContext.tsx` (anti-flash `<script>` in `index.html` still applies `data-theme` pre-hydration) |
| `LangManager` + `js/i18n.js` | `i18n/LangContext.tsx` + `i18n/translations.ts` (typed as `Record<'es'\|'en', Record<TranslationKey,string>>`) |
| `ScrollProgress` | `hooks/useScrollProgress.ts` |
| `NavManager` | `hooks/useActiveSection.ts` → `Navbar.tsx` (hamburger toggle **removed**, see §6.4) |
| `RevealManager` | `hooks/useReveal.ts` (generic `IntersectionObserver`-by-ref hook) |
| `SkillBars` | inline within `SkillBar.tsx` via `useReveal` |
| `CustomCursor` / `CardTilt` | `hooks/useCustomCursor.ts` / `hooks/useCardTilt.ts` (+ `prefers-reduced-motion` guard, see §6.4) |
| `HeroCanvas` | `hooks/useHeroCanvas.ts` (+ reduced-motion guard, `visibilitychange`/`IntersectionObserver` pause) |
| `BackToTop` / `SmartPrefetch` | `components/layout/BackToTop.tsx` / `hooks/useSmartPrefetch.ts` |
| SW registration | `virtual:pwa-register` call in `main.tsx` |
| `ToastManager` | `contexts/ToastContext.tsx` + `components/ui/ToastContainer.tsx` (React escapes text by default — no `innerHTML`) |
| `CVDialog` / `AITerminal` / `ProjectDetailModal` / `CertViewer` / `LiveDemoModal` | `components/dialogs/*Dialog.tsx`, all sharing `hooks/useDialogController.ts` (imperative `showModal()`/`close()` over a native `<dialog>` ref) |
| `ContactForm` | **removed** — dead code, no corresponding DOM in any prior version of `index.html` |
| `CopyManager` | `hooks/useClipboardCopy.ts` |
| `SkillsFilterManager` | `useState` local to `Skills.tsx` |
| `CounterAnim` | `hooks/useCounterAnim.ts` |
| `NetworkStatus` | `hooks/useNetworkStatus.ts` |
| `SoundDesign` | `contexts/SoundContext.tsx` |

### 6.4. Concrete Bugs Fixed During Migration

1. **CSP `frame-src` missing** (§4.2) — the ProAssist live-demo iframe was silently blocked by `default-src 'self'` in production. Fixed in `index.html`, `vercel.json`, and `_headers` simultaneously.
2. **Dead `ContactForm` module** — a full fetch-to-FormSubmit implementation with matching CSS (`.contact-form`, `.cf-*`) existed with no `#contact-form` element in the DOM to attach to. Removed entirely; `formsubmit.co` dropped from CSP.
3. **Non-functional JS obfuscation** — `build.js` configured `javascript-obfuscator` options extensively but never called `.obfuscate()`; output was byte-identical to source. Replaced with a Vite plugin (`obfuscate-bundle`, `vite.config.ts`) hooking `generateBundle` in production mode, verified by `grep`-ing compiled output for source identifiers (0 matches — genuinely obfuscated).
4. **Unreachable hamburger button** — `.hamburger { display:none }` with no breakpoint re-enabling it; the click handler and `aria-expanded` logic never activated at any viewport, since `.bottom-bar` already covers mobile/tablet nav. Removed; not ported.
5. **No `prefers-reduced-motion` / visibility guard on JS-driven animation loops** — the hero canvas `requestAnimationFrame` loop ran indefinitely regardless of tab visibility or viewport intersection, and none of `HeroCanvas`/`CustomCursor`/`CardTilt` checked `prefers-reduced-motion`, unlike the CSS-driven animations. `useHeroCanvas.ts` now pauses via `visibilitychange` + `IntersectionObserver`, and all three hooks early-return under `matchMedia('(prefers-reduced-motion: reduce)')`.
6. **CSS bugs found during the port** (verified line-by-line against the original `index.html`, fixed in `src/styles/global.css`): undefined custom properties `--bg-card`/`--border-light`/`--text-primary`/`--text-secondary`/`--bg-alt`/`--dur-med` used but never declared (silently falling back to browser initial values in `.cv-dialog-*`, `.toast-*`, `.cert-modal[open]`, `.demo-modal[open]`); `@keyframes modal-in` referenced but never defined (cert/demo modals had no entrance animation); stale `.clc-title` selector not matching the markup's `.clc-label`; duplicate `@keyframes spin` and duplicate `prefers-reduced-motion` blocks; confirmed-dead rules (`.cert-item-link`, `.cert-inline-link`, `.reveal-delay-2`/`-3`, `@keyframes scaleIn`) removed.

### 6.5. Type System & Static Verification

`tsconfig.json` uses project references to `tsconfig.app.json` (`strict: true`, `noUncheckedIndexedAccess` via `strict`, `verbatimModuleSyntax`, `moduleResolution: "bundler"`) and `tsconfig.node.json` (for `vite.config.ts`). `translations.ts` is typed as `const translations = {...} as const satisfies Record<Lang, Record<TranslationKey, string>>`, which makes a missing translation key in either language a **compile-time** error rather than a silent runtime fallback — the ES/EN key-parity check that used to require a manual audit of `js/i18n.js` is now enforced by `tsc`.

`eslint.config.js` (ESLint 10 flat config) runs `typescript-eslint`, `eslint-plugin-react-hooks` (including the newer `react-hooks/refs` and `react-hooks/set-state-in-effect` rules, oriented at React Compiler compatibility), `eslint-plugin-jsx-a11y` (enforces the WCAG AAA convention from `CLAUDE.md`), and `eslint-plugin-react-refresh`. The `react-hooks/set-state-in-effect` rule caught a real pattern in `CertViewerDialog`/`LiveDemoDialog`: both synchronously called `setState` inside an effect to reset content state when the `cert`/`demo` prop changed. Fixed by splitting each into an outer "chrome" component (dialog shell, does not need reset) and an inner content component keyed by content identity (`key={cert.url ?? cert.title}` / `key={demo.url}`) — React fully remounts the inner component on prop change, giving fresh `useState` initializers with no reset-effect required.

### 6.6. Build Pipeline & PWA

**⚠️ Superseded (Phase 13):** `vite.config.ts`/`main.tsx` no longer exist — the build is now driven by `astro.config.ts`, and `<App>` mounts via an Astro client directive instead of a manual `createRoot` call. The Workbox strategy described below is unchanged in substance, just re-hosted under `@vite-pwa/astro`. See §7.3.

$$\text{Build} = \text{tsc -b (typecheck, no emit)} \to \text{vite build} \to \{\text{generateBundle: obfuscate}, \text{closeBundle: vite-plugin-pwa}\}$$

`vite-plugin-pwa` runs in `generateSW` (Workbox) mode, replacing the hand-written `sw.js` from §5 — necessary because Vite's content-hashed output filenames (`dist/assets/index-<hash>.js`) make a fixed `PRECACHE_URLS` array in a manually maintained service worker structurally unable to stay correct across builds. Workbox precaches all build-time-known assets and applies runtime caching rules functionally equivalent to the original strategy: `NetworkFirst` for HTML navigations, `StaleWhileRevalidate` for style/script/worker/image requests. The `virtual:pwa-register` module in `main.tsx` preserves the original "new version detected → reload" UX (`PwaUpdater.tsx`).

### 6.7. Testing

Vitest 4 + `@testing-library/react` + jsdom, previously absent from the project entirely (the static site had no automated tests). Coverage is intentionally a smoke/interaction layer, not exhaustive: i18n ES/EN key-parity (`translations.test.ts`), `ThemeContext` toggle behavior, full-tree render (`App.test.tsx`), and `@testing-library/user-event`-driven interaction flows (`App.interactions.test.tsx`) — CV dialog open/close, AI terminal `help` command execution, skills category filtering. jsdom lacks a `<canvas>` 2D context and real `IntersectionObserver`, so `src/test/setup.ts` polyfills both (a `MockIntersectionObserver`) plus native `<dialog>` `showModal()`/`close()`, which jsdom does not implement.

### 6.8. Explicit Trade-off: CSR vs. the Original Static HTML

**⚠️ Resolved (Phase 13):** the CSR trade-off described below was closed by migrating the shell to Astro SSG — see §7. Kept as historical record of the reasoning at the time.

The original site was 100% static HTML — every crawler, including ones without JS execution, saw full content immediately. The React SPA is client-rendered: `<div id="root">` is empty until React hydrates. All `<head>` content (meta, Open Graph, JSON-LD, hreflang, preloads) remains static in `index.html` and is unaffected, so social-card unfurling and the primary SEO signals are unchanged; only the *body* content requires JS execution to become visible to a crawler. No SSR/SSG framework (Next.js, Astro) was introduced — out of scope for the requested "React with TypeScript via Vite" migration — so this is a deliberate, disclosed trade-off rather than an oversight.

---

## 🏝️ 7. Phase 13: Astro (SSG) Shell + Lazy-Loaded Dialogs

Two follow-ups to Phase 12, both requested after reviewing the shipped React migration: the 1.8MB main bundle (Vite's own build warning), and closing the CSR/SEO trade-off disclosed in §6.8.

### 7.1. Dialog Code-Splitting

All 5 dialogs (`CvDialog`, `AITerminalDialog`, `ProjectDetailDialog`, `CertViewerDialog`, `LiveDemoDialog`) were previously mounted unconditionally in `PageContent` (`src/App.tsx`), hidden only via the native `<dialog>` element's non-open state — meaning their code was always part of the initial bundle regardless of use. Wrapping them in `React.lazy()` alone would **not** have helped: an unconditionally-rendered lazy component still triggers its dynamic import on first render of the parent. The actual fix combines two changes:

1. `React.lazy(() => import('./components/dialogs/XDialog').then(m => ({ default: m.XDialog })))` for each of the 5 (named exports, hence the `.then` re-wrap).
2. A `useEverOpenedDialogs(currentName)` hook in `App.tsx` tracks, as a `Set<DialogState['name']>`, which dialogs have ever been the active one — each dialog now renders as `{everOpened.has('cv') && <CvDialog />}` inside a single `<Suspense fallback={null}>`. This mounts each dialog's chunk on first open and **keeps it mounted** afterward, rather than unmounting on close — necessary because closing must not discard in-dialog state that legitimately persists across opens today (e.g. `AITerminalDialog`'s command history `lines`).

The hook itself avoids a `setState`-in-`useEffect` cascade (which `eslint-plugin-react-hooks`'s `react-hooks/set-state-in-effect` rule flags as a real anti-pattern, per the Phase 12 findings in §6.5) by using React's documented "adjust state during render" pattern instead — comparing `currentName` against a mirrored `prevName` state and calling `setState` directly in the render body when they diverge, rather than in an effect.

Net result measured via `npm run build`: the 5 dialogs now ship as separate chunks (15–27 KB each, obfuscated) fetched only on first open, instead of being baked into the critical-path bundle.

### 7.2. Why a Single Astro Island, Not Fine-Grained Islands

The chosen approach wraps the *entire* existing `<App />` tree as one Astro client component (`<App client:idle />` in `src/pages/index.astro`) inside an `output: 'static'` Astro project, rather than decomposing the page into multiple independently-hydrated islands (e.g. a static Hero + a hydrated Navbar + a hydrated Skills filter, etc.).

The reason is `DialogsProvider`/`ThemeProvider`/`LangProvider`/`SoundProvider`/`ToastProvider` (§6.2) are 5 Context providers shared across effectively every component in the tree. Astro islands do not share React context across island boundaries — splitting the page into multiple islands would require moving all 5 providers' state out of React Context into a cross-island store (e.g. nanostores), a materially larger rewrite touching every consumer. The single-island pattern is Astro's own documented low-risk path for migrating an existing SPA: Astro server-renders the *same* component tree to real HTML at build time (via `@astrojs/react`), then hydrates that exact tree client-side — zero changes to any component's internals, contexts, or hooks. The trade-off, made explicitly: the JS payload needed for *interactivity* is unchanged from Phase 12 (still the full app), only *visibility* of content no longer depends on that JS executing.

### 7.3. Build Pipeline (current)

$$\text{Build} = \text{astro check (typecheck)} \to \text{astro build} \to \{\text{SSG render to dist/index.html}, \text{generateBundle: obfuscate}, \text{astro:build:done: @vite-pwa/astro}\}$$

`astro.config.ts` (`output: 'static'`) replaces `vite.config.ts`; `integrations: [react(), AstroPWA({...})]` replace the bare `@vitejs/plugin-react` and `vite-plugin-pwa` plugins — `@vite-pwa/astro` is a thin wrapper that registers the same underlying `vite-plugin-pwa`/Workbox pipeline described in §6.6, so the `generateSW`/runtime-caching strategy and the `virtual:pwa-register/react` hook in `PwaUpdater.tsx` are unchanged. The `obfuscatePlugin()` function (generateBundle hook, production-only) moved unchanged into `astro.config.ts`'s `vite.plugins` array — Astro exposes its internal Vite instance for exactly this purpose. `src/main.tsx` was deleted: Astro's `client:idle` directive mounts `<App>` itself, so the manual `createRoot(...).render(...)` call is no longer needed. Global CSS (`styles/global.css`) is now imported from `src/pages/index.astro`'s frontmatter instead of `main.tsx`, matching Astro's idiomatic pattern for page-level stylesheets. `tsconfig.json` now extends `astro/tsconfigs/strict` (single config, no project references) instead of the previous `tsconfig.app.json`/`tsconfig.node.json` split; `npm run typecheck` is `astro check`, which type-checks `.astro`, `.ts`, and `.tsx` files together.

### 7.4. SSR-Safety Fixes (required for real Node-side rendering)

Enabling actual server-side rendering (even build-time-only, as here) surfaced two real bugs that were latent but inert throughout Phase 12, because nothing had ever executed that code path in Node before:

- `useNetworkStatus.ts`: `useState(() => navigator.onLine)` ran unguarded. **First fix attempt was insufficient**: gating on `typeof navigator !== 'undefined'` does not work, because Node 21+ ships a partial built-in global `navigator` object (confirmed empirically: `node -e "console.log(navigator.onLine)"` → `undefined`, not a `ReferenceError`). The build did not crash, but `navigator.onLine` evaluated to `undefined` (falsy) during the static render — verified in the shipped output: `dist/index.html` baked in the `network-badge offline` / "Offline Mode" state for every visitor, a real, user-visible bug. **Correct fix**: gate on `typeof window !== 'undefined'` instead — `window` has no Node built-in equivalent — and default to `true` (online) during SSR, since there is no real connectivity state to report at build time and defaulting to "offline" is actively misleading.
- `i18n/LangContext.tsx`'s `detectInitialLang()`: same class of bug. `navigator.language` in this sandbox's Node 24 resolves to the build machine's OS locale (`en-US`), which — combined with the same `typeof navigator` guard — made the static build non-deterministically default to **English** nav/body text (verified: `dist/index.html` initially shipped `<a class="nav-link">About</a>` instead of the intended Spanish default), even though the site's actual default audience and `og:locale` (`es_CO`) is Spanish. Same fix: gate on `typeof window !== 'undefined'`.

Both were caught and corrected by actually building and `grep`-ing the static output rather than trusting the guard clauses in isolation — a general lesson this document keeps: SSR-safety fixes must be verified against real build output, not just "doesn't throw."

### 7.5. Verification

`dist/index.html` (post-build, `grep`-verified): contains the real hero/nav/section text server-rendered (previously an empty `<div id="root">` under CSR-only Vite) — resolves §6.8. Obfuscation re-verified with the same 0-source-identifier-matches `grep` method from Phase 12, now against `dist/_astro/*.js` (Astro's chunk directory, replacing Vite's `dist/assets/*.js`). `dist/sw.js` still generates. `vercel.json`/`_headers` gained a `/_astro/(.*)` immutable-cache rule mirroring the existing `/assets/(.*)` one — a gap that would otherwise have silently dropped long-term caching for the app's own JS/CSS chunks, since Astro's default chunk directory differs from Vite's.

### 7.6. Production Incident: CSP Blocked All Inline Scripts, Breaking Hydration Entirely

Not caught by any check in §7.5 — all of them verify *presence* of content in the static HTML, not that client-side JS actually executes in a real browser (no browser tooling was available in this environment at any point in this migration). First real-browser load, reported by the user post-deploy, showed the page fully unstyled/inert (nothing interactive, `.reveal`-class content stuck at `opacity: 0`).

**Root cause**: `script-src` in the CSP (meta tag + `vercel.json` + `_headers`) had never included `'unsafe-inline'`, a nonce, or a hash allow-list — it only ever needed to permit *external* same-origin scripts (`<script src="/js/main.js">` in the original site; `<script type="module" src="/src/main.tsx">` under Phase 12's Vite CSR build). Astro changed this: `<App client:idle>` hydration is bootstrapped by **inline** `<script>` tags that Astro itself injects (the `astro-island` custom element definition + its `client:idle` scheduler), and this project's own anti-flash theme script (`is:inline`, in `<head>`) is also inline. The browser correctly blocked all of them per CSP. Since Astro's hydration bootstrap never ran, `<App>` never mounted — the SSR'd HTML was present in the DOM (confirmed via `curl`, which is why every automated check in §7.5 passed), but everything gated behind JS (interactivity, and any `.reveal`-triggered visibility) stayed dead.

**Why nothing in this session's verification caught it**: every check up to this point was `curl`/`grep` against the built HTML, or jsdom-based Vitest — none of them load real script tags under a real CSP the way a browser does. This was flagged only once the user opened DevTools and reported the actual console errors (three `Content Security Policy directive` violations, one per inline script, each carrying the browser-computed SHA-256 hash of the blocked script's content).

**Fix**: computed the SHA-256 hashes of the 3 inline `<script>` bodies directly from the built `dist/index.html` (independently, via a small Python script — not just trusting the pasted browser output) and added them as `'sha256-<hash>'` entries to `script-src`, keeping `default-src`/everything else unchanged and avoiding `'unsafe-inline'` (which would accept *any* inline script, defeating CSP's XSS protection rather than this project's actual need — 3 specific, known-good, static scripts). Verified the hashes are deterministic by rebuilding and recomputing them.

**Known fragility, left as-is deliberately**: these hashes are tied to the literal content of Astro's internal bootstrap scripts. An Astro version upgrade, or adding/removing `client:*` islands, will very likely change that content and silently reintroduce this exact failure — the fix will need to be redone (rebuild, recompute hashes, update all 3 files) whenever that happens. Astro has a first-party CSP integration (`experimental`/stable depending on version) that manages this automatically instead of hand-rolling hashes; adopting it was deliberately deferred rather than done under this incident's time pressure, to avoid introducing a second unverified change on top of a live outage. Worth revisiting in a calmer follow-up.

### 7.7. Bug: Certificate PDF Viewer Blocked by the Site's Own Anti-Clickjacking Headers

**Report**: user reported the certificate viewer and the ProAssist live-demo modal both "open but show an error," later clarified as a browser navigation error `lainramirez.vercel.app refused to connect.` and/or the iframe staying stuck on the loading state.

**Investigation**: static/data checks (PDF file present and serving `200`, `demoUrl`/`frame-src` wiring correct, ProAssist backend reachable) all passed, matching the pattern from §7.6 where a purely client-side/browser-enforced failure is invisible to `curl`/`grep`-based checks. Fetched the actual response headers for the live PDF (`curl -I`) and found:

```
x-frame-options: DENY
content-security-policy: ...; frame-ancestors 'none'; ...
```

**Root cause**: the global header rule (`source: "/(.*)"` in both `vercel.json` and `_headers`) applies `X-Frame-Options: DENY` and `frame-ancestors 'none'` to *every* response from the origin, including static assets like `/assets/docs/*.pdf`. `CertViewerDialog`'s `CertBody` embeds the certificate PDF in an `<iframe src={cert.url}>` — i.e., the site tries to frame its own PDF. Both `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` mean "nobody may frame this resource, not even the same origin," so the browser correctly refused, surfacing as the `refused to connect` navigation error inside the iframe and leaving `CertBody` stuck in its `loading` state until the 10s fallback timer flipped it to the "no PDF" UI (which reads as "shows an error" from the user's side, distinct from the actual intentional no-PDF fallback used for the 2 certs that genuinely have no `pdfUrl`).

**Fix**: changed both directives from a same-origin-inclusive deny to a same-origin-exclusive one — `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'` — in both `vercel.json` and `_headers` (the only two places that actually enforce these; `frame-ancestors` is spec-ignored when set via a `<meta http-equiv="Content-Security-Policy">` tag, and `index.astro`'s meta CSP was confirmed to not set it, so no change was needed there). This still blocks every third-party origin from framing any page or asset on this site (the actual clickjacking protection `frame-ancestors`/`X-Frame-Options` exist for) while allowing the site to frame its own same-origin PDFs.

**ProAssist demo**: `curl -sD -` against `https://proassist-r1q6.onrender.com` (with a real browser `User-Agent`) showed no `X-Frame-Options` and no `frame-ancestors` in its response, and no client-side frame-busting pattern (`top.location`, `self !== top`, etc.) in the served HTML shell. No blocking evidence was found server-side for the demo; the "stays loading" symptom there is most plausibly Render.com free-tier cold-start latency (observed up to ~12s, but can run longer under load) colliding with `DemoBody`'s perceived-stuck UI rather than a hard block. Left as a follow-up to confirm with the user after the certificate fix ships — if it recurs, the next step is real DevTools console output from that specific modal, per the evidence-first process established in §7.6.

### 7.8. Follow-up Bug: Certificates Without a PDF Showed a Permanent Spinner Alongside the Fallback

Separate from §7.7's framing fix, the user also reported that the two certificates with `pdfUrl: null` (Frontend, AI — `src/data/certifications.ts`) got stuck loading forever while *also* showing the "see it on LinkedIn" fallback text at the same time.

**Root cause**: in `CertViewerDialog.tsx`'s `CertBody`, `loading` was always initialized to `true` regardless of whether `cert.url` existed, while `noPdf` was correctly initialized to `!cert.url`. For a cert with no URL, the `useEffect` that manages the 10s fallback timer returns early (`if (!cert.url) return;`) and never calls `setLoading(false)` — so `loading` stayed `true` forever, and both the loading spinner (`{loading && ...}`) and the no-PDF fallback (`{noPdf && ...}`) rendered simultaneously and indefinitely.

**Fix**: changed the initializer to `useState(() => !!cert.url)`, so `loading` starts `false` whenever there's no URL to load in the first place — the no-PDF fallback then renders alone, immediately, with no spinner. Certs that do have a `pdfUrl` are unaffected (`loading` still starts `true` and is cleared by `onIframeLoad` or the 10s timeout, exactly as before).

### 7.9. Favicon Rendering Badly in Google Search Results

**Report**: user said the favicon looked wrong when their name was searched on Google and the site appeared in results.

**Root cause**: `public/assets/img/favicon.png` is `244×195` — not square — despite being declared everywhere as if it were square: `apple-touch-icon sizes="180x180"`, `icon sizes="32x32"`, `icon sizes="192x192"` in `index.astro`, and `192x192`/`512x512` (the latter upscaled well beyond its real resolution) in `manifest.json`'s `icons`. Every consumer (browsers, OS, and Google's favicon fetcher, which specifically wants a clean square image) had to squash or stretch a non-square, low-res source into a square box, producing a visibly distorted icon.

**Fix**: rasterized the existing (already square, 512×512, clean "LR" monogram) `favicon.svg` into properly sized, actually-square PNGs via `sharp` — `favicon-32.png`, `favicon-180.png`, `favicon-192.png`, `favicon-512.png` — and pointed every consumer at the correctly-sized file instead of reusing one mismatched source: `index.astro`'s `<link>` tags, `manifest.json`'s `icons`/`shortcuts`, and `astro.config.ts`'s PWA `includeAssets` glob. Deleted the now-unreferenced `favicon.png` and the unused duplicate `logo.png` (identical bytes, never referenced anywhere in the codebase).

### 7.10. Custom Cursor Frozen at Page Load Until First Mouse Movement

**Report**: user said the cursor looked "stuck" right when the page loads.

**Root cause**: `useCustomCursor.ts` renders `.cursor`/`.cursor-follower` as `position: fixed` elements with no initial `left`/`top` — they only get positioned inside the `mousemove` handler. Before the visitor's first mouse movement, both elements sat at their unset default position (effectively the viewport's top-left corner), fully visible, reading as a cursor stuck in the corner. Compounding it: the follower ring's position comes from a `lerp` loop that starts from `cx = cy = 0`, so even the first real movement would have visibly animated the ring flying in from the corner rather than appearing already in place.

**Fix**: both elements now start `visibility: hidden` (added to their rules in `global.css`, under the existing `@media (hover: hover) and (min-width: 1024px)` block that already scopes this feature to desktop) and only gain a `.cursor--visible` class — making them `visibility: visible` — from inside `onMouseMove`, so nothing renders until a real position is known. Also added a `hasMoved` flag in `useCustomCursor.ts`: on the first move, `cx`/`cy` are snapped directly to the cursor position instead of starting the lerp from `(0, 0)`, so the ring appears already in place rather than animating in from the corner.

### 7.11. Favicon Legibility + Google Showing "Vercel" Instead of the Site Name

**Report**: user shared a screenshot of Google search results for their own name — the result's site-name label read "Vercel" instead of their name, and the favicon next to it looked poor at the tiny size Google renders it.

**Favicon legibility root cause**: `favicon.svg` set `font-family="'Space Grotesk', sans-serif"` — a Google Font loaded on the page itself, but not available to any context that rasterizes the SVG standalone (this project's own `sharp`-based PNG generation from §7.9, and likely Google's own favicon-fetching pipeline). Without that font installed, renderers silently fall back to a generic, thinner system font, which at 16×16/32×32 read as faint and hard to parse. Fixed by switching to `font-family="Arial, Helvetica, sans-serif"` (near-universal, resolves cleanly via fontconfig in this environment to a bold, high-contrast render), bumping `font-size` slightly, and adding negative `letter-spacing` to tighten "LR" into a more compact mark — then regenerating all PNG sizes (`16`, `32`, `180`, `192`, `512` — added a dedicated `16` for the size most favicon consumers, including Google, actually use) and visually confirming legibility via `Read` on the generated files before shipping.

**"Vercel" site-name root cause**: not fully provable without access to Google's ranking internals, but the page already had a correct `og:site_name` (`"Lain Ramirez — Portfolio"`) and *no* `WebSite`-typed structured data — only a `Person` entity. Free multi-tenant subdomains (`*.vercel.app`, `*.netlify.app`, `*.github.io`, etc.) are known to sometimes get their "site name" in search results attributed to the hosting platform rather than the page's own branding when Google doesn't have a strong, unambiguous same-typed signal to prefer instead.

**Fix**: added a second, explicit `WebSite` JSON-LD block (separate `<script type="application/ld+json">`, same pattern as the existing `Person` block — confirmed this doesn't need a CSP hash entry, since `script-src` only restricts *executable* script types and `application/ld+json` isn't one, matching how the pre-existing `Person` block already worked without a hash) with `"name": "Lain Sthid Ramirez Rueda | Portafolio"` and `"publisher"` pointing back to the `Person` entity. This is the correct, spec-compliant lever available without changing hosting; it is not guaranteed to override Google's platform-name heuristic on a `vercel.app` subdomain, and the user was explicitly asked about moving to a custom domain (the much stronger, near-guaranteed fix for this specific symptom) and declined for now, choosing to stay on `vercel.app`.

### 7.12. Codebase Audit (Read-Only) + Three Follow-up Fixes

Ran a dedicated read-only audit of the whole codebase (bugs, WCAG AAA compliance, performance, security, SEO, dead code) after the CSP/framing/favicon/cursor fixes above, specifically looking for anything in the same "real bug, not speculation" category. Three findings were confirmed and fixed; a few others were explicitly flagged as *not* worth doing and left alone (see below).

**Fixed — theme icon flash on hydration**: `ThemeContext.tsx`'s `detectInitialTheme()` re-derived the theme independently from `localStorage`, duplicating logic already handled by the anti-flash inline script in `index.astro` (which sets `data-theme` on `<html>` before paint, including the SSR-time default). The two happened to agree today but had no structural reason to stay in sync, and for a returning light-mode visitor the very first client render could show the wrong theme-toggle icon (`Navbar.tsx` derives the sun/moon glyph from this state) before correcting itself post-hydration. Fixed by having `detectInitialTheme()` read `document.documentElement.getAttribute('data-theme')` — the value the anti-flash script already committed — instead of re-reading `localStorage` a second time. Same `try/catch` as before (still needed: `document` doesn't exist in Node either, so this throws under SSR exactly like the `localStorage` read it replaces, and falls through to the same `'dark'` default).

**Fixed — light-mode primary color was WCAG AA, not AAA**: `global.css`'s `[data-theme="light"] --clr-primary` was `#006B61`, with a comment admitting "WCAG AA on white" (verified: 6.41:1 against `#FFFFFF`). `CLAUDE.md` mandates AAA (7:1 for normal text), and this variable is used as actual text color (not just decoration) in ~54 places in light mode. Changed to `#005850` (verified 8.36:1 against white — comfortable AAA margin, not a bare pass) via a WCAG relative-luminance calculation script, keeping the same hue family so the rebrand is imperceptible at a glance.

**Fixed (by explicit user decision, not unilaterally) — obfuscation was inflating the largest JS chunk 6-8x**: `astro.config.ts`'s `obfuscatePlugin()` had `controlFlowFlattening: true` and `deadCodeInjection: true` (0.4 threshold — injects fake code ~40% the size of the real code). Measured directly via `SKIP_OBFUSCATION=1` vs normal build on the same source: one chunk went from 184KB unobfuscated to 1.44MB obfuscated. This is almost certainly the actual reason Vite's "chunk larger than 500kB" warning persisted even after Phase 13's dialog code-splitting — splitting the *source* doesn't help when the obfuscator itself is the dominant size multiplier. Since this is a deliberate security-vs-performance trade-off from Phase 6, it was surfaced to the user as a decision rather than silently changed; they chose to prioritize load speed. Disabled `controlFlowFlattening` and `deadCodeInjection` specifically, keeping every other protection (`identifierNamesGenerator: 'hexadecimal'`, `stringArray`/`splitStrings`/`stringArrayEncoding: base64`, `selfDefending`, `disableConsoleOutput`). Rebuilt: the same chunk dropped from 1.44MB to 596KB (still obfuscated — spot-checked the output is still hex-identifier, unreadable machine code, not a readability regression). Verified typecheck/lint/tests all still pass after the change.

**Explicitly not done, and why**: the audit also flagged the hero canvas not being DPR-aware (cosmetic softness on high-DPI screens, moderate effort, skipped as not worth the risk/effort here) and `img-src https:` in the CSP being broader than currently needed (real but very low-value hardening given the codebase has zero remote `<img>` references and no `dangerouslySetInnerHTML` anywhere — the actual XSS surface is already minimal) — both explicitly called out as *not worth doing* rather than omitted by oversight. Dialog keyboard/focus handling and `prefers-reduced-motion` coverage were re-checked and found solid, no changes.

### 7.13. PageSpeed Insights Audit: Font Awesome Self-Subsetting, Google Fonts Trim, Further Obfuscation Runtime-Cost Cuts, and an Agentic-Navigation Base Layer

**Trigger**: user linked a PSI mobile report and asked for the site to score close to 100 on both performance and "agentic navigation." PSI's own page returned no CrUX field data for this URL (too little real-world traffic), and the public PageSpeedInsights API (`pagespeedonline.googleapis.com`) was returning `429 RESOURCE_EXHAUSTED` (shared no-API-key quota, not specific to this project) for both `WebFetch` and direct `curl`. No local Chrome/Chromium or `lighthouse`/`puppeteer` install was available in this environment either, so no Lighthouse run (local or remote) was possible this session. The entire audit below is a source-level static analysis plus real `npm run build` output measurements — not a Lighthouse score. If PSI's API quota resets, a follow-up session should run a real Lighthouse pass against the deployed URL to confirm these translate into score movement, since some of PSI's weighting (e.g. exact TBT-vs-size tradeoffs) can't be fully predicted from source alone.

**Two decisions were explicitly put to the user rather than assumed** (`AskUserQuestion`), since both are real trade-offs against previously-stated priorities, not unambiguous bugs:
1. How far to keep cutting the obfuscator's runtime cost (weighed against the source-protection goal from Phase 6/§7.12) — user chose "cut further."
2. Scope for "agentic navigation"/"webMCP" (an ambiguous, not-yet-standardized term) — user chose the static, zero-backend tier over building a live MCP server.

**Font Awesome: full CDN bundle → self-hosted 56-glyph subset.** `index.astro` loaded `cdnjs.cloudflare.com/.../font-awesome/6.7.2/css/all.min.css` — verified via direct `curl` against cdnjs: 73,890B CSS + `fa-solid-900.woff2` (158,220B) + `fa-brands-400.woff2` (118,684B) + `fa-regular-400.woff2` (25,472B) = 375,912B raw, render-blocking (icons appear above the fold in the nav/hero), for a library covering ~2,000 glyphs. Enumerated actual usage via `grep -rohE "fa-[a-z0-9-]+" src` across every `.tsx`/`.ts` file (including icon names composed dynamically in `src/data/*.ts` and template-literal-built classes in `Navbar.tsx`/`Footer.tsx`) and cross-checked two independent extraction methods against each other: **56 unique icons** (44 solid, 11 brands, 1 regular — `fa-copy`). Installed `fonttools`/`pyftsubset` (`pip3 install --user fonttools brotli`; not previously present), extracted each icon's PUA codepoint from FA6's `--fa` CSS custom-property declarations (FA6 moved off direct `:before{content:...}` per-icon, using a shared `::before{content:var(--fa)}` plus per-class `--fa:"\fXXX"` — the extraction regex had to match that pattern, not the FA4/5-style one), and ran `python3 -m fontTools.subset` per style with `--unicodes` limited to the exact codepoints in use. Result: 375,912B → 9,044B of woff2 (5,392 + 3,096 + 556) — a **97.6% reduction** — plus a hand-written `src/styles/fontawesome.css` (~3.5KB before minification; `@font-face` × 3 + base `.fa-solid`/`.fa-regular`/`.fa-brands` rules + one `::before{content:"\fXXX"}` per icon, `font-display: block` since these are decorative glyphs where a fallback-font flash would be worse than a brief invisible period) imported via `@import "./fontawesome.css";` at the top of `global.css` — so it's bundled/minified/cached through the normal Vite pipeline instead of being a second render-blocking `<link>`. Font files live in `public/assets/fonts/` (new directory, same convention as `public/assets/img/` and `public/assets/docs/`), already covered by the existing `/assets/(.*)` immutable-cache rule in `vercel.json`/`_headers` and by the PWA `globPatterns` (`**/*.{...,woff2}` already matched `.woff2`, no config change needed there). **Regeneration note for future icon additions**: add the new icon's class to the relevant style list, re-run the codepoint-extraction + `pyftsubset` steps against a freshly-downloaded `all.min.css`/webfont from cdnjs (or any FA6.7.2 source), and append the new `::before` rule — there is no build-time automation for this yet, it's a manual subsetting step.

**Google Fonts: 13 variants → 10.** Cross-referenced every `font-weight`/`font-style` actually used against what the `css2` URL requested. `font-weight: 900` in `global.css` (the decorative robot-watermark `::before` on the IA skill card) turned out to target `"Font Awesome 6 Free"` specifically, not Space Grotesk — a false lead, not a bug. What *was* dead: `font-style: italic` has zero matches anywhere in the codebase (no CSS rule, no inline style), yet the URL requested `Space+Mono:ital,...;1,400` and `DM+Sans:ital,...;1,9..40,300` — both italic axes pure waste. Also `DM Sans` weight `300` (non-italic) has zero `font-weight: 300` matches anywhere, while `500`/`600`/`700` are all used (7/10/10 occurrences respectively) and `400` is the implicit default. Removed both italic axes and the unused `DM Sans 300` from the `css2` URL — `family=Space+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Grotesk:wght@400;500;600;700`. Zero visual risk: nothing in the codebase can render in italic or DM Sans 300, so there's no glyph that could regress.

**CSP tightened as a side effect**: with Font Awesome no longer loaded from `cdnjs.cloudflare.com`, and confirming via `grep -rn "cdnjs"` that nothing else in the codebase references it, removed `https://cdnjs.cloudflare.com` from `script-src`, `style-src`, and `font-src` in all three places that declare the CSP (`index.astro`'s meta tag, `vercel.json`, `_headers` — same three-way duplication documented in §7.6/§7.7, kept in sync by hand since there's still no single source of truth for it). One fewer allowed external origin is a real (if modest) reduction in XSS attack surface, not just a perf cleanup.

**Obfuscation: further runtime-cost cuts, per the user's explicit choice above.** §7.12 had already dropped `controlFlowFlattening`/`deadCodeInjection` (the dominant *size* cost: 1.44MB → 596KB on the main chunk) but kept `selfDefending`, `numbersToExpressions`, and `stringArrayCallsTransform`/`stringArrayWrappersChainedCalls` — all of which cost CPU on *every execution*, not just at parse time, which is exactly what PSI's mobile TBT/INP metrics penalize (measured on a throttled CPU profile). `numbersToExpressions` in particular replaces every numeric literal with an arithmetic expression re-evaluated at runtime — a real concern here specifically because this app re-runs numeric-heavy code on every animation frame (`useCardTilt`, the custom-cursor RAF loop from §7.10). Disabled all three (`selfDefending: false`, `numbersToExpressions: false`, `stringArrayCallsTransform: false`, `stringArrayWrappersChainedCalls: false`), and raised `splitStringsChunkLength` from `10` to `30` (fewer, longer chunks per string → less runtime concatenation per string access, still splits/obscures). Kept everything build-time-only and still-obscuring: `identifierNamesGenerator: 'hexadecimal'`, `stringArray`/`stringArrayEncoding: base64`/`stringArrayRotate`/`stringArrayShuffle` (array reordering happens once, at build), `disableConsoleOutput`. Measured via real rebuild: the main client chunk went **594,971B → 421,869B** (−29%), the `App` chunk **128,430B → 84,465B** (−34%) — on top of being real per-execution CPU savings, not just smaller downloads. `npm run test` (10/10) and `npm run build`'s `astro check` (0 errors/warnings) both still pass, confirming the obfuscated output is still valid, runnable JS.

**Agentic-navigation base layer** (the "safe tier" the user chose over a live MCP server): added `public/llms.txt` following the [llmstxt.org](https://llmstxt.org) convention — H1 + blockquote summary, then H2 sections (`Perfil`, `Secciones`, `Notas para agentes`) linking to the page's real anchor IDs (`#hero`/`#about`/`#skills`/`#projects`/`#contact`, taken directly from `grep -rn 'id="' src/components/sections'`) with content sourced from the already-vetted `Person` JSON-LD (name, `alumniOf`, `knowsAbout`, `sameAs`) and `src/data/projects.ts`/`certifications.ts` — nothing fabricated. Explicitly notes the page is prerendered static HTML (Astro SSG, per §7.6 — content is in the DOM before any JS runs) so crawlers/agents don't need to execute JS to read it, and explicitly states there is no MCP server or public API on this domain (accurate, and prevents an agent from hallucinating an endpoint that doesn't exist). Referenced it from `robots.txt` with a comment pointing at `/llms.txt`, next to the existing `Sitemap:` line — not part of the llms.txt spec itself, but a zero-risk discoverability nudge in the file crawlers already check first. Also fixed two pre-existing SEO/crawl-hygiene issues found in the same area: `public/sitemap.xml` still had `hreflang="es"`/`hreflang="en"` entries both pointing at the identical URL — the exact anti-pattern §7 (point 14 of `explanation-LAIN.md`) already corrected in `index.astro`'s `<head>` but this file was missed at the time — reduced to `x-default` only, matching the established convention; and `robots.txt`'s `Disallow: /assets/img/photo_b64.txt` referenced a file confirmed (via `find`) to no longer exist in `public/`, a dead rule from an earlier phase, removed.

**A live MCP server was scoped but deliberately not built**, per the user's chosen option. "WebMCP" is not (as of this session) a single settled standard — it was surfaced to the user as a spectrum from "static discoverability files" (what was built) to "an actual Model-Context-Protocol server the user's portfolio backend exposes as callable tools," which would require a genuinely new stateful/serverful surface (e.g. a Vercel serverless function) on a project that is currently 100% static (`output: 'static'` in `astro.config.ts`, zero backend). Left as a scoped, separate future phase rather than half-built under this session's original ask.

**Deliberately not attempted this session, and why**: splitting the single `<App client:idle />` Astro island (§ — `src/pages/index.astro`; the entire site, `Hero` through `Footer`, hydrates as one React tree) into multiple smaller islands (e.g. `client:visible` for below-the-fold sections) would directly reduce hydration-time main-thread blocking, and is a real, known lever for TBT/INP — but every section currently shares one React tree specifically so `ThemeContext`/`LangContext`/`SoundContext`/`ToastContext`/`DialogsContext` stay in sync across the whole page (e.g. toggling the theme in the navbar must re-render every section). Splitting into independent Astro islands would give each its own React root, breaking that shared state unless a non-React state bridge (e.g. a module-level store + custom events, or `localStorage` + a `storage` listener) replaced the context providers first — a real architecture change, not a drop-in perf tweak, and out of scope for a fix that was meant to stay safe/reversible. Flagged here as the most promising remaining performance lever for a future, dedicated session.

### 7.14. Real Lighthouse Data, a Critical Hydration-Mismatch Bug, and a Second Performance/A11y/Best-Practices Pass

**Trigger**: user linked a second PSI mobile report and asked for every category to land at ~100 (or at least 95+), explicitly calling out mobile performance and "the agentic thing and others" as still lacking. §7.13 had been unable to get any real score (PSI's CrUX had no field data, the public API was quota-exhausted) and worked from static analysis alone.

**Getting real data this time**: `npx playwright install chromium` failed with `ENOSPC` — `/home` is a separate, nearly-full 4.8GB partition, and Playwright's default cache dir (`~/.cache/ms-playwright`) lives under it. Retried with `PLAYWRIGHT_BROWSERS_PATH` pointed at `/tmp` (on the 119GB root overlay, 54GB free) and it downloaded cleanly — both a full Chrome-for-Testing build and a headless-shell. Ran real `lighthouse` (also via `npx`) against the *live deployed* `https://lainramirez.vercel.app/` with `CHROME_PATH` pointed at that binary and `--chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox"` (the `--disable-dev-shm-usage`/`--disable-setuid-sandbox` pair was required — without them Chrome's tab crashed immediately, a known container/`/dev/shm`-size issue, not specific to this repo). This is the first time in this project's session history real Lighthouse/CrUX-equivalent lab data existed to work from, instead of source-level static audit.

**First real numbers** (against the live site, i.e. still reflecting §7.13's commit, not yet deployed... actually reflecting whatever commit *was* deployed at the time — §7.13's changes were committed but explicitly not pushed, so this first run measured the pre-§7.13 deployed state): Performance 47, Accessibility 94, Best Practices 92, SEO 100. LCP 6.4s, TBT **4,270ms**, TTI 7.4s. A TBT this large (anything past ~600ms is "poor") demanded an explanation beyond asset weight — the `bootup-time`/`mainthread-work-breakdown` audits showed `scriptEvaluation` alone at 4.77s, almost the entire main-thread budget, concentrated in one file (`_astro/client.*.js`).

**Root cause: React error #418 — a full-tree hydration remount on every English-locale visitor.** The `best-practices` category's `errors-in-console` audit had literally captured it, but minified/obfuscated past readability (`Minified React error #418`, stack frames all `_0x...`). Reproduced with full React dev diagnostics by running `astro dev` (unminified React) and driving it with `playwright-core` (via the same locally-installed Chrome, `chromium.launch({ executablePath: ... })`) with `Page.setBypassCSP` enabled over CDP (dev mode's Vite/HMR inline scripts don't match the production CSP's hashes, so hydration is blocked entirely under the real CSP in dev — bypassing CSP for this one diagnostic session was the only way to get past that and reach the actual bug). React's full, unminified warning named the exact node and the exact mismatch: `<SkipLink>`'s `<a>` rendered `"Skip to main content"` on the client vs `"Saltar al contenido"` from the server.

The mechanism: `LangContext.tsx`'s `detectInitialLang()` ran `navigator.language.startsWith('en') ? 'en' : 'es'` inside `useState`'s lazy initializer — which runs on *both* the server (Astro's build-time prerender, where `typeof window === 'undefined'` so it always resolved `'es'`, matching the static `<html lang="es">`) *and* the client's first render (where `navigator.language` is real and, on any English-preferring browser — including Lighthouse/Chrome's own default `en-US` profile — resolves `'en'`). Since virtually every visible string on the page is `t()`-driven, this doesn't cause one attribute mismatch (cheap, patchable in place) — it makes *every* text node on the page disagree between server and client, which React 19 treats as unrecoverable: it discards the entire hydrated DOM subtree and remounts it client-side from scratch. On a single-island page (`<App client:idle>` wraps the whole site, per the architecture note in §7.13's last paragraph) that means re-mounting *everything*, not just the mismatched node — which is exactly what a 4.27s `scriptEvaluation` spike concentrated in one chunk looks like. This bug affects any real visitor whose browser reports an English-leaning locale, not just Lighthouse — meaning it was very likely degrading the actual CrUX field-data experience for a large fraction of real traffic, not just lab scores.

**Fix, mirroring the `ThemeContext`/`detectInitialTheme` precedent from §7.12 but adapted for the stricter failure mode**: `ThemeContext`'s fix could get away with reading a pre-paint-committed DOM *attribute* (cheap to patch on mismatch). Language can't use that trick — the divergence here is in *text content*, not an attribute, so *any* client/server difference on the first render is fatal, even one sourced from an inline pre-hydration script. The correct fix is the standard SSR pattern: the state initializer always returns the exact SSR default (`SSR_DEFAULT_LANG = 'es'`, matching `<html lang="es">`) on both server and the client's first render, and the *real* client preference (`localStorage`, then `navigator.language`) is applied a tick later from inside a `useEffect` — which runs only after hydration has already safely reconciled, so a state change there is a normal, cheap, patch-in-place re-render, not a mismatch. Applied the identical pattern to `SoundContext.tsx`'s `enabled` state, which had the same class of bug at lower severity (only `aria-pressed`/an icon `className` depend on it — attribute-level, not text — so it wasn't the `errors-in-console` trigger, but was still a real hydration-mismatch source worth closing for consistency). Both effects trip the newer `react-hooks/set-state-in-effect` ESLint rule (a heuristic that can't distinguish "careless setState in an effect" from "the officially-sanctioned sync-external-system-into-React-state-after-mount pattern," which this is) — silenced with `eslint-disable-next-line` and an explanatory comment at each site, the same precedent already established for `jsx-a11y/no-redundant-roles` in `Navbar.tsx`.

**Fix: `javascript-obfuscator`'s `stringArray` runtime tripped the CSP on every chunk.** Chrome DevTools' `Audits` domain (captured directly via CDP — `Audits.enable` + listening for `issueAdded` events, since Lighthouse's `inspector-issues` audit summarizes these without enough detail to diagnose from its own JSON output) showed a `ContentSecurityPolicyIssue`/`kEvalViolation` against `script-src`, one per obfuscated chunk, all pointing at the same injected bootstrap pattern: `Function('return this')()`-style global-object recovery, already wrapped in `try{...}catch{ = window }` by the obfuscator itself (confirmed harmless — a real headless-browser load showed zero console/page errors either way) but still logged as a blocked-eval Issue by Chrome regardless of the catch. This is intrinsic to `stringArray`'s runtime (needed to locate a global scope for the string-array cache), not tied to `selfDefending`/`numbersToExpressions`/etc. (already disabled per §7.13) — there's no granular flag to keep `stringArray` without it. `javascript-obfuscator` ships a purpose-built fix for exactly this: `target: 'browser-no-eval'` (vs. the default `'browser'`) — same string-array obfuscation, but the global-object lookup avoids `eval`/`Function()` entirely. Added it to the plugin config in `astro.config.ts`; re-verified via the same CDP `Audits.issueAdded` capture that zero CSP issues remain, and via `errors-in-console`/`page-on-console` that behavior is unchanged.

**Fix: accessibility, 94 → 100.** Two real, distinct bugs, not just Lighthouse nitpicks:
- `aria-required-children` (weight 10, the accessibility category's single largest failing item): `Skills.tsx`'s `.skills-filter-wrap` used `role="tablist"` around plain filter buttons — but this UI was never actually a tabs pattern (clicking a filter toggles a CSS class that hides/shows *multiple* cards simultaneously; nothing swaps between distinct tabpanels), so `role="tablist"` was a straight-up semantic misuse, not a "missing `role="tab"` children" oversight to patch over. Fixed by using the ARIA pattern that actually matches the behavior — a filter button group: `role="group"` on the wrapper, `aria-pressed={filter === f.filter}` on each button (toggle-button semantics) instead of fake tab roles.
- `label-content-name-mismatch` (WCAG 2.5.3, weight 0 in the score but a real defect): `nav-logo`'s visible `"[LSRR]"` didn't appear anywhere in its `aria-label`; `lang-toggle`'s visible `"EN"`/`"ES"` wasn't in its `aria-label` (`t('aria.lang_toggle')` = "Cambiar idioma"/"Change language"); Hero's `scroll-indicator` visible `"scroll"` wasn't in its (also hardcoded, never-translated) `aria-label="Ir a Sobre mí"`; and every `BottomBar.tsx` nav item had a **hardcoded Spanish `label` field** (`'Inicio'`, `'Sobre mí'`, etc.) used as `aria-label` regardless of `lang` state, while the *visible* text was correctly `t(item.key)`-translated — so in English mode a screen-reader user heard Spanish nav labels while sighted users saw English ones, a real i18n-completeness bug independent of the WCAG finding. Fixed by making every one of these `aria-label`s start with (or equal) the actual rendered text: `nav-logo` → `"LSRR — Lain Sthid Ramirez Rueda, Inicio"`; `lang-toggle` → `` `${visibleCode} — ${t('aria.lang_toggle')}` ``; `scroll-indicator` → a new translated key pair (`aria.scroll_to_about`: "Ir a Sobre mí" / "Go to About") prefixed with `t('hero.scroll')`; `BottomBar` items → dropped the dead hardcoded `label` field entirely and used `aria-label={t(item.key)}`, the same key already driving the visible text (so they're now identical by construction, and correctly bilingual).

**Fix: LCP image preload targeted the wrong file.** `render-blocking-insight`/a Lighthouse warning flagged `profile.webp`'s preload (`index.astro`) as "preloaded but not used within a few seconds" — because Hero.tsx's `<picture>` lists `.avif` *before* `.webp`, and Chrome (including Lighthouse's own) picks the first supported source, i.e. the AVIF, leaving the explicitly preloaded WebP file fetched and unused while the actual LCP image (the AVIF) got no preload benefit at all. Fixed by preloading `profile.avif`/`type="image/avif"` instead, matching what the `<picture>` will actually select.

**Fix: self-hosted the three Google Fonts families, not just subsetted their `<link>`'s weights (already done in §7.13).** `render-blocking-insight` specifically flagged the `fonts.googleapis.com` stylesheet: ~1.2KB of actual content costing **761ms** of render-blocking time — almost entirely cross-origin connection latency (DNS/TLS/round-trip to a second origin), not bytes, so no amount of further weight-trimming on that `<link>` could fix it; only removing the extra origin hop could. Fetched the resolved `css2` response with a real desktop-Chrome UA (Google's endpoint content-negotiates by `User-Agent`) and found each of the 10 requested weight/family combinations resolves to just **4 unique files**: DM Sans and Space Grotesk are both true variable fonts, so Google serves the *same* file for all 4 requested static weights (400/500/600/700) — meaning a single `@font-face` per family with a `font-weight: 400 700` range (rather than 4 near-duplicate declarations) is both correct and sufficient. Space Mono isn't variable, so its 400/700 are 2 real separate files. Downloaded only the **`latin`** unicode-range subset of each (Google's endpoint also serves `latin-ext`/`vietnamese` subsets this site's ES/EN content never needs) — confirmed `latin`'s range (`U+0000-00FF` et al.) fully covers Spanish's accented characters (á/é/í/ó/ú/ñ/¿/¡ are all within `U+00E1`–`U+00F1`, inside Latin-1 Supplement). Result: 4 files, ~115KB total, self-hosted at `public/assets/fonts/` alongside the Font Awesome subset, declared in a new `src/styles/fonts.css` (imported first in `global.css`, before `fontawesome.css`). Removed the `fonts.googleapis.com`/`fonts.gstatic.com` `<link>`, `preconnect`, and `dns-prefetch` tags from `index.astro`, and — since nothing on the page depends on either origin anymore — dropped both from the CSP's `script-src`/`style-src`/`font-src` in all three places that declare it (`index.astro`'s meta tag, `vercel.json`, `_headers`), same pattern as cdnjs's removal in §7.13.

**Fix: Font Awesome's self-hosted `@font-face` used `font-display: block`.** `font-display-insight` flagged this directly — `block` risks up to a 3s invisible-text period per spec before falling back, which Lighthouse dings even for icon glyphs. Changed to `font-display: swap` in `src/styles/fontawesome.css` (icons render as blank/absent briefly instead of blocking, consistent with how the newly self-hosted text fonts already use `swap`).

**Measured impact** (local `astro preview` of the production build, Lighthouse mobile via the same locally-installed Chrome — not a live redeploy; see caveat below): Performance 47→**61**, Accessibility 94→**100**, Best Practices 92→**96**, SEO stayed **100**. TBT 4,270ms → **1,720ms** (after the hydration fix alone, before the CSP/`browser-no-eval` fix, TBT was still 5–6s in two intermediate runs — see caveat) — `scriptEvaluation` in `mainthread-work-breakdown` dropped from 4.77s to 2.8s. The remaining Best Practices point (96, not 100) is `errors-in-console` catching `/_vercel/insights/view` returning 404 — that route is a Vercel platform feature that only exists on the real deployed edge network, not `astro preview`'s local static server, so this is a local-testing artifact, not a real defect; expected to read as a clean pass once actually deployed. Verified via a direct `playwright-core` load (real Chrome, no throttling, no simulation) that shows **zero** console errors, page errors, or CSP issues on the fixed build — confirming these aren't residual bugs, just Lighthouse's simulated-throttling numbers still reflecting genuine (not spurious) work.

**Caveat on absolute numbers, and what's still the biggest remaining lever**: Lighthouse runs in this sandboxed environment showed real run-to-run variance on identical code (Performance scored 47/58/61 and TBT 4.27s/5.3s/6.4s/1.7s across consecutive runs against the *same* unchanged build in one case) — almost certainly CPU-contention noise from `--throttling-method=simulate`'s trace-scaling math amplifying whatever jitter the underlying (likely shared/virtualized) sandbox CPU had at capture time, not a real behavior change. Category *scores* (which come from percentile buckets, not raw audit output) are more robust to this than the raw ms figures, so treat the score deltas above as directionally solid and the specific ms figures as approximate. Even accounting for that noise, `scriptEvaluation` remained the dominant single cost in every run post-fix (2.8–3s), which is the expected, now-honest cost of this app's architecture — one giant `client:idle` React island hydrating the entire page at once, discussed as the top remaining lever at the end of §7.13. That work was scoped there and intentionally not attempted in this session either (same reasoning: real architecture change, needs a context-provider state-bridge redesign first, out of scope for what was meant to stay a safe, mechanically-verifiable pass). **None of this session's changes were pushed to `origin/main`** (matching the user's explicit "don't touch git without being asked" precedent) — the live site does not yet reflect any of §7.13 or §7.14's fixes; the "measured impact" numbers above are from a local build, not the deployed one.

### 7.15. Scroll-Reveal Starvation Bug (Content "Not Appearing"), Bounded Hydration Timeout, Security/A11y Verification Pass

**Trigger**: user reported the live site as slow to load and, specifically, that scrolling down showed sections missing/not there ("lo abro y bajo y no estan las otras pantallas, se demora"), plus a general request to harden security and confirm WCAG AAA compliance.

**Root cause — content genuinely present in the DOM but invisible for an unbounded time.** Confirmed via `grep`/`wc -c` on a fresh `dist/index.html` that all five sections (`#hero`/`#about`/`#skills`/`#projects`/`#contact`) are fully server-rendered with real text — this was never a missing-SSR-content bug (§7.6 already established the page prerenders to static HTML). The actual mechanism: every scroll-triggered element carries the `.reveal` class (`opacity: 0` until a `.visible` class is added, `global.css`), and `.visible` is only added by React state set from `useReveal.ts`'s `IntersectionObserver` callback — which cannot run until (a) `<App client:idle />` hydrates, an event with no upper bound in the codebase before this fix, and (b), once hydrated, the observer fired the reveal via `window.scheduler.postTask(reveal, { priority: 'background' })` — the **lowest** priority the Prioritized Task Scheduling API offers, explicitly meant for non-urgent work and subject to starvation by any higher-priority work still running. This app has exactly that kind of continuous higher-priority work competing for the main thread: `useHeroCanvas.ts` runs a permanent particle-animation `requestAnimationFrame` loop for the Hero's canvas background, and `useCardTilt.ts` adds another `requestAnimationFrame` chain on pointer movement — both are exactly the sustained main-thread activity that starves both `requestIdleCallback` (what `client:idle` waits on) and `background`-priority scheduler tasks. On a loaded or lower-end device, this combination could plausibly leave `.reveal` content sitting at `opacity: 0` for seconds after it's already in the viewport — a real, reproducible bug, not a perception issue.

**Fix 1 — `useReveal.ts`**: removed the `scheduler.postTask`/`background`-priority indirection entirely; `setVisible(true)` now runs directly in the `IntersectionObserver` callback. The premise of deferring to "background" priority was backwards for this use case: an element the visitor has already scrolled to see is, by definition, the most user-visible thing on screen at that moment, not background work — React 19's automatic batching already coalesces multiple simultaneous reveals into one paint, so no manual scheduling was providing a real benefit here, only a starvation risk.

**Fix 2 — bounded `client:idle` timeout**: `src/pages/index.astro`'s `<App client:idle />` had no `timeout`, meaning Astro's hydration bootstrap could in principle wait indefinitely for a truly idle window — which, given the continuous rAF loops above, may not arrive for a while under load. Changed to `<App client:idle={{ timeout: 1500 }} />`, Astro's own documented mechanism for exactly this: hydration is forced after at most 1500ms even if `requestIdleCallback` hasn't fired naturally. Verified the option round-trips correctly into the built output (`opts="{&quot;name&quot;:&quot;App&quot;,&quot;value&quot;:{&quot;timeout&quot;:1500}}"` in `dist/index.html`'s `astro-island` element).

Both fixes are minimal and additive — no architecture change, so they do not touch or resolve §7.13's still-open "biggest lever" item (splitting the single `client:idle` React island into multiple smaller islands, blocked on replacing the shared Theme/Lang/Sound/Toast/Dialogs context tree with a non-React state bridge first). That remains open and was re-flagged to the user as a larger, separate-session decision. `npm run test` (10/10) and `npm run build` (`astro check`: 0 errors/0 warnings) both pass unchanged after these fixes.

**Security verification (no changes needed)**: `npm audit --omit=dev` reports 0 vulnerabilities. `vercel.json`/`_headers` (kept in sync per §7.6/§7.7/§7.13's established three-way-duplication pattern) already carry HSTS (`preload`-eligible), a real CSP (hash-pinned inline scripts, no `unsafe-eval`, `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and a locked-down `Permissions-Policy` — all already covered by §7.6/§7.13's prior work and unaffected by today's change. `npm outdated` shows only minor/patch-level version drift on dependencies already at 0 known vulnerabilities; left alone as out of scope for this pass (a version bump is a separate, deliberate decision, not a security fix).

**WCAG AAA verification (no changes needed)**: `eslint-plugin-jsx-a11y` (already wired into `eslint.config.js` per §7) reports zero accessibility errors project-wide. Spot-checked for the two most common regressions (missing `alt` on `<img>`, icon-only `<button>`s with no accessible name) via `grep` — none found; the light-mode AAA contrast fix (§7.13) and the `label-content-name-mismatch`/i18n `aria-label` fixes (§7.14) already cover the substantive findings from prior sessions. No new WCAG defects were found in this pass.

### 7.16. Real Lighthouse Numbers on the Live Site, Desktop Accessibility to 100, Mobile Bundle Reduction via In-Tree Code-Splitting

**Trigger**: user linked a live PageSpeed Insights report and asked for desktop accessibility (reported ~4% short of 100) and mobile performance (~21% short) to improve, explicitly "sin dañar lo que esta bien" (without breaking what already works) — ruling out any risky rewrite.

**Getting real numbers**: PSI's public API returned `RESOURCE_EXHAUSTED` (daily quota is `0` for this unauthenticated project — same wall hit in §7.14) and `WebFetch` against the PSI web app returned only its JS-shell chrome, not the client-rendered report — neither gave audit-level detail. Repeated §7.14's approach: installed a local Chrome for Testing via `npx playwright install chromium` (again pointing `PLAYWRIGHT_BROWSERS_PATH` at `/tmp` — `/home` is the same near-full 4.8GB partition noted in §7.14) and ran real `lighthouse@13.4.1` against `https://lainramirez.vercel.app/` for both `--preset=desktop` and the default mobile emulation, `--only-categories=performance,accessibility`.

**Desktop accessibility, 96 → 100 — one real `color-contrast` failure.** The only failing audit: two of the Hero's four floating brand-color chips (`.float-chip` in `global.css`) — `chip-python` (`#3776AB` on `#10131A`, 3.84:1) and `chip-adapt` (using `--clr-secondary`, `#7B61FF` on `#10131A`, 4.42:1) — both below even AA's 4.5:1, let alone this project's AAA mandate. Both chips are `aria-hidden="true"` (decorative, skipped by screen readers), but WCAG contrast rules are a visual-perception requirement, not a screen-reader one — `aria-hidden` doesn't exempt visually-perceivable text from it, so this was a real defect for low-vision sighted users, not a false positive. Computed AAA-safe replacements via the same relative-luminance script used for the primary-color fix in §7.13, solving for ≥7.2:1 (a safety margin over the 7:1 AAA floor) against each chip's actual background in each theme:
- `--clr-secondary` (drives `chip-adapt`, and three other real text usages: `.cert-ai`'s icon color in both themes, a `border-color`, and two gradient stops) — dark value only: `#7B61FF` → `#A493FF` (7.25:1 on `--clr-surface-1`/`#10131A`). The light-theme value (`#4A32D4`, already 7.78:1 on white) was already AAA-safe, untouched.
- `chip-python` and `chip-git` use **fixed** brand hex codes (Python's `#3776AB`, Git's `#F05032`), not CSS variables — unlike `chip-elicit`/`chip-adapt`, they never adapted per theme, which is *why* they were the ones that failed (their color never got the AAA-safe values `--clr-primary`/`--clr-secondary` already carry). `chip-git` wasn't flagged by this run's crawl but was audited anyway on the same principle. Gave both a proper dark-theme value (lightened: `#73A7D2` / `#F4806A`, 7.2–7.24:1 on `#10131A`) plus a new `[data-theme="light"] .chip-python`/`.chip-git` override (darkened: `#2A5A83` / `#A7250C`, 7.21–7.27:1 on white) — the same lighten-for-dark/darken-for-light pattern the theme's other AAA-compliant colors already follow. Verified via a local Lighthouse desktop run against the rebuilt site: `color-contrast` score `1`, category `100`.

**Mobile performance — root-caused via `lcp-breakdown-insight`, not guessed at.** The live mobile run showed Performance 69, TBT 1,090ms (score 0.24, the single worst-scoring metric), and — more tellingly — `lcp-breakdown-insight` broke the 3.1s LCP down into `timeToFirstByte: 80ms` and `elementRenderDelay: 2,762ms`. The LCP element is the Hero `<h1>`'s `span.title-name` — server-rendered text, already in the HTML before any JS runs (confirmed in §7.6/§7.15) — so a 2.76s *render* delay on already-parsed, already-downloaded text is not a network problem; it's the main thread being too busy to hand control back to the compositor to actually paint it. `mainthread-work-breakdown` pointed at the same root: `scriptEvaluation` at 2.3s, concentrated (per `bootup-time`) almost entirely in one file, `_astro/client.*.js` (Astro's React client-hydration runtime), with `unused-javascript` flagging 42% (47KB) of that same file as not executed by the time of measurement. This is the same structural cause named as the "biggest remaining lever" in §7.13/§7.14/§7.15: `<App client:idle>` hydrates the *entire* page — Hero through Footer — as one synchronous React commit, and that one long task blocks paint of content that's already sitting in the DOM, not just interactivity.

**Fix — code-split below-the-fold sections inside the existing single island, not a new one.** §7.13/§7.14/§7.15 all deferred the obvious fix (splitting `<App client:idle>` into several separate Astro islands) because it would give each island its own React root, breaking the shared `ThemeContext`/`LangContext`/`SoundContext`/`ToastContext`/`DialogsContext` tree unless replaced with a non-React state bridge first — a real architecture change the user has twice declined to greenlight (most recently this session, "No por ahora"). This session used a materially different, much lower-risk technique instead: `React.lazy()` + `Suspense` *inside* the same single React tree, for `Skills`/`Projects`/`Contact` (`src/App.tsx`) — the same code-splitting pattern already proven safe for the five dialog components (§ earlier in this doc). This changes nothing about the context/provider architecture — still one `<App client:idle>` island, one React root, state still shared everywhere — it only shrinks what has to be eagerly bundled and executed in the initial hydration commit.

**Verified this doesn't quietly reintroduce §7.6's "content missing" failure mode** (the exact risk of this kind of change: `Suspense`/`lazy` during SSR can, on some renderers, serialize the fallback instead of the resolved content if the renderer can't await the async import). Tested empirically rather than assumed: built with only `Skills` lazy first, `grep`-verified `id="skills"` and real skill-item text (`skill-category`, `"Python"` ×10) were still present in `dist/index.html`, confirming Astro's `@astrojs/react` SSR path correctly awaits `Suspense` boundaries at build time. Extended the same pattern to `Projects`/`Contact` and re-verified all five section IDs plus real content markers (`project-card` ×9, `contact-link-card` ×4) are still in the static HTML — nothing is now gated behind client JS that wasn't already gated before (the sections were already inert-until-hydrated for interactivity/reveal purposes; SSR content presence is unchanged).

**Measured, deterministic effect at the time**: the `App` chunk shrank from 83,589B to 59,858B (−29%, three components' code plus their own now-separate chunks: `Skills`/`Projects`/`Contact`, 10.5–12.8KB each, only fetched as needed). Lighthouse score movement was inconclusive in this sandbox (three local `astro preview` runs returned Performance 65/62/62 — the same CPU-contention noise documented in §7.14's caveat), but the bundle-size reduction itself was real and verified from build output. `npm run test` needed one fix for the new async boundary (`App.test.tsx`'s section-presence assertions wrapped in `waitFor`). All tests and `astro check`/`npm run build` passed with 0 errors. **This was pushed to `origin/main` and then reverted the same day once a real production regression surfaced — see §7.17.**

### 7.17. Reverting §7.16's Code-Split: React's Streaming-SSR Scripts Are Incompatible with a Hash-Pinned CSP

**Trigger**: after §7.16 shipped, the user reported the live site's desktop *performance* had regressed ("te tiraste el rendimiento del pc, cuando estaba en 100" — linking a fresh PageSpeed report) and asked to improve both desktop and mobile "sin dañar el otro" (without breaking the other one).

**First check: was desktop performance actually 100 before, and is it lower now?** Re-ran real Lighthouse (same local-Chrome method as §7.14/§7.16) against the live, freshly-redeployed site (`Last-Modified` header confirmed the deploy was ~2 minutes old). Desktop Performance measured **92** (accessibility **100**, confirming §7.16's contrast fix held) — actually *higher* than this session's own pre-fix baseline of 85, not lower, so the raw score alone didn't reproduce a regression. But `best-practices` (not checked in §7.16's original desktop run) came back **92**, with two failing audits worth investigating rather than dismissing: `errors-in-console` and `inspector-issues`.

**The real find: `errors-in-console` showed a live, reproducible bug.** The console captured "Minified React error #419" pointing at `_astro/client.*.js`, plus five separate `ContentSecurityPolicyIssue`/`kInlineViolation` reports for blocked inline `<script>` execution — five *different* SHA-256 hashes, none matching the CSP's three pinned values. This needed a real root cause, not a guess, so it was reproduced deterministically: installed `playwright-core` (pointed at the same local Chrome-for-Testing binary from §7.14/§7.16, via `executablePath` so no separate browser download was needed) and drove a real headless Chrome against the local `astro preview` build with `Network.emulateNetworkConditions` (500kbps/400ms latency) and `Emulation.setCPUThrottlingRate(4)` — conditions close to what a real mobile/loaded-desktop visitor sees, closer than `astro preview` on unthrottled localhost (which had never reproduced this, explaining why §7.16's own local testing missed it). The CDP `Audits.issueAdded` capture reproduced the exact same 5 CSP issues + error #419 on demand.

**Root cause, found by diffing every `<script>` element's live content-hash against the CSP allowlist** (a `page.evaluate` pass computing SHA-256 over each inline script's `textContent` and flagging any that don't match one of the three pinned hashes): the five blocked scripts were `$RT`/`$RS`/`$RB`/`$RV` — these are **React's own internal streaming-SSR helper names**, not app code. Astro's `@astrojs/react` renderer uses React's *streaming* server-rendering API (needed to `await` a `Suspense` boundary during a static build, which is exactly what §7.16's `lazy()`-wrapped `Skills`/`Projects`/`Contact` required). When a streamed boundary's real content isn't ready the instant the "shell" is flushed, React emits the content as a **placeholder now, then a same-response inline `<script>` that swaps the real content in** — and because each boundary gets its own auto-generated segment ID (`"r1S:1"`/`"r1P:1"`, etc.), that swap script's exact text differs per build. A hash-pinned CSP with no `'unsafe-inline'` and no nonce (this is `output: 'static'` — no per-request server exists to mint a fresh nonce) has no way to allow content that isn't knowable until after the build runs. The browser correctly blocks the swap script — but blocking it means the real content never gets swapped in, so React's hydrator, finding the boundary stuck in an inconsistent state, throws error #419 and **discards the entire SSR'd subtree to re-render it client-side from scratch** — strictly more work than the single-block hydration §7.16 was trying to reduce, which is the actual mechanism behind the user's "performance tanked" observation (the effect is timing/network-dependent, so it wouldn't fire on every single page load, but firing on some/most is enough to hurt real-world and lab scores alike).

**Why the dialogs' identical-looking `lazy()`+`Suspense` pattern (§7.1) never had this problem**: dialogs render `null` during the static build (no dialog is open at build time), so Astro's SSR pass never has to await or stream anything for that boundary — the lazy/Suspense machinery there only ever runs client-side, post-hydration, where streaming-SSR's inline swap scripts are never involved. `Skills`/`Projects`/`Contact` needed *real, immediate* content in the static HTML, which is precisely the case that forces the streaming code path.

**Fix: reverted `Skills`/`Projects`/`Contact` to plain eager imports** (`src/App.tsx`), restoring the exact pre-§7.16 chunk (`App.CzfLUFHM.js`, byte-identical hash), and left a detailed comment in their place explaining why this specific optimization doesn't work under this project's CSP, so a future session doesn't rediscover the same regression the hard way. Also reverted an intermediate attempt at fixing this via `startTransition` (wrapping `LangContext`/`SoundContext`'s post-mount preference-sync `setState` calls, per React error #419's own suggested remedy) — that address a *different* trigger condition (an update racing a still-hydrating boundary) and, tested, did not resolve *this* failure mode (confirmed: still reproduced under the same throttled CDP repro with `startTransition` applied), since the actual problem is the CSP unconditionally blocking the swap script regardless of timing. Removed that dead-end change too, keeping the diff minimal.

**Verification**: re-ran the same throttled `playwright-core`/CDP repro against the reverted build — **0** `Audits.issueAdded` issues, **0** page errors. A throttled local Lighthouse pass (`--throttling-method=devtools`, real not simulated throttling) showed the only remaining `errors-in-console` item is the already-known, already-documented (§7.14) `/_vercel/insights/view` 404 — a local-`astro preview`-only artifact (that route only exists on Vercel's real edge), not a live-site defect. `npm run test` (10/10), `npm run lint`, and `npm run build` (`astro check`: 0 errors/warnings) all pass on the reverted code. §7.16's desktop color-contrast fix (chip AAA contrast, `--clr-secondary` value) is untouched and still shipped — only the mobile code-splitting attempt was reverted.

**Where this leaves mobile performance**: back to the same conclusion §7.13/§7.14/§7.15/§7.16 all separately arrived at — the single `client:idle` React island hydrating the whole page in one synchronous commit remains the dominant, structural cost, and a code-splitting approach that keeps one island but still needs real SSR'd content per section runs into this CSP incompatibility. The only approaches that would actually reduce it either (a) relax the CSP to allow React's streaming swap scripts (a real security trade-off: nonces aren't possible on a static build, so this would mean adding `'unsafe-inline'` to `script-src`, which defeats the point of hash-pinning it in the first place), or (b) the still-unbuilt "split into separate Astro islands" architecture change (§7.13), which sidesteps streaming SSR entirely by not needing one React tree to await Suspense for another island's content. Neither was attempted here — left as an explicit open decision for the user, not silently chosen.

### 7.18. New Project (SENA Congress 2026), GitHub Username Migration, and Mobile Performance via Vendor-Exempt Obfuscation + Hydrate-on-Intent

**Trigger**: user asked to (1) add the official SENA Congress 2026 website (`https://congreso-sena.vercel.app`, repo `Lain-Sthid-Ramirez-Rueda/Congreso-SENA`, private) to the projects section, (2) fix GitHub links after renaming the account `Lain-ramirez18` → `Lain-Sthid-Ramirez-Rueda`, (3) apply improvements from their LinkedIn profile, and (4) get PageSpeed scores to ~100 on mobile and desktop.

**Username migration (verified, not assumed)**: `gh api users/Lain-ramirez18` → 404; `gh api users/Lain-Sthid-Ramirez-Rueda` → 200 with the expected name/bio. Every `github.com/Lain-ramirez18` URL was replaced (`src/data/projects.ts`, `Hero.tsx`, `Projects.tsx`, `Contact.tsx`, `index.astro` JSON-LD `sameAs`, `public/llms.txt`, `README.md`, `package.json` repository/bugs/homepage), plus the two display-only strings (`Contact.tsx` card subtitle, `AITerminalDialog.tsx` `contact` command). The local `origin` remote was repointed too. A new test (`App.test.tsx`, "links GitHub only under the current username") asserts every rendered `github.com` anchor uses the new username.

**New project card**: `projects.ts` gains `id: 'congreso'` as `01` (others renumbered 02–04). Stack/description were taken from the Congress repo's README and source (React 19 + TypeScript, TanStack Start SSR, Tailwind/Radix, Supabase live poster voting, SENA brand manual, WCAG AAA, ES/EN, schema.org/Event, PDF viewer). Because the repo is private, the card has no GitHub link — only `demoUrl` (reusing the existing `LiveDemoDialog` iframe modal) and an external link in the detail modal. `curl -sI` confirmed the Congress site sends no `X-Frame-Options`/`frame-ancestors`, so it is frameable; `https://congreso-sena.vercel.app` was added to `frame-src` in all three CSP copies (`vercel.json`, `_headers`, meta tag). The iframe's hardcoded `title="Demo en vivo de ProAssist"` became `` `Demo en vivo: ${demo.title}` `` (it would have mislabeled the new demo for screen readers). `.projects-grid` went from 3 to 2 desktop columns so the 4 cards form a 2×2 grid instead of 3+1. New i18n key `proj.congreso.desc` (es/en). Verified in headless Chrome: modal opens, iframe navigates to the Congress site, zero CSP issues.

**Performance — measured, not guessed.** PSI's public API was quota-exhausted again, so real Lighthouse 12 ran locally against a downloaded Chrome for Testing (`benchmarkIndex` ≈ 1200, comparable to PSI's hardware). To avoid `astro preview`'s missing compression skewing FCP/LCP, a small Node server serving `dist/` with cached brotli + immutable cache headers emulated Vercel. Baseline (live site): **mobile 65 / desktop 89**, a11y/BP/SEO already 100. Mobile TBT 2,190 ms.

1. **Obfuscating vendor chunks was the single biggest TBT cost.** `client.*.js` (react-dom) was 422 KB obfuscated vs 184 KB plain; `SKIP_OBFUSCATION=1` alone moved desktop to 100 and mobile TBT 2,190 → 630 ms. `obfuscatePlugin()` now skips chunks whose `moduleIds` are all under `node_modules` (or virtual `\0` ids). Our own chunks are still obfuscated with the same options; react-dom/react/workbox are public code, so obfuscating them protected nothing.
2. **LCP element (`span.title-name`) started at `opacity: 0` with a 0.35s delay** (`fadeInUp`). It now uses a transform-only `riseIn` keyframe with no delay, so it is opaque on first paint. Other hero entrance delays were shortened (max 0.8s → 0.2s, scroll hint 1.2s → 0.4s) to improve Speed Index without removing the effect.
3. **`build.inlineStylesheets: 'always'`** removes the render-blocking CSS request (A/B-tested against external CSS on the brotli server: equal-or-better LCP; `style-src` already allows inline).
4. **`content-visibility: auto` + `contain-intrinsic-size: auto 1000px` on `.section`** (hero isn't a `.section`), so off-screen sections skip style/layout/paint. `auto` keeps anchor jumps and `useActiveSection`'s `offsetTop` math accurate once rendered.
5. **`LangContext` applies the detected language inside `startTransition`.** Lighthouse/PSI (and every English browser) re-render every text node right after hydration; a transition makes that render interruptible.
6. **Hydrate on intent — `client:intent`** (`src/directives/intent.ts`, registered via an inline integration's `addClientDirective` in `astro.config.ts`, typed via `Astro.ClientDirectives` in `src/env.d.ts`). The fully pre-rendered page no longer hydrates the whole single React island on a timer (`client:idle`, 1500ms timeout). It hydrates on the first `pointerdown`/`pointermove`/`touchstart`/`keydown`/`wheel`/`scroll`/`focusin`, or immediately when the URL has a hash or a restored scroll position. A static-HTML-only measurement (scripts stripped) showed a mobile ceiling of 96 vs ~75 with eager hydration, so this is where the remaining ~20 points were. Mitigations: the island's `component-url`/`renderer-url` are `<link rel=prefetch>`ed on `load`, so hydration after the gesture doesn't wait on the network; button clicks before React attaches its root listeners are recorded (capture-phase listener) and re-dispatched right after `hydrateRoot` runs, and React's own discrete-event replay covers the rest. Verified in headless Chrome under 4× CPU throttling: no hydration before interaction (`ssr` attribute present, no `__reactContainer`), a single tap on `#theme-toggle` hydrates and toggles exactly once (dark → light), the English switch applies, reveal works after scrolling, 0 page errors, 0 `Audits.issueAdded`. **Trade-offs (accepted, documented):** until the first interaction the hero canvas isn't running, and English-preferring visitors see Spanish until their first gesture (then it switches in a transition). Astro inlines the directive script, so its CSP hash changed: `sha256-BF0290…` (old `client:idle`) → `sha256-npkW3W4Lwo60+u5BELqh0qRErxrvhwpDShcLBwx78yU=` in all three CSP copies. The script was re-hashed from the built `dist/index.html` to confirm an exact match.

7. **Preload of the display font** (`/assets/fonts/space-grotesk-latin.woff2`, `index.astro`): the LCP text is set in Space Grotesk, and with `font-display: swap` the web-font swap re-records the LCP candidate. The font was only discovered after the inline CSS was parsed. On the local brotli server the preload moved mobile LCP from 2.7s to 2.5s (score 0.86 → 0.90). On the live site LCP stayed at 2.7s, so the gain did not reproduce in production. The preload is kept because it's harmless (22 KB, used immediately).

**Results**: live site after the first deploy (Lighthouse, 3 runs each): **mobile 95 / 95 / 95, desktop 100 / 100 / 100; accessibility, best practices and SEO 100 in every run**. After the font-preload deploy (live, 3 runs): **mobile 96 / 95 / 93, desktop 100 / 100 / 100**, with TBT 0 ms and CLS 0. Mobile LCP is 2.7s (score ~0.85), and Speed Index varied in one run. What's left on mobile is the simulated slow-4G network floor for FCP/LCP. Earlier iterations measured mobile 94 / 94 / 97. This sandbox's run-to-run noise is documented in §7.14 (one identical-build desktop run scored 66 during heavy CPU contention). Live PSI numbers should be confirmed after deploy. `npm run build` (`astro check`: 0 errors/0 warnings), `npm run test` (12/12, 2 new), and `npm run lint` (0 errors, the same 5 pre-existing warnings) all pass.

**LinkedIn**: the profile could not be read. LinkedIn returns HTTP 999 to unauthenticated fetches, web search surfaced no profile content, and Claude in Chrome was not connected, so no LinkedIn-derived content changes were made. That part is pending the user pasting the profile content.
