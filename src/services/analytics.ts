import { getDatabase, ref, set, push, query, orderByChild, limitToLast } from 'firebase/database';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getOptionalEnvValue } from '../utils/env';

interface AnalyticsEvent {
  eventType: string;
  timestamp: number;
  data: Record<string, unknown>;
  userAgent: string;
  url: string;
}

interface PageViewEvent extends AnalyticsEvent {
  eventType: 'page_view';
  data: {
    section: string;
    duration?: number;
  };
}

interface FormSubmissionEvent extends AnalyticsEvent {
  eventType: 'form_submission';
  data: {
    formType: string;
    success: boolean;
    duration: number;
  };
}

interface ProjectClickEvent extends AnalyticsEvent {
  eventType: 'project_click';
  data: {
    projectId: string;
    projectName: string;
  };
}

interface ResumeDownloadEvent extends AnalyticsEvent {
  eventType: 'resume_download';
  data: {
    format: string;
    method: string;
  };
}

export type AnalyticsEventType =
  | PageViewEvent
  | FormSubmissionEvent
  | ProjectClickEvent
  | ResumeDownloadEvent;

const analytics = {
  async logEvent(event: AnalyticsEventType): Promise<void> {
    try {
      // Initialize Firebase
      const firebaseConfig = {
        apiKey: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
        authDomain: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
        databaseURL: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_DATABASE_URL),
        projectId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
        appId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
      };

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const db = getDatabase(app);

      const eventWithMetadata: AnalyticsEvent = {
        ...event,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Log to Firebase under analytics collection
      const eventsRef = ref(db, `analytics/${event.eventType}`);
      const newEventRef = push(eventsRef);
      await set(newEventRef, eventWithMetadata);

      // Also log locally for real-time dashboard
      console.log(`[Analytics] ${event.eventType}:`, event.data);
    } catch (error) {
      console.error('Failed to log analytics event:', error);
    }
  },

  async logPageView(section: string, duration?: number): Promise<void> {
    return this.logEvent({
      eventType: 'page_view',
      data: { section, duration },
      timestamp: 0,
      userAgent: '',
      url: '',
    });
  },

  async logFormSubmission(formType: string, success: boolean, duration: number): Promise<void> {
    return this.logEvent({
      eventType: 'form_submission',
      data: { formType, success, duration },
      timestamp: 0,
      userAgent: '',
      url: '',
    });
  },

  async logProjectClick(projectId: string, projectName: string): Promise<void> {
    return this.logEvent({
      eventType: 'project_click',
      data: { projectId, projectName },
      timestamp: 0,
      userAgent: '',
      url: '',
    });
  },

  async logResumeDownload(format: string, method: string): Promise<void> {
    return this.logEvent({
      eventType: 'resume_download',
      data: { format, method },
      timestamp: 0,
      userAgent: '',
      url: '',
    });
  },

  async getAnalyticsData(eventType: string, limit: number = 100): Promise<AnalyticsEvent[]> {
    try {
      // Initialize Firebase
      const firebaseConfig = {
        apiKey: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
        authDomain: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
        databaseURL: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_DATABASE_URL),
        projectId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
        appId: getOptionalEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
      };

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const db = getDatabase(app);
      query(ref(db, `analytics/${eventType}`), orderByChild('timestamp'), limitToLast(limit));
      // Query execution would happen here in real Firebase implementation
      return [];
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      return [];
    }
  },
};

export default analytics;
