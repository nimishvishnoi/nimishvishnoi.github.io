/**
 * Skills data
 */
import type { Skill } from '@types';

export const skills: Skill[] = [
  // Frontend
  {
    id: 'skill-1',
    name: 'JavaScript',
    category: 'frontend',
    proficiency: 'expert',
  },
  {
    id: 'skill-2',
    name: 'React Js',
    category: 'frontend',
    proficiency: 'expert',
  },
  {
    id: 'skill-3',
    name: 'HTML',
    category: 'frontend',
    proficiency: 'expert',
  },
  {
    id: 'skill-4',
    name: 'CSS',
    category: 'frontend',
    proficiency: 'expert',
  },
  {
    id: 'skill-5',
    name: 'Bootstrap',
    category: 'frontend',
    proficiency: 'advanced',
  },
  {
    id: 'skill-6',
    name: 'jQuery',
    category: 'frontend',
    proficiency: 'advanced',
  },

  // Backend
  {
    id: 'skill-7',
    name: '.NET',
    category: 'backend',
    proficiency: 'expert',
  },
  {
    id: 'skill-8',
    name: 'Python',
    category: 'backend',
    proficiency: 'advanced',
  },
  {
    id: 'skill-9',
    name: 'API',
    category: 'backend',
    proficiency: 'expert',
  },

  // Database
  {
    id: 'skill-10',
    name: 'SQL',
    category: 'database',
    proficiency: 'expert',
  },
  {
    id: 'skill-11',
    name: 'MongoDB',
    category: 'database',
    proficiency: 'advanced',
  },

  // Tools
  {
    id: 'skill-12',
    name: 'GIT / TFS',
    category: 'tools',
    proficiency: 'expert',
  },
];

export const skillCategories = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Databases',
  tools: 'Tools & Version Control',
};
