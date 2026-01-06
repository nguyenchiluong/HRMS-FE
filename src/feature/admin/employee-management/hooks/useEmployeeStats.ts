import { useQuery } from '@tanstack/react-query';
import { getEmployeeStats } from '../api';

export const employeeStatsKeys = {
  all: ['employeeStats'] as const,
};

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: employeeStatsKeys.all,
    queryFn: getEmployeeStats,
    staleTime: 60 * 1000, // 1 minute
  });
};

