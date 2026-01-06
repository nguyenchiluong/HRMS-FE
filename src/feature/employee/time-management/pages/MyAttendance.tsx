import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
  Timer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAttendanceHistory,
  useClockIn,
  useClockOut,
  useCurrentClockStatus,
} from '../hooks';

const ITEMS_PER_PAGE = 7;

const formatTime = (date: Date | null): string => {
  if (!date) return '--:--';
  return format(date, 'HH:mm');
};

const formatDuration = (minutes: number | null): string => {
  if (minutes === null) return '--:--';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export default function MyAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks - React Query handles errors and success automatically via onSuccess/onError in hooks
  const { data: clockStatusData, isLoading: isLoadingStatus } =
    useCurrentClockStatus();
  const { data: attendanceData, isLoading: isLoadingHistory } =
    useAttendanceHistory({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    });
  // Also fetch first page to check for today's record (most recent records)
  const { data: firstPageData } = useAttendanceHistory({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });
  // Mutations handle errors/success via onSuccess/onError callbacks in hooks
  const clockInMutation = useClockIn();
  const clockOutMutation = useClockOut();

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get clock status and working duration from API
  const clockStatus = clockStatusData?.status || 'clocked-out';
  const clockInTime = clockStatusData?.clockInTime
    ? new Date(clockStatusData.clockInTime)
    : null;
  const workingDuration =
    clockStatusData?.currentWorkingMinutes !== null &&
    clockStatusData?.currentWorkingMinutes !== undefined
      ? clockStatusData.currentWorkingMinutes
      : clockInTime
        ? Math.round((currentTime.getTime() - clockInTime.getTime()) / 60000)
        : null;

  // Pagination logic
  const attendanceRecords = attendanceData?.data || [];
  const pagination = attendanceData?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const currentRecords = attendanceRecords;

  // Check if already clocked in today - use multiple sources for reliability
  const today = new Date();
  const todayDateString = format(today, 'yyyy-MM-dd');
  
  // Check today's record from first page (most recent records)
  const firstPageRecords = firstPageData?.data || [];
  const todayRecord = firstPageRecords.find(
    (record) => format(record.date, 'yyyy-MM-dd') === todayDateString,
  );
  
  // Has clock in if: status says clocked-in OR today's record has a clock-in time
  const hasClockInToday =
    clockStatus === 'clocked-in' ||
    (todayRecord?.clockInTime !== null && todayRecord?.clockInTime !== undefined);

  const handleClockIn = () => {
    // Frontend validation: prevent multiple clock-ins per day
    if (hasClockInToday) {
      toast.error('You have already clocked in today. Only one clock-in per day is allowed.');
      return;
    }

    clockInMutation.mutate();
  };

  const handleClockOut = () => {
    clockOutMutation.mutate();
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

  return (
    <div className="w-full space-y-6">
      {/* Clock In/Out Banner */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
          </div>

          <div className="relative flex items-center justify-between">
            {/* Date & Time Display */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="h-5 w-5" />
                <span className="text-lg font-medium">
                  {format(currentTime, 'EEEE, MMMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-white" />
                <span className="font-mono text-5xl font-bold tracking-tight text-white">
                  {format(currentTime, 'HH:mm:ss')}
                </span>
              </div>

              {/* Status indicator */}
              <div className="mt-4 flex items-center gap-3">
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium',
                    clockStatus === 'clocked-in'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700/50 text-slate-400',
                  )}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      clockStatus === 'clocked-in'
                        ? 'animate-pulse bg-emerald-400'
                        : 'bg-slate-500',
                    )}
                  />
                  {clockStatus === 'clocked-in'
                    ? 'Currently Working'
                    : 'Not Clocked In'}
                </div>

                {workingDuration !== null && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Timer className="h-4 w-4" />
                    <span className="text-sm">
                      Working for:{' '}
                      <strong>{formatDuration(workingDuration)}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Clock In/Out Buttons */}
            <div className="flex gap-4">
              {/* Clock In button - disabled if already clocked in today (one clock-in per day) */}
              <Button
                onClick={handleClockIn}
                disabled={
                  hasClockInToday || // Prevent double clock-in (one per day) - checks both status and today's record
                  clockInMutation.isPending ||
                  isLoadingStatus
                }
                className={cn(
                  'h-16 gap-3 px-8 text-lg font-semibold transition-all',
                  hasClockInToday ||
                    clockInMutation.isPending ||
                    isLoadingStatus
                    ? 'cursor-not-allowed bg-slate-700 text-slate-500'
                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500 hover:shadow-emerald-500/40',
                )}
              >
                <LogIn className="h-6 w-6" />
                {clockInMutation.isPending ? 'Clocking In...' : 'Clock In'}
              </Button>

              <Button
                onClick={handleClockOut}
                disabled={
                  clockStatus === 'clocked-out' ||
                  clockOutMutation.isPending ||
                  isLoadingStatus
                }
                className={cn(
                  'h-16 gap-3 px-8 text-lg font-semibold transition-all',
                  clockStatus === 'clocked-out' ||
                    clockOutMutation.isPending ||
                    isLoadingStatus
                    ? 'cursor-not-allowed bg-slate-700 text-slate-500'
                    : 'bg-rose-600 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-500 hover:shadow-rose-500/40',
                )}
              >
                <LogOut className="h-6 w-6" />
                {clockOutMutation.isPending ? 'Clocking Out...' : 'Clock Out'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance History Table */}
      <div>
        <h2 className="font-regular text-md mb-4 text-gray-900">
          Attendance History
        </h2>
        <Card className="overflow-hidden">
          {isLoadingHistory ? (
            <div className="py-12 text-center text-gray-500">
              Loading attendance records...
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No attendance records found
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Clock In
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Clock Out
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total Working Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentRecords.map((record) => {
                    const isToday =
                      format(record.date, 'yyyy-MM-dd') ===
                      format(new Date(), 'yyyy-MM-dd');

                    return (
                      <tr
                        key={record.id}
                        className={cn(
                          'hover:bg-gray-50',
                          isToday && 'bg-blue-50/50',
                        )}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold',
                                isToday
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-gray-100 text-gray-600',
                              )}
                            >
                              {format(record.date, 'dd')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {format(record.date, 'EEEE')}
                                {isToday && (
                                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                    Today
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(record.date, 'MMMM dd, yyyy')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          <div
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
                              record.clockInTime
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-500',
                            )}
                          >
                            <LogIn className="h-3.5 w-3.5" />
                            {formatTime(record.clockInTime)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          <div
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
                              record.clockOutTime
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-gray-100 text-gray-500',
                            )}
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            {formatTime(record.clockOutTime)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          <div
                            className={cn(
                              'inline-flex items-center gap-1.5 text-sm font-medium',
                              record.totalWorkingMinutes !== null
                                ? record.totalWorkingMinutes >= 480
                                  ? 'text-emerald-600'
                                  : 'text-amber-600'
                                : 'text-gray-400',
                            )}
                          >
                            <Timer className="h-4 w-4" />
                            {formatDuration(record.totalWorkingMinutes)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {/* Pagination */}
          {!isLoadingHistory && totalPages > 1 && pagination && (
            <div className="flex items-center justify-between border-t bg-white px-6 py-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  pagination.total,
                )} of{' '}
                {pagination.total} records
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
        </Card>
      </div>
    </div>
  );
}
