// Approval Status
export const ApprovalStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

export type ApprovalStatus =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

// Timesheet Approval Types
export interface TimesheetApprovalRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar?: string;
  department: string;
  month: number;
  year: number;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  leaveHours: number;
  submittedDate: Date;
  status: ApprovalStatus;
  notes?: string;
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
