/**
 * Firebase service for contact form submissions
 * Uses environment variables for configuration
 * Includes security measures: input sanitization, rate limiting, spam detection
 */
import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getDatabase, ref, push, set, serverTimestamp, type Database } from 'firebase/database';
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
import DOMPurify from 'dompurify';
import type { ContactFormData } from '@types';

// Firebase configuration from environment variables
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId
);

let database: Database | null = null;
let functionsClient: Functions | null = null;

if (isFirebaseEnabled) {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  functionsClient = getFunctions(app);
} else {
  console.warn('Firebase is not configured. Contact form submissions are disabled.');
}

/**
 * Security utilities for form submission
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim(), { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
};

/**
 * Generate device fingerprint for rate limiting and abuse detection
 */
const getDeviceFingerprint = (): string => {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
  };
  
  // Simple hash of fingerprint
  const str = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
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
    'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'maildrop.cc', 'throwaway.email'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  return !disposableDomains.includes(domain);
};

/**
 * Check for spam patterns
 */
const detectSpam = (formData: ContactFormData): boolean => {
  const combined = `${formData.name} ${formData.email} ${formData.subject} ${formData.message}`.toLowerCase();
  
  // Common spam patterns
  const spamPatterns = [
    /viagra|cialis|casino|poker|lottery|bitcoin|cryptocurrency/i,
    /click here now|limited offer|act now|urgent|click link/i,
    /you have won|congratulations|claim.*prize/i,
    /https?:\/\/[^\s]+/g, // Multiple links
  ];
  
  const linkCount = (combined.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) return true; // Too many links
  
  return spamPatterns.some(pattern => pattern.test(combined));
};

/**
 * Submit contact form to Firebase with security validations
 */
export const submitContactForm = async (formData: ContactFormData): Promise<void> => {
  if (!database) {
    throw new Error(
      'Firebase is not configured. Please provide Firebase environment variables in .env.local.'
    );
  }

  // Spam detection
  if (detectSpam(formData)) {
    throw new Error('Your message was flagged as spam. Please review your content and try again.');
  }

  try {
    const now = new Date();
    const dateString = `${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}${now.getFullYear()}`;

    const messageRef = ref(database, `Message/${dateString}`);
    const newMessageRef = push(messageRef);

    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: formData.phone ? sanitizeInput(formData.phone) : '',
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message),
    };

    // Additional validation after sanitization
    if (!isValidEmail(sanitizedData.email)) {
      throw new Error('Invalid email address');
    }

    const messageData = {
      ...sanitizedData,
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString(),
      deviceFingerprint: getDeviceFingerprint(),
      origin: window.location.origin,
      userAgent: navigator.userAgent.substring(0, 100), // Truncate for privacy
    };

    await set(newMessageRef, messageData);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

/**
 * Submit contact form with reCAPTCHA verification
 * Calls Cloud Function for server-side validation
 */
export const submitContactFormWithRecaptcha = async (
  formData: ContactFormData,
  recaptchaToken: string
): Promise<void> => {
  if (!functionsClient) {
    throw new Error(
      'Firebase functions are not configured. Please verify Firebase environment variables and initialization.'
    );
  }

  if (!recaptchaToken) {
    throw new Error('reCAPTCHA verification failed. Please reload the page and try again.');
  }

  // Spam detection
  if (detectSpam(formData)) {
    throw new Error('Your message was flagged as spam. Please review your content and try again.');
  }

  // Sanitize all inputs
  const sanitizedData = {
    name: sanitizeInput(formData.name),
    email: sanitizeInput(formData.email),
    phone: formData.phone ? sanitizeInput(formData.phone) : '',
    subject: sanitizeInput(formData.subject),
    message: sanitizeInput(formData.message),
  };

  if (!isValidEmail(sanitizedData.email)) {
    throw new Error('Invalid email address');
  }

  try {
    const validateContactSubmission = httpsCallable(functionsClient, 'validateContactSubmission');
    const response = await validateContactSubmission({
      formData: sanitizedData,
      recaptchaToken,
      deviceFingerprint: getDeviceFingerprint(),
      origin: window.location.origin,
    });

    const responseData = response.data as { success?: boolean } | undefined;
    if (!responseData || responseData.success !== true) {
      throw new Error('Contact form submission could not be validated.');
    }
  } catch (error) {
    console.error('Error submitting contact form with reCAPTCHA:', error);
    throw error;
  }
};

export { isFirebaseEnabled };

/**
 * Validate form data before submission
 */
export const validateContactForm = (
  formData: ContactFormData
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!formData.name || formData.name.trim().length < 4) {
    errors.name = 'Please enter at least 4 characters';
  }

  // Validate email with enhanced validation
  if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone (optional, but if provided, should be valid)
  if (formData.phone) {
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  // Validate subject
  if (!formData.subject || formData.subject.trim().length < 8) {
    errors.subject = 'Please enter at least 8 characters';
  }

  // Validate message
  if (!formData.message || formData.message.trim().length === 0) {
    errors.message = 'Please write something';
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
 * Stores submission timestamps by device fingerprint
 */
export const checkRateLimit = (maxSubmissions: number = 3, timeWindowMs: number = 3600000): boolean => {
  const fingerprint = getDeviceFingerprint();
  const storageKey = `submission_${fingerprint}`;
  const now = Date.now();

  const storedData = localStorage.getItem(storageKey);
  let timestamps: number[] = [];

  if (storedData) {
    try {
      timestamps = JSON.parse(storedData);
      // Remove old timestamps outside the time window
      timestamps = timestamps.filter(ts => now - ts < timeWindowMs);
    } catch {
      timestamps = [];
    }
  }

  // Check if user has exceeded rate limit
  if (timestamps.length >= maxSubmissions) {
    return false;
  }

  // Add current timestamp and save
  timestamps.push(now);
  localStorage.setItem(storageKey, JSON.stringify(timestamps));
  return true;
};
