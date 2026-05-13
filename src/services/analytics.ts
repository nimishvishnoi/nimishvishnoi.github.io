/**
 * Analytics service — stores events in Firestore.
 *
 * Collection structure:
 *   analytics/{eventType}/events  (sub-collection of documents)
 *
 * Each document:
 *   { eventType, timestamp, data, userAgent, url }
 */
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase.firestore';

interface AnalyticsEvent {
  eventType: string;
  timestamp: number;
  data: Record<string, unknown>;
  userAgent: string;
  url: string;
}

interface PageViewEvent extends AnalyticsEvent {
  eventType: 'page_view';
  data: { section: string; duration?: number };
}

interface FormSubmissionEvent extends AnalyticsEvent {
  eventType: 'form_submission';
  data: { formType: string; success: boolean; duration: number };
}

interface ProjectClickEvent extends AnalyticsEvent {
  eventType: 'project_click';
  data: { projectId: string; projectName: string };
}

interface ResumeDownloadEvent extends AnalyticsEvent {
  eventType: 'resume_download';
  data: { format: string; method: string };
}

export type AnalyticsEventType =
  | PageViewEvent
  | FormSubmissionEvent
  | ProjectClickEvent
  | ResumeDownloadEvent;

const analytics = {
  async logEvent(event: AnalyticsEventType): Promise<void> {
    try {
      const db = getDb();

      // analytics/<eventType>/events/<auto-id>
      const eventsCol = collection(db, 'analytics', event.eventType, 'events');
      await addDoc(eventsCol, {
        eventType: event.eventType,
        data: event.data,
        // serverTimestamp for accurate ordering; also store ms for reads
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 100),
        url: window.location.pathname,
      });

      if (import.meta.env.DEV) {
        console.log(`[Analytics] ${event.eventType}:`, event.data);
      }
    } catch (error) {
      // Analytics failures should never break the app
      if (import.meta.env.DEV) {
        console.error('Failed to log analytics event:', error);
      }
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

  async getAnalyticsData(eventType: string, limitCount: number = 100): Promise<AnalyticsEvent[]> {
    try {
      const db = getDb();
      const eventsCol = collection(db, 'analytics', eventType, 'events');
      const q = query(eventsCol, orderBy('timestamp', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          eventType: d.eventType as string,
          timestamp: d.timestamp instanceof Timestamp ? d.timestamp.toMillis() : (d.timestamp as number),
          data: d.data as Record<string, unknown>,
          userAgent: d.userAgent as string,
          url: d.url as string,
        };
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch analytics data:', error);
      }
      return [];
    }
  },
};

export default analytics;
