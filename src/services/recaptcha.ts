/**
 * reCAPTCHA v3 Service
 * Handles bot verification with Google reCAPTCHA v3
 */

/**
 * Get reCAPTCHA site key from environment
 */
export const getRecaptchaSiteKey = (): string => {
  const key = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!key) {
    console.warn('reCAPTCHA site key not configured. Bot protection disabled.');
    return '';
  }
  return key;
};

/**
 * Check if reCAPTCHA is configured
 */
export const isRecaptchaEnabled = (): boolean => {
  return Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
};

/**
 * Load reCAPTCHA script dynamically
 */
export const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${getRecaptchaSiteKey()}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      resolve();
    };
    document.head.appendChild(script);
  });
};

export const executeRecaptcha = async (action: string = 'contact_form_submit'): Promise<string> => {
  const siteKey = getRecaptchaSiteKey();
  const grecaptcha = window.grecaptcha;

  if (!siteKey || !grecaptcha) {
    return '';
  }

  return new Promise((resolve) => {
    try {
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch (error) {
          console.error('reCAPTCHA execution failed:', error);
          resolve('');
        }
      });
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      resolve('');
    }
  });
};

/**
 * Type declaration for grecaptcha
 */
declare global {
  interface Window {
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}
