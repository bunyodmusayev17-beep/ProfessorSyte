import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and let later Tailwind utilities win over
 * earlier conflicting ones, so components can accept a `className` override.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
