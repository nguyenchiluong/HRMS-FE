import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  approveRequest,
  getRequests,
  rejectRequest,
  type RequestDto,
  type RequestStatus,
} from '../api';
import type { TimeOffApprovalRequest } from '../types';

// ==================== Query Keys ====================

export const timeOffApprovalKeys = {
  all: ['time-off-approvals'] as const,
  pending: (page: number, limit: number, status?: RequestStatus) =>
    [...timeOffApprovalKeys.all, 'pending', page, limit, status] as const,
};

// ==================== Helper Functions ====================

/**
 * Map API RequestDto to TimeOffApprovalRequest
 */
const mapRequestDtoToTimeOffApproval = (
  dto: RequestDto,
): TimeOffApprovalRequest => {
  // Map request type from API format to frontend format
  const typeMap: Record<string, TimeOffApprovalRequest['type']> = {
    PAID_LEAVE: 'paid-leave',
    UNPAID_LEAVE: 'unpaid-leave',
    PAID_SICK_LEAVE: 'paid-sick-leave',
    UNPAID_SICK_LEAVE: 'unpaid-sick-leave',
    WFH: 'wfh',
  };

  return {
    id: dto.id,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName,
    employeeEmail: dto.employeeEmail,
    employeeAvatar: dto.employeeAvatar || undefined,
    department: dto.department || '',
    type: typeMap[dto.type] || 'paid-leave',
    startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
    endDate: dto.endDate ? new Date(dto.endDate) : new Date(),
    duration: dto.duration || 0,
    reason: dto.reason,
    submittedDate: new Date(dto.submittedDate),
    status: dto.status as TimeOffApprovalRequest['status'],
    attachments: dto.attachments || [],
  };
};

// ==================== Queries ====================

/**
 * Hook to fetch pending time-off approvals
 * Uses category-based filtering: category=time-off
 */
export const usePendingTimeOffApprovals = (
  page = 1,
  limit = 20,
  status?: RequestStatus,
) => {
  return useQuery({
    queryKey: timeOffApprovalKeys.pending(page, limit, status),
    queryFn: () =>
      getRequests({
        page,
        limit,
        status,
        category: 'time-off',
      }),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ==================== Mutations ====================

interface ApprovalOptions {
  onSuccess?: (data: RequestDto) => void;
}

/**
 * Hook to approve a time-off request
 */
export const useApproveTimeOff = (options?: ApprovalOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data?: { comment?: string };
    }) => approveRequest(requestId, data),
    onSuccess: (response) => {
      toast.success(
        `Time-off request for ${response.data.employeeName} approved successfully!`,
      );
      // Invalidate all time-off approval queries
      queryClient.invalidateQueries({ queryKey: timeOffApprovalKeys.all });
      options?.onSuccess?.(response.data);
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to approve time-off request. Please try again.');
      }
    },
  });
};

/**
 * Hook to reject a time-off request
 */
export const useRejectTimeOff = (options?: ApprovalOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: { reason: string };
    }) => rejectRequest(requestId, data),
    onSuccess: (response) => {
      toast.success(
        `Time-off request for ${response.data.employeeName} rejected.`,
      );
      queryClient.invalidateQueries({ queryKey: timeOffApprovalKeys.all });
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
          toast.error('Failed to reject time-off request. Please try again.');
        }
      } else {
        toast.error('Failed to reject time-off request. Please try again.');
      }
    },
  });
};

