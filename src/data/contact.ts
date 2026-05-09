/**
 * Contact information and social links
 */
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
