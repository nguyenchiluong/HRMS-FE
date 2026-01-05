/**
 * Admin Profile Change Requests API
 * Uses the unified request system with category='profile'
 */

import {
  approveRequest,
  getRequests,
  rejectRequest,
  type RequestStatus,
} from '@/feature/employee/approve-requests/api';
import type { IdChangeRequestDto } from '@/feature/employee/profile-management/api/idChangeRequests';

// Re-export types
export type { RequestStatus };

// Query parameters for getting profile change requests
export interface GetProfileChangeRequestsParams {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  date_from?: string; // ISO format
  date_to?: string; // ISO format
}

// Paginated response
export interface PaginatedProfileChangeRequestResponse {
  data: IdChangeRequestDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get profile change requests (admin view - all employees)
 */
export const getProfileChangeRequests = async (
  params?: GetProfileChangeRequestsParams,
): Promise<PaginatedProfileChangeRequestResponse> => {
  const queryParams: Record<string, string | number> = {
    category: 'profile',
  };

  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status) queryParams.status = params.status;
  if (params?.date_from) queryParams.date_from = params.date_from;
  if (params?.date_to) queryParams.date_to = params.date_to;

  const response = await getRequests(queryParams);
  return response as PaginatedProfileChangeRequestResponse;
};

/**
 * Approve a profile change request
 */
export const approveProfileChangeRequest = async (
  requestId: string,
  data?: { comment?: string },
) => {
  return await approveRequest(requestId, data);
};

/**
 * Reject a profile change request
 */
export const rejectProfileChangeRequest = async (
  requestId: string,
  data: { reason: string },
) => {
  return await rejectRequest(requestId, data);
};

