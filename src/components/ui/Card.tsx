/**
 * Card Component
 */
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={hover ? { translateY: -8 } : undefined}
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-xl dark:hover:shadow-2xl smooth-transition p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};
