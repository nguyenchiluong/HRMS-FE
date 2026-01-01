import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  approveTimesheet,
  getPendingApprovals,
  rejectTimesheet,
} from '@/feature/employee/time-management/api';
import type {
  ApproveTimesheetRequest,
  RejectTimesheetRequest,
  TimesheetResponse,
} from '@/feature/employee/time-management/types';

// ==================== Query Keys ====================

export const approvalKeys = {
  all: ['timesheet-approvals'] as const,
  pending: (page: number, limit: number) =>
    [...approvalKeys.all, 'pending', page, limit] as const,
};

// ==================== Queries ====================

/**
 * Hook to fetch pending timesheet approvals
 */
export const usePendingApprovals = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: approvalKeys.pending(page, limit),
    queryFn: () => getPendingApprovals({ page, limit }),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ==================== Mutations ====================

interface ApprovalOptions {
  onSuccess?: (data: TimesheetResponse) => void;
}

/**
 * Hook to approve a timesheet
 */
export const useApproveTimesheet = (options?: ApprovalOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: number;
      data: ApproveTimesheetRequest;
    }) => approveTimesheet(requestId, data),
    onSuccess: (response) => {
      toast.success(
        `Timesheet for ${response.data.employeeName} approved successfully!`,
      );
      // Invalidate all pending approvals queries
      queryClient.invalidateQueries({ queryKey: approvalKeys.all });
      options?.onSuccess?.(response.data);
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to approve timesheet. Please try again.');
      }
    },
  });
};

/**
 * Hook to reject a timesheet
 */
export const useRejectTimesheet = (options?: ApprovalOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: number;
      data: RejectTimesheetRequest;
    }) => rejectTimesheet(requestId, data),
    onSuccess: (response) => {
      toast.success(
        `Timesheet for ${response.data.employeeName} rejected.`,
      );
      queryClient.invalidateQueries({ queryKey: approvalKeys.all });
      options?.onSuccess?.(response.data);
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to reject timesheet. Please try again.');
      }
    },
  });
};

