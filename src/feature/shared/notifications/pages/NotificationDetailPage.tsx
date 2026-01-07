import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, Bell } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Notification } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkNotificationAsRead } from '../hooks/useNotifications';
import { mapNotificationToLegacy } from '../utils/mapNotification';

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notificationId = id ? parseInt(id, 10) : null;

  // Fetch all notifications (we'll need to search through them since there's no single notification endpoint)
  // Using a large page size to get all notifications
  const { data: notificationsData, isLoading } = useNotifications({
    page: 0,
    size: 1000, // Large size to get all notifications
  });

  const { mutate: markAsRead } = useMarkNotificationAsRead();

  // Find the notification by ID
  const notification = useMemo(() => {
    if (!notificationId || !notificationsData?.notifications) {
      return null;
    }

    const apiNotification = notificationsData.notifications.find(
      (n) => n.notificationId === notificationId,
    );

    if (!apiNotification) {
      return null;
    }

    // Mark as read when viewing if not already read
    if (!apiNotification.isRead) {
      markAsRead(notificationId);
      // Optimistically update the notification
      return mapNotificationToLegacy({
        ...apiNotification,
        isRead: true,
      });
    }

    return mapNotificationToLegacy(apiNotification);
  }, [notificationId, notificationsData, markAsRead]);

  const handleBack = () => {
    // Navigate back based on current path
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      navigate('/admin/notifications');
    } else {
      navigate('/employee/notifications');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Bell className="mx-auto mb-2 h-8 w-8 animate-pulse text-gray-400" />
          <p className="text-sm text-gray-500">Loading notification...</p>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Bell className="mx-auto mb-2 h-12 w-12 text-gray-400" />
          <p className="text-sm font-medium text-gray-900">
            Notification not found
          </p>
          <p className="mt-1 text-xs text-gray-500">
            The notification you're looking for doesn't exist or has been
            deleted.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full space-y-6 px-20 py-10">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notifications
      </Button>

      {/* Notification Detail Card */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                {!notification.isRead ? (
                  <div className="h-3 w-3 rounded-full bg-black" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {notification.title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {format(notification.time, 'EEEE, MMMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  !notification.isRead
                    ? 'bg-black/10 text-gray-900'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {notification.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="prose max-w-none">
            <div className="mb-4">
              <h2 className="mb-2 text-sm font-semibold text-gray-700">
                Content
              </h2>
              <p className="text-base leading-relaxed text-gray-900">
                {notification.content}
              </p>
            </div>

            {/* Additional Details */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                Details
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">Notification ID</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {notification.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {format(notification.time, 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {notification.isRead ? 'Read' : 'Unread'}
                  </p>
                </div>
                {notification.type && (
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                      {notification.type}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {notification.link && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <Button
                  onClick={() => {
                    if (notification.link) {
                      window.location.href = notification.link;
                    }
                  }}
                  className="w-full sm:w-auto"
                >
                  View Related Content
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
