/**
 * Mobile Header Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaMoon, FaSun } from 'react-icons/fa';

interface MobileHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  mobileNavOpen: boolean;
  onToggleMobileNav: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  mobileNavOpen,
  onToggleMobileNav,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-primary-700 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-lg flex items-center justify-between px-3 sm:px-4 lg:hidden z-50"
    >
      <h1 className="min-w-0 truncate font-[Raleway] font-bold text-lg sm:text-xl">
        Nimish Vishnoi
      </h1>
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-base hover:text-primary-200 smooth-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:text-lg"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button
          type="button"
          onClick={onToggleMobileNav}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl hover:text-primary-200 smooth-transition transform transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800 sm:text-2xl ${
            mobileNavOpen ? 'rotate-90' : ''
          }`}
          aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="mobile-navigation"
          aria-expanded={mobileNavOpen}
        >
          <FaBars />
        </button>
      </div>
    </motion.header>
  );
};
