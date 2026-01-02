import type { JobLevel } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';
import { getJobLevels } from '../api';

export const useJobLevels = () => {
  return useQuery<JobLevel[]>({
    queryKey: ['jobLevels'],
    queryFn: getJobLevels,
  });
};

