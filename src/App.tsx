/**
 * Main App Component
 */
import React, { useEffect } from 'react';
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
import { useScrollSpy, useMobileNav, useDarkMode } from '@hooks';

const App: React.FC = () => {
  const { activeSection } = useScrollSpy(['about', 'skills', 'resume', 'projects', 'contact']);
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useMobileNav();
  const { darkMode, toggleDarkMode } = useDarkMode();

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
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Mobile Header */}
      <MobileHeader
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={toggleMobileNav}
      />

      {/* Navigation */}
      <Navigation activeSection={activeSection} />

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileNavOpen && <MobileNav activeSection={activeSection} onClose={closeMobileNav} />}
      </AnimatePresence>

      {/* Main Content - Add padding-top for mobile header */}
      <main className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white smooth-transition pt-16 lg:pt-0">
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
          className="bg-gray-100 dark:bg-slate-800 py-8 px-4 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800"
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
