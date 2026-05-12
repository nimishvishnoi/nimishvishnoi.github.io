import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage with a working in-memory store
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Firebase — complete set of exports used across the codebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    // Simulate no user signed in
    callback(null);
    return vi.fn(); // unsubscribe
  }),
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(() => ({})),
  ref: vi.fn(() => ({})),
  set: vi.fn(() => Promise.resolve()),
  push: vi.fn(() => ({})),
  get: vi.fn(() =>
    Promise.resolve({
      exists: () => false,
      val: () => null,
      forEach: vi.fn(),
    })
  ),
  query: vi.fn((...args) => args[0]),
  orderByChild: vi.fn(() => ({})),
  limitToLast: vi.fn(() => ({})),
}));
