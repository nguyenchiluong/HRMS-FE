/**
 * Unified Requests API
 * Handles both timesheet and time-off approval requests
 * Uses /api/v1/requests endpoint
 */

import dotnetApi from '@/api/dotnet';

const BASE_URL = '/api/v1/requests';

// Request type values from API
export type RequestType =
  | 'TIMESHEET_WEEKLY'
  | 'PAID_LEAVE'
  | 'UNPAID_LEAVE'
  | 'PAID_SICK_LEAVE'
  | 'UNPAID_SICK_LEAVE'
  | 'WFH';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// API Response DTO
export interface RequestDto {
  id: string;
  type: RequestType;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar: string | null;
  department: string | null;
  status: RequestStatus;
  startDate: string | null; // yyyy-MM-dd format (for time-off requests only)
  endDate: string | null; // yyyy-MM-dd format (for time-off requests only)
  duration: number | null; // Number of days (for time-off requests only)
  submittedDate: string; // ISO 8601 format
  reason: string;
  attachments: string[];
}

// Paginated response
export interface PaginatedRequestResponse {
  data: RequestDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request category values
export type RequestCategory = 'timesheet' | 'time-off' | 'profile' | 'other';

// Query parameters for getting requests
export interface GetRequestsParams {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  category?: RequestCategory;
  employee_id?: number;
  date_from?: string; // ISO format
  date_to?: string; // ISO format
}

// Approve request body
export interface ApproveRequestBody {
  comment?: string;
}

// Reject request body
export interface RejectRequestBody {
  reason: string;
}

// Approve response
export interface ApproveRequestResponse {
  message: string;
  data: RequestDto;
}

// Reject response
export interface RejectRequestResponse {
  message: string;
  data: RequestDto;
}

/**
 * Get pending approvals (supports both timesheet and time-off)
 * Uses category-based filtering instead of request_type
 */
export const getRequests = async (
  params?: GetRequestsParams,
): Promise<PaginatedRequestResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status) queryParams.status = params.status;
  if (params?.category) queryParams.category = params.category;
  if (params?.employee_id) queryParams.employee_id = params.employee_id;
  if (params?.date_from) queryParams.date_from = params.date_from;
  if (params?.date_to) queryParams.date_to = params.date_to;

  const response = await dotnetApi.get<PaginatedRequestResponse>(BASE_URL, {
    params: queryParams,
  });
  return response.data;
};

/**
 * Approve a request
 */
export const approveRequest = async (
  requestId: string,
  data?: ApproveRequestBody,
): Promise<ApproveRequestResponse> => {
  const response = await dotnetApi.post<ApproveRequestResponse>(
    `${BASE_URL}/${requestId}/approve`,
    data || {},
  );
  return response.data;
};

/**
 * Reject a request
 */
export const rejectRequest = async (
  requestId: string,
  data: RejectRequestBody,
): Promise<RejectRequestResponse> => {
  const response = await dotnetApi.post<RejectRequestResponse>(
    `${BASE_URL}/${requestId}/reject`,
    data,
  );
  return response.data;
};

