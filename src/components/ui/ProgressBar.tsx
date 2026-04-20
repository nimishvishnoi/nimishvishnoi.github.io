/**
 * ProgressBar Component
 */
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  percentage: number;
  color?: 'primary' | 'secondary';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percentage,
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-500',
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-lg font-accent font-semibold text-gray-800 dark:text-white">
          {label}
        </label>
        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden h-3">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={`h-full ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
};
