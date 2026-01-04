import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import {
  clockIn,
  clockOut,
  getAttendanceHistory,
  getCurrentClockStatus,
} from '../api';
import type {
  AttendanceRecord,
  CurrentClockStatusResponse,
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

export const attendanceKeys = {
  all: ['attendance'] as const,
  status: () => [...attendanceKeys.all, 'status'] as const,
  history: (params?: { page?: number; limit?: number }) =>
    [...attendanceKeys.all, 'history', params] as const,
};

// ==================== Convert API Response to Frontend Format ====================

/**
 * API response format (dates as ISO strings)
 */
type AttendanceRecordApiResponse = {
  id: string;
  date: string; // ISO date string
  clockInTime: string | null; // ISO timestamp or null
  clockOutTime: string | null; // ISO timestamp or null
  totalWorkingMinutes: number | null;
};

/**
 * Convert API response AttendanceRecord (with ISO strings) to frontend format (with Date objects)
 */
const convertToAttendanceRecord = (
  record: AttendanceRecordApiResponse,
): AttendanceRecord => {
  return {
    id: record.id,
    date: new Date(record.date),
    clockInTime: record.clockInTime ? new Date(record.clockInTime) : null,
    clockOutTime: record.clockOutTime ? new Date(record.clockOutTime) : null,
    totalWorkingMinutes: record.totalWorkingMinutes,
  };
};

// ==================== Clock Status Query ====================

/**
 * Hook to fetch current clock status
 * 
 * Note: Query errors are available via the returned `error` property.
 * Use React Query's built-in error handling in components.
 */
export const useCurrentClockStatus = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<CurrentClockStatusResponse>({
    queryKey: attendanceKeys.status(),
    queryFn: getCurrentClockStatus,
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds to update working duration
    staleTime: 10 * 1000, // 10 seconds
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

// ==================== Attendance History Query ====================

/**
 * Hook to fetch attendance history with pagination
 * 
 * Note: Query errors are available via the returned `error` property.
 * Use React Query's built-in error handling in components.
 */
export const useAttendanceHistory = (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<{
    data: AttendanceRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: attendanceKeys.history(params),
    queryFn: async () => {
      const response = await getAttendanceHistory(params);
      return {
        data: response.data.map(convertToAttendanceRecord),
        pagination: response.pagination,
      };
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

// ==================== Clock In/Out Mutations ====================

interface UseClockInOptions {
  onSuccess?: (response: Awaited<ReturnType<typeof clockIn>>) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook to clock in
 * 
 * Business Rule: Only one clock-in per day allowed.
 * - UI prevents clicking when already clocked in (via disabled button)
 * - Backend validates and returns 400 error if attempted twice
 * - Error message from backend (e.g., "Already clocked in today") is displayed via toast
 * 
 * Leverages React Query's onSuccess and onError callbacks.
 * Errors are automatically handled with toast notifications.
 */
export const useClockIn = (options?: UseClockInOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockIn,
    onSuccess: (response) => {
      toast.success(response.message || 'Successfully clocked in!');
      // Invalidate and refetch clock status and all history queries (regardless of params)
      queryClient.invalidateQueries({ queryKey: attendanceKeys.status() });
      queryClient.invalidateQueries({ 
        queryKey: [...attendanceKeys.all, 'history'],
        exact: false, // Match all history queries regardless of params
      });
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      // Backend will return 400 with message "Already clocked in today" if attempted twice
      // The error message is extracted and displayed via handleMutationError
      handleMutationError(error, 'Failed to clock in. Please try again.');
      options?.onError?.(error);
    },
  });
};

interface UseClockOutOptions {
  onSuccess?: (response: Awaited<ReturnType<typeof clockOut>>) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook to clock out
 * 
 * Leverages React Query's onSuccess and onError callbacks.
 * Errors are automatically handled with toast notifications.
 */
export const useClockOut = (options?: UseClockOutOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clockOut,
    onSuccess: (response) => {
      toast.success(response.message || 'Successfully clocked out!');
      // Invalidate and refetch clock status and all history queries (regardless of params)
      queryClient.invalidateQueries({ queryKey: attendanceKeys.status() });
      queryClient.invalidateQueries({ 
        queryKey: [...attendanceKeys.all, 'history'],
        exact: false, // Match all history queries regardless of params
      });
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to clock out. Please try again.');
      options?.onError?.(error);
    },
  });
};

