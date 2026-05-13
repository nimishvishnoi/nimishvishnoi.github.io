/**
 * useContent — fetches portfolio content from Firestore.
 * Returns loading state and the data, falling back to static data on error.
 */
import { useState, useEffect } from 'react';
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
import type { AboutContent } from '../services/content';
import {
  getAbout,
  getSkills,
  getSkillCategories,
  getProjects,
  getExperiences,
  getEducation,
  getAchievements,
  getContactInfo,
  getSocialLinks,
  getSummary,
} from '../services/content';

export interface PortfolioContent {
  about: AboutContent;
  skills: Skill[];
  skillCategories: Record<string, string>;
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  achievements: Achievement[];
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  summary: ResumeSummary;
}

// Static fallbacks for initial render (avoids layout shift)
import { aboutContent } from '../data/about';
import { skills, skillCategories } from '../data/skills';
import { projects } from '../data/projects';
import { experiences } from '../data/experience';
import { education, summary } from '../data/education';
import { achievements } from '../data/achievements';
import { contactInfo, socialLinks } from '../data/contact';

const STATIC_DEFAULTS: PortfolioContent = {
  about: aboutContent,
  skills,
  skillCategories,
  projects,
  experiences,
  education,
  achievements,
  contactInfo,
  socialLinks,
  summary,
};

export function useContent() {
  const [content, setContent] = useState<PortfolioContent>(STATIC_DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          about,
          fetchedSkills,
          fetchedSkillCategories,
          fetchedProjects,
          fetchedExperiences,
          fetchedEducation,
          fetchedAchievements,
          fetchedContact,
          fetchedSocialLinks,
          fetchedSummary,
        ] = await Promise.all([
          getAbout(),
          getSkills(),
          getSkillCategories(),
          getProjects(),
          getExperiences(),
          getEducation(),
          getAchievements(),
          getContactInfo(),
          getSocialLinks(),
          getSummary(),
        ]);

        if (!cancelled) {
          setContent({
            about,
            skills: fetchedSkills,
            skillCategories: fetchedSkillCategories,
            projects: fetchedProjects,
            experiences: fetchedExperiences,
            education: fetchedEducation,
            achievements: fetchedAchievements,
            contactInfo: fetchedContact,
            socialLinks: fetchedSocialLinks,
            summary: fetchedSummary,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load content from Firestore — showing cached data.');
          console.error('useContent error:', err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { content, isLoading, error };
}
