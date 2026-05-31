/**
 * Projects data
 */
import type { Project } from '@types';
import siteContent from './site-content.json';

export const projects = (siteContent as Record<string, unknown>).projects as Project[];
