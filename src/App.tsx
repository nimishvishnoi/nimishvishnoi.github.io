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
import { useScrollSpy, useMobileNav } from '@hooks';

const App: React.FC = () => {
  const { activeSection } = useScrollSpy(['about', 'skills', 'resume', 'projects', 'contact']);
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useMobileNav();

  // Update dark mode in DOM and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      const darkMode = saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

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
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Mobile Header */}
      <MobileHeader
        darkMode={false}
        onToggleDarkMode={() => {}}
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={toggleMobileNav}
      />

      {/* Navigation */}
      <Navigation activeSection={activeSection} />

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileNavOpen && <MobileNav activeSection={activeSection} onClose={closeMobileNav} />}
      </AnimatePresence>

      {/* Main Content */}
      <main className="bg-white dark:bg-dark-bg text-gray-900 dark:text-white smooth-transition">
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
