import { summary, education } from '@data/education';
import { experiences } from '@data/experience';
import { skills } from '@data/skills';
import { projects } from '@data/projects';
import { contactInfo } from '@data/contact';
import { achievements } from '@data/achievements';
import type { ResumePayload } from '@types';

export const resumePayload: ResumePayload = {
  summary,
  education,
  experiences,
  skills,
  projects,
  contactInfo,
  achievements,
};
