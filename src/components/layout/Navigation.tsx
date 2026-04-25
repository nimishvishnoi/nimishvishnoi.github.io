/**
 * Navigation Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { navigationLinks } from '@/constants/site';
import { downloadGeneratedResume } from '@/utils/resume';

interface NavigationProps {
  activeSection?: string;
  onLinkClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onLinkClick }) => {
  const handleClick = (href: string): void => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onLinkClick?.();
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-16 z-30 hidden lg:block">
      <div className="container-custom">
        <ul className="flex justify-center space-x-8 py-4">
          {navigationLinks.map((link, index) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                onClick={() => handleClick(link.href)}
                aria-current={activeSection === link.id ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg font-accent font-medium smooth-transition ${
                  activeSection === link.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.label}
              </button>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: navigationLinks.length * 0.1 }}
          >
            <button
              type="button"
              onClick={() => {
                void downloadGeneratedResume();
              }}
              className="px-4 py-2 rounded-lg font-accent font-medium smooth-transition text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Download Resume
            </button>
          </motion.li>
        </ul>
      </div>
    </nav>
  );
};
