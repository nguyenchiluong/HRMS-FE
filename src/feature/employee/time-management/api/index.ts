/**
 * Time Management Feature API
 * Uses .NET backend (dotnetApi)
 */

import dotnetApi from '@/api/dotnet';
import type {
  AdjustTimesheetRequest,
  ApproveTimesheetRequest,
  CancelTimeOffRequest,
  CurrentClockStatusResponse,
  LeaveBalance,
  PaginatedResponse,
  RejectTimesheetRequest,
  SubmitTimeOffRequest,
  SubmitTimesheetRequest,
  Task,
  TimeOffRequestResponse,
  TimesheetResponse,
  TimesheetSummaryResponse,
} from '../types';

const BASE_URL = '/api/v1/timesheet';
const TIME_OFF_BASE_URL = '/api/time-off';
const ATTENDANCE_BASE_URL = '/api/v1/attendance';

// ==================== Task Management ====================

/**
 * Get all active tasks available for timesheet entry
 */
export const getActiveTasks = async (): Promise<Task[]> => {
  const response = await dotnetApi.get<Task[]>(`${BASE_URL}/tasks`);
  return response.data;
};

/**
 * Get all tasks including inactive (Admin only)
 */
export const getAllTasks = async (): Promise<Task[]> => {
  const response = await dotnetApi.get<Task[]>(`${BASE_URL}/tasks/all`);
  return response.data;
};

/**
 * Create a new task (Admin only)
 */
export const createTask = async (
  task: Omit<Task, 'id' | 'isActive'>,
): Promise<Task> => {
  const response = await dotnetApi.post<Task>(`${BASE_URL}/tasks`, task);
  return response.data;
};

/**
 * Update a task (Admin only)
 */
export const updateTask = async (
  id: number,
  task: Partial<Task>,
): Promise<Task> => {
  const response = await dotnetApi.put<Task>(`${BASE_URL}/tasks/${id}`, task);
  return response.data;
};

// ==================== Timesheet Submission ====================

/**
 * Submit weekly timesheet
 */
export const submitTimesheet = async (
  request: SubmitTimesheetRequest,
): Promise<{ message: string; data: TimesheetResponse }> => {
  const response = await dotnetApi.post<{
    message: string;
    data: TimesheetResponse;
  }>(`${BASE_URL}/submit`, request);
  return response.data;
};

/**
 * Adjust a pending/rejected timesheet
 */
export const adjustTimesheet = async (
  requestId: number,
  request: AdjustTimesheetRequest,
): Promise<{ message: string; data: TimesheetResponse }> => {
  const response = await dotnetApi.put<{
    message: string;
    data: TimesheetResponse;
  }>(`${BASE_URL}/${requestId}/adjust`, request);
  return response.data;
};

// ==================== Timesheet Queries ====================

/**
 * Get timesheet by ID
 */
export const getTimesheetById = async (
  requestId: number,
): Promise<TimesheetResponse> => {
  const response = await dotnetApi.get<TimesheetResponse>(
    `${BASE_URL}/${requestId}`,
  );
  return response.data;
};

/**
 * Get my timesheets with optional filters
 */
export const getMyTimesheets = async (params?: {
  year?: number;
  month?: number;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<TimesheetSummaryResponse>> => {
  const response = await dotnetApi.get<
    PaginatedResponse<TimesheetSummaryResponse>
  >(`${BASE_URL}/my-timesheets`, { params });
  return response.data;
};

// ==================== Approval Workflow ====================

/**
 * Get pending approvals for manager/admin
 */
export const getPendingApprovals = async (params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<TimesheetSummaryResponse>> => {
  const response = await dotnetApi.get<
    PaginatedResponse<TimesheetSummaryResponse>
  >(`${BASE_URL}/pending-approvals`, { params });
  return response.data;
};

/**
 * Approve a timesheet
 */
export const approveTimesheet = async (
  requestId: number,
  request: ApproveTimesheetRequest,
): Promise<{ message: string; data: TimesheetResponse }> => {
  const response = await dotnetApi.put<{
    message: string;
    data: TimesheetResponse;
  }>(`${BASE_URL}/${requestId}/approve`, request);
  return response.data;
};

/**
 * Reject a timesheet
 */
export const rejectTimesheet = async (
  requestId: number,
  request: RejectTimesheetRequest,
): Promise<{ message: string; data: TimesheetResponse }> => {
  const response = await dotnetApi.put<{
    message: string;
    data: TimesheetResponse;
  }>(`${BASE_URL}/${requestId}/reject`, request);
  return response.data;
};

/**
 * Cancel a pending timesheet (employee can cancel before manager action)
 */
export const cancelTimesheet = async (
  requestId: number,
): Promise<{ message: string; data: TimesheetResponse }> => {
  const response = await dotnetApi.put<{
    message: string;
    data: TimesheetResponse;
  }>(`${BASE_URL}/${requestId}/cancel`);
  return response.data;
};

// ==================== Time-Off Request APIs ====================

/**
 * Submit a time-off request with file attachment URLs
 */
export const submitTimeOffRequest = async (
  request: SubmitTimeOffRequest,
): Promise<{ message: string; data: TimeOffRequestResponse }> => {
  const response = await dotnetApi.post<{
    message: string;
    data: TimeOffRequestResponse;
  }>(`${TIME_OFF_BASE_URL}/requests`, {
    type: request.type,
    startDate: request.startDate,
    endDate: request.endDate,
    reason: request.reason,
    attachments: request.attachments || [],
  });
  return response.data;
};

/**
 * Get leave balances for the authenticated employee
 */
export const getLeaveBalances = async (
  year?: number,
): Promise<{ balances: LeaveBalance[] }> => {
  const response = await dotnetApi.get<{ balances: LeaveBalance[] }>(
    `${TIME_OFF_BASE_URL}/balances`,
    {
      params: year ? { year } : {},
    },
  );
  return response.data;
};

/**
 * Get time-off request history with pagination and filters
 */
export const getTimeOffRequests = async (params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  type?: string;
}): Promise<PaginatedResponse<TimeOffRequestResponse>> => {
  const response = await dotnetApi.get<
    PaginatedResponse<TimeOffRequestResponse>
  >(`${TIME_OFF_BASE_URL}/requests`, { params });
  return response.data;
};

/**
 * Cancel a time-off request
 */
export const cancelTimeOffRequest = async (
  requestId: string,
  request?: CancelTimeOffRequest,
): Promise<{ message: string; data: TimeOffRequestResponse }> => {
  const response = await dotnetApi.patch<{
    message: string;
    data: TimeOffRequestResponse;
  }>(`${TIME_OFF_BASE_URL}/requests/${requestId}/cancel`, request);
  return response.data;
};

/**
 * Get available request types from API
 */
export const getRequestTypes = async (): Promise<{
  requestTypes: Array<{
    id: number;
    value: string;
    category: 'time-off' | 'timesheet' | 'profile' | 'other';
    name: string;
    description: string;
    isActive: boolean;
    requiresApproval: boolean;
  }>;
}> => {
  const response = await dotnetApi.get<{
    requestTypes: Array<{
      id: number;
      value: string;
      category: 'time-off' | 'timesheet' | 'profile' | 'other';
      name: string;
      description: string;
      isActive: boolean;
      requiresApproval: boolean;
    }>;
  }>('/api/v1/request-types');
  return response.data;
};

// ==================== Attendance APIs ====================

/**
 * API response format for attendance records (dates as ISO strings)
 */
interface AttendanceRecordApiResponse {
  id: string;
  date: string; // ISO date string
  clockInTime: string | null; // ISO timestamp or null
  clockOutTime: string | null; // ISO timestamp or null
  totalWorkingMinutes: number | null;
}

/**
 * Get current clock status for the authenticated employee
 */
export const getCurrentClockStatus =
  async (): Promise<CurrentClockStatusResponse> => {
    const response = await dotnetApi.get<CurrentClockStatusResponse>(
      `${ATTENDANCE_BASE_URL}/status`,
    );
    return response.data;
  };

/**
 * Clock in for the authenticated employee
 */
export const clockIn = async (): Promise<{
  message: string;
  data: AttendanceRecordApiResponse;
}> => {
  const response = await dotnetApi.post<{
    message: string;
    data: AttendanceRecordApiResponse;
  }>(`${ATTENDANCE_BASE_URL}/clock-in`, {});
  return response.data;
};

/**
 * Clock out for the authenticated employee
 */
export const clockOut = async (): Promise<{
  message: string;
  data: AttendanceRecordApiResponse;
}> => {
  const response = await dotnetApi.post<{
    message: string;
    data: AttendanceRecordApiResponse;
  }>(`${ATTENDANCE_BASE_URL}/clock-out`, {});
  return response.data;
};

/**
 * Get attendance history with pagination
 */
export const getAttendanceHistory = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedResponse<AttendanceRecordApiResponse>> => {
  const response = await dotnetApi.get<
    PaginatedResponse<AttendanceRecordApiResponse>
  >(`${ATTENDANCE_BASE_URL}/history`, { params });
  return response.data;
};

