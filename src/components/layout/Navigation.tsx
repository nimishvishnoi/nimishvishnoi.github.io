/**
 * Navigation Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaMoon, FaSun } from 'react-icons/fa';
import { navigationLinks } from '@/constants/site';
import { downloadPredefinedResume } from '@/utils/resume';

interface NavigationProps {
  activeSection?: string;
  onLinkClick?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onLinkClick,
  darkMode,
  onToggleDarkMode,
}) => {
  const handleClick = (href: string): void => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onLinkClick?.();
    }
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-30 hidden lg:block"
    >
      <div className="container-custom flex items-center justify-between gap-4 py-4">
        <div className="w-44" aria-hidden="true" />

        <ul className="flex justify-center gap-2">
          {navigationLinks.map((link, index) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                type="button"
                onClick={() => handleClick(link.href)}
                aria-current={activeSection === link.id ? 'page' : undefined}
                className={`min-h-10 px-4 py-2 rounded-lg font-accent font-medium smooth-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
                  activeSection === link.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.label}
              </button>
            </motion.li>
          ))}
        </ul>

        <div className="flex w-44 items-center justify-end gap-2">
          <button
            type="button"
            onClick={downloadPredefinedResume}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 font-accent font-medium text-gray-700 smooth-transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-300 dark:hover:text-primary-400 dark:focus-visible:ring-offset-slate-900"
          >
            <FaDownload aria-hidden="true" />
            Resume
          </button>
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 smooth-transition hover:bg-gray-100 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-primary-400 dark:focus-visible:ring-offset-slate-900"
          >
            {darkMode ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>
        </div>
      </div>
    </nav>
  );
};
