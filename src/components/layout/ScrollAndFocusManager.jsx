import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On route *path* changes: scroll to top and move focus to <main> (a11y).
 * Query-string changes (filtering, sorting) deliberately do not scroll or
 * steal focus.
 */
export default function ScrollAndFocusManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
