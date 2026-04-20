/**
 * Contact Section Component
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { SectionTitle, Card, Button, SocialLinks } from '@components/ui';
import { contactInfo, socialLinks } from '@data/contact';
import {
  submitContactForm,
  validateContactForm,
  isFirebaseEnabled,
} from '@services/firebase';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

// Validation schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(4, 'Please enter at least 4 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().min(8, 'Please enter at least 8 characters'),
  message: z.string().min(1, 'Please write something'),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export const ContactSection: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const firebaseAvailable = isFirebaseEnabled;

  const onSubmit = async (data: ContactFormInputs): Promise<void> => {
    try {
      setSubmitStatus('loading');
      setErrorMessage('');

      // Additional validation
      const validation = validateContactForm(data);
      if (!validation.isValid) {
        setErrorMessage('Please check all fields');
        setSubmitStatus('error');
        return;
      }

      // Submit to Firebase
      await submitContactForm(data);

      setSubmitStatus('success');
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      );
      setSubmitStatus('error');
    }
  };

  return (
    <section id="contact" className="py-[5rem] px-4">
      <div className="container-custom">
        <SectionTitle title="Contact" subtitle="Get in touch with me" />

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div className="w-12 h-12 bg-secondary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <h3 className="font-[Raleway] font-bold text-lg mb-1">Email</h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 smooth-transition"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
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
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
                  placeholder="Project Discussion"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
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
                  placeholder="Your message here..."
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-primary-600 focus:outline-none smooth-transition resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-accent"
                >
                  ✓ Your message has been sent successfully! Thank you for reaching out.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-accent"
                >
                  ✗ {errorMessage || 'Failed to send message. Please try again.'}
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  !firebaseAvailable || isSubmitting || submitStatus === 'loading'
                }
                isLoading={isSubmitting || submitStatus === 'loading'}
                className="w-full"
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
