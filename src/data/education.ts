/**
 * Education data
 */
import type { Education, ResumeSummary } from '@types';
import siteContent from './site-content.json';

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
}

export const education = ((siteContent as Record<string, unknown>).education as Record<string, unknown>[] ?? []).map((e: Record<string, unknown>) => ({
  ...e,
  startDate: toDate(e.startDate),
  endDate: toDate(e.endDate),
})) as Education[];

export const summary = (siteContent as Record<string, unknown>).summary as ResumeSummary;
