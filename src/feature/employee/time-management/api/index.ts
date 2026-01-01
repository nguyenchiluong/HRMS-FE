/**
 * Time Management Feature API
 * Uses .NET backend (dotnetApi)
 */

import dotnetApi from '@/api/dotnet';
import type {
  AdjustTimesheetRequest,
  ApproveTimesheetRequest,
  PaginatedResponse,
  RejectTimesheetRequest,
  SubmitTimesheetRequest,
  Task,
  TimesheetResponse,
  TimesheetSummaryResponse,
} from '../types';

const BASE_URL = '/api/v1/timesheet';

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

