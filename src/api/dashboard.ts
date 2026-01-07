/**
 * Dashboard API Functions
 * Endpoints for Admin and Employee dashboard statistics
 */

import dotnetApi from './dotnet';
import springApi from './spring';
import type {
  AdminDashboardStatsDto,
  BonusBalanceResponse,
  CampaignStatsResponse,
  CampaignWithStatsResponse,
  EmployeeDashboardStatsDto,
} from '@/types/dashboard';

// ==================== .NET API Endpoints ====================

/**
 * Get employee dashboard statistics
 * @returns Employee stats including pending timesheets, hours worked, leave balance
 */
export const getEmployeeDashboardStats =
  async (): Promise<EmployeeDashboardStatsDto> => {
    const response = await dotnetApi.get<EmployeeDashboardStatsDto>(
      '/api/employees/me/dashboard-stats',
    );
    return response.data;
  };

/**
 * Get admin dashboard statistics (employee & approval data)
 * @returns Admin stats including employee counts, departments, payroll, pending approvals
 */
export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStatsDto> => {
    const response = await dotnetApi.get<AdminDashboardStatsDto>(
      '/api/admin/dashboard-stats',
    );
    return response.data;
  };

// ==================== Spring Boot API Endpoints ====================

/**
 * Get campaign statistics for admin dashboard
 * @returns Campaign counts by status
 */
export const getCampaignStats = async (): Promise<CampaignStatsResponse> => {
  const response = await springApi.get<CampaignStatsResponse>(
    '/api/campaigns/stats',
  );
  return response.data;
};

/**
 * Get all campaigns with participation statistics
 * @returns Campaigns enhanced with participants, totalDistance, pendingSubmissions
 */
export const getCampaignsWithStats = async (): Promise<
  CampaignWithStatsResponse[]
> => {
  const response = await springApi.get<CampaignWithStatsResponse[]>(
    '/api/campaigns/with-stats',
  );
  return response.data;
};

/**
 * Get current employee's bonus balance
 * @returns Bonus balance details including current balance, redeemed, received
 */
export const getBonusBalance = async (): Promise<BonusBalanceResponse> => {
  const response = await springApi.get<BonusBalanceResponse>(
    '/api/bonus/balance',
  );
  return response.data;
};
