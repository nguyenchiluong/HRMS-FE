import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { getLeaveBalances } from '../api';
import type { LeaveBalance } from '../types';

/**
 * Hook to fetch leave balances for the authenticated employee
 */
export const useLeaveBalances = (year?: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<LeaveBalance[]>({
    queryKey: ['leaveBalances', year],
    queryFn: async () => {
      const response = await getLeaveBalances(year);
      return response.balances;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

