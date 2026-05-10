/**
 * Main App Component
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Header, Navigation, MobileHeader, MobileNav, ScrollToTopButton } from '@components/layout';
import {
  AboutSection,
  SkillsSection,
  ResumeSection,
  ProjectsSection,
  ContactSection,
} from '@components/sections';
import { useScrollSpy, useMobileNav, useDarkMode } from '@hooks';
import { useAppState } from '@hooks/useAppState';
import { sectionIds } from '@/constants/site';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { AdminPanel } from '@components/admin/AdminPanel';
import { MessageToast } from '@components/ui/MessageToast';
import { updateSEOMetadata, seoDefaults, seoSections } from '@/utils/seo';
import analytics from '@services/analytics';
import { useTranslation } from 'react-i18next';

const AppContent: React.FC = () => {
  const { activeSection } = useScrollSpy(sectionIds);
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useMobileNav();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { state, dispatch } = useAppState();
  const { i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Update SEO metadata when section changes
  useEffect(() => {
    const sectionKey = activeSection as keyof typeof seoSections;
    const metadata = seoSections[sectionKey] || seoDefaults;
    updateSEOMetadata(metadata);

    // Log page view to analytics
    analytics.logPageView(activeSection || 'home');
  }, [activeSection]);

  // Handle language changes
  useEffect(() => {
    if (state.selectedLanguage !== i18n.language) {
      i18n.changeLanguage(state.selectedLanguage);
    }
  }, [state.selectedLanguage, i18n]);

  // Close messages after 5 seconds
  useEffect(() => {
    if (state.error || state.successMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_MESSAGES' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error, state.successMessage, dispatch]);

  return (
    <MotionConfig reducedMotion="user">
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
        <Navigation
          activeSection={activeSection}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

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
              © {currentYear} Nimish Vishnoi. Built with React 19 & TypeScript. All rights reserved.
            </p>
          </motion.footer>
        </main>

        {/* Scroll to Top Button */}
        <ScrollToTopButton />

        {/* Admin Panel */}
        <AdminPanel />

        {/* Message Toasts */}
        {state.error && (
          <MessageToast
            message={state.error.message}
            type={state.error.type as 'error' | 'info' | 'success'}
            onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}
        {state.successMessage && (
          <MessageToast
            message={state.successMessage}
            type="success"
            onClose={() => dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null })}
          />
        )}
      </div>
    </MotionConfig>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
