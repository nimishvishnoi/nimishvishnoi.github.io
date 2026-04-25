/**
 * Skills data
 */
import type { Skill } from '@types';

export const skills: Skill[] = [
  // Programming Languages
  {
    id: 'skill-1',
    name: 'C#',
    category: 'backend',
    proficiency: 'expert',
  },
  {
    id: 'skill-2',
    name: 'JavaScript',
    category: 'frontend',
    proficiency: 'expert',
  },
  {
    id: 'skill-3',
    name: 'Python',
    category: 'backend',
    proficiency: 'advanced',
  },

  // Web Development
  {
    id: 'skill-4',
    name: 'React JS',
    category: 'frontend',
    proficiency: 'expert',
  },
  {
    id: 'skill-5',
    name: 'Stencil JS',
    category: 'frontend',
    proficiency: 'advanced',
  },
  {
    id: 'skill-6',
    name: 'HTML',
    category: 'frontend',
    proficiency: 'expert',
  },
  {
    id: 'skill-7',
    name: 'CSS',
    category: 'frontend',
    proficiency: 'expert',
  },

  // Version Control
  {
    id: 'skill-8',
    name: 'Git',
    category: 'tools',
    proficiency: 'advanced',
  },

  // Databases
  {
    id: 'skill-9',
    name: 'SQL Server',
    category: 'database',
    proficiency: 'expert',
  },
  {
    id: 'skill-10',
    name: 'MongoDB',
    category: 'database',
    proficiency: 'intermediate',
  },

  // Frameworks & Libraries
  {
    id: 'skill-11',
    name: '.NET Core',
    category: 'backend',
    proficiency: 'expert',
  },
  {
    id: 'skill-12',
    name: 'MVC',
    category: 'backend',
    proficiency: 'expert',
  },
  {
    id: 'skill-13',
    name: 'RESTful Web Services',
    category: 'backend',
    proficiency: 'advanced',
  },
  {
    id: 'skill-14',
    name: 'jQuery',
    category: 'frontend',
    proficiency: 'advanced',
  },
  {
    id: 'skill-15',
    name: 'Bootstrap',
    category: 'frontend',
    proficiency: 'advanced',
  },
  {
    id: 'skill-16',
    name: 'Responsive Web Design',
    category: 'frontend',
    proficiency: 'advanced',
  },

  // Cloud Platforms
  {
    id: 'skill-17',
    name: 'AWS',
    category: 'tools',
    proficiency: 'advanced',
  },
  {
    id: 'skill-18',
    name: 'GitHub Actions',
    category: 'tools',
    proficiency: 'advanced',
  },
  {
    id: 'skill-19',
    name: 'Terraform',
    category: 'tools',
    proficiency: 'advanced',
  },
  {
    id: 'skill-20',
    name: 'Software Testing',
    category: 'tools',
    proficiency: 'advanced',
  },
];

export const skillCategories = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  database: 'Databases',
  tools: 'Tools & Cloud Platforms',
};
