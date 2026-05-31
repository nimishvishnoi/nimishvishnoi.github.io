/**
 * Experience data
 */
import type { Experience } from '@types';
import siteContent from './site-content.json';

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
}

export const experiences = (
  ((siteContent as Record<string, unknown>).experience as Record<string, unknown>[]) ?? []
).map((e: Record<string, unknown>) => ({
  ...e,
  startDate: toDate(e.startDate),
  endDate: e.endDate ? toDate(e.endDate) : null,
})) as Experience[];
