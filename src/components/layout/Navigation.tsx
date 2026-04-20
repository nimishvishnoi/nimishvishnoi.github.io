/**
 * Navigation Component
 */
import React from 'react';
import { motion } from 'framer-motion';

interface NavLink {
  label: string;
  href: string;
  id: string;
}

const navLinks: NavLink[] = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Resume', href: '#resume', id: 'resume' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

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
    <nav className="hidden lg:block">
      <ul className="space-y-3">
        {navLinks.map((link, index) => (
          <motion.li
            key={link.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <button
              onClick={() => handleClick(link.href)}
              className={`w-full text-left px-4 py-3 rounded-lg font-accent font-medium smooth-transition ${
                activeSection === link.id
                  ? 'bg-white text-primary-700 dark:bg-primary-600 dark:text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};
