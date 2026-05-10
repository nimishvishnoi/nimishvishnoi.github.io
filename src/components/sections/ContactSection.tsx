/**
 * Contact Section Component
 */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { SectionTitle, Card, Button, SocialLinks } from '@components/ui';
import { LoadingOverlay } from '@components/ui/LoadingComponents';
import { contactInfo, socialLinks } from '@data/contact';
import { useAppState } from '@hooks/useAppState';
import {
  validateContactForm,
  isFirebaseEnabled,
  submitContactForm,
  checkRateLimit,
  recordContactFormSubmission,
} from '@services/firebase';
import { loadRecaptchaScript, isRecaptchaEnabled, executeRecaptcha } from '@services/recaptcha';
import { useFormPersistence, debounce } from '@/utils/storage';
import analytics from '@services/analytics';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const getTimestamp = () => Date.now();

const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  phoneMax: 30,
  subjectMax: 150,
  messageMin: 10,
  messageMax: 2000,
};

// Validation schema using Zod (honeypot must be empty)
const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, 'Please enter at least 4 characters')
    .max(CONTACT_LIMITS.nameMax, 'Please keep your name under 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(CONTACT_LIMITS.emailMax, 'Please keep your email under 254 characters'),
  phone: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.phoneMax, 'Please keep your phone under 30 characters')
    .regex(/^[\d\s\-+()]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .trim()
    .min(8, 'Please enter at least 8 characters')
    .max(CONTACT_LIMITS.subjectMax, 'Please keep the subject under 150 characters'),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, 'Please write at least 10 characters')
    .max(CONTACT_LIMITS.messageMax, 'Please keep your message under 2000 characters'),
  website: z.string().max(200).optional().or(z.literal('')), // Honeypot field
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export const ContactSection: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const { saveToStorage, getFromStorage, clearStorage } = useFormPersistence('contact-form', {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submissionStartTime] = useState(getTimestamp());

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: getFromStorage() || undefined,
  });

  const formValues = useWatch({ control });
  const firebaseAvailable = isFirebaseEnabled;
  const recaptchaAvailable = isRecaptchaEnabled();

  // Auto-save form data with debouncing
  useEffect(() => {
    const debouncedSave = debounce(() => {
      saveToStorage(formValues);
    }, 1000);

    debouncedSave();
  }, [formValues, saveToStorage]);

  // Load reCAPTCHA script on component mount
  useEffect(() => {
    if (recaptchaAvailable) {
      loadRecaptchaScript().then((loaded) => {
        setRecaptchaLoaded(loaded);
      });
    }
  }, [recaptchaAvailable]);

  const onSubmit = async (data: ContactFormInputs): Promise<void> => {
    try {
      setSubmitStatus('loading');
      setErrorMessage('');
      dispatch({ type: 'SET_FORM_SUBMITTING', payload: true });

      // Honeypot check: if website field is filled, it's a bot
      if (data.website && data.website.trim().length > 0) {
        setSubmitStatus('success');
        reset();
        clearStorage();
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Message sent successfully!' });
        return;
      }

      // Rate limiting check: max 3 submissions per hour per device
      if (!checkRateLimit(3, 3600000)) {
        const errorMsg =
          'You have exceeded the maximum number of submissions. Please try again in 1 hour.';
        setErrorMessage(errorMsg);
        setSubmitStatus('error');
        dispatch({
          type: 'SET_ERROR',
          payload: {
            message: errorMsg,
            type: 'error',
            timestamp: getTimestamp(),
          },
        });
        return;
      }

      // Additional validation
      const validation = validateContactForm(data);
      if (!validation.isValid) {
        setErrorMessage('Please check all fields');
        setSubmitStatus('error');
        dispatch({
          type: 'SET_ERROR',
          payload: {
            message: 'Please check all fields',
            type: 'error',
            timestamp: getTimestamp(),
          },
        });
        return;
      }

      // Get reCAPTCHA token if available
      let recaptchaToken = '';
      if (recaptchaAvailable && recaptchaLoaded) {
        recaptchaToken = await executeRecaptcha('contact_form_submit');
      }

      await submitContactForm(data, recaptchaToken);
      recordContactFormSubmission();

      // Calculate submission duration
      const submissionDuration = getTimestamp() - submissionStartTime;

      // Log analytics
      await analytics.logFormSubmission('contact_form', true, submissionDuration);

      setSubmitStatus('success');
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Message sent successfully!' });
      reset();
      clearStorage();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Form submission error:', error);
      }
      const errorMsg =
        error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
      dispatch({
        type: 'SET_ERROR',
        payload: {
          message: errorMsg,
          type: 'error',
          timestamp: getTimestamp(),
        },
      });

      // Log failed submission
      await analytics.logFormSubmission(
        'contact_form',
        false,
        getTimestamp() - submissionStartTime
      );
    } finally {
      dispatch({ type: 'SET_FORM_SUBMITTING', payload: false });
    }
  };

  useEffect(() => {
    if (submitStatus !== 'success') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSubmitStatus('idle');
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [submitStatus]);

  return (
    <section id="contact" className="py-[5rem] px-4 scroll-mt-24 lg:scroll-mt-20">
      <div className="container-custom">
        <SectionTitle title="Contact" subtitle="Get in touch with me" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h3 className="font-[Raleway] font-bold text-lg mb-1">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400">{contactInfo.location}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary-600 text-white rounded-lg flex items-center justify-center shrink-0">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <h3 className="font-[Raleway] font-bold text-lg mb-1">Email</h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="break-all text-primary-600 dark:text-primary-400 hover:text-primary-700 smooth-transition"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center shrink-0">
                  <FaPhone size={20} />
                </div>
                <div>
                  <h3 className="font-[Raleway] font-bold text-lg mb-1">Phone</h3>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 smooth-transition"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-[Raleway] font-bold text-lg mb-4">Follow Me</h3>
              <SocialLinks links={socialLinks} size="lg" />
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <h3 className="font-[Raleway] font-bold text-xl mb-6">Send Me a Message</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!firebaseAvailable && (
                <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900 dark:border-yellow-600 dark:bg-yellow-900/10 dark:text-yellow-200">
                  Contact form is disabled because Firebase is not configured. Add the required
                  Firebase variables to <code className="font-mono">.env.local</code> and restart
                  the app.
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-accent font-semibold mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  id="name"
                  type="text"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.nameMax}
                  placeholder="John Doe"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-accent font-semibold mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.emailMax}
                  placeholder="john@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-accent font-semibold mb-2">
                  Your Phone
                </label>
                <input
                  {...register('phone')}
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={CONTACT_LIMITS.phoneMax}
                  placeholder="+91 9876543210"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-accent font-semibold mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('subject')}
                  id="subject"
                  type="text"
                  autoComplete="off"
                  maxLength={CONTACT_LIMITS.subjectMax}
                  placeholder="Project Discussion"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.subject && (
                  <p id="subject-error" className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Honeypot Field - Hidden from users */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  {...register('website')}
                  id="website"
                  type="text"
                  placeholder="Your Website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-accent font-semibold mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={5}
                  minLength={CONTACT_LIMITS.messageMin}
                  maxLength={CONTACT_LIMITS.messageMax}
                  placeholder="Your message here..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition resize-none"
                />
                {errors.message && (
                  <p id="message-error" className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-accent"
                >
                  Success: Your message has been sent. Thank you for reaching out.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-accent"
                >
                  Error: {errorMessage || 'Failed to send message. Please try again.'}
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  !firebaseAvailable ||
                  isSubmitting ||
                  submitStatus === 'loading' ||
                  state.isFormSubmitting
                }
                isLoading={isSubmitting || submitStatus === 'loading' || state.isFormSubmitting}
                className="w-full"
              >
                {submitStatus === 'loading' || state.isFormSubmitting
                  ? 'Sending...'
                  : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={state.isFormSubmitting} message="Sending your message..." />
    </section>
  );
};
