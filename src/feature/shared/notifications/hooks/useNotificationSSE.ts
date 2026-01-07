/**
 * Hook for Server-Sent Events (SSE) real-time notifications
 */

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from './useNotifications';
import type { Notification } from '../api';

const SSE_BASE_URL =
  import.meta.env.VITE_SPRING_API_URL || 'http://localhost:8080';

interface UseNotificationSSEOptions {
  onNotification?: (notification: Notification) => void;
  onUnreadCountUpdate?: (count: number) => void;
  onError?: (error: Event) => void;
  enabled?: boolean;
}

/**
 * Hook to establish SSE connection for real-time notifications
 */
export const useNotificationSSE = (options?: UseNotificationSSEOptions) => {
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const {
    onNotification,
    onUnreadCountUpdate,
    onError,
    enabled = true,
  } = options || {};

  useEffect(() => {
    // Don't connect if not authenticated, no token, or disabled
    if (!isAuthenticated || !token || !enabled) {
      return;
    }

    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const connectSSE = () => {
      try {
        // EventSource doesn't support custom headers, so we pass token as query parameter
        // The backend should extract the token from the query parameter
        const url = `${SSE_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`;
        const eventSource = new EventSource(url, {
          withCredentials: true,
        });

        eventSourceRef.current = eventSource;

        // Handle connection established
        eventSource.addEventListener('connected', () => {
          console.log('SSE connection established');
          reconnectAttemptsRef.current = 0; // Reset on successful connection
        });

        // Handle new notification
        eventSource.addEventListener('notification', (event) => {
          try {
            const notification: Notification = JSON.parse(event.data);
            console.log('New notification received:', notification);

            // Invalidate notification list queries, but NOT unread count
            // since unread count is updated separately via 'unread-count' event
            queryClient.invalidateQueries({
              queryKey: notificationKeys.lists(),
            });
            queryClient.invalidateQueries({
              queryKey: notificationKeys.unread(),
            });

            // Call custom callback if provided
            if (onNotification) {
              onNotification(notification);
            }
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });

        // Handle unread count update
        eventSource.addEventListener('unread-count', (event) => {
          try {
            const count = parseInt(event.data, 10);
            console.log('Unread count updated:', count);

            // Update the unread count query cache
            queryClient.setQueryData(notificationKeys.unreadCount(), count);

            // Call custom callback if provided
            if (onUnreadCountUpdate) {
              onUnreadCountUpdate(count);
            }
          } catch (error) {
            console.error('Error parsing unread count:', error);
          }
        });

        // Handle errors
        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          eventSource.close();

          // Attempt to reconnect if we haven't exceeded max attempts
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current += 1;
            console.log(
              `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`,
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              connectSSE();
            }, reconnectDelay);
          } else {
            console.error('Max reconnection attempts reached');
            if (onError) {
              onError(error);
            }
          }
        };

        // Handle connection close
        eventSource.onopen = () => {
          console.log('SSE connection opened');
          reconnectAttemptsRef.current = 0;
        };
      } catch (error) {
        console.error('Error creating SSE connection:', error);
        if (onError && error instanceof Event) {
          onError(error);
        }
      }
    };

    // Initial connection
    connectSSE();

    // Cleanup on unmount or when dependencies change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [isAuthenticated, token, enabled, queryClient, onNotification, onUnreadCountUpdate, onError]);

  // Return function to manually close connection
  return {
    close: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    },
  };
};

