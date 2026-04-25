/**
 * useScrollToTop Hook - Show/hide back to top button
 */
import { useEffect, useState } from 'react';
import { debounce } from '../utils';

interface UseScrollToTopReturn {
  showButton: boolean;
  scrollToTop: () => void;
}

export const useScrollToTop = (threshold: number = 300): UseScrollToTopReturn => {
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = debounce(() => {
      setShowButton(window.scrollY > threshold);
    }, 100);

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTopFn = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return { showButton, scrollToTop: scrollToTopFn };
};
