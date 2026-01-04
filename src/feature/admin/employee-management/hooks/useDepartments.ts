import type { Department } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../api';

export const useDepartments = () => {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};

