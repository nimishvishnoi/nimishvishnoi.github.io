/**
 * Firebase service for contact form submissions
 * Uses environment variables for configuration
 * Includes security measures: input sanitization, local rate limiting, spam detection
 */
import type { FirebaseOptions } from 'firebase/app';
import type { Database } from 'firebase/database';
import type { ContactFormData } from '@types';
import { getOptionalEnvValue } from '@/utils/env';

// Firebase configuration from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  databaseURL: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_DATABASE_URL),
  projectId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
};

export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let databasePromise: Promise<Database> | null = null;

const getConfiguredDatabase = async (): Promise<Database> => {
  if (!isFirebaseEnabled) {
    throw new Error(
      'Firebase is not configured. Please provide Firebase environment variables in .env.local.'
    );
  }

  if (!databasePromise) {
    databasePromise = Promise.all([import('firebase/app'), import('firebase/database')])
      .then(([appModule, databaseModule]) => {
        const app = appModule.getApps().length
          ? appModule.getApp()
          : appModule.initializeApp(firebaseConfig);

        return databaseModule.getDatabase(app);
      })
      .catch((error: unknown) => {
        databasePromise = null;
        throw error;
      });
  }

  return databasePromise;
};

const sanitizeContactData = async (
  formData: ContactFormData
): Promise<Required<ContactFormData>> => {
  const { default: DOMPurify } = await import('dompurify');

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  };

  return {
    name: sanitizeInput(formData.name),
    email: sanitizeInput(formData.email).toLowerCase(),
    phone: formData.phone ? sanitizeInput(formData.phone) : '',
    subject: sanitizeInput(formData.subject),
    message: sanitizeInput(formData.message),
  };
};

/**
 * Enhanced email validation
 */
const isValidEmail = (email: string): boolean => {
  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Reject disposable email patterns
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'maildrop.cc',
    'throwaway.email',
  ];

  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return !disposableDomains.includes(domain);
};

const isValidPhone = (phone: string): boolean => {
  return /^[\d\s\-+()]+$/.test(phone);
};

/**
 * Check for spam patterns
 */
const detectSpam = (formData: ContactFormData): boolean => {
  const combined =
    `${formData.name} ${formData.email} ${formData.subject} ${formData.message}`.toLowerCase();

  // Common spam patterns
  const spamPatterns = [
    /viagra|cialis|casino|poker|lottery|bitcoin|cryptocurrency/i,
    /click here now|limited offer|act now|urgent|click link/i,
    /you have won|congratulations|claim.*prize/i,
  ];

  const linkCount = (combined.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) return true;

  return spamPatterns.some((pattern) => pattern.test(combined));
};

const RATE_LIMIT_STORAGE_KEY = 'contact_form_submissions';

const readSubmissionTimestamps = (timeWindowMs: number): number[] => {
  try {
    const storedData = window.localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (!storedData) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedData);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const now = Date.now();
    return parsedValue.filter((timestamp): timestamp is number => {
      return typeof timestamp === 'number' && now - timestamp < timeWindowMs;
    });
  } catch {
    return [];
  }
};

const writeSubmissionTimestamps = (timestamps: number[]): void => {
  try {
    window.localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(timestamps));
  } catch {
    // Storage can be unavailable in private browsing or locked-down environments.
  }
};

/**
 * Submit contact form with client-side validation and secure Realtime Database write
 */
export const submitContactForm = async (
  formData: ContactFormData,
  recaptchaToken?: string
): Promise<void> => {
  // Spam detection
  if (detectSpam(formData)) {
    throw new Error('Your message was flagged as spam. Please review your content and try again.');
  }

  const sanitizedData = await sanitizeContactData(formData);

  if (!isValidEmail(sanitizedData.email)) {
    throw new Error('Invalid email address');
  }

  try {
    const [{ push, ref, serverTimestamp, set }, database] = await Promise.all([
      import('firebase/database'),
      getConfiguredDatabase(),
    ]);
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10);

    const messageRef = ref(database, `Message/${dateString}`);
    const newMessageRef = push(messageRef);

    const messageData = {
      name: sanitizedData.name,
      email: sanitizedData.email,
      ...(sanitizedData.phone ? { phone: sanitizedData.phone } : {}),
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString(),
      origin: window.location.origin.substring(0, 120),
      validationMethod: recaptchaToken ? 'client-validation+recaptcha' : 'client-validation',
      recaptchaStatus: recaptchaToken ? 'token-generated' : 'not-configured',
    };

    await set(newMessageRef, messageData);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error submitting contact form:', error);
    }
    throw error;
  }
};

/**
 * Validate form data before submission
 */
export const validateContactForm = (
  formData: ContactFormData
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  const name = formData.name.trim();
  const email = formData.email.trim();
  const phone = formData.phone?.trim() ?? '';
  const subject = formData.subject.trim();
  const message = formData.message.trim();

  if (name.length < 4) {
    errors.name = 'Please enter at least 4 characters';
  } else if (name.length > 100) {
    errors.name = 'Please keep your name under 100 characters';
  }

  // Validate email with enhanced validation
  if (email.length > 254 || !isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone (optional, but if provided, should be valid)
  if (phone && (phone.length > 30 || !isValidPhone(phone))) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Validate subject
  if (subject.length < 8) {
    errors.subject = 'Please enter at least 8 characters';
  } else if (subject.length > 150) {
    errors.subject = 'Please keep the subject under 150 characters';
  }

  // Validate message
  if (message.length < 10) {
    errors.message = 'Please write at least 10 characters';
  } else if (message.length > 2000) {
    errors.message = 'Please keep your message under 2000 characters';
  }

  // Check for spam
  if (detectSpam(formData)) {
    errors.message = 'Your message was flagged as spam. Please review your content.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Rate limiting using localStorage
 * Stores submission timestamps locally without sending a fingerprint to the database
 */
export const checkRateLimit = (
  maxSubmissions: number = 3,
  timeWindowMs: number = 3600000
): boolean => {
  return readSubmissionTimestamps(timeWindowMs).length < maxSubmissions;
};

export const recordContactFormSubmission = (timeWindowMs: number = 3600000): void => {
  const timestamps = readSubmissionTimestamps(timeWindowMs);

  timestamps.push(Date.now());
  writeSubmissionTimestamps(timestamps);
};
