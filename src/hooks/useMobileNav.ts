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
    const handleResize = (): void => {
      if (window.innerWidth >= 1024) {
        closeMobileNav();
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMobileNav();
      }
    };

    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileNavOpen]);

  return { mobileNavOpen, toggleMobileNav, closeMobileNav };
};
