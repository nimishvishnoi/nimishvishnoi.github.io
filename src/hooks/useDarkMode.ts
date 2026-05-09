/**
 * Dark Mode Hook
 */
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'darkMode';

const readStoredPreference = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const savedPreference = readStoredPreference();
  if (savedPreference === 'true') {
    return true;
  }

  if (savedPreference === 'false') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useDarkMode = (): {
  darkMode: boolean;
  toggleDarkMode: () => void;
} => {
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';

    try {
      window.localStorage.setItem(STORAGE_KEY, String(darkMode));
    } catch {
      // Persisting theme is a convenience; the UI still works without storage access.
    }
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedPreference = readStoredPreference();

    if (savedPreference !== null) {
      return undefined;
    }

    const handleChange = (event: MediaQueryListEvent): void => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = (): void => {
    setDarkMode((previousValue) => !previousValue);
  };

  return { darkMode, toggleDarkMode };
};
