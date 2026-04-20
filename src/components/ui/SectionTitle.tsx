/**
 * SectionTitle Component
 */
import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
