/**
 * Firebase service for contact form submissions
 * Uses environment variables for configuration
 */
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, serverTimestamp } from 'firebase/database';
import type { ContactFormData } from '@types';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Submit contact form to Firebase
 */
export const submitContactForm = async (formData: ContactFormData): Promise<void> => {
  try {
    // Create date-based path for organization
    const now = new Date();
    const dateString = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getFullYear()}`;

    // Create a new reference for the message
    const messageRef = ref(database, `Message/${dateString}`);
    const newMessageRef = push(messageRef);

    // Prepare the data with timestamp
    const messageData = {
      ...formData,
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString(),
    };

    // Set the data in the database
    await set(newMessageRef, messageData);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

/**
 * Validate form data before submission
 */
export const validateContactForm = (formData: ContactFormData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!formData.name || formData.name.trim().length < 4) {
    errors.name = 'Please enter at least 4 characters';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone (optional, but if provided, should be valid)
  if (formData.phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
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

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
