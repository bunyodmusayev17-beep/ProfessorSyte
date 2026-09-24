import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Client-side navigation keeps the scroll position; reset it like a real page load. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
