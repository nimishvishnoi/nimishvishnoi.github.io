/**
 * Header Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { SocialLinks } from '@components/ui';
import { socialLinks } from '@data/contact';
import { downloadResume } from '@/utils/resume';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-b from-primary-700 to-primary-800 dark:from-slate-800 dark:to-slate-900 text-white py-8 sm:py-12 hidden lg:block">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Profile Image */}
          <img
            src="/profile.jpg"
            alt="Nimish Vishnoi"
            className="w-24 sm:w-32 h-24 sm:h-32 rounded-full border-4 border-white/20 mx-auto mb-4 object-cover bg-white/10"
            onError={(e) => {
              e.currentTarget.src = '/profile.svg';
            }}
          />

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-[Raleway] font-bold mb-2">Nimish Vishnoi</h1>
          <p className="text-primary-200 dark:text-primary-300 font-accent text-sm">
            Senior Software Engineer
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mt-6"
        >
          <SocialLinks links={socialLinks} size="md" />
        </motion.div>

        {/* Download Resume */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => {
            void downloadResume();
          }}
          className="block text-center py-3 px-6 bg-white text-primary-700 hover:bg-primary-100 rounded-lg font-accent font-bold smooth-transition mt-6 mx-auto w-fit"
        >
          Download Resume
        </motion.button>
      </div>
    </header>
  );
};
