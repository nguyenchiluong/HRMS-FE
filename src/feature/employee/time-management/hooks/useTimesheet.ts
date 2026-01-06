import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import {
  adjustTimesheet,
  cancelTimesheet,
  getActiveTasks,
  getMyTimesheets,
  getTimesheetById,
  submitTimesheet,
} from '../api';
import type {
  AdjustTimesheetRequest,
  SubmitTimesheetRequest,
  Task,
  TimesheetResponse,
  TimesheetSummaryResponse,
  TimesheetStatus,
  WeekRange,
} from '../types';

// ==================== Utility Functions ====================

/**
 * Extract error message from axios error
 */
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      defaultMessage
    );
  }
  return defaultMessage;
};

/**
 * Handle mutation error with toast notification
 */
const handleMutationError = (error: unknown, defaultMessage: string) => {
  console.error(error);
  const message = getErrorMessage(error, defaultMessage);
  toast.error(message);
};

// ==================== Query Keys ====================

export const timesheetKeys = {
  all: ['timesheet'] as const,
  tasks: () => [...timesheetKeys.all, 'tasks'] as const,
  myTimesheets: (year: number, month: number) =>
    [...timesheetKeys.all, 'my', year, month] as const,
  detail: (requestId: number) =>
    [...timesheetKeys.all, 'detail', requestId] as const,
};

// ==================== Task Queries ====================

/**
 * Hook to fetch active tasks
 * 
 * Note: Query errors are available via the returned `error` property.
 * Use React Query's built-in error handling in components.
 */
export const useActiveTasks = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return useQuery({
    queryKey: timesheetKeys.tasks(),
    queryFn: getActiveTasks,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

// ==================== Timesheet Queries ====================

/**
 * Hook to fetch my timesheets for a specific month
 * 
 * Note: Query errors are available via the returned `error` property.
 * Use React Query's built-in error handling in components.
 */
export const useMyTimesheets = (year: number, month: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return useQuery({
    queryKey: timesheetKeys.myTimesheets(year, month),
    queryFn: async () => {
      const response = await getMyTimesheets({ year, month });
      
      // If entries are missing from summary, fetch full details for each timesheet
      if (response.data && response.data.length > 0) {
        const timesheetsWithEntries = await Promise.all(
          response.data.map(async (ts) => {
            // If entries are already present, use them
            if (ts.entries && ts.entries.length > 0) {
              return ts;
            }
            // Otherwise, fetch full timesheet details to get entries
            try {
              const fullTimesheet = await getTimesheetById(ts.requestId);
              return {
                ...ts,
                entries: fullTimesheet.entries,
              };
            } catch (error) {
              console.error(`Failed to fetch entries for timesheet ${ts.requestId}:`, error);
              return ts;
            }
          }),
        );
        
        return {
          ...response,
          data: timesheetsWithEntries,
        };
      }
      
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

// ==================== Timesheet Data Transformation ====================

/**
 * Transform API response to UI-friendly format
 */
export const transformTimesheetsToRows = (
  timesheets: TimesheetSummaryResponse[],
  tasks: Task[],
  weekRanges: WeekRange[],
) => {
  // Map to track tasks and their weekly hours
  // Only include tasks that have actual timesheet entries
  const taskMap = new Map<
    number,
    {
      taskId: number;
      taskCode: string;
      name: string;
      type: 'project' | 'leave';
      weeklyData: {
        hours: number;
        requestId?: number;
        status?: string;
      }[];
    }
  >();

  // Only add tasks that have entries in the timesheets
  timesheets.forEach((ts) => {
    const weekIndex = ts.weekNumber - 1;
    if (weekIndex >= 0 && weekIndex < weekRanges.length && ts.entries) {
      ts.entries.forEach((entry) => {
        const existing = taskMap.get(entry.taskId);
        if (existing) {
          existing.weeklyData[weekIndex] = {
            hours: entry.hours,
            requestId: ts.requestId,
            status: ts.status,
          };
        } else {
          // Task from API not in active tasks list
          const task = tasks.find((t) => t.id === entry.taskId);
          const weeklyData = weekRanges.map((_, idx) =>
            idx === weekIndex
              ? { hours: entry.hours, requestId: ts.requestId, status: ts.status }
              : { hours: 0 },
          );
          taskMap.set(entry.taskId, {
            taskId: entry.taskId,
            taskCode: entry.taskCode || task?.taskCode || '',
            name: entry.taskName || task?.taskName || 'Unknown Task',
            type: entry.entryType,
            weeklyData,
          });
        }
      });
    }
  });

  // Convert to array and add IDs
  return Array.from(taskMap.values()).map((row) => ({
    id: `task-${row.taskId}`,
    ...row,
  }));
};

export interface WeekSubmission {
  weekNumber: number;
  requestId?: number;
  status: TimesheetStatus | 'DRAFT';
  summary?: TimesheetSummaryResponse['summary'];
}

/**
 * Get week submissions from timesheet data
 */
export const getWeekSubmissions = (
  timesheets: TimesheetSummaryResponse[],
  weekRanges: WeekRange[],
): WeekSubmission[] => {
  return weekRanges.map((week) => {
    const ts = timesheets.find((t) => t.weekNumber === week.weekNumber);
    return {
      weekNumber: week.weekNumber,
      requestId: ts?.requestId,
      status: ts?.status || 'DRAFT',
      summary: ts?.summary,
    };
  });
};

// ==================== Timesheet Mutations ====================

interface UseSubmitTimesheetOptions {
  onSuccess?: (data: TimesheetResponse) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook to submit a weekly timesheet
 * 
 * Leverages React Query's onSuccess and onError callbacks.
 * Errors are automatically handled with toast notifications.
 */
export const useSubmitTimesheet = (
  year: number,
  month: number,
  options?: UseSubmitTimesheetOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SubmitTimesheetRequest) => submitTimesheet(request),
    onSuccess: (response) => {
      toast.success(
        `Week ${response.data.weekNumber} timesheet submitted successfully!`,
      );
      // Invalidate to refresh the data
      queryClient.invalidateQueries({
        queryKey: timesheetKeys.myTimesheets(year, month),
      });
      options?.onSuccess?.(response.data);
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to submit timesheet. Please try again.');
      options?.onError?.(error);
    },
  });
};

interface UseAdjustTimesheetOptions {
  onSuccess?: (data: TimesheetResponse) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook to adjust a rejected/pending timesheet
 * 
 * Leverages React Query's onSuccess and onError callbacks.
 * Errors are automatically handled with toast notifications.
 */
export const useAdjustTimesheet = (
  year: number,
  month: number,
  options?: UseAdjustTimesheetOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: number;
      data: AdjustTimesheetRequest;
    }) => adjustTimesheet(requestId, data),
    onSuccess: (response) => {
      toast.success('Timesheet adjusted and resubmitted successfully!');
      queryClient.invalidateQueries({
        queryKey: timesheetKeys.myTimesheets(year, month),
      });
      options?.onSuccess?.(response.data);
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to adjust timesheet. Please try again.');
      options?.onError?.(error);
    },
  });
};

interface UseCancelTimesheetOptions {
  onSuccess?: (data: TimesheetResponse) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook to cancel a pending timesheet
 * 
 * Leverages React Query's onSuccess and onError callbacks.
 * Errors are automatically handled with toast notifications.
 */
export const useCancelTimesheet = (
  year: number,
  month: number,
  options?: UseCancelTimesheetOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => cancelTimesheet(requestId),
    onSuccess: (response) => {
      toast.success('Timesheet cancelled successfully. You can now edit and resubmit.');
      queryClient.invalidateQueries({
        queryKey: timesheetKeys.myTimesheets(year, month),
      });
      options?.onSuccess?.(response.data);
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to cancel timesheet. Please try again.');
      options?.onError?.(error);
    },
  });
};

