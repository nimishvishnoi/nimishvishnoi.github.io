/**
 * Header Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { SocialLinks } from '@components/ui';
import { socialLinks } from '@data/contact';

export const Header: React.FC = () => {
  return (
    <header className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-primary-700 to-primary-800 dark:from-dark-card dark:to-dark-bg text-white shadow-2xl hidden lg:flex flex-col p-8 z-40 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        {/* Profile Image */}
        <img
          src="./favicon.svg"
          alt="Nimish Vishnoi"
          className="w-32 h-32 rounded-full border-4 border-white/20 mx-auto mb-4 object-cover bg-white/10"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="48" fill="%2325ad7b"/%3E%3Ctext x="50" y="60" font-size="60" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial"%3EN%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Name */}
        <h1 className="text-3xl font-heading font-bold mb-2">Nimish Vishnoi</h1>
        <p className="text-primary-200 dark:text-primary-300 font-accent text-sm">
          Senior Software Engineer
        </p>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <SocialLinks links={socialLinks} size="md" />
      </motion.div>

      {/* Download Resume */}
      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        href="./Nimish_Resume.pdf"
        download
        className="block text-center py-3 px-6 bg-white text-primary-700 hover:bg-primary-100 rounded-lg font-accent font-bold smooth-transition mb-8"
      >
        ⬇ Download Resume
      </motion.a>
    </header>
  );
};
