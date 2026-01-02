// ==================== Timesheet Status ====================

export const TimesheetStatus = {
  Draft: 'DRAFT', // Frontend only - not submitted yet
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
  Cancelled: 'CANCELLED',
} as const;

export type TimesheetStatus =
  (typeof TimesheetStatus)[keyof typeof TimesheetStatus];

// ==================== Task Types ====================

export interface Task {
  id: number;
  taskCode: string;
  taskName: string;
  description?: string;
  taskType: 'project' | 'leave';
  isActive: boolean;
}

// ==================== Timesheet Entry ====================

export interface TimesheetEntry {
  id?: number;
  taskId: number;
  taskCode?: string;
  taskName?: string;
  entryType: 'project' | 'leave';
  hours: number;
}

export interface TimesheetSummary {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  leaveHours: number;
}

// ==================== API Request Types ====================

export interface SubmitTimesheetRequest {
  year: number;
  month: number;
  weekNumber: number;
  weekStartDate: string; // ISO date string
  weekEndDate: string; // ISO date string
  reason: string;
  entries: {
    taskId: number;
    entryType: 'project' | 'leave';
    hours: number;
  }[];
}

export interface AdjustTimesheetRequest {
  reason: string;
  entries: {
    taskId: number;
    entryType: 'project' | 'leave';
    hours: number;
  }[];
}

export interface ApproveTimesheetRequest {
  comment?: string;
}

export interface RejectTimesheetRequest {
  reason: string;
}

// ==================== API Response Types ====================

export interface TimesheetResponse {
  requestId: number;
  employeeId: number;
  employeeName: string;
  department: string;
  year: number;
  month: number;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  status: TimesheetStatus;
  reason: string;
  submittedAt: string;
  approvedAt?: string;
  approverEmployeeId?: number;
  approverName?: string;
  approvalComment?: string;
  rejectionReason?: string;
  summary: TimesheetSummary;
  entries: TimesheetEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetSummaryResponse {
  requestId: number;
  employeeId: number;
  employeeName: string;
  department: string;
  year: number;
  month: number;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  status: TimesheetStatus;
  summary: TimesheetSummary;
  submittedAt: string;
  createdAt: string;
  // These may be included in some endpoints
  entries?: TimesheetEntry[];
  reason?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Frontend UI Types ====================

export interface TimesheetRow {
  id: string;
  taskId: number;
  taskCode: string;
  name: string;
  type: 'project' | 'leave';
  weeklyData: {
    hours: number;
    requestId?: number; // Track which request this entry belongs to
    status?: string; // Status as string to avoid type issues with API
  }[];
}

export interface WeekRange {
  start: string;
  end: string;
  weekNumber: number;
  isCurrentWeek: boolean;
  startDate: Date; // Full date object for API calls
  endDate: Date; // Full date object for API calls
}

export interface WeeklyTotal {
  totalHours: number;
  percentage: number;
}

export interface AvailableProject {
  id: string;
  taskId: number;
  name: string;
  taskCode: string;
  type: 'project' | 'leave';
}

export interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

// ==================== Week Submission State ====================

export interface WeekSubmission {
  weekNumber: number;
  requestId?: number;
  status: TimesheetStatus;
  entries: TimesheetEntry[];
}

// ==================== Time Off Request types ====================

// Request types in uppercase snake_case format (as returned by API)
export type RequestType =
  | 'PAID_LEAVE'
  | 'UNPAID_LEAVE'
  | 'PAID_SICK_LEAVE'
  | 'UNPAID_SICK_LEAVE'
  | 'WFH';

// Legacy kebab-case format (for backward compatibility during migration)
export type RequestTypeKebab =
  | 'paid-leave'
  | 'unpaid-leave'
  | 'paid-sick-leave'
  | 'unpaid-sick-leave'
  | 'wfh';

// Request Type from API
export interface RequestTypeOption {
  id: number;
  value: string; // Uppercase snake_case (e.g., "PAID_LEAVE")
  category: 'time-off' | 'timesheet' | 'profile' | 'other';
  name: string; // Display name (e.g., "Paid Leave")
  description: string;
  isActive: boolean;
  requiresApproval: boolean;
}

// Leave Request Status
export const LeaveRequestStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
  Cancelled: 'cancelled',
} as const;

export type LeaveRequestStatus =
  (typeof LeaveRequestStatus)[keyof typeof LeaveRequestStatus];

// Leave Balance
export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

// Leave Request History (API Response)
export interface TimeOffRequestResponse {
  id: string;
  type: RequestType;
  startDate: string; // ISO date string (yyyy-MM-dd)
  endDate: string; // ISO date string (yyyy-MM-dd)
  duration: number;
  submittedDate: string; // ISO timestamp
  status: LeaveRequestStatus;
  reason: string;
  attachments?: string[]; // Array of file URLs
}

// Leave Request History (Frontend UI)
export interface LeaveRequest {
  id: string;
  type: RequestType;
  startDate: Date;
  endDate: Date;
  duration: number;
  submittedDate: Date;
  status: LeaveRequestStatus;
  reason?: string;
  attachments?: string[];
}

// Submit Time Off Request
export interface SubmitTimeOffRequest {
  type: RequestType;
  startDate: string; // ISO date string (yyyy-MM-dd)
  endDate: string; // ISO date string (yyyy-MM-dd)
  reason: string;
  attachments?: string[]; // Array of file URLs (CloudFront URLs)
}

// Cancel Time Off Request
export interface CancelTimeOffRequest {
  comment?: string;
}

// ==================== Attendance types ====================

export interface AttendanceRecord {
  id: string;
  date: Date;
  clockInTime: Date | null;
  clockOutTime: Date | null;
  totalWorkingMinutes: number | null;
}

export type ClockStatus = 'clocked-out' | 'clocked-in';
