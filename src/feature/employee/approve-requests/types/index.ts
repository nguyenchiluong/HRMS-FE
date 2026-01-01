// Approval Status
export const ApprovalStatus = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
} as const;

export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

// Timesheet Summary from API
export interface TimesheetSummary {
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  leaveHours: number;
}

// Timesheet Approval Types (matches API response)
export interface TimesheetApprovalRequest {
  requestId: number;
  employeeId: number;
  employeeName: string;
  employeeEmail?: string;
  employeeAvatar?: string;
  department: string;
  year: number;
  month: number;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  summary: TimesheetSummary;
  submittedAt: string;
  status: ApprovalStatus;
  reason?: string;
  approvalComment?: string;
  rejectionReason?: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Time-Off Approval Types
export type TimeOffType =
  | 'paid-leave'
  | 'unpaid-leave'
  | 'paid-sick-leave'
  | 'unpaid-sick-leave'
  | 'wfh';

export interface TimeOffApprovalRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar?: string;
  department: string;
  type: TimeOffType;
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  submittedDate: Date;
  status: ApprovalStatus;
  attachments?: string[];
}

// Stats for dashboard cards
export interface ApprovalStats {
  pendingTimesheets: number;
  pendingTimeOff: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
}
