/**
 * Scroll to Top Button Component
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { useScrollToTop } from '@hooks';

export const ScrollToTopButton: React.FC = () => {
  const { showButton, scrollToTop } = useScrollToTop(300);

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl smooth-transition z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          aria-label="Scroll to top"
        >
          <FaArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
