/**
 * Badge Component
 */
import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'primary', size = 'md' }) => {
  const baseStyles =
    'inline-flex items-center font-accent font-semibold rounded-full whitespace-nowrap';

  const variants = {
    primary: 'bg-primary-600 text-white dark:bg-primary-500',
    secondary: 'bg-secondary-600 text-white dark:bg-secondary-500',
    outline:
      'border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2 text-base',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>{text}</span>;
};
