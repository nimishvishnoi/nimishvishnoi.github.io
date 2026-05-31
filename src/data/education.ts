/**
 * Education data
 */
import siteContent from './site-content.json';

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
}

export const education = ((siteContent as any).education ?? []).map((e: any) => ({
  ...e,
  startDate: toDate(e.startDate),
  endDate: toDate(e.endDate),
}));

export const summary = (siteContent as any).summary;
