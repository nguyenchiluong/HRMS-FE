import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { cancelTimeOffRequest, getTimeOffRequests, submitTimeOffRequest } from '../api';
import type {
  CancelTimeOffRequest,
  LeaveRequest,
  SubmitTimeOffRequest,
  TimeOffRequestResponse,
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

export const timeOffKeys = {
  all: ['timeOffRequests'] as const,
  list: (params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    type?: string;
  }) => [...timeOffKeys.all, params] as const,
};

/**
 * Convert API response to frontend LeaveRequest format
 */
const convertToLeaveRequest = (
  response: TimeOffRequestResponse,
): LeaveRequest => {
  return {
    id: response.id,
    type: response.type,
    startDate: new Date(response.startDate),
    endDate: new Date(response.endDate),
    duration: response.duration,
    submittedDate: new Date(response.submittedDate),
    status: response.status,
    reason: response.reason,
    attachments: response.attachments,
  };
};

/**
 * Hook to fetch time-off request history
 * 
 * Note: Query errors are available via the returned `error` property.
 * Use React Query's built-in error handling in components.
 */
export const useTimeOffRequests = (params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  type?: string;
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<{
    data: LeaveRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: timeOffKeys.list(params),
    queryFn: async () => {
      const response = await getTimeOffRequests(params);
      return {
        data: response.data.map(convertToLeaveRequest),
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

interface UseSubmitTimeOffRequestOptions {
  onSuccess?: (response: Awaited<ReturnType<typeof submitTimeOffRequest>>) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook to submit a time-off request
 * 
 * Leverages React Query's onSuccess and onError callbacks.
 * Errors are automatically handled with toast notifications.
 */
export const useSubmitTimeOffRequest = (options?: UseSubmitTimeOffRequestOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTimeOffRequest,
    onSuccess: (response) => {
      toast.success(response.message || 'Time-off request submitted successfully!');
      // Invalidate and refetch time-off requests and leave balances
      queryClient.invalidateQueries({ 
        queryKey: timeOffKeys.all,
        exact: false, // Match all time-off request queries regardless of params
      });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to submit time-off request. Please try again.');
      options?.onError?.(error);
    },
  });
};

interface UseCancelTimeOffRequestOptions {
  onSuccess?: (response: Awaited<ReturnType<typeof cancelTimeOffRequest>>) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook to cancel a time-off request
 * 
 * Leverages React Query's onSuccess and onError callbacks.
 * Errors are automatically handled with toast notifications.
 */
export const useCancelTimeOffRequest = (options?: UseCancelTimeOffRequestOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      request,
    }: {
      requestId: string;
      request?: CancelTimeOffRequest;
    }) => {
      return await cancelTimeOffRequest(requestId, request);
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Time-off request cancelled successfully!');
      // Invalidate and refetch time-off requests and leave balances
      queryClient.invalidateQueries({ 
        queryKey: timeOffKeys.all,
        exact: false, // Match all time-off request queries regardless of params
      });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to cancel time-off request. Please try again.');
      options?.onError?.(error);
    },
  });
};

