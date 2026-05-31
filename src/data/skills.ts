/**
 * Skills data
 */
import type { Skill } from '@types';
import siteContent from './site-content.json';

export const skills = (siteContent as Record<string, unknown>).skills as Skill[];
export const skillCategories = (siteContent as Record<string, unknown>).skillCategories as Record<
  string,
  string
>;
