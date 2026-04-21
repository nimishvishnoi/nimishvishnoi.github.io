/**
 * useScrollSpy Hook - Track active section during scroll
 */
import { useEffect, useState } from 'react';

export const useScrollSpy = (
  sectionIds: readonly string[],
  offset: number = 160
): { activeSection: string } => {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? '');

  useEffect(() => {
    if (sectionIds.length === 0) {
      return undefined;
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) {
      return undefined;
    }

    const updateActiveSection = (): void => {
      const currentScroll = window.scrollY + offset;
      let currentSection = sections[0].id;

      for (const section of sections) {
        if (currentScroll >= section.offsetTop) {
          currentSection = section.id;
        } else {
          break;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [offset, sectionIds]);

  return { activeSection };
};
