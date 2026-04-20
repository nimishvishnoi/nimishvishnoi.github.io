/**
 * Type definitions for the portfolio
 */

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  proficiency: 'expert' | 'advanced' | 'intermediate';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | null; // null for current position
  description: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  field: string;
  startDate: Date;
  endDate: Date;
}

export interface Project {
  id: string;
  title: string;
  year: number;
  description: string;
  technologies: string[];
  url?: string;
  category: 'app' | 'web' | 'card';
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string; // react-icons icon name
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
