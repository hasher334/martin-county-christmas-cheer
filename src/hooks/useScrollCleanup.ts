
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollCleanup = () => {
  const location = useLocation();

  useEffect(() => {
    // Clean up any lingering scroll locks on route change
    const cleanupScrollLocks = () => {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden');
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('overflow-hidden');
      
      // Remove any position fixed that might be applied
      document.body.style.position = '';
      document.documentElement.style.position = '';
      
      console.log('Scroll cleanup executed on route change:', location.pathname);
    };

    cleanupScrollLocks();
  }, [location.pathname]);
};
