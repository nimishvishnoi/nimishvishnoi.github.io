/**
 * Content service — reads portfolio content from Firestore.
 * Falls back to static data if Firestore is unavailable (e.g. offline / not configured).
 *
 * Firestore structure:
 *   portfolio/about                    → { title, description, fullDescription[] }
 *   portfolio/contact                  → { email, phone, location }
 *   portfolio/summary                  → { name, title, bio }
 *   portfolio/skillCategories          → { frontend, backend, database, tools }
 *   skills/{id}                        → Skill
 *   projects/{id}                      → Project  (technologies stored as array)
 *   experience/{id}                    → Experience (dates stored as ISO strings)
 *   education/{id}                     → Education  (dates stored as ISO strings)
 *   achievements/{id}                  → Achievement
 *   socialLinks/{id}                   → SocialLink
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

// ─── Static fallbacks ────────────────────────────────────────────────────────
import { aboutContent as staticAbout } from '../data/about';
import { skills as staticSkills, skillCategories as staticSkillCategories } from '../data/skills';
import { projects as staticProjects } from '../data/projects';
import { experiences as staticExperiences } from '../data/experience';
import { education as staticEducation, summary as staticSummary } from '../data/education';
import { achievements as staticAchievements } from '../data/achievements';
import { contactInfo as staticContact, socialLinks as staticSocialLinks } from '../data/contact';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Firestore stores dates as ISO strings; convert back to Date objects */
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

// ─── About ───────────────────────────────────────────────────────────────────

export interface AboutContent {
  title: string;
  description: string;
  fullDescription: string[];
}

export async function getAbout(): Promise<AboutContent> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'about'));
    if (snap.exists()) return snap.data() as AboutContent;
  } catch {
    /* fall through */
  }
  return staticAbout;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'contact'));
    if (snap.exists()) return snap.data() as ContactInfo;
  } catch {
    /* fall through */
  }
  return staticContact;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), 'socialLinks'), orderBy('id')));
    if (!snap.empty) return snap.docs.map((d) => d.data() as SocialLink);
  } catch {
    /* fall through */
  }
  return staticSocialLinks;
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export async function getSummary(): Promise<ResumeSummary> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'summary'));
    if (snap.exists()) return snap.data() as ResumeSummary;
  } catch {
    /* fall through */
  }
  return staticSummary;
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), 'skills'), orderBy('id')));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Skill);
  } catch {
    /* fall through */
  }
  return staticSkills;
}

export async function getSkillCategories(): Promise<Record<string, string>> {
  try {
    const snap = await getDoc(doc(getDb(), 'portfolio', 'skillCategories'));
    if (snap.exists()) return snap.data() as Record<string, string>;
  } catch {
    /* fall through */
  }
  return staticSkillCategories;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), 'projects'), orderBy('year', 'desc')));
    if (!snap.empty) return snap.docs.map((d) => d.data() as Project);
  } catch {
    /* fall through */
  }
  return staticProjects;
}

// ─── Experience ──────────────────────────────────────────────────────────────

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
  return staticExperiences;
}

// ─── Education ───────────────────────────────────────────────────────────────

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
  return staticAchievements;
}
