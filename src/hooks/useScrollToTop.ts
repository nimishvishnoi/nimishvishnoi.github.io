/**
 * useScrollToTop Hook - Show/hide back to top button
 */
import { useEffect, useState } from 'react';

interface UseScrollToTopReturn {
  showButton: boolean;
  scrollToTop: () => void;
}

export const useScrollToTop = (threshold: number = 300): UseScrollToTopReturn => {
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined;

    const toggleVisibility = (): void => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setShowButton(window.scrollY > threshold);
      }, 100);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold]);

  const scrollToTopFn = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return { showButton, scrollToTop: scrollToTopFn };
};
