/**
 * Dashboard Hooks
 * React Query hooks for fetching dashboard statistics
 */

import { useQuery } from '@tanstack/react-query';
import {
  getAdminDashboardStats,
  getBonusBalance,
  getCampaignStats,
  getCampaignsWithStats,
  getEmployeeDashboardStats,
} from '@/api/dashboard';
import type {
  AdminDashboardData,
  AdminDashboardStatsDto,
  BonusBalanceResponse,
  CampaignStatsResponse,
  CampaignWithStatsResponse,
  EmployeeDashboardStatsDto,
} from '@/types/dashboard';

// ==================== Employee Dashboard Hooks ====================

/**
 * Fetch employee dashboard stats from .NET API
 */
export const useEmployeeDashboardStats = () => {
  return useQuery<EmployeeDashboardStatsDto>({
    queryKey: ['employee-dashboard-stats'],
    queryFn: getEmployeeDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch bonus balance from Spring Boot API
 */
export const useBonusBalance = () => {
  return useQuery<BonusBalanceResponse>({
    queryKey: ['bonus-balance'],
    queryFn: getBonusBalance,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== Admin Dashboard Hooks ====================

/**
 * Fetch admin dashboard stats from .NET API
 */
export const useAdminDashboardStats = () => {
  return useQuery<AdminDashboardStatsDto>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getAdminDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch campaign stats from Spring Boot API
 */
export const useCampaignStats = () => {
  return useQuery<CampaignStatsResponse>({
    queryKey: ['campaign-stats'],
    queryFn: getCampaignStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch campaigns with participation statistics from Spring Boot API
 */
export const useCampaignsWithStats = () => {
  return useQuery<CampaignWithStatsResponse[]>({
    queryKey: ['campaigns-with-stats'],
    queryFn: getCampaignsWithStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Combined hook for admin dashboard - merges data from both APIs
 */
export const useAdminDashboardData = () => {
  const adminStats = useAdminDashboardStats();
  const campaignStats = useCampaignStats();

  const isLoading = adminStats.isLoading || campaignStats.isLoading;
  const isError = adminStats.isError || campaignStats.isError;
  const error = adminStats.error || campaignStats.error;

  const data: AdminDashboardData | undefined =
    adminStats.data && campaignStats.data
      ? {
          // From .NET API
          totalEmployees: adminStats.data.totalEmployees,
          activeEmployees: adminStats.data.activeEmployees,
          departments: adminStats.data.departments,
          totalPayroll: adminStats.data.totalPayroll,
          pendingApprovals: adminStats.data.pendingApprovals,
          // From Spring Boot API
          totalCampaigns: campaignStats.data.totalCampaigns,
          activeCampaigns: campaignStats.data.activeCampaigns,
          completedCampaigns: campaignStats.data.completedCampaigns,
          draftCampaigns: campaignStats.data.draftCampaigns,
        }
      : undefined;

  return {
    data,
    isLoading,
    isError,
    error,
    // Expose individual query states for partial loading
    adminStats,
    campaignStats,
  };
};
