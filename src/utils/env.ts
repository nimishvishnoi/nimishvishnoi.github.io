const PLACEHOLDER_PATTERNS = [/^your_/i, /^replace_/i, /_here$/i, /placeholder/i];

export const getOptionalEnvValue = (value: string | undefined): string => {
  const normalizedValue = value?.trim() ?? '';

  if (!normalizedValue) {
    return '';
  }

  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalizedValue))) {
    return '';
  }

  return normalizedValue;
};
