import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from './translations';

const STORAGE_KEY = 'lain-lang-v2';
// The static build always prerenders Spanish (matches `<html lang="es">` in index.astro — this
// site has no per-request SSR, so there is no way to serve pre-rendered English HTML).
const SSR_DEFAULT_LANG: Lang = 'es';

function detectClientLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
  } catch {
    /* localStorage unavailable */
  }
  return navigator.language.startsWith('en') ? 'en' : 'es';
}

interface LangContextValue {
  lang: Lang;
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  // Must start at the same value the server rendered, on both server AND the client's first
  // render — every visible string on the page is `t()`-driven, so picking the client's real
  // language here (e.g. from `navigator.language`) makes literally every text node disagree
  // with the server-rendered HTML. React 19 treats that as unrecoverable and throws away the
  // whole hydrated tree to re-render it client-side from scratch (React error #418) instead of
  // patching in place — on a single-island page (`<App client:intent>`, index.astro) that means
  // re-mounting the entire site, which measured as ~4.2s of Total Blocking Time in a Lighthouse
  // run with an en-US Chrome profile (i.e. on every English-browser visitor, and on every
  // Lighthouse/PSI run, since both default to en-US). The real client preference is applied a
  // tick later, in the effect below, once hydration has already safely completed — same
  // trade-off `detectInitialTheme` in ThemeContext.tsx makes for `data-theme`, just applied to
  // `lang` instead: a possible one-frame flash of the SSR'd language for returning
  // English-preferring visitors, instead of a full-tree remount for all of them.
  const [lang, setLang] = useState<Lang>(SSR_DEFAULT_LANG);

  useEffect(() => {
    const detected = detectClientLang();
    // Syncs an external system (localStorage/navigator) into React state. Must run after mount,
    // not in the initializer, or it reintroduces the hydration mismatch this state split exists
    // to avoid (see comment above).
    // As a transition: switching language re-renders every text node on the page, and this is
    // exactly what Lighthouse/PageSpeed (en-US browsers) hit right after hydration — a transition
    // lets React split that render into interruptible chunks instead of one long blocking task.
    if (detected !== lang) startTransition(() => setLang(detected));
    // Deliberately mount-only — re-running on every `lang` change would defeat the point (this
    // effect exists to run exactly once, right after hydration).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* localStorage unavailable */
    }
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  const t = useCallback((key: TranslationKey) => translations[lang][key] ?? key, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const value = useMemo(() => ({ lang, t, toggleLang }), [lang, t, toggleLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within a LangProvider');
  return ctx;
}
