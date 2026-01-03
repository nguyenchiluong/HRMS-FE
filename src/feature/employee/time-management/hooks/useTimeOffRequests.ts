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
    queryKey: ['timeOffRequests', params],
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
      // Don't retry on 401 errors
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

/**
 * Hook to submit a time-off request
 */
export const useSubmitTimeOffRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SubmitTimeOffRequest) => {
      return await submitTimeOffRequest(request);
    },
    onSuccess: (response) => {
      toast.success(response.message || 'Time-off request submitted successfully!');
      // Invalidate and refetch time-off requests
      queryClient.invalidateQueries({ queryKey: ['timeOffRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        toast.error(message || 'Failed to submit time-off request. Please try again.');
      } else {
        toast.error('Failed to submit time-off request. Please try again.');
      }
    },
  });
};

/**
 * Hook to cancel a time-off request
 */
export const useCancelTimeOffRequest = () => {
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
      // Invalidate and refetch time-off requests
      queryClient.invalidateQueries({ queryKey: ['timeOffRequests'] });
      queryClient.invalidateQueries({ queryKey: ['leaveBalances'] });
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        toast.error(message || 'Failed to cancel time-off request. Please try again.');
      } else {
        toast.error('Failed to cancel time-off request. Please try again.');
      }
    },
  });
};

