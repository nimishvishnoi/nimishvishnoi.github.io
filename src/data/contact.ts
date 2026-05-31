/**
 * Contact information and social links
 */
import type { ContactInfo, SocialLink } from '@types';
import siteContent from './site-content.json';

export const contactInfo = (siteContent as Record<string, unknown>).contact as ContactInfo;
export const socialLinks = (siteContent as Record<string, unknown>).socialLinks as SocialLink[];
