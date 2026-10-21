import { useEffect, useState } from 'react';
import { useIntersectionOnce } from './useIntersectionOnce';

/**
 * Animates 0 → target (with an optional suffix like "+") once the element scrolls into view.
 * The initial value is the target itself, so the statically pre-rendered HTML (what crawlers,
 * link previews and no-JS visitors see) shows the real number instead of "0+".
 */
export function useCounterAnim<T extends HTMLElement>(target: number, suffix = '') {
  const { ref, inView } = useIntersectionOnce<T>(0.5);
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 25));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(current);
      if (current >= target) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [inView, target]);

  return { ref, display: `${value}${suffix}` };
}
