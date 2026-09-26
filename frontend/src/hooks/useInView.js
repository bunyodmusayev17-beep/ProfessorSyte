import { useEffect, useRef, useState } from 'react';

/**
 * Flips to true the first time the element scrolls into view and stays true,
 * so scroll-triggered animations play once rather than on every pass.
 */
export function useInView({ rootMargin = '0px 0px -8% 0px', threshold = 0.08 } = {}) {
  const ref = useRef(null);
  // Old browsers / jsdom have no IntersectionObserver: just show the content.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, rootMargin, threshold]);

  return [ref, inView];
}
