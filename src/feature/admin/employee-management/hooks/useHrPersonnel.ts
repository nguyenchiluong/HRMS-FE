import { useQuery } from '@tanstack/react-query';
import { getHrPersonnel } from '../api';
import type { ManagerOrHrDto } from '../api';

export const hrPersonnelKeys = {
  all: ['hrPersonnel'] as const,
  lists: () => [...hrPersonnelKeys.all, 'list'] as const,
  list: (search?: string) => [...hrPersonnelKeys.lists(), search] as const,
};

interface UseHrPersonnelParams {
  search?: string;
  enabled?: boolean;
}

export const useHrPersonnel = ({ search, enabled = true }: UseHrPersonnelParams = {}) => {
  return useQuery<ManagerOrHrDto[]>({
    queryKey: hrPersonnelKeys.list(search),
    queryFn: () => getHrPersonnel(search),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};

