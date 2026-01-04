/**
 * Custom hook for fetching current employee profile
 */

import { useQuery } from '@tanstack/react-query';
import { getCurrentEmployee } from '../api';

export const useCurrentEmployee = () => {
  return useQuery({
    queryKey: ['currentEmployee'],
    queryFn: getCurrentEmployee,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
