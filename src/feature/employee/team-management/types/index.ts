export interface TeamMember {
  id: number;
  fullName: string;
  workEmail: string;
  position: string | null;
  department: string | null;
  jobLevel: string | null;
  status: 'Active' | 'Pending' | 'Inactive';
  employmentType: string | null;
  timeType: string | null;
  avatar?: string | null;
  phone?: string | null;
  startDate?: string | null;
  // Time Management Data
  attendanceStatus?: 'clocked-in' | 'clocked-out';
  clockInTime?: string | null;
  currentWorkingMinutes?: number | null;
  pendingTimesheetCount?: number;
  pendingTimeOffCount?: number;
  lastTimesheetStatus?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface TeamMembersSummary {
  activeMembers: number;
  clockedInCount: number;
  totalPendingTimesheets: number;
  totalPendingTimeOff: number;
}

export interface TeamMembersResponse {
  teamMembers: TeamMember[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface TeamMembersFilters {
  search?: string;
  department?: string;
  status?: 'Active' | 'Pending' | 'Inactive';
  position?: string;
  page?: number;
  pageSize?: number;
}
