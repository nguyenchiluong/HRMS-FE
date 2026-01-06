/**
 * Utility functions to map API notifications to component format
 */

import type { Notification } from '../api';
import type { LegacyNotification } from '../types';

/**
 * Convert API notification to legacy format for components
 */
export const mapNotificationToLegacy = (
  notification: Notification,
): LegacyNotification => {
  return {
    id: notification.notificationId.toString(),
    title: notification.title,
    content: notification.message,
    time: new Date(notification.createdAt),
    isRead: notification.isRead,
    type: (notification.type as 'info' | 'success' | 'warning' | 'error') || undefined,
    link: undefined, // Can be extended if needed
  };
};

/**
 * Convert array of API notifications to legacy format
 */
export const mapNotificationsToLegacy = (
  notifications: Notification[],
): LegacyNotification[] => {
  return notifications.map(mapNotificationToLegacy);
};

