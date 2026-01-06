// Re-export API types (import with 'as ApiNotification' to avoid conflicts)
export type {
  Notification as ApiNotification,
  NotificationListResponse,
  CreateNotificationRequest,
} from '../api';

// Legacy type for backward compatibility with existing components
// This format is used by UI components and is mapped from API responses
export interface LegacyNotification {
  id: string;
  title: string;
  content: string;
  time: Date;
  isRead: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

// Export as Notification for components (backward compatibility)
export type Notification = LegacyNotification;

