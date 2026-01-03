import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicking
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    // Navigate to detail page based on current path
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      navigate(`/admin/notifications/${notification.id}`);
    } else {
      navigate(`/employee/notifications/${notification.id}`);
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd, yyyy');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-100 focus:outline-none">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 rounded-xl p-0">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-gray-600 transition-colors hover:text-gray-900"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto bg-white">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'mx-2 my-1 cursor-pointer rounded-lg px-4 py-3 transition-colors',
                      !notification.isRead
                        ? 'bg-black/5 hover:bg-black/10'
                        : 'hover:bg-gray-50',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black" />
                      )}
                      {notification.isRead && (
                        <div className="mt-1.5 h-2 w-2 shrink-0" />
                      )}

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={cn(
                              'text-sm font-medium',
                              !notification.isRead
                                ? 'text-gray-900'
                                : 'text-gray-700',
                            )}
                          >
                            {notification.title}
                          </h4>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                          {notification.content}
                        </p>
                        <p className="mt-1.5 text-xs text-gray-400">
                          {formatNotificationTime(notification.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="rounded-b-xl border-t border-gray-200 bg-white px-4 py-2">
              <button
                onClick={() => {
                  // Navigate based on current path - employee or admin
                  const currentPath = window.location.pathname;
                  if (currentPath.startsWith('/admin')) {
                    navigate('/admin/notifications');
                  } else {
                    navigate('/employee/notifications');
                  }
                }}
                className="w-full text-center text-xs text-gray-600 transition-colors hover:text-gray-900"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
