import type { EmploymentType } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';
import { getEmploymentTypes } from '../api';

export const useEmploymentTypes = () => {
  return useQuery<EmploymentType[]>({
    queryKey: ['employmentTypes'],
    queryFn: getEmploymentTypes,
  });
};

