/**
 * Team Management API
 * Uses .NET backend (dotnetApi)
 */

import dotnetApi from '@/api/dotnet';
import type {
  TeamMember,
  TeamMembersResponse,
  TeamMembersSummary,
  TeamMembersFilters,
} from '../types';

const BASE_URL = '/api/v1/team-members';

/**
 * Get team members summary (metrics)
 * Shows overall team statistics - no filters applied
 */
export const getTeamMembersSummary = async (): Promise<TeamMembersSummary> => {
  const response = await dotnetApi.get<TeamMembersSummary>(
    `${BASE_URL}/summary`
  );
  return response.data;
};

/**
 * Get paginated team members
 */
export const getTeamMembers = async (
  filters: TeamMembersFilters
): Promise<TeamMembersResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (filters.page) queryParams.page = filters.page;
  if (filters.pageSize) queryParams.pageSize = filters.pageSize;
  if (filters.search) queryParams.search = filters.search;
  if (filters.department) queryParams.department = filters.department;
  if (filters.status) queryParams.status = filters.status;
  if (filters.position) queryParams.position = filters.position;

  const response = await dotnetApi.get<TeamMembersResponse>(BASE_URL, {
    params: queryParams,
  });
  return response.data;
};
