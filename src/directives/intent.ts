import type { ClientDirective } from 'astro';

/**
 * `client:intent` — hydrate the island on the visitor's first sign of intent (pointer, touch,
 * key, wheel, scroll or focus) instead of on a timer.
 *
 * The page is fully pre-rendered, so it is readable before React runs; hydrating the whole
 * single-island App up front was the dominant mobile Total Blocking Time cost (~20 Lighthouse
 * points). The island's JS is still prefetched at low priority once the page has loaded, so the
 * hydration that follows the first interaction doesn't wait on the network.
 *
 * Button clicks that land before React has attached its root listeners are recorded and replayed
 * once hydration starts; React's own event replay covers everything after that.
 */
const INTENT_EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'keydown', 'wheel', 'scroll', 'focusin'];

const intentDirective: ClientDirective = (load, _opts, el) => {
  let started = false;
  const missedClicks: HTMLElement[] = [];
  const listenerOpts: AddEventListenerOptions = { capture: true, passive: true };

  const recordClick = (e: Event) => {
    const button = e.target instanceof Element ? e.target.closest<HTMLElement>('button') : null;
    if (button && el.contains(button)) missedClicks.push(button);
  };

  const hydrate = async () => {
    if (started) return;
    started = true;
    for (const type of INTENT_EVENTS) window.removeEventListener(type, hydrate, listenerOpts);
    const run = await load();
    await run();
    document.removeEventListener('click', recordClick, true);
    // hydrateRoot has attached React's root listeners synchronously by now, so a re-dispatched
    // click is queued and replayed by React as soon as the target's subtree is hydrated.
    for (const button of missedClicks) button.click();
  };

  // A deep link (#projects) or a restored scroll position means the visitor is already past the
  // hero — hydrate right away so scroll-reveal content isn't left waiting for another gesture.
  if (location.hash) {
    void hydrate();
    return;
  }

  document.addEventListener('click', recordClick, true);
  for (const type of INTENT_EVENTS) window.addEventListener(type, hydrate, listenerOpts);

  // Restored scroll position: read `scrollY` on the next frame, not here. This runs while the HTML
  // is still being parsed, and reading `scrollY` at that point forced a synchronous layout of the
  // whole page before the first paint (~38ms of main-thread work in a Lighthouse trace). The
  // `scroll` listener above also catches a restoration that happens later.
  // NOTE: this file is inlined into the HTML — editing it changes its CSP sha256 hash, which must
  // be recomputed in index.astro, vercel.json and _headers (see docs/explanation-IA.md §7.6).
  requestAnimationFrame(() => {
    if (window.scrollY > 0) void hydrate();
  });

  const prefetch = () => {
    for (const attr of ['component-url', 'renderer-url']) {
      const href = el.getAttribute(attr);
      if (!href) continue;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'script';
      link.href = href;
      document.head.append(link);
    }
  };
  if (document.readyState === 'complete') prefetch();
  else window.addEventListener('load', prefetch, { once: true });
};

export default intentDirective;
