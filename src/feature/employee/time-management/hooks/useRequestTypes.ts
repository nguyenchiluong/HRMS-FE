import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { getRequestTypes } from '../api';
import type { RequestTypeOption } from '../types';

/**
 * Hook to fetch available request types from API
 */
export const useRequestTypes = (category?: 'time-off' | 'timesheet' | 'profile' | 'other') => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<RequestTypeOption[]>({
    queryKey: ['requestTypes', category],
    queryFn: async () => {
      const response = await getRequestTypes();
      let types = response.requestTypes.filter((type) => type.isActive);
      
      if (category) {
        types = types.filter((type) => type.category === category);
      }
      
      return types;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });
};

