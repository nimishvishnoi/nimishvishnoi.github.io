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
      <h1 className="font-[Raleway] font-bold text-lg sm:text-xl truncate">Nimish Vishnoi</h1>
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <button
          onClick={onToggleDarkMode}
          className="text-base sm:text-lg hover:text-primary-200 smooth-transition"
          aria-label="Toggle dark mode"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button
          onClick={onToggleMobileNav}
          className={`text-xl sm:text-2xl hover:text-primary-200 smooth-transition transform transition-transform ${
            mobileNavOpen ? 'rotate-90' : ''
          }`}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>
      </div>
    </motion.header>
  );
};
