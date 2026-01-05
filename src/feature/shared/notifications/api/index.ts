/**
 * Notification API Service
 * Handles all notification-related API calls to Spring Boot backend
 */

import springApi from '@/api/spring';

// Types matching backend API
export interface Notification {
  notificationId: number;
  empId: number;
  title: string;
  message: string;
  type: string | null; // "info", "warning", "success", "error", or null
  isRead: boolean;
  createdAt: string; // ISO 8601 datetime string
}

export interface NotificationListResponse {
  notifications: Notification[];
  totalUnread: number;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateNotificationRequest {
  empId: number;
  title: string;
  message: string;
  type?: string; // Optional: "info", "warning", "success", "error"
}

export interface GetNotificationsParams {
  page?: number;
  size?: number;
}

/**
 * Get paginated notifications for the authenticated user
 */
export const getNotifications = async (
  params?: GetNotificationsParams,
): Promise<NotificationListResponse> => {
  const { page = 0, size = 20 } = params || {};
  const response = await springApi.get<NotificationListResponse>(
    `/notifications`,
    {
      params: { page, size },
    },
  );
  return response.data;
};

/**
 * Get all unread notifications for the authenticated user
 */
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const response = await springApi.get<Notification[]>(`/notifications/unread`);
  return response.data;
};

/**
 * Get unread notification count for the authenticated user
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await springApi.get<number>(`/notifications/unread-count`);
  return response.data;
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await springApi.put(`/notifications/${notificationId}/read`);
};

/**
 * Mark all notifications as read for the authenticated user
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await springApi.put(`/notifications/read-all`);
};

/**
 * Send a notification to an employee (typically used by admins/managers)
 */
export const sendNotification = async (
  data: CreateNotificationRequest,
): Promise<void> => {
  await springApi.post(`/notifications`, data);
};

