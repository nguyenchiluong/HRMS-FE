import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Bell, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

type FilterType = 'all' | 'unread' | 'read';

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(
    generateMockNotifications,
  );
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
        ? notifications.filter((n) => !n.isRead)
        : notifications.filter((n) => n.isRead);

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex,
  );

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }
    return pages;
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('all')}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('unread')}
          className={cn(
            filter === 'unread' && 'bg-amber-600 hover:bg-amber-700',
          )}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('read')}
          className={cn(
            filter === 'read' && 'bg-emerald-600 hover:bg-emerald-700',
          )}
        >
          Read ({readCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div>
        {filteredNotifications.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <Bell className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium text-gray-900">
              No {filter === 'all' ? '' : filter} notifications
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {filter === 'unread'
                ? 'All caught up! You have no unread notifications.'
                : filter === 'read'
                  ? 'You have no read notifications yet.'
                  : 'You have no notifications yet.'}
            </p>
          </Card>
        ) : (
          <>
            <div className="space-y-2">
              {currentNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  onClick={() => {
                    // Mark as read when clicking (always mark as read)
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                    // Navigate to detail page
                    const currentPath = window.location.pathname;
                    if (currentPath.startsWith('/admin')) {
                      navigate(`/admin/notifications/${notification.id}`);
                    } else {
                      navigate(`/employee/notifications/${notification.id}`);
                    }
                  }}
                  className={cn(
                    'cursor-pointer transition-colors',
                    !notification.isRead && 'bg-black/5 hover:bg-black/10',
                    notification.isRead && 'hover:bg-gray-50',
                  )}
                >
                  <div className="flex items-start gap-4 p-4">
                    {/* Unread Indicator */}
                    <div className="mt-1 shrink-0">
                      {!notification.isRead ? (
                        <div className="h-2 w-2 rounded-full bg-black" />
                      ) : (
                        <div className="h-2 w-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className={cn(
                              'text-sm font-medium',
                              !notification.isRead
                                ? 'text-gray-900'
                                : 'text-gray-700',
                            )}
                          >
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.content}
                          </p>
                        </div>
                        <div className="shrink-0 text-xs text-gray-400">
                          {formatNotificationTime(notification.time)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{' '}
                  {Math.min(endIndex, filteredNotifications.length)} of{' '}
                  {filteredNotifications.length} results
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {getPageNumbers().map((page, index) =>
                    typeof page === 'number' ? (
                      <Button
                        key={index}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageClick(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    ) : (
                      <span key={index} className="px-2 text-gray-400">
                        {page}
                      </span>
                    ),
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
