/**
 * Experience data
 */
import siteContent from './site-content.json';

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
}

export const experiences = ((siteContent as any).experience ?? []).map((e: any) => ({
  ...e,
  startDate: toDate(e.startDate),
  endDate: e.endDate ? toDate(e.endDate) : null,
}));
