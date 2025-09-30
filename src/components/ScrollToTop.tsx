import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Always reset scroll to top on route change
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      // Also reset any scrollable container that might be used in layouts
      const main = document.querySelector('main');
      if (main) (main as HTMLElement).scrollTop = 0;
    } catch {}
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;


