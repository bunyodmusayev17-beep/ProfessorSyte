import { useCallback } from 'react';

/**
 * Writes the pointer position onto the element as --mx / --my so the
 * `.spotlight` utility can paint a glow that follows the cursor. Pure CSS
 * variables: no re-render per mouse move.
 */
export function useSpotlight() {
  return useCallback((event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    target.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, []);
}
