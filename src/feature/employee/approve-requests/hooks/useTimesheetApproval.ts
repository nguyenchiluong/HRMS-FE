import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { getTimesheetById } from '@/feature/employee/time-management/api';
import {
  approveRequest,
  getRequests,
  rejectRequest,
  type RequestDto,
  type RequestStatus,
} from '../api';
import type { TimesheetApprovalRequest } from '../types';

// ==================== Query Keys ====================

export const approvalKeys = {
  all: ['timesheet-approvals'] as const,
  pending: (page: number, limit: number, status?: RequestStatus) =>
    [...approvalKeys.all, 'pending', page, limit, status] as const,
  detail: (requestId: number) =>
    [...approvalKeys.all, 'detail', requestId] as const,
};

// ==================== Queries ====================

/**
 * Hook to fetch pending timesheet approvals
 * Uses unified endpoint with category-based filtering: category=timesheet
 * Only fetches full details when needed (lazy loading)
 */
export const usePendingApprovals = (
  page = 1,
  limit = 20,
  status?: RequestStatus,
) => {
  return useQuery({
    queryKey: approvalKeys.pending(page, limit, status),
    queryFn: async () => {
      const response = await getRequests({
        page,
        limit,
        status,
        category: 'timesheet',
      });
      
      // Map unified API response to timesheet approval format
      // Note: The unified endpoint may not include all timesheet-specific fields
      // We'll use what's available and fetch full details only when viewing details
      const mappedData = response.data.map((dto) => {
        const submittedDate = new Date(dto.submittedDate);
        const year = submittedDate.getFullYear();
        const month = submittedDate.getMonth() + 1;

        return {
          requestId: parseInt(dto.id, 10),
          employeeId: parseInt(dto.employeeId, 10),
          employeeName: dto.employeeName,
          employeeEmail: dto.employeeEmail,
          employeeAvatar: dto.employeeAvatar || undefined,
          department: dto.department || '',
          year,
          month,
          weekNumber: 1, // Default - will be updated when full details are fetched
          weekStartDate: dto.startDate || submittedDate.toISOString().split('T')[0],
          weekEndDate: dto.endDate || submittedDate.toISOString().split('T')[0],
          summary: {
            totalHours: 0, // Will be updated when full details are fetched
            regularHours: 0,
            overtimeHours: 0,
            leaveHours: 0,
          },
          submittedAt: dto.submittedDate,
          status: dto.status as TimesheetApprovalRequest['status'],
          reason: dto.reason,
        };
      });
      
      return {
        data: mappedData,
        pagination: response.pagination,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch full timesheet details by ID
 * Use this when viewing details of a specific timesheet
 */
export const useTimesheetDetails = (requestId: number | null) => {
  return useQuery({
    queryKey: approvalKeys.detail(requestId || 0),
    queryFn: () => getTimesheetById(requestId!),
    enabled: requestId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== Mutations ====================

interface ApprovalOptions {
  onSuccess?: (data: RequestDto) => void;
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
      data: { comment?: string };
    }) => approveRequest(String(requestId), data),
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
      data: { reason: string };
    }) => rejectRequest(String(requestId), data),
    onSuccess: (response) => {
      toast.success(
        `Timesheet for ${response.data.employeeName} rejected.`,
      );
      queryClient.invalidateQueries({ queryKey: approvalKeys.all });
      options?.onSuccess?.(response.data);
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors (400 Bad Request with errors object)
        if (error.response.status === 400 && errorData.errors) {
          const errorMessages: string[] = [];
          
          // Extract all validation error messages
          Object.keys(errorData.errors).forEach((field) => {
            const fieldErrors = errorData.errors[field];
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            } else if (typeof fieldErrors === 'string') {
              errorMessages.push(fieldErrors);
            }
          });
          
          if (errorMessages.length > 0) {
            toast.error(errorMessages[0]); // Show first error
          } else {
            toast.error(errorData.message || 'Validation failed. Please check your input.');
          }
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Failed to reject timesheet. Please try again.');
        }
      } else {
        toast.error('Failed to reject timesheet. Please try again.');
      }
    },
  });
};

