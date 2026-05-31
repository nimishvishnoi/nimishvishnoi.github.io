import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useFormPersistence, debounce, throttle, getCachedPDF, cachePDF } from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('useFormPersistence', () => {
    it('should save form data to localStorage', () => {
      const persistence = useFormPersistence('test-form');

      act(() => {
        persistence.saveToStorage({ name: 'John', email: 'john@test.com' });
      });

      const stored = localStorage.getItem('test-form');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.data).toEqual({ name: 'John', email: 'john@test.com' });
    });

    it('should retrieve form data from localStorage', () => {
      const persistence = useFormPersistence('test-form');

      act(() => {
        persistence.saveToStorage({ name: 'Jane', email: 'jane@test.com' });
      });

      act(() => {
        const retrieved = persistence.getFromStorage();
        expect(retrieved).toEqual({ name: 'Jane', email: 'jane@test.com' });
      });
    });

    it('should clear localStorage', () => {
      const persistence = useFormPersistence('test-form');

      act(() => {
        persistence.saveToStorage({ name: 'Test' });
      });

      act(() => {
        persistence.clearStorage();
      });

      expect(localStorage.getItem('test-form')).toBeNull();
    });

    it('should return null for expired data (7+ days old)', () => {
      const persistence = useFormPersistence('test-form');
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        'test-form',
        JSON.stringify({ data: { name: 'Old' }, timestamp: eightDaysAgo })
      );

      const result = persistence.getFromStorage();
      expect(result).toBeNull();
      expect(localStorage.getItem('test-form')).toBeNull();
    });
  });

  describe('PDF Cache', () => {
    it('should cache and retrieve PDF data', () => {
      const testPDF = 'data:application/pdf;base64,TEST';
      cachePDF('test-pdf', testPDF);

      const cached = getCachedPDF('test-pdf');
      expect(cached).toBe(testPDF);
    });

    it('should return null for non-existent cache', () => {
      const cached = getCachedPDF('non-existent');
      expect(cached).toBeNull();
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0;
      const mockFn = () => callCount++;
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      let callCount = 0;
      const mockFn = () => callCount++;
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(callCount).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, 150));
      throttledFn();
      expect(callCount).toBe(2);
    });
  });
});
