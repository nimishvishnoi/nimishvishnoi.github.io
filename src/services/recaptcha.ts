/**
 * reCAPTCHA v3 Service
 * Handles bot verification with Google reCAPTCHA v3
 */
import { getOptionalEnvValue } from '@/utils/env';

const readRecaptchaSiteKey = (logMissing: boolean = false): string => {
  const key = getOptionalEnvValue(import.meta.env.VITE_RECAPTCHA_SITE_KEY);

  if (!key && logMissing && import.meta.env.DEV) {
    console.warn('reCAPTCHA site key not configured. Bot protection disabled.');
  }

  return key;
};

/**
 * Get reCAPTCHA site key from environment
 */
export const getRecaptchaSiteKey = (): string => {
  return readRecaptchaSiteKey(true);
};

/**
 * Check if reCAPTCHA is configured
 */
export const isRecaptchaEnabled = (): boolean => {
  return Boolean(readRecaptchaSiteKey());
};

/**
 * Load reCAPTCHA script dynamically.
 * Returns whether the script is ready to execute.
 */
export const loadRecaptchaScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const siteKey = getRecaptchaSiteKey();
    if (!siteKey) {
      resolve(false);
      return;
    }

    if (window.grecaptcha) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-recaptcha="true"]'
    );
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(Boolean(window.grecaptcha)), {
        once: true,
      });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'true';
    script.onload = () => resolve(Boolean(window.grecaptcha));
    script.onerror = () => {
      if (import.meta.env.DEV) {
        console.error('Failed to load reCAPTCHA script');
      }
      resolve(false);
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
          if (import.meta.env.DEV) {
            console.error('reCAPTCHA execution failed:', error);
          }
          resolve('');
        }
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('reCAPTCHA execution failed:', error);
      }
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
