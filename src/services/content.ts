/**
 * Content service — reads portfolio content from Firestore.
 *
 * Fallback priority:
 *   1. Firestore (live, editable via admin panel)
 *   2. site-content.json (edit this file + sync from admin panel)
 *   3. Individual TS data files (compile-time safety net)
 *
 * Firestore structure:
 *   portfolio/about            → { title, description, fullDescription[] }
 *   portfolio/contact          → { email, phone, location }
 *   portfolio/summary          → { name, title, bio }
 *   portfolio/skillCategories  → { frontend, backend, database, tools }
 *   skills/{id}                → Skill
 *   projects/{id}              → Project
 *   experience/{id}            → Experience  (dates as ISO strings)
 *   education/{id}             → Education   (dates as ISO strings)
 *   achievements/{id}          → Achievement
 *   socialLinks/{id}           → SocialLink
 */
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { getDb } from './firebase.firestore';
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

// ─── JSON fallback (single source of truth for offline / pre-seed) ────────────
import siteContent from '../data/site-content.json';

// ─── TS fallbacks (compile-time safety net) ───────────────────────────────────
import { aboutContent as staticAbout } from '../data/about';
import { skills as staticSkills, skillCategories as staticSkillCategories } from '../data/skills';
import { projects as staticProjects } from '../data/projects';
import { experiences as staticExperiences } from '../data/experience';
import { education as staticEducation, summary as staticSummary } from '../data/education';
import { achievements as staticAchievements } from '../data/achievements';
import { contactInfo as staticContact, socialLinks as staticSocialLinks } from '../data/contact';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  if (typeof value === 'number') return new Date(value);
  return new Date();
}

function toDateOrNull(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  return toDate(value);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AboutContent {
  title: string;
  description: string;
  fullDescription: string[];
}

// ─── About ────────────────────────────────────────────────────────────────────

export async function getAbout(): Promise<AboutContent> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'about'));
    if (snap.exists()) return snap.data() as AboutContent;
  } catch {
    /* fall through */
  }
  return (siteContent.about as AboutContent) ?? staticAbout;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'contact'));
    if (snap.exists()) return snap.data() as ContactInfo;
  } catch {
    /* fall through */
  }
  return (siteContent.contact as ContactInfo) ?? staticContact;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), 'socialLinks'), orderBy('id')));
    if (!snap.empty) return snap.docs.map((d) => d.data() as SocialLink);
  } catch {
    /* fall through */
  }
  return (siteContent.socialLinks as SocialLink[]) ?? staticSocialLinks;
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export async function getSummary(): Promise<ResumeSummary> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'summary'));
    if (snap.exists()) return snap.data() as ResumeSummary;
  } catch {
    /* fall through */
  }
  return (siteContent.summary as ResumeSummary) ?? staticSummary;
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), 'skills'), orderBy('id')));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Skill);
  } catch {
    /* fall through */
  }
  return (siteContent.skills as Skill[]) ?? staticSkills;
}

export async function getSkillCategories(): Promise<Record<string, string>> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'skillCategories'));
    if (snap.exists()) return snap.data() as Record<string, string>;
  } catch {
    /* fall through */
  }
  return (siteContent.skillCategories as Record<string, string>) ?? staticSkillCategories;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), 'projects'), orderBy('year', 'desc')));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Project);
  } catch {
    /* fall through */
  }
  return (siteContent.projects as Project[]) ?? staticProjects;
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function getExperiences(): Promise<Experience[]> {
  try {
    const snap = await getDocs(collection(getDb(), 'experience'));
    if (!snap.empty) {
      return snap.docs
        .map((d) => {
          const data = d.data();
          return {
            ...data,
            startDate: toDate(data.startDate),
            endDate: toDateOrNull(data.endDate),
          } as Experience;
        })
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    }
  } catch {
    /* fall through */
  }
  // JSON fallback — dates are ISO strings, convert to Date
  if (siteContent.experience?.length) {
    return (
      siteContent.experience as Array<
        Omit<Experience, 'startDate' | 'endDate'> & { startDate: string; endDate: string | null }
      >
    )
      .map((e) => ({ ...e, startDate: toDate(e.startDate), endDate: toDateOrNull(e.endDate) }))
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }
  return staticExperiences;
}

// ─── Education ────────────────────────────────────────────────────────────────

export async function getEducation(): Promise<Education[]> {
  try {
    const snap = await getDocs(collection(getDb(), 'education'));
    if (!snap.empty) {
      return snap.docs
        .map((d) => {
          const data = d.data();
          return {
            ...data,
            startDate: toDate(data.startDate),
            endDate: toDate(data.endDate),
          } as Education;
        })
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    }
  } catch {
    /* fall through */
  }
  if (siteContent.education?.length) {
    return (
      siteContent.education as Array<
        Omit<Education, 'startDate' | 'endDate'> & { startDate: string; endDate: string }
      >
    )
      .map((e) => ({ ...e, startDate: toDate(e.startDate), endDate: toDate(e.endDate) }))
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }
  return staticEducation;
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), 'achievements'), orderBy('year', 'desc')));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Achievement);
  } catch {
    /* fall through */
  }
  return (siteContent.achievements as Achievement[]) ?? staticAchievements;
}
