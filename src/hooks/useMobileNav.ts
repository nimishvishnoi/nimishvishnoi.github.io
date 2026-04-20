/**
 * useMobileNav Hook - Manage mobile navigation state
 */
import { useEffect, useState } from 'react';

export const useMobileNav = (): {
  mobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
} => {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const toggleMobileNav = (): void => {
    setMobileNavOpen((prev) => !prev);
  };

  const closeMobileNav = (): void => {
    setMobileNavOpen(false);
  };

  useEffect(() => {
    // Close mobile menu when window is resized to desktop size
    const handleResize = (): void => {
      if (window.innerWidth >= 1024) {
        closeMobileNav();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { mobileNavOpen, toggleMobileNav, closeMobileNav };
};
