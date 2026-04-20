/**
 * SocialLinks Component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import type { SocialLink } from '@types';

interface SocialLinksProps {
  links: SocialLink[];
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ links, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <div className="flex gap-3 justify-center">
      {links.map((link, index) => {
        const IconComponent = iconMap[link.icon as keyof typeof iconMap];

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.platform}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white hover:shadow-lg dark:shadow-lg smooth-transition`}
          >
            {IconComponent && <IconComponent className="w-full h-full p-2" />}
          </motion.a>
        );
      })}
    </div>
  );
};
