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
 * Format a date range using month and year only
 */
export const formatDateRange = (startDate: Date, endDate: Date | null): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
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

  const firstStartDate = new Date(
    Math.min(...experiences.map((experience) => experience.startDate.getTime()))
  );

  return calculateExperience(firstStartDate, new Date());
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
