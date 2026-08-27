/**
 * Audit Logging Service
 * Logs admin actions to Firestore for accountability and compliance
 * Free tier compatible: Uses Firestore with no additional cost
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from './firebase.firestore';

export interface AuditLogEntry {
  userId: string;
  userEmail: string;
  action:
    | 'admin_login'
    | 'admin_logout'
    | 'admin_session_timeout'
    | 'content_created'
    | 'content_updated'
    | 'content_deleted'
    | 'message_viewed'
    | 'message_deleted'
    | 'user_added'
    | 'user_removed'
    | 'settings_changed';
  resourceType:
    | 'admin_session'
    | 'portfolio_content'
    | 'contact_message'
    | 'admin_user'
    | 'admin_settings';
  resourceId: string;
  details?: Record<string, unknown>;
}

/**
 * Log an admin action to Firestore auditLog collection
 * This creates an immutable record of who did what and when
 *
 * @param entry - The audit log entry to record
 * @throws Error if Firestore is not configured or write fails
 *
 * @example
 * await logAuditEvent({
 *   userId: user.uid,
 *   userEmail: user.email || 'unknown',
 *   action: 'content_updated',
 *   resourceType: 'portfolio_content',
 *   resourceId: 'about-section',
 *   details: { previousValue: '...', newValue: '...' }
 * });
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<string> {
  try {
    const db = getDb();
    const auditCollection = collection(db, 'auditLog');

    const docRef = await addDoc(auditCollection, {
      ...entry,
      timestamp: serverTimestamp(),
    });

    if (import.meta.env.DEV) {
      console.log('Audit log recorded:', docRef.id);
    }

    return docRef.id;
  } catch (error) {
    // Log but don't throw — audit failures should not block operations
    if (import.meta.env.DEV) {
      console.error('Failed to log audit event:', error);
    }
    return '';
  }
}

/**
 * Convenience function to log admin login
 */
export async function logAdminLogin(uid: string, email: string): Promise<void> {
  await logAuditEvent({
    userId: uid,
    userEmail: email,
    action: 'admin_login',
    resourceType: 'admin_session',
    resourceId: uid,
    details: {
      loginTime: new Date().toISOString(),
    },
  });
}

/**
 * Convenience function to log admin logout
 */
export async function logAdminLogout(uid: string, email: string): Promise<void> {
  await logAuditEvent({
    userId: uid,
    userEmail: email,
    action: 'admin_logout',
    resourceType: 'admin_session',
    resourceId: uid,
    details: {
      logoutTime: new Date().toISOString(),
    },
  });
}

/**
 * Convenience function to log content changes
 */
export async function logContentChange(
  userId: string,
  userEmail: string,
  action: 'content_created' | 'content_updated' | 'content_deleted',
  resourceId: string,
  details?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    userId,
    userEmail,
    action,
    resourceType: 'portfolio_content',
    resourceId,
    details,
  });
}

/**
 * Convenience function to log message operations
 */
export async function logMessageOperation(
  userId: string,
  userEmail: string,
  action: 'message_viewed' | 'message_deleted',
  messageId: string,
  details?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    userId,
    userEmail,
    action,
    resourceType: 'contact_message',
    resourceId: messageId,
    details,
  });
}
