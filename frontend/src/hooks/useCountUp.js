import { useEffect, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Animates a number from 0 to `target` (ease-out) once `start` is true. */
export function useCountUp(target, { duration = 1400, start = true } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    const end = Number(target) || 0;

    // Reduced motion: a zero-length run lands on the final value in one frame.
    const length = prefersReducedMotion() ? 0 : duration;

    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = length === 0 ? 1 : Math.min(1, (now - startedAt) / length);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(end * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);

  return value;
}
