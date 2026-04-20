/**
 * Main App Component
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Header,
  Navigation,
  MobileHeader,
  MobileNav,
  ScrollToTopButton,
} from '@components/layout';
import {
  AboutSection,
  SkillsSection,
  ResumeSection,
  ProjectsSection,
  ContactSection,
} from '@components/sections';
import { useScrollSpy, useMobileNav } from '@hooks';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check for saved preference or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const { activeSection } = useScrollSpy(['about', 'skills', 'resume', 'projects', 'contact']);
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useMobileNav();

  // Update dark mode in DOM and localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close mobile nav on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileNavOpen) {
        closeMobileNav();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileNavOpen, closeMobileNav]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-80 lg:bg-white dark:lg:bg-dark-bg lg:border-r lg:border-gray-200 dark:lg:border-gray-800">
        <Header />
      </div>

      {/* Mobile Header */}
      <MobileHeader
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={toggleMobileNav}
      />

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileNavOpen && <MobileNav activeSection={activeSection} onClose={closeMobileNav} />}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <div className="hidden lg:fixed lg:left-80 lg:top-0 lg:right-0 lg:h-20 lg:bg-white dark:lg:bg-dark-bg lg:border-b lg:border-gray-200 dark:lg:border-gray-800 lg:shadow-sm">
        <Navigation activeSection={activeSection} />
      </div>

      {/* Main Content */}
      <main className="bg-white dark:bg-dark-bg text-gray-900 dark:text-white lg:ml-80 lg:pt-20 smooth-transition">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <AboutSection />
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <SkillsSection />
        </motion.div>

        {/* Resume Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <ResumeSection />
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <ProjectsSection />
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <ContactSection />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-100 dark:bg-dark-card py-8 px-4 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800"
        >
          <p className="text-sm">
            © 2024 Nimish Vishnoi. Built with React 19 & TypeScript. All rights reserved.
          </p>
        </motion.footer>
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default App;
