import { useQuery } from '@tanstack/react-query';
import { getTeamMembers, getTeamMembersSummary } from '../api';
import type { TeamMembersFilters } from '../types';

/**
 * Hook to fetch team members summary (metrics)
 * Shows overall team statistics - fetched once on page load
 */
export function useTeamMembersSummary() {
  return useQuery({
    queryKey: ['team-members', 'summary'],
    queryFn: () => getTeamMembersSummary(),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}

/**
 * Hook to fetch paginated team members
 */
export function useTeamMembers(filters: TeamMembersFilters) {
  return useQuery({
    queryKey: ['team-members', 'list', filters],
    queryFn: () => getTeamMembers(filters),
  });
}
