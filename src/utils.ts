/**
 * Utility functions
 */

/**
 * Calculate experience in years and months from a start date
 */
export const calculateExperience = (
  startDate: Date,
  endDate: Date = new Date()
): { years: number; months: number } => {
  if (endDate < startDate) {
    return { years: 0, months: 0 };
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  const days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
};

/**
 * Format experience text
 */
export const formatExperience = (years: number, months: number): string => {
  const yearText = years > 1 ? 'Years' : 'Year';
  const monthText = months > 1 ? 'Months' : 'Month';

  if (years > 0 && months > 0) {
    return `${years} ${yearText} ${months} ${monthText}`;
  } else if (years > 0) {
    return `${years} ${yearText}`;
  } else {
    return `${months} ${monthText}`;
  }
};

/**
 * Format date to readable format
 */
export const formatDate = (date: Date | null): string => {
  if (!date) return 'Present';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

/**
 * Get total years of experience from experiences array
 */
export const getTotalExperience = (
  experiences: Array<{ startDate: Date; endDate: Date | null }>
): { years: number; months: number } => {
  if (experiences.length === 0) {
    return { years: 0, months: 0 };
  }

  const now = new Date();
  const ranges = experiences
    .map((experience) => ({
      start: new Date(experience.startDate),
      end: new Date(experience.endDate ?? now),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const mergedRanges: Array<{ start: Date; end: Date }> = [];
  for (const range of ranges) {
    const previous = mergedRanges[mergedRanges.length - 1];
    if (!previous || range.start.getTime() > previous.end.getTime()) {
      mergedRanges.push(range);
      continue;
    }

    if (range.end.getTime() > previous.end.getTime()) {
      previous.end = range.end;
    }
  }

  const totalMonths = mergedRanges.reduce((sum, range) => {
    const { years, months } = calculateExperience(range.start, range.end);
    return sum + years * 12 + months;
  }, 0);

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  };
};

/**
 * Smooth scroll to element
 */
export const smoothScroll = (target: string): void => {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
