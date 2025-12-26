export const TimesheetStatus = {
  Draft: 'draft',
  Submitted: 'submitted',
  Approved: 'approved',
} as const;

export type TimesheetStatus =
  (typeof TimesheetStatus)[keyof typeof TimesheetStatus];

export interface TimesheetRow {
  id: string;
  name: string;
  type: 'project' | 'leave';
  weeklyData: {
    hours: number;
  }[];
}

export interface WeekRange {
  start: string;
  end: string;
  weekNumber: number;
  isCurrentWeek: boolean;
}

export interface WeeklyTotal {
  totalHours: number;
  percentage: number;
}

export interface AvailableProject {
  id: string;
  name: string;
  type: 'project' | 'leave';
}

export interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

// Time Off Request types
export type RequestType =
  | 'paid-leave'
  | 'unpaid-leave'
  | 'paid-sick-leave'
  | 'unpaid-sick-leave'
  | 'wfh';

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

// Leave Request History
export interface LeaveRequest {
  id: string;
  type: RequestType;
  startDate: Date;
  endDate: Date;
  duration: number;
  submittedDate: Date;
  status: LeaveRequestStatus;
  reason?: string;
}
