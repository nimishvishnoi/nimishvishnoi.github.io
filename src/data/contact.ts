/**
 * Contact information and social links
 */
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import type { ContactInfo, SocialLink } from '@types';

export const contactInfo: ContactInfo = {
  email: 'nimish.vishnoi@rocketmail.com',
  phone: '+91 829-971-8692',
  location: 'Noida, Uttar Pradesh, India',
};

export const socialLinks: SocialLink[] = [
  {
    id: 'social-1',
    platform: 'GitHub',
    url: 'https://github.com/nimishvishnoi',
    icon: 'FaGithub',
  },
  {
    id: 'social-2',
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nimishvishnoi',
    icon: 'FaLinkedin',
  },
  {
    id: 'social-3',
    platform: 'Facebook',
    url: 'https://www.facebook.com/nimishvishnoi',
    icon: 'FaFacebook',
  },
  {
    id: 'social-4',
    platform: 'Twitter',
    url: 'https://twitter.com/NimishVishnoi',
    icon: 'FaTwitter',
  },
  {
    id: 'social-5',
    platform: 'Instagram',
    url: 'https://www.instagram.com/nimishvishnoi',
    icon: 'FaInstagram',
  },
];

// Map icon names to actual React Icon components
export const iconMap = {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
};

export const navigationLinks = [
  { label: 'About', href: '#about', icon: 'FaUser' },
  { label: 'Skills', href: '#skills', icon: 'FaCode' },
  { label: 'Resume', href: '#resume', icon: 'FaFileAlt' },
  { label: 'Projects', href: '#portfolio', icon: 'FaProjectDiagram' },
  { label: 'Contact', href: '#contact', icon: 'FaEnvelope' },
];
