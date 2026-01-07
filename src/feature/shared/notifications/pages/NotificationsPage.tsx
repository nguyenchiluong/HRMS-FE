import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { Bell, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';
import {
  useNotifications,
  useUnreadNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../hooks/useNotifications';
import { mapNotificationsToLegacy } from '../utils/mapNotification';

type FilterType = 'all' | 'unread' | 'read';

const ITEMS_PER_PAGE = 20; // Match API default

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-indexed pages

  // Fetch all notifications with pagination
  const {
    data: allNotificationsData,
    isLoading: isLoadingAll,
    error: allError,
  } = useNotifications({
    page: filter === 'all' ? currentPage : undefined,
    size: ITEMS_PER_PAGE,
  });

  // Fetch unread notifications
  const {
    data: unreadNotificationsData,
    isLoading: isLoadingUnread,
    error: unreadError,
  } = useUnreadNotifications();

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  // Map API notifications to legacy format
  const allNotifications = useMemo(() => {
    if (allNotificationsData?.notifications) {
      return mapNotificationsToLegacy(allNotificationsData.notifications);
    }
    return [];
  }, [allNotificationsData]);

  const unreadNotifications = useMemo(() => {
    if (unreadNotificationsData) {
      return mapNotificationsToLegacy(unreadNotificationsData);
    }
    return [];
  }, [unreadNotificationsData]);

  // Determine which data to use based on filter
  const isLoading =
    filter === 'all' || filter === 'read' ? isLoadingAll : isLoadingUnread;
  const error = filter === 'all' || filter === 'read' ? allError : unreadError;

  const readNotifications = allNotifications.filter((n) => n.isRead);

  const unreadCount = allNotificationsData?.totalUnread ?? unreadNotifications.length;
  const readCount = allNotificationsData
    ? allNotificationsData.totalElements - (allNotificationsData.totalUnread ?? 0)
    : readNotifications.length;

  // Determine notifications to display based on filter
  let notifications: Notification[];
  let totalPages: number;
  let totalElements: number;

  if (filter === 'all') {
    notifications = allNotifications;
    totalPages = allNotificationsData?.totalPages ?? 1;
    totalElements = allNotificationsData?.totalElements ?? 0;
  } else if (filter === 'unread') {
    notifications = unreadNotifications;
    totalPages = Math.ceil(unreadNotifications.length / ITEMS_PER_PAGE);
    totalElements = unreadNotifications.length;
  } else {
    // Read filter - filter client-side from all notifications
    notifications = readNotifications;
    totalPages = Math.ceil(readNotifications.length / ITEMS_PER_PAGE);
    totalElements = readNotifications.length;
  }

  // Pagination logic
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotifications =
    filter === 'all'
      ? notifications // API handles pagination
      : notifications.slice(startIndex, endIndex); // Client-side pagination for unread/read

  // Reset to page 0 when filter changes
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(0);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(0, 1, 2, 3, '...', totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          0,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
        );
      } else {
        pages.push(
          0,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages - 1,
        );
      }
    }
    return pages;
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(parseInt(id, 10));
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
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
    <div className="h-full w-full space-y-6 px-20 py-10">
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
            disabled={isLoading}
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
          disabled={isLoading}
        >
          All ({allNotificationsData?.totalElements ?? 0})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('unread')}
          className={cn(
            filter === 'unread' && 'bg-amber-600 hover:bg-amber-700',
          )}
          disabled={isLoading}
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
          disabled={isLoading}
        >
          Read ({readCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div>
        {isLoading ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <Bell className="mb-4 h-12 w-12 animate-pulse text-gray-400" />
            <p className="text-sm font-medium text-gray-900">
              Loading notifications...
            </p>
          </Card>
        ) : error ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <Bell className="mb-4 h-12 w-12 text-red-400" />
            <p className="text-sm font-medium text-gray-900">
              Error loading notifications
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Please try refreshing the page.
            </p>
          </Card>
        ) : currentNotifications.length === 0 ? (
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
                    // Mark as read when clicking
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
                  Showing {filter === 'all' ? currentPage * ITEMS_PER_PAGE + 1 : startIndex + 1} to{' '}
                  {Math.min(
                    filter === 'all' ? (currentPage + 1) * ITEMS_PER_PAGE : endIndex,
                    totalElements,
                  )}{' '}
                  of {totalElements} results
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
                        {page + 1}
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
                    disabled={currentPage >= totalPages - 1}
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
