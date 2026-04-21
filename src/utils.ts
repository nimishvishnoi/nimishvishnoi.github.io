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
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();

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

  const oldestStart = new Date(Math.min(...experiences.map((e) => e.startDate.getTime())));
  const newestEnd = new Date();

  return calculateExperience(oldestStart, newestEnd);
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
