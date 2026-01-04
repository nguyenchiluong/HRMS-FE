/**
 * ID Change Request API
 * Handles employee ID change requests through the unified request system
 */

import dotnetApi from '@/api/dotnet';

const BASE_URL = '/api/v1/requests';

// Request type lookup
export interface RequestTypeOption {
  id: number;
  value: string;
  category: 'time-off' | 'timesheet' | 'profile' | 'other';
  name: string;
  description: string;
  isActive: boolean;
  requiresApproval: boolean;
}

/**
 * Get request types from API
 */
export const getRequestTypes = async (): Promise<{
  requestTypes: RequestTypeOption[];
}> => {
  const response = await dotnetApi.get<{
    requestTypes: RequestTypeOption[];
  }>('/api/v1/request-types');
  return response.data;
};

// Request type for ID change requests
export const PROFILE_ID_CHANGE_REQUEST_TYPE = 'PROFILE_ID_CHANGE';

// Request status
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// Field change detail
export interface FieldChangeDetail {
  fieldLabel: string;
  oldValue: string | null;
  newValue: string | null;
}

// ID Change Request DTO
export interface IdChangeRequestDto {
  id: string;
  type: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar: string | null;
  department: string | null;
  status: RequestStatus;
  submittedDate: string; // ISO 8601 timestamp
  reason: string;
  attachments: string[];
  payload?: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    nationality?: string;
    nationalId?: {
      country?: string;
      number?: string;
      issuedDate?: string;
      expirationDate?: string;
      issuedBy?: string;
    };
    socialInsuranceNumber?: string;
    taxId?: string;
    comment?: string;
  };
  fieldChanges?: string[];
  fieldChangeDetails?: FieldChangeDetail[];
  approverName?: string | null;
  approvalComment?: string | null;
  rejectionReason?: string | null;
}

// Create ID Change Request payload
export interface CreateIdChangeRequestPayload {
  requestTypeId: number; // PROFILE_ID_CHANGE request_type_id
  reason: string;
  payload: {
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nationality?: string | null;
    nationalId?: {
      country?: string | null;
      number?: string | null;
      issuedDate?: string | null;
      expirationDate?: string | null;
      issuedBy?: string | null;
    } | null;
    socialInsuranceNumber?: string | null;
    taxId?: string | null;
    comment?: string | null;
  };
  attachments?: string[];
}

// Create ID Change Request response
export interface CreateIdChangeRequestResponse {
  message: string;
  data: IdChangeRequestDto;
}

// Get ID Change Requests query params
export interface GetIdChangeRequestsParams {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  date_from?: string;
  date_to?: string;
}

// Paginated response
export interface PaginatedIdChangeRequestResponse {
  data: IdChangeRequestDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Cancel request response
export interface CancelRequestResponse {
  message: string;
  data: {
    id: string;
    status: 'CANCELLED';
    updatedAt: string;
  };
}

/**
 * Create an ID change request
 */
export const createIdChangeRequest = async (
  data: CreateIdChangeRequestPayload,
): Promise<CreateIdChangeRequestResponse> => {
  const response = await dotnetApi.post<CreateIdChangeRequestResponse>(
    BASE_URL,
    data,
  );
  return response.data;
};

/**
 * Get employee's ID change requests
 */
export const getIdChangeRequests = async (
  params?: GetIdChangeRequestsParams,
): Promise<PaginatedIdChangeRequestResponse> => {
  const queryParams: Record<string, string | number> = {
    category: 'profile',
  };

  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status) queryParams.status = params.status;
  if (params?.date_from) queryParams.date_from = params.date_from;
  if (params?.date_to) queryParams.date_to = params.date_to;

  const response = await dotnetApi.get<PaginatedIdChangeRequestResponse>(
    BASE_URL,
    {
      params: queryParams,
    },
  );
  return response.data;
};

/**
 * Cancel an ID change request
 */
export const cancelIdChangeRequest = async (
  requestId: string,
  comment?: string,
): Promise<CancelRequestResponse> => {
  const response = await dotnetApi.patch<CancelRequestResponse>(
    `${BASE_URL}/${requestId}/cancel`,
    comment ? { comment } : {},
  );
  return response.data;
};

