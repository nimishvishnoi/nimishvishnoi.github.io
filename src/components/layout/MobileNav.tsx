/**
 * Mobile Navigation Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { navigationLinks } from '@/constants/site';
import { downloadResume } from '@/utils/resume';

interface MobileNavProps {
  activeSection: string;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeSection, onClose }) => {
  const handleNavClick = (href: string): void => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 lg:hidden z-30"
      />

      {/* Menu */}
      <motion.nav
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-3/4 max-w-xs bg-primary-700 dark:bg-slate-800 shadow-xl p-4 sm:p-6 z-40 overflow-y-auto lg:hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-primary-200 smooth-transition"
          aria-label="Close navigation"
        >
          <FaTimes size={24} />
        </button>

        {/* Menu Items */}
        <ul className="space-y-4 mt-12">
          {navigationLinks.map((link, index) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                onClick={() => handleNavClick(link.href)}
                aria-current={activeSection === link.id ? 'page' : undefined}
                className={`w-full text-left px-4 py-3 rounded-lg font-accent font-medium smooth-transition ${
                  activeSection === link.id
                    ? 'bg-white text-primary-700'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            </motion.li>
          ))}

          {/* Download Resume Link */}
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: navigationLinks.length * 0.1 }}
            className="pt-4 border-t border-white/20"
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                void downloadResume();
              }}
              className="block w-full text-center py-3 px-4 bg-white text-primary-700 hover:bg-primary-100 rounded-lg font-accent font-bold smooth-transition"
            >
              Download Resume
            </button>
          </motion.li>
        </ul>
      </motion.nav>
    </>
  );
};
