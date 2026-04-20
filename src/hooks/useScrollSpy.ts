/**
 * useScrollSpy Hook - Track active section during scroll
 */
import { useEffect, useState } from 'react';

export const useScrollSpy = (
  sectionIds: string[],
  offset: number = 100,
): { activeSection: string } => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPosition = window.scrollY + offset;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return { activeSection };
};
