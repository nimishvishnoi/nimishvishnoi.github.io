/**
 * useFormPersistence - Auto-save form data to localStorage
 * Recovers on component mount if available
 */
export function useFormPersistence(key: string, _initialData: Record<string, any>) {
  const saveToStorage = (data: Record<string, any>) => {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (error) {
      console.error(`Failed to save form to localStorage:`, error);
    }
  };

  const getFromStorage = (): Record<string, any> | null => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        const age = Date.now() - parsed.timestamp;
        // Expire after 7 days
        if (age < 7 * 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Failed to retrieve form from localStorage:`, error);
    }
    return null;
  };

  const clearStorage = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to clear localStorage:`, error);
    }
  };

  return { saveToStorage, getFromStorage, clearStorage };
}

/**
 * Cache for generated PDFs and expensive computations
 */
const pdfCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_EXPIRY_MS = 1 * 60 * 60 * 1000; // 1 hour

export function cachePDF(key: string, data: string) {
  pdfCache.set(key, { data, timestamp: Date.now() });
}

export function getCachedPDF(key: string): string | null {
  const cached = pdfCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
    return cached.data;
  }
  if (cached) {
    pdfCache.delete(key);
  }
  return null;
}

export function clearPDFCache() {
  pdfCache.clear();
}

/**
 * Image optimization: preload images and cache references
 */
const imageCache = new Map<string, HTMLImageElement>();

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve(imageCache.get(src)!);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Debounce function for auto-save
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
