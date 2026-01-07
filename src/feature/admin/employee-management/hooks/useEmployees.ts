import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../api';
import type { FilterState } from '../types';

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: FilterState, page: number, pageSize: number) =>
    [...employeeKeys.lists(), filters, page, pageSize] as const,
};

interface UseEmployeesParams {
  filters: FilterState;
  page: number;
  pageSize: number;
  enabled?: boolean;
}

export const useEmployees = ({
  filters,
  page,
  pageSize,
  enabled = true,
}: UseEmployeesParams) => {
  return useQuery({
    queryKey: employeeKeys.list(filters, page, pageSize),
    queryFn: () =>
      getEmployees({
        searchTerm: filters.searchTerm || undefined,
        status: filters.status.length > 0 ? filters.status : undefined,
        department: filters.department.length > 0 ? filters.department : undefined,
        position: filters.position.length > 0 ? filters.position : undefined,
        jobLevel: filters.jobLevel.length > 0 ? filters.jobLevel : undefined,
        employmentType:
          filters.employmentType.length > 0
            ? filters.employmentType
            : undefined,
        timeType: filters.timeType.length > 0 ? filters.timeType : undefined,
        page,
        pageSize,
      }),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};

