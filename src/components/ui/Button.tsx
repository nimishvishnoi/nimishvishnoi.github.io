/**
 * Button Component
 */
import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & MotionProps
>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      isLoading = false,
      icon,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-accent font-semibold rounded-lg smooth-transition disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
      secondary:
        'bg-secondary-600 text-white hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600',
      outline:
        'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-dark-card',
      ghost: 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-dark-card',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <motion.button
        ref={ref as any}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...(props as any)}
      >
        {icon && <span>{icon}</span>}
        {isLoading ? 'Loading...' : children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
