/**
 * Dashboard API Types
 * Generated from OpenAPI specifications
 */

// ==================== .NET API Types ====================

export interface EmployeeDashboardStatsDto {
  /** Current bonus credit points balance (placeholder: 0 from .NET, use Spring Boot for actual) */
  bonusBalance: number;
  /** Count of timesheet requests with status 'PENDING' for the current employee */
  pendingTimesheets: number;
  /** Sum of approved timesheet hours for the current month */
  totalHoursThisMonth: number;
  /** Remaining leave days for the current year */
  leaveBalance: number;
}

export interface PendingApprovalsDto {
  /** Count of pending timesheet requests */
  timesheets: number;
  /** Count of pending time-off requests */
  timeOff: number;
}

export interface AdminDashboardStatsDto {
  /** Total count of all employees in the system */
  totalEmployees: number;
  /** Count of employees with status 'active' */
  activeEmployees: number;
  /** Count of distinct departments */
  departments: number;
  /** Sum of Position.Salary for all employees with assigned positions */
  totalPayroll: number;
  /** Pending approval counts */
  pendingApprovals: PendingApprovalsDto;
}

// ==================== Spring Boot API Types ====================

export interface CampaignStatsResponse {
  /** Total count of all campaigns in the system */
  totalCampaigns: number;
  /** Count of campaigns with status 'active' */
  activeCampaigns: number;
  /** Count of campaigns with status 'completed' */
  completedCampaigns: number;
  /** Count of campaigns with status 'draft' */
  draftCampaigns: number;
}

export interface CampaignWithStatsResponse {
  campaignId: number;
  campaignName: string;
  campaignType: 'walking' | 'running' | 'cycling';
  primaryMetric?: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  status: 'draft' | 'active' | 'completed';
  imageUrl?: string;
  createdAt?: string;
  /** Number of employees registered for this campaign */
  participants: number;
  /** Sum of all verified distance submissions (km) */
  totalDistance: number;
  /** Count of activity submissions with status 'pending' */
  pendingSubmissions: number;
}

export interface BonusBalanceResponse {
  /** Employee identifier */
  empId: number;
  /** Current available bonus points balance */
  currentBalance: number;
  /** Total bonus points redeemed/converted to cash throughout history */
  totalRedeemed: number;
  /** Total bonus points received from all transfer transactions */
  totalReceived: number;
}

// ==================== Combined Types for Frontend ====================

export interface AdminDashboardData {
  // From .NET API
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  totalPayroll: number;
  pendingApprovals: PendingApprovalsDto;
  // From Spring Boot API
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  draftCampaigns: number;
}

export interface EmployeeDashboardData {
  // From .NET API
  pendingTimesheets: number;
  totalHoursThisMonth: number;
  leaveBalance: number;
  // From Spring Boot API
  bonusBalance: number;
}
