/**
 * About section content
 */
import type { AboutContent } from '../services/content';
import siteContent from './site-content.json';

export const aboutContent = (siteContent as Record<string, unknown>).about as AboutContent;
