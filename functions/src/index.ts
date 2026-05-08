/**
 * Firebase Cloud Functions for Contact Form Validation
 * Handles server-side verification of contact form submissions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.database();

// Environment configuration
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '';
const RECAPTCHA_MIN_SCORE = 0.5; // reCAPTCHA v3 score threshold (0.0-1.0)
const MAX_SUBMISSIONS_PER_HOUR = 3;
const MAX_SUBMISSIONS_PER_DAY = 20;

/**
 * Verify reCAPTCHA v3 token with Google
 */
const verifyRecaptchaToken = async (token: string, remoteIP?: string): Promise<{
  success: boolean;
  score: number;
  action: string;
  challengeTimestamp: string;
  hostname: string;
}> => {
  if (!RECAPTCHA_SECRET_KEY) {
    console.error('reCAPTCHA secret key not configured. Aborting validation.');
    throw new functions.https.HttpsError(
      'failed-precondition',
      'reCAPTCHA secret key is not configured on the server.'
    );
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {},
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
          remoteip: remoteIP,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to verify reCAPTCHA token'
    );
  }
};

/**
 * Check rate limit for device
 */
const checkRateLimit = async (
  deviceFingerprint: string,
  limitType: 'hour' | 'day' = 'hour'
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> => {
  const now = Date.now();
  const timeWindow = limitType === 'hour' ? 3600000 : 86400000;
  const maxSubmissions = limitType === 'hour' ? MAX_SUBMISSIONS_PER_HOUR : MAX_SUBMISSIONS_PER_DAY;

  const rateLimitRef = db.ref(`rate_limits/${deviceFingerprint}/${limitType}`);
  const snapshot = await rateLimitRef.get();

  let submissions: number[] = [];
  if (snapshot.exists()) {
    submissions = snapshot.val() || [];
  }

  // Remove old submissions outside time window
  submissions = submissions.filter(ts => now - ts < timeWindow);

  const allowed = submissions.length < maxSubmissions;
  const remaining = Math.max(0, maxSubmissions - submissions.length - 1);
  const resetTime = submissions.length > 0 ? submissions[0] + timeWindow : now + timeWindow;

  // Add current submission
  if (allowed) {
    submissions.push(now);
    await rateLimitRef.set(submissions);
  }

  return { allowed, remaining, resetTime };
};

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // Reject disposable email domains
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'maildrop.cc',
    'throwaway.email',
    'temp-mail.org',
    'mytrashmail.com',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return !disposableDomains.includes(domain);
};

/**
 * Validate contact form submission
 * Cloud Function endpoint: https://us-central1-{PROJECT_ID}.cloudfunctions.net/validateContactSubmission
 */
export const validateContactSubmission = functions.https.onCall(
  async (data, context) => {
    try {
      // Validate input data
      if (!data.formData || !data.recaptchaToken) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Missing required fields: formData and recaptchaToken'
        );
      }

      const { formData, recaptchaToken, deviceFingerprint, origin } = data;

      // Validate origin
      const allowedOrigins = [
        'https://nimishvishnoi.github.io',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

      if (!allowedOrigins.includes(origin)) {
        console.warn(`Submission from unauthorized origin: ${origin}`);
        throw new functions.https.HttpsError(
          'permission-denied',
          'Submission origin not allowed'
        );
      }

      // Get client IP for reCAPTCHA verification
      const xForwardedFor = context.rawRequest.headers['x-forwarded-for'];
      const clientIP =
        typeof xForwardedFor === 'string'
          ? xForwardedFor.split(',')[0]?.trim()
          : Array.isArray(xForwardedFor)
          ? xForwardedFor[0]?.trim()
          : context.rawRequest.connection.remoteAddress;

      // Step 1: Verify reCAPTCHA token
      console.log('Verifying reCAPTCHA token...');
      const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, clientIP as string);

      if (!recaptchaResult.success) {
        console.warn('reCAPTCHA verification failed:', recaptchaResult);
        throw new functions.https.HttpsError(
          'permission-denied',
          'reCAPTCHA verification failed'
        );
      }

      if (recaptchaResult.score < RECAPTCHA_MIN_SCORE) {
        console.warn(`Low reCAPTCHA score: ${recaptchaResult.score}`);
        throw new functions.https.HttpsError(
          'permission-denied',
          'Failed bot detection. Please try again.'
        );
      }

      // Step 2: Check rate limits (hourly)
      console.log('Checking rate limits...');
      const hourlyLimit = await checkRateLimit(deviceFingerprint, 'hour');
      if (!hourlyLimit.allowed) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          `Too many submissions. Please try again in ${Math.ceil((hourlyLimit.resetTime - Date.now()) / 60000)} minutes.`
        );
      }

      // Step 3: Check rate limits (daily)
      const dailyLimit = await checkRateLimit(deviceFingerprint, 'day');
      if (!dailyLimit.allowed) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          `Daily submission limit reached. Please try again tomorrow.`
        );
      }

      // Step 4: Validate form data
      console.log('Validating form data...');
      if (!formData.name || formData.name.trim().length < 4) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Invalid name: minimum 4 characters'
        );
      }

      if (!isValidEmail(formData.email)) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Invalid email address'
        );
      }

      if (!formData.subject || formData.subject.trim().length < 8) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Invalid subject: minimum 8 characters'
        );
      }

      if (!formData.message || formData.message.trim().length === 0) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Message cannot be empty'
        );
      }

      // Step 5: Check for spam patterns
      const combined = `${formData.name} ${formData.email} ${formData.subject} ${formData.message}`.toLowerCase();
      const spamPatterns = [
        /viagra|cialis|casino|poker|lottery|bitcoin|cryptocurrency/i,
        /click here now|limited offer|act now|urgent|click link/i,
        /you have won|congratulations|claim.*prize/i,
      ];

      const isSpam = spamPatterns.some(pattern => pattern.test(combined));
      if (isSpam) {
        console.warn('Spam detected in submission');
        throw new functions.https.HttpsError(
          'permission-denied',
          'Your message was flagged as spam'
        );
      }

      // Step 6: Save the verified and sanitized submission to the database
      console.log('Saving validated submission...');
      const now = new Date();
      const dateString = `${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}${now.getFullYear()}`;

      const submissionsRef = db.ref(`Message/${dateString}`);
      const newSubmissionRef = submissionsRef.push();

      await newSubmissionRef.set({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        subject: formData.subject,
        message: formData.message,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        submittedAt: now.toISOString(),
        deviceFingerprint: deviceFingerprint || 'unknown',
        origin: origin || 'unknown',
        userAgent: context.rawRequest.headers['user-agent']?.substring(0, 100) || '',
        recaptchaScore: recaptchaResult.score,
        verified: true,
      });

      return {
        success: true,
        message: 'Submission validated and saved successfully',
        recaptchaScore: recaptchaResult.score,
        remainingSubmissions: hourlyLimit.remaining,
      };
    } catch (error) {
      // Log error for debugging
      console.error('Validation error:', error);

      // Re-throw if it's already an HttpsError
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      // Throw generic error for security
      throw new functions.https.HttpsError(
        'internal',
        'An error occurred while processing your request'
      );
    }
  }
);

/**
 * Cleanup old rate limit entries (runs daily)
 */
export const cleanupRateLimits = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    try {
      const rateLimitsRef = db.ref('rate_limits');
      const snapshot = await rateLimitsRef.get();

      if (!snapshot.exists()) {
        return null;
      }

      const now = Date.now();
      const updates: Record<string, null> = {};
      const data = snapshot.val();

      // Remove rate limit entries older than 7 days
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      for (const deviceId of Object.keys(data)) {
        for (const limitType of Object.keys(data[deviceId])) {
          const submissions = data[deviceId][limitType];
          if (Array.isArray(submissions)) {
            const recentSubmissions = submissions.filter(ts => ts > sevenDaysAgo);
            if (recentSubmissions.length === 0) {
              updates[`${deviceId}/${limitType}`] = null;
            }
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        await rateLimitsRef.update(updates);
        console.log(`Cleaned up ${Object.keys(updates).length} rate limit entries`);
      }

      return null;
    } catch (error) {
      console.error('Error cleaning up rate limits:', error);
      return null;
    }
  });
