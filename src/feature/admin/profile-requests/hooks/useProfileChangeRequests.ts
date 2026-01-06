/**
 * React Query hooks for admin profile change requests
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  approveProfileChangeRequest,
  getProfileChangeRequests,
  rejectProfileChangeRequest,
  type RequestStatus,
} from '../api';
import type {
  ProfileChangeRequest,
  ProfileRequestStatus,
} from '../types';

// ==================== Query Keys ====================

export const profileChangeRequestKeys = {
  all: ['admin-profile-change-requests'] as const,
  lists: () => [...profileChangeRequestKeys.all, 'list'] as const,
  list: (
    page: number,
    limit: number,
    status?: RequestStatus,
  ) => [...profileChangeRequestKeys.lists(), page, limit, status] as const,
};

// ==================== Helper Functions ====================

/**
 * Map API IdChangeRequestDto to ProfileChangeRequest
 * Since API returns multiple fields, we'll use the first field for the table
 * and show all fields in the details dialog
 */
const mapIdChangeRequestToProfileChangeRequest = (
  dto: any,
): ProfileChangeRequest => {
  // Get the first field change for the table display
  const firstFieldChange = dto.fieldChangeDetails?.[0] || {
    fieldLabel: dto.fieldChanges?.[0] || 'Multiple Fields',
    oldValue: null,
    newValue: null,
  };

  // Map status from API format to frontend format
  const statusMap: Record<string, ProfileRequestStatus> = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'rejected', // Treat cancelled as rejected for admin view
  };

  // Map field label to ChangeableField type
  const fieldLabelToField = (label: string): ProfileChangeRequest['field'] => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('legal full name') || labelLower.includes('full name'))
      return 'legal-full-name';
    if (labelLower.includes('national id'))
      return 'national-id';
    if (labelLower.includes('social insurance'))
      return 'social-insurance-number';
    if (labelLower.includes('tax id'))
      return 'other';
    if (labelLower.includes('first name'))
      return 'legal-full-name';
    if (labelLower.includes('last name'))
      return 'legal-full-name';
    if (labelLower.includes('nationality'))
      return 'other';
    return 'other';
  };

  return {
    id: dto.id,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName,
    employeeEmail: dto.employeeEmail,
    employeeAvatar: dto.employeeAvatar || undefined,
    department: dto.department || 'N/A',
    field: fieldLabelToField(firstFieldChange.fieldLabel),
    fieldLabel:
      dto.fieldChanges && dto.fieldChanges.length > 1
        ? `${dto.fieldChanges.length} Fields`
        : firstFieldChange.fieldLabel,
    oldValue: firstFieldChange.oldValue || '—',
    newValue: firstFieldChange.newValue || '—',
    requestDate: new Date(dto.submittedDate),
    status: statusMap[dto.status] || 'pending',
    reason: dto.reason,
    adminNotes: dto.approvalComment || dto.rejectionReason,
    attachments: dto.attachments || [],
    // Store full API data for details view
    _apiData: {
      fieldChanges: dto.fieldChanges,
      fieldChangeDetails: dto.fieldChangeDetails,
    },
  };
};

// ==================== Queries ====================

/**
 * Hook to fetch profile change requests (admin view)
 */
export const useProfileChangeRequests = (
  page = 1,
  limit = 20,
  status?: RequestStatus,
) => {
  return useQuery({
    queryKey: profileChangeRequestKeys.list(page, limit, status),
    queryFn: async () => {
      const response = await getProfileChangeRequests({
        page,
        limit,
        status,
      });
      return {
        data: response.data.map(mapIdChangeRequestToProfileChangeRequest),
        pagination: response.pagination,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ==================== Mutations ====================

interface ApprovalOptions {
  onSuccess?: () => void;
}

/**
 * Hook to approve a profile change request
 */
export const useApproveProfileChangeRequest = (
  options?: ApprovalOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data?: { comment?: string };
    }) => approveProfileChangeRequest(requestId, data),
    onSuccess: (response) => {
      toast.success(
        `Profile change request for ${response.data.employeeName} approved successfully!`,
      );
      queryClient.invalidateQueries({
        queryKey: profileChangeRequestKeys.all,
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Failed to approve profile change request:', error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          'Failed to approve profile change request. Please try again.',
        );
      }
    },
  });
};

/**
 * Hook to reject a profile change request
 */
export const useRejectProfileChangeRequest = (options?: ApprovalOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: { reason: string };
    }) => rejectProfileChangeRequest(requestId, data),
    onSuccess: (response) => {
      toast.success(
        `Profile change request for ${response.data.employeeName} rejected.`,
      );
      queryClient.invalidateQueries({
        queryKey: profileChangeRequestKeys.all,
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('Failed to reject profile change request:', error);
      if (isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data;
        if (error.response.status === 400 && errorData.errors) {
          const errorMessages: string[] = [];
          Object.keys(errorData.errors).forEach((field) => {
            const fieldErrors = errorData.errors[field];
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            } else if (typeof fieldErrors === 'string') {
              errorMessages.push(fieldErrors);
            }
          });
          if (errorMessages.length > 0) {
            toast.error(errorMessages[0]);
          } else {
            toast.error(
              errorData.message ||
                'Validation failed. Please check your input.',
            );
          }
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error(
            'Failed to reject profile change request. Please try again.',
          );
        }
      } else {
        toast.error(
          'Failed to reject profile change request. Please try again.',
        );
      }
    },
  });
};

