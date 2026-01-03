import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ArrowLeft, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Notification } from '../types';

// Mock data - replace with actual API call
const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  const today = new Date();

  const notificationTemplates = [
    {
      title: 'Timesheet Approved',
      content: 'Your timesheet for Week 1 has been approved by your manager.',
    },
    {
      title: 'Time-off Request Pending',
      content:
        'Your time-off request is pending approval. Please wait for manager review.',
    },
    {
      title: 'Profile Update Required',
      content:
        'Please update your emergency contact information in your profile.',
    },
    {
      title: 'New Campaign Available',
      content: 'A new wellness campaign has been launched. Check it out!',
    },
    {
      title: 'Password Change Successful',
      content: 'Your password has been successfully changed.',
    },
    {
      title: 'Timesheet Rejected',
      content:
        'Your timesheet for Week 2 has been rejected. Please review and resubmit.',
    },
    {
      title: 'Time-off Approved',
      content: 'Your time-off request from Jan 15-20 has been approved.',
    },
    {
      title: 'System Maintenance',
      content:
        'Scheduled system maintenance will occur on Sunday, 2 AM - 4 AM.',
    },
  ];

  for (let i = 0; i < 25; i++) {
    const notificationDate = new Date(today);
    notificationDate.setHours(today.getHours() - i * 3);
    notificationDate.setDate(today.getDate() - Math.floor(i / 8));

    const template = notificationTemplates[i % notificationTemplates.length];

    notifications.push({
      id: `NOTIF-${String(i + 1).padStart(4, '0')}`,
      title: template.title,
      content: template.content,
      time: notificationDate,
      isRead: i >= 8, // First 8 are unread
    });
  }

  return notifications;
};

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API call
    const fetchNotification = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const allNotifications = generateMockNotifications();
      const found = allNotifications.find((n) => n.id === id);

      if (found) {
        // Mark as read when viewing
        setNotification({ ...found, isRead: true });
      } else {
        setNotification(null);
      }
      setIsLoading(false);
    };

    if (id) {
      fetchNotification();
    }
  }, [id]);

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
    <div className="w-full space-y-6">
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
