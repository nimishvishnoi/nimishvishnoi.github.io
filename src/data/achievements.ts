import type { Achievement } from '@types';
import siteContent from './site-content.json';

export const achievements = (siteContent as Record<string, unknown>).achievements as Achievement[];
