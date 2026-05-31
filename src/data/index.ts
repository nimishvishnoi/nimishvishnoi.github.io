/**
 * Central data export hub
 *
 * Single source-of-truth for all portfolio content.
 * Data is authored in `site-content.json` and re-exported here with types.
 *
 * Pattern:
 *   - JSON (site-content.json) = canonical editable source
 *   - Thin wrappers (*.ts files) = re-export with date conversions
 *   - This index = typed convenience exports for consumers
 */
import type {
  Skill,
  Project,
  Experience,
  Education,
  Achievement,
  SocialLink,
  ContactInfo,
  ResumeSummary,
} from '../types';

// Re-export with proper typing to avoid `any` throughout the codebase
export type { AboutContent } from '../services/content';
export type {
  Skill,
  Project,
  Experience,
  Education,
  Achievement,
  SocialLink,
  ContactInfo,
  ResumeSummary,
};

// Import thin wrappers (which re-export from site-content.json with type conversions)
export { aboutContent } from './about';
export { contactInfo, socialLinks } from './contact';
export { skills, skillCategories } from './skills';
export { projects } from './projects';
export { experiences } from './experience';
export { education, summary } from './education';
export { achievements } from './achievements';

// Resume composite
export { resumePayload } from './resume';

// Named aggregation for convenience (optional import pattern)
import { aboutContent } from './about';
import { contactInfo, socialLinks } from './contact';
import { skills, skillCategories } from './skills';
import { projects } from './projects';
import { experiences } from './experience';
import { education, summary } from './education';
import { achievements } from './achievements';

export const portfolioData = {
  about: aboutContent,
  contact: contactInfo,
  socialLinks,
  skills,
  skillCategories,
  projects,
  experiences,
  education,
  achievements,
  summary,
};
